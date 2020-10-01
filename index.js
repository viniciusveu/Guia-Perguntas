const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

connection.authenticate()
    .then(() => {
        console.log("Conexão MySQL bem sucedida!")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

app.set('view engine', 'ejs')     //Para aceitar ejs
app.use(express.static('public')) //Para aceitar css, js, img... no html 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order: [ // raw = pega os dados limpos, order = ordena
        ['id', 'DESC']    //ASC = Crescente || DESC = Decrescente
    ]}).then(perguntas => {
        res.render("index", {
            perguntas
        })
    })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    Pergunta.create({
        titulo,
        descricao
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: { id }
    }).then(pergunta => {
        if(pergunta != undefined) {

            Resposta.findAll({
                where: {perguntaId : pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta,
                    respostas
                })
            })

        } else {
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    Resposta.create({
        corpo,
        perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId)
    })
})

app.listen(8080, () => {
    console.log("App rodando!")
})


// app.get("/", (req, res) => {
//     var nome = "Vinicius Vedovotto"
//     var lang = "JavaScript"
//     var empresa = "EJComp"
//     var exibirMsg = false

//     var produtos = [
//         {nome: "Doritos", preco: 3.14},
//         {nome: "Coca-cola", preco: 5},
//         {nome: "Leite", preco: 2.45},
//         {nome: "Carne", preco: 21},
//         {nome: "Café", preco: 4.19}
//     ]


//     res.render("index", {
//         nome,
//         lang,
//         empresa,
//         ano: 2020,
//         msg: exibirMsg,
//         produtos
//     })
// })