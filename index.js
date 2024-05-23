// Importando o Express
import express from "express" 
// Iniciando o Express
const app = express() 
// Importando o Sequelize
import connection from "./config/sequelize-config.js" 
// Importando os Controllers
import ClientesController from "./controllers/ClientesController.js"
import PedidosController from "./controllers/PedidosController.js"
import ProdutosController from "./controllers/ProdutosController.js"
import UsersController from "./controllers/UsersController.js"
//IMPORTANDO O GERADOR DE SESSÕES DO EXPRESS
import session from "express-session"
//IMPORTANDO O AUTH
import Auth from "./middleware/auth.js"
//IMPORTANDO O EXPRESS-FLASH
import flash from "express-flash"

// Realizando a conexão com o banco de dados
connection.authenticate().then(()=> {
    console.log("Conexão com o banco de dados feita com sucesso!")
}).catch((error) => {
    console.log(error)
})

// Criando o banco de dados se ele não existir
connection.query(`CREATE DATABASE IF NOT EXISTS loja;`).then(() => {
    console.log("O banco de dados está criado.")
}).catch((error) => {
    console.log(error)
})

// Define o EJS como Renderizador de páginas
app.set('view engine', 'ejs')
// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static('public'))
// Permite capturar dados vindo de formulários
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(flash())
//configurando a sessão do usuario
app.use(session({
    secret: "lojasecret",
    cookie: {maxAge: 3600000}, //sessão expira em 2 minutos - mudar depois
    saveUninitialized : false,
    resave : false
}))

// Definindo o uso das rotas dos Controllers
app.use("/", ClientesController)
app.use("/", PedidosController)
app.use("/", ProdutosController)
app.use("/", UsersController)

// ROTA PRINCIPAL
app.get("/", Auth, function(req,res){
    res.render("index", {
        messages: req.flash()
    })
})

// INICIA O SERVIDOR NA PORTA 8080
app.listen(4000, function(erro){
    if (erro) {
        console.log("Ocorreu um erro!")
    } else {
        console.log("Servidor iniciado com sucesso!")
    }
})