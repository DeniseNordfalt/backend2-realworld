const {createArticle, getAllArticle, findArticlesQuery, findOneArticle, findOneAndUpdateArticle, getFavoritedArticle, favoriteArticle, unFavoriteArticle, deleteArticle} = require("../models/article")
exports.article_Create = async function(req, res, next) {
    const article = await createArticle(req.body.article, req.user)
    if(article === undefined){
        res.sendStatus(400)
    }else{
        res.json({article})  
    }
    
}
exports.get_Article = async function(req, res, next) {
        const articles = await findArticlesQuery(req.query, req.user)
        if(articles !== null && articles.length > 0){
          let articlesCount = articles.length
          res.json({articles, articlesCount})
        }else {
         res.json({articles: [], articlesCount: 0})   
        }
         
     
}
exports.find_Article_Slug = async function(req, res, next) {
    const article = await findOneArticle(req.params.slug)
    res.json({article})
}
exports.updateArticle = async function(req, res, next){
    const article = await findOneAndUpdateArticle(req.params.slug, req.body.article)
    res.json({article})
}
exports.favorite_Article = async function(req, res, next){
    const article = await favoriteArticle(req.params, req.user)
    res.json({article})
}
exports.unFavorite_Article = async function(req, res, next) {
    const article = await unFavoriteArticle(req.params, req.user)
    res.json({article})
}
exports.delete_Article = async function(req, res, next) {
    const article = await deleteArticle(req.params.slug, req.user.username)
    res.json({article})
}