let express = require("express");
let app = express();
let bodyParser = require('body-parser');
let connection = require("./database/database");

let categoriesController = require("./categories/CategoriesController");
let articlesController = require("./articles/ArticlesController");
let usersController = require ("./users/UsersController");

let Article = require("./articles/Article");
let Category = require("./categories/Category");
let User = require("./users/User");



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

//static

app.use(express.static('public'));

// configurando o bodyParser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//declaraçao das rotas

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController)


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