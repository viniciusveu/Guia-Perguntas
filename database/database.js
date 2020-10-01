const { Sequelize } = require("sequelize")
const sequelize = require("sequelize")

const connection = new Sequelize(
    'guiaperguntas', 
    'root', 
    'Foston6152!', 
    {
        host: '172.17.0.2',
        dialect: 'mysql',
    }
)

module.exports = connection  