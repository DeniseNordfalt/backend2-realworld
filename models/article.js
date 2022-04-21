const res = require("express/lib/response")
const mongoose = require("mongoose")
const {User} = require("./user")
const articleSchema = mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    body: {type: String, required: true},
    description: {type: String, required: true},
    favorited: {type: Boolean, default: false},
    favoritedBy: [],
    favoritesCount: {type: Number, default: 0},
    tagList: [String],
}, {timestamps: true})

const Article = mongoose.model("Article", articleSchema)

const createArticle = async (article, user) => {
    article.author = user.userId
    article.slug = article.title
    article.tagList = article.tagList.sort()
    const result = await Article.create(article).catch((err) => {
        if(err){
            return undefined
        }
    })
    return result
}
const getAllArticle = async() => {
    return await Article.find().populate("author", "username bio image -_id")
}
const findArticlesQuery = async(query, user) => {
    if(query.tag !== undefined){
        return await Article.find({tagList: query.tag}).populate("author", "username bio image -_id")
        
    } else if(query.author !== undefined){
        const user = await User.findOne({username: query.author})
        const userId = user._id
        const article = await Article.find({author: userId}).populate("author", "username bio image -_id")
        return article
    }else if (query.favorited !== undefined){
        const article = await Article.find({favoritedBy: user.username}).populate("author", "username bio image -_id").select({favoritedBy: false})
        article.forEach(item => item.favorited = true) 
        return article 
    }else {   
        return await Article.find().populate("author", "username bio image -_id")
    }
}
const findOneArticle = async(slug) => {
    return await Article.findOne({slug: slug}).populate("author", "username bio image -_id")
}
const findOneAndUpdateArticle = async(slug, article) => { 
    return await Article.findOneAndUpdate({slug: slug}, article, {new: true}).populate("author", "username bio image -_id")
}
const findAllTags = async() => {
    return await Article.find().select({tagList: true, _id: false})
}
const favoriteArticle = async(slug, user) => {
    const article = await Article.findOne(slug)
    if(article.favoritedBy.includes(user.username) === true){
        return "you have already liked"
    }else {
        const articles = await Article.findOneAndUpdate(slug, {$addToSet: {favoritedBy: user.username}, $inc: {favoritesCount: +1}}, {new: true}).populate("author", "username bio image -_id").select({favoritedBy: false})
        articles.favorited = true
        return articles
    }
}
const unFavoriteArticle = async(slug, user) => {
    const article = await Article.findOne(slug)
    if(article.favoritedBy.includes(user.username) === false){
        return "you have already unliked"
    }else {
        return await Article.findOneAndUpdate(slug, {$pull: {favoritedBy: user.username}, $inc: {favoritesCount: -1}}, {new: true}).populate("author", "username bio image -_id").select({favoritedBy: false})
    } 
} 
const deleteArticle = async(slug, username) => {
    return await Article.findOneAndDelete({slug: slug, username: username}).populate("author", "username bio image -_id")
}
module.exports = {deleteArticle, createArticle, getAllArticle, findArticlesQuery, findOneArticle,findOneAndUpdateArticle, findAllTags, favoriteArticle,unFavoriteArticle }