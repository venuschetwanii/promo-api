const formQuestion = require('../models/question.model')
const express = require("express")
require("../config/db");
const app = express();
app.use(express.json());
const _ = require("lodash")


//adding question with type and option values  --->POST req
exports.addQuestion = async (req, res) => {
  try {
    const formquestion = new formQuestion({
      ...req.body,
      owner: req.user._id
    });
    await formquestion.save()
    res.status(201).send(formquestion)

  }
  catch (e) {
    console.log(e);
    res.status(404).send();
  }
}

//Getting question by auth  --->GET req
exports.getQuestion = async (req, res) => {
  try {
    var data = await formQuestion.find({
      owner: req.user._id
    })

    return res.status(200).json(data)
  }
  catch (e) {
    console.log(e);
    return res.status(404).json({ "error": "not able to get the questions" })
  }

}


//Getting question by Id     --->GET req

exports.getQuestionById = async (req, res) => {
  const _id = req.params.id;
  formQuestion.find({ _id })
    .then((data) => {
      if (!data) {
        return res.status(404).send()
      }
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e);
    });
}


//Updating question by auth   --->PUT req
exports.questionpatchById = async (req, res) => {

  const updatess = Object.keys(req.body);
  const allowupdates = ["questionHeader", "questionType", "optionValue"];
  const valid = updatess.every((update) => allowupdates.includes(update));
  if (!valid) {
    return res.status(404).send({ error: "invalid" });
  }

  try {

    const data = await formQuestion.findOne({ owner: req.user._id, _id: req.params.id });
    if (req.body.optionValue) {
      const objlen = Object.keys(req.body.optionValue).length
      for (let i = objlen - 1; i < objlen; i++) {
        const a = data.optionValue.hasOwnProperty(Object.keys(req.body.optionValue)[i])

        if (a) {
          console.log("if")
          updatess.forEach((update) => (data[update] = req.body[update]));
          await data.save()
        }
        else {
          console.log("else")
          data.optionValue = Object.assign(data.optionValue, req.body.optionValue)
          data.markModified("optionValue")
          await data.save()
        }
      }
    }
    else {

      updatess.forEach((update) => (data[update] = req.body[update]));
      await data.save()
    }
    if (!data) {
      return res.status(404).send({ error: "data not found" });
    }
    res.send(data)
  }

  catch (e) {
    res.status(400).send(e);
  }
}

//Deleting questionsbyId    --->DELETE req
exports.questiondeleteById = async (req, res) => {
  try {
    const data = await formQuestion.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!data) {
      return res.status(404).send("no such question found");
    }
    res.send(data);

  }
  catch (e) {
    res.status(400).send(e);
  }
}