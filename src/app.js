const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const user_router = require("./routers/user.router")
const auth_router = require("./routers/auth.user")
const sku_router = require("./routers/sku.router")
const question =require("./routers/question.router")
const shelf_router = require("./routers/shelf.router")
const form=require("./routers/form.router")
const bodyparser = require('body-parser')
const app = express();

//third party middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

//json output 
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

//routes
app.use('/users', user_router);
app.use('/user', auth_router)
app.use('/sku', sku_router)
app.use('/shelf', shelf_router)
app.use('/question',question)
app.use('/form',form)



app.get("/", (req, res) => {
    res.json('Hello')
})

module.exports = app