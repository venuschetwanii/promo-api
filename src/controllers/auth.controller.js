const User = require("../models/user");
const express = require("express");
require("../config/db");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const _ = require("lodash")
const forgetpswdemail = require('../utils/email')




//AddingUser   --->POST request
exports.addUser = async (req, res) => {

  try {
    if (req.body.password) {
      return res.status(400).send({ error: "password not required" })
    }
    obj={
      owner: req.user._id
    }
    let user = new User(req.body)
    user=_.extend(user,obj)
    await user.save()
    res.status(201).send(user)
  }
  catch (e) {
    console.log(e);
    res.status(404).send(e);
  }

}




//LoginUser   --->POST request
exports.loginUser = async (req, res) => {
  try {

    email = req.body.email
    const userr = await User.findOne({ email })
    if (!userr) {
      return res.status(401).send({ error: "invalid email" })
    }
    if (userr.password.length > 0) {
      const user = await User.findByCredintials(
        req.body.email,
        req.body.password
      )
      if (!user) {
        throw new Error()
      }
      await User.lastLogin(user._id)
      const token = await user.tokenauthkey()
      const isExpired = await User.checkTokenExpiry(token)
      if (isExpired) {
        res.status(404).send("token is expired")
      }
      else {
        res.send({ user, token })
      }
    }
    else {
      console.log("no password");
      const userPassword = await bcrypt.hash(req.body.password, 8);
      const user = await User.findOneAndUpdate({ email }, { password: userPassword })
      await user.save()
      await User.lastLogin(user._id)
      const token = await user.tokenauthkey()
      res.send({ user, token })
    }
  }
  catch (e) {
    res.status(500).send(e);
  }

}


//LogoutToken by auth    --->GET request
exports.logouttoken = async (req, res) => {
  try {
    console.log("hello");
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send('token logout');
  } catch (e) {
    res.status(401).send();
  }
}



//LogoutAllToken by auth    --->GET request
exports.logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("user logout all the tokens");
  } catch (e) {
    res.status(401).send(e);
  }
}



//ForgetPassword     --->PUT request
exports.forgetpassword = async (req, res) => {
  const email = req.body.email;
  const userrr = await User.findOne({ email })

  if (!userrr) {
    return res.status(400).json({ error: "user with this email does not exist " })
  }

  const token = jwt.sign({ _id: userrr._id }, process.env.RESET_KEY, { expiresIn: '24h' })
  forgetpswdemail(email, token);   //Sending forgetpasswordtoken link through email
  userrr.updateOne({ resetlink: token }, function (err, success) {
    if (err) {

      return res.status(400).json({ error: "reset password link error" })

    }
    else {

      return res.json({ success, message: "email has been successfully send,Kindly reset your password" })
    }
  })


}



//ResetPassword   --->PUT request
exports.resetpassword = async (req, res) => {
  const { resetlink, newPassword } = req.body;
  const hashednewPassword = await bcrypt.hash(newPassword, 8);
  if (resetlink) {
    jwt.verify(resetlink, process.env.RESET_KEY, function (error) {
      if (error) {
        return res.status(401).json({
          error: "incorrect token or it is expired"
        })
      }
      User.findOne({ resetlink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({ error: "user with this token does not exist" })
        }

        const obj = {
          password: hashednewPassword,
          resetlink: ""
        }

        user = _.extend(user, obj)   //replacing the password
        user.save((err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: "reset password error" })
          }
          else {
            return res.status(200).json({ message: "your password is changed successfully" })
          }

        })
      })
    })
  }
}




//ChangePassword by auth    --->PUT request
exports.changepwd = async (req, res) => {
  const { oldPassword, newPassword, confirmnewPassword } = req.body;

  const Match = await bcrypt.compare(oldPassword, req.user.password);  //comparing pswd

  if (!Match) {
    console.log("no such user found");
    throw new Error("no such user");
  }
  else {

    if (newPassword === confirmnewPassword) {
      const hashednewPassword = await bcrypt.hash(newPassword, 8);   //encrypting pswd
      const obj = {
        password: hashednewPassword
      }
      req.user = _.extend(req.user, obj)   //replacing pswd
      req.user.save((err) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "change password error" })
        }
        else {
          return res.status(200).json({ message: "your password is changed successfully" })
        }

      })
    }
  }
}



//Registering Admin    --->POST request
exports.register = async (req, res) => {
  try {
    let user = new User(req.body)

    if (!req.body.password) {

      const obj = {
        password: ""
      }

      user = _.extend(user, obj)
      await user.save()
      res.status(201).send(user)

    }
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }


}
