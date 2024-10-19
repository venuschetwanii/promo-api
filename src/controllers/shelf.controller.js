const shelfUser = require('../models/shelf.model')
const express = require("express");
require("../config/db");
const app = express();
app.use(express.json());
const multer = require("multer");
const xlsx = require("xlsx")
const exceljs = require("exceljs")
const path = require('path')
const fs = require('fs')
app.use('/uploads', express.static('uploads'));



//adding shelfUser    --->POST req
exports.addshelfUser = async (req, res) => {
  try {
    const shelf_user = new shelfUser({
      ...req.body,
      owner: req.user._id
    });
    await shelf_user.save()
    res.status(201).send(shelf_user)

  }
  catch (e) {
    console.log(e);
    res.status(404).send();
  }
}



//GettingAllthe ShelfUser    --->GET req

//GET  /getallshelf?status=active
//GET /getallshelf?limit=10&skip=10
//GET  /user/me?search="name,description,shelfPath,status"
exports.getshelfUser = async (req, res) => {
  try {
    const match = {}


    if (req.query.search) {
      let data = await shelfUser.find({
        owner: req.user._id,
        "$or": [
          { name: { $regex: req.query.search } },
          { description: { $regex: req.query.search } },
          { shelfPath: { $regex: req.query.search } },
          { status: { $regex: req.query.search } }
        ]
      })

      return res.status(200).json(data)
    }


    if (req.query.status) {
      if (req.query.status === "active") {
        match.status = "active"
      }
    }

    await req.user.populate({
      path: "user_shelfuser",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      },
    })
    res.send(req.user.user_shelfuser);
  }
  catch (e) {
    console.log(e);
    res.status(404).send(e);
  }

}



//GetinfShelfUserby ID   --->GET req
exports.shelfuserById = (req, res) => {
  const _id = req.params.id;
  shelfUser.findOne({ _id, owner: req.user._id })
    .then((shelfuser) => {
      if (!shelfuser) {
        return res.status(404).send();
      }

      res.send(shelfuser);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
}



//Updating shelfUserbyID    --->PATCH req
exports.shelfpatchById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowupdates = ["name", "description", "shelfPath", "status"];
  const valid = updates.every((update) => allowupdates.includes(update));
  if (!valid) {
    return res.status(404).send({ error: "invalid" });
  }
  try {

    const shelfuser = await shelfUser.findOne({ _id: req.params.id, owner: req.user._id });
    updates.forEach((update) => (shelfuser[update] = req.body[update]));  //updating
    await shelfuser.save();
    if (!shelfuser) {
      return res.status(404).send();
    }
    res.send(shelfuser);
  }
  catch (e) {
    res.status(400).send(e);
  }
}



//Deleting ShelfUserbyId    --->DELETE req
exports.shelfdeleteById = async (req, res) => {
  try {
    const shelfuser = await shelfUser.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!shelfuser) {
      return res.status(404).send("no such user found");
    }
    res.send(shelfuser);

  }
  catch (e) {
    res.status(400).send(e);
  }
}


//Uploading Excelfile    ---->POST req   
exports.uploadXLSX = async (req, res) => {
  try {
    var workbook = xlsx.readFile(req.file.path);
    var sheet_name_list = workbook.SheetNames;
    let jsonData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "xml sheet has no data",
      });
    }
    let savedData = await shelfUser.create(jsonData);

    return res.status(201).json({
      success: true,
      message: savedData.length + " rows added to the database",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


//Storing the uploaded file in Uploads folder
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('./uploads/', (err) => {
      cb(null, './uploads/');
    })
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage: storage });




//Creating an excelfile from the shelfUser database    --->GET req  exportt
exports.excelfile = async (req, res) => {
  try {
    const users = await shelfUser.find({}).populate("owner")
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('shelfUser')
    worksheet.columns = [
      { header: 'S.no', key: 's_no', width: 10 },
      { header: 'name', key: 'name', width: 15 },
      { header: 'description', key: 'description', width: 20 },
      { header: 'shelfPath', key: 'shelfPath', width: 20 },
      { header: 'status', key: 'status', width: 10 },
      { header: 'owner', key: 'owner', width: 30 }

    ];

    let count = 1;
    users.forEach(user => {
      worksheet.addRow({
        s_no: count,
        name: user.name,
        description: user.description,
        shelfPath: user.shelfPath,
        status: user.status,
        owner: `${user.owner._id}`
      });
      count++;

    })
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    })


    workbook.xlsx.writeFile('users.xlsx').then(function (err, data) {
      console.log('Excel file is written');

    });

    res.status(200).send({ message: "excel file created" })
  }
  catch (e) {
    console.log(e);
    res.status(404).send(e)
  }
}


//it will create an _id to the data
// exports.excelfile = async (req, res) => {

//   var wb = xlsx.utils.book_new(); //new workbook
//   shelfUser.find((err,Shelf)=>{
//       if(err){
//           console.log(err)
//       }else{
//           var temp = JSON.stringify(Shelf);
//           temp = JSON.parse(temp);
//           var ws = xlsx.utils.json_to_sheet(temp);
//           var down ='./users.xlsx'
//           xlsx.utils.book_append_sheet(wb,ws,"sheet1");
//           xlsx.writeFile(wb,down);
//          res.download(down);
//       }
//   });
//   };
