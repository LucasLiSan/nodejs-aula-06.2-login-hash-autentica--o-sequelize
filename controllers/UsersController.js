import express from "express"
import User from "../models/User.js"
const router = express.Router()
// Importando bcrypt (hash de senha)
import bcrypt from "bcrypt" 
import session from "express-session"



// ROTA DE LOGIN
router.get("/login", (req, res) => {
    res.render("login", {
      loggedOut : true,
      messages : req.flash()
    })
  })

// ROTA DE CADASTRO DE USUÁRIO
router.get("/cadastro", (req, res) => {
    res.render("cadastro", {
      loggedOut : true,
      messages : req.flash()
    })
  })

// ROTA DE CRIAÇÃO DE USUÁRIO NO BANCO
router.post("/createUser", (req, res) => {
  // COLETANDO INFORMAÇÕES DO CORPO DA REQUISIÇÃO
  const email = req.body.email
  const password = req.body.password

  // VERIFICA SE O USUÁRIO JÁ ESTÁ CADASTRADO NO BANCO
  User.findOne({where: {email : email}}).then(user => {
    // SE NÃO HOUVER
    if(user == undefined){
      // AQUI SERÁ FEITO O CADASTRO
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      User.create({
        email : email,
        password : hash,
      }).then(() => {
        res.redirect("/login")
      })

    // CASO JÁ EXISTA UM USUÁRIO CADASTRADO COM O MESMO E-MAIL
    } else {
        req.flash('danger', 'Usuario já cadastrado.')
        res.redirect("/login")
    }
  })
})

// ROTA DE AUTENTICAÇÃO
router.post("/authenticate", (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // BUSCA O USUÁRIO NO BANCO
  User.findOne({where: {email : email}}).then(user => {
    // SE O USUÁRIO EXISTIR
    if (user != undefined) { 
      // VALIDA A SENHA
      const correct = bcrypt.compareSync(password, user.password)
      // SE A SENHA FOR VÁLIDA
      if(correct){
        // AUTORIZA O LOGIN - CRIAREMOS A SESSAO DO USUARIO
        req.session.user = {
          id : user.id,
          email : user.email
        }
        //res.send(`Usuario logado: <br> ID : ${req.session.user['id']}<br> E-mail: ${req.session.user['email']}`)
        req.flash('success', 'Login efetuado com suceeso!')
        res.redirect("/")
      // SE A SENHA NÃO FOR VÁLIDA
      } else {
        // EXIBE A MENSAGEM
        req.flash('danger', 'Senha incorreta! Tente novamente.')
        res.redirect("/login")
      }
    // SE O USÁRIO NÃO EXISTIR
    } else {
      // EXIBE A MENSAGEM
        req.flash('danger', 'Usuario não cadastrado!')
        res.redirect("/login")
    }
  })
})

//ROTA LOGOUT
router.get("/logout", (req, res) => {
  req.session.user = undefined
  res.redirect("/")
})

export default router