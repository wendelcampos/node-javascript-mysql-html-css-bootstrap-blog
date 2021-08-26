const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require ("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");



//conexao com banco de dados

connection
    .authenticate()
    .then(() => {
        console.log("Conexão com banco de dados feita com sucesso!");
    }).catch((error) => {
        console.log("error: " + error);
    })

// configurando o ejs

app.set("view engine", "ejs");

// Sessions

app.use(session({
    secret: "qualquercoisa",
    cookie: {
        maxAge: 3000000
    }
}))

//static

app.use(express.static('public'));

// configurando o bodyParser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//declaraçao das rotas

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });
    });
});

app.get("/:slug", (req, res) => {
    let slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then(category => {
        if(category != undefined){
           Category.findAll().then(categories => {
               res.render("index", 
               {
                   articles: category.articles, 
                   categories: categories
                })
           })
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})


//Iniciando o servidor
app.listen(8080, () => {
    console.log("Servidor iniciado");
});