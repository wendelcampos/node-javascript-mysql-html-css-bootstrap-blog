let express = require("express");
let app = express();
let bodyParser = require('body-parser');
let connection = require("./database/database");

let categoriesController = require("./categories/CategoriesController");
let articlesController = require("./articles/ArticlesController");

let Article = require("./articles/Article");
let Category = require("./categories/Category");


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


app.get("/", (req, res) => {
    res.render('index');
});


//Iniciando o servidor
app.listen(8080, () => {
    console.log("Servidor iniciado")
});