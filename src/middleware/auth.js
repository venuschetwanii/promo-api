const jwt = require('jsonwebtoken')
const User = require('../models/user')
require("dotenv").config();


const auth = async (req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRETKEY || process.env.RESET_KEY)
        // console.log(decode)//  { _id: '63035d0700c124bb75f2621d', iat: 1661164942, exp: 1661251342 }
        const user = await User.findOne({ '_id': decode._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }


        req.user = user
        req.token = token
        if (user.role !== 'admin') {
            return res.status(403).send({ error: { status: 403, message: 'Access denied.' } })

        }

        next()
    }
    catch (e) {
        res.status(404).send({ error: 'please authenticate' })
    }
}


module.exports = auth