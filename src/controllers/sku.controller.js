const skuUser = require('../models/sku.models')
const express = require("express");
require("../config/db");
const app = express();
app.use(express.json());


//Adding skuUser   --->POST req
exports.addskuUser = async (req, res) => {
    try {
        const sku_user = new skuUser({
            ...req.body,
            owner: req.user._id
        });
        await sku_user.save()
        res.status(201).send(sku_user)

    }
    catch (e) {
        console.log(e);
        res.status(404).send();
    }
}


//Getting SkuUserby Auth   --->GET req


//GET  /getallshelf?status=active
//GET /getallshelf?limit=10&skip=10
//GET  /user/me?search="name,product,brand,status"
exports.getskuUser = async (req, res) => {
    try {
        const match = {}
        if (req.query.search){
        if(/^[0-9]+$/.test(req.query.search))
        {
            let dataa = await skuUser.find({
                owner: req.user._id,
                "$or": [
                    { dayId: parseInt( req.query.search ) },
                   
                ]
            })

            return res.status(200).json(dataa)
        }
        
        else {
            
            let data = await skuUser.find({
                owner: req.user._id,
                "$or": [
                    { name: { $regex: req.query.search } },
                    { product: { $regex: req.query.search } },
                    { brand: { $regex: req.query.search } },
                    { status: { $regex: req.query.search } },
                   
                ]
            })

            return res.status(200).json(data)
        }}

        if (req.query.status) {
            console.log(req.query.status);
            if (req.query.status === "active") {
                match.status = "active"
            }
            console.log(match);
        }

        await req.user.populate({
            path: "user_skuuser",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            },
        })
        console.log(req.user.user_skuuser);
        res.send(req.user.user_skuuser);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }

}

//Getting SkuUserbyId    --->GET req
exports.skuuserById = (req, res) => {

    const _id = req.params.id;
    skuUser.findOne({ _id, owner: req.user._id })
        .then((skuuser) => {
            if (!skuuser) {
                return res.status(404).send();
            }

            res.send(skuuser);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
}


//Upadting skuUserbyId   --->PATCH req
exports.skupatchById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowupdates = ["name", "product", "dayId", "brand", "status"];
    const valid = updates.every((update) => allowupdates.includes(update));
    if (!valid) {
        return res.status(404).send({ error: "invalid" });
    }
    try {

        const skuuser = await skuUser.findOne({ _id: req.params.id, owner: req.user._id });
        updates.forEach((update) => (skuuser[update] = req.body[update]));
        await skuuser.save();
        if (!skuuser) {
            return res.status(404).send();
        }
        res.send(skuuser);
    }
    catch (e) {
        res.status(400).send(e);
    }
}


//Deleting skuUserbyId   --->DELETE req
exports.skudeleteById = async (req, res) => {
    try {
        const skuuser = await skuUser.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!skuuser) {
            return res.status(404).send("no such user found");
        }
        res.send(skuuser);

    }
    catch (e) {
        res.status(400).send(e);
    }
}
