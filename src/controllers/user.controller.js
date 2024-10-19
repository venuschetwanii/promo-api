const express = require("express");
const User = require("../models/user");
const router = new express.Router();
router.use(express.json());



//Getting user  --->GET req
exports.getAllUser = (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    })
}


//Getting user by auth  --->GET req


//pagination
//GET  /user/me?page=2&limit=5
//filter or search
//GET  /user/me?search="firstname,lastname,email,role"
exports.getUserauth = async (req, res) => {

    try {
        if (req.query.search) {
            let data = await User.find({
                owner: req.user._id,
                "$or": [
                    { firstName: { $regex: req.query.search } },
                    { lastName: { $regex: req.query.search } },
                    { email: { $regex: req.query.search } },
                    { role: { $regex: req.query.search } }
                ]
            })
            return res.status(200).json(data)
        }


        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0,
            limit: parseInt(req.query.limit, 10) || 10
        }


        await User.find({ owner: req.user._id })
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .limit(pageOptions.limit)
            .exec(function (err, doc) {
                if (err) { res.status(500).json(err); return; };
                res.status(200).json(doc);
            });



    } catch (e) {
        console.log(e);
    }


}



//Getting user by Id     --->GET req
exports.userById = (req, res) => {

    User.findOne({ _id: req.params.id, owner: req.user._id  })
        .then((user) => {
            if (!user) {
                return res.status(404).send();
            }

            res.send(user);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
}


// //Updating User by auth   --->PATCH req
// exports.patchAll = async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowupdates = ["firstName", "lastName", "role", "email"];
//     const valid = updates.every((update) => allowupdates.includes(update));
//     if (!valid) {
//         return res.status(404).send({ error: "invalid" });
//     }

//     try {
//         const user = await User.findOne({ _id: req.params.id, owner: req.user._id });
//         updates.forEach((update) => (req.user[update] = req.body[update]));
//         await req.user.save()
//         res.send(req.user)
//     }
//     catch (e) {
//         res.status(400).send(e);
//     }
// }


//Updating User by Id   --->PATCH req
exports.patchById = async (req, res) => {

    const updates = Object.keys(req.body);
    const allowupdates = ["firstName", "lastName", "role", "email"];
    const valid = updates.every((update) => allowupdates.includes(update));
    if (!valid) {
        return res.status(404).send({ error: "invalid" });
    }
   
    try {
       
        const user = await User.findOne({_id:req.params.id,owner:req.user._id});
      
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}


//Deleting user by ID  --->DELETE req
exports.deleteById = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!user) {
            return res.status(404).send("no such user found");
        }
        res.send(user);

    }
    catch (e) {
        res.status(400).send(e);
    }
}


// //Deleting user by auth  --->DELETE req
// exports.deleteByAuth = async (req, res) => {
//     try {
//         await req.user.remove();
//         res.send(req.user);
//     }
//     catch (e) {
//         res.status(400).send(e);
//     }
// }





