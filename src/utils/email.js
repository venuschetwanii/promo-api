const nodemailer = require("nodemailer");


//sending email for forgetpswd link
const forgetpswdemail = async (email, token) => {
  const mailoptions =
  {
    from: "shubhangih.mobio@gmail.com",
    to: email,
    subject: "forget password link",
    html: `
           <h2>Please click on given link to reset your passwords/h2>
          <p>${process.env.APP_HOST}/resetpassword/${token} </p>
          `
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    service: "gmail",
    secure: false,
    auth: {
      user: "shubhangihingu@gmail.com",
      pass: "iossrpmwotsdsdcg",
    },
  });

  let info = await transporter.sendMail(mailoptions);

  if (info.rejected == null) {
    console.log("email not send");
  } else {
    console.log(info);
  }
}





//sendWelcomemail("shubhangih.mobio@gmail.com",'shubhangih');

module.exports = forgetpswdemail

