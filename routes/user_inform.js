const express = require('express');
const router = express.Router();
// const db = require('../models');
// const db = require('../config/db');
const { user_informs } = require("../models");
const bcrypt = require("bcrypt");
const util = require('util');
const {sign} = require('jsonwebtoken');
const nodemailer = require("nodemailer");
//컨트롤러
const login = require('../controller/login');
const aligoapi = require('aligoapi');
// secretkey
var dotenv = require('dotenv');
dotenv.config(); //LOAD CONFIG

// const sequelize = new Sequelize( process.env.LOGIN_SECRET,
// process.env.DB_USER, process.env.DB_PASSWORD,{
//     host: process.env.DB_HOST,

//회원가입
router.post('/',login.signUp)

//결제전 로그인정보 상태관리 데이터보내기 (setUserSV)
router.post('/onLoginData', login.onLoginData)

//로그인
router.post('/onLogin', login.onLogin)

//아이디 중복 체크
router.post('/idCheck', login.idCheck)

//이메일찾기
// router.post('/PassWordEmail', login.PassWordEmail)
router.post('/PassWordEmail', async (req, res) => {

    const { user_email } = req.body;
    const user = await user_informs.findOne({ where: {'user_email':user_email} });

    const variable = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,j,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(",");
    const randomPassword = createRandomPassword(variable, 8);
    
    //비밀번호 랜덤함수 
    function createRandomPassword(variable, passwordLength) {
        var randomString = '';
        for (var j=0; j<passwordLength; j++)
            randomString += variable[Math.floor(Math.random()*variable.length)];
            return randomString
    }
    bcrypt.hash(randomPassword,10).then((hash) => {
        user_informs.update({
            user_pw:hash
        },{
            where: { 'user_email':user_email }
        })
    })

    if(!user){
        res.json({ 'msg': '이메일로 등록된 정보가 없습니다.'});
    }else{
        main(user_email,randomPassword).catch(console.error);
        res.json({ 'msg': '임시비밀번호를 발송하였습니다.'});
    }
});


async function main(user_email2,randomPassword2) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        user: "djdjdjk2002@gmail.com", // generated ethereal user
        pass: "zebthvyweahonwln", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'djdjdjk2002@gmail.com',
        to: user_email2,
        subject:'라즈베리에서 임시비밀번호를 알려드립니다1.',
        text:'라즈베리에서 임시비밀번호를 알려드립니다2.',
        html: 
        "<h1 >라즈베리에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " + randomPassword2 + "</h2>"
        +'<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>'
        +'<img src="https://aurorafac.co.kr/img/raspberrylogo.png">'      
        ,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
// router.post('/PassWordEmail', login.PassWordEmail)

//결제전 로그인정보 리덕스 데이터보내기 (setUserSV)
// router.post('/onLoginData', async (req, res) => {
//     const { session } = req.body;
//     console.log("session!!!",session);
//     user_informs.findOne({
//         where: {
//             'user_id': session,
//         },
//     }).then((result)=>{
//         res.send({
//             user:result
//         });
//     }).catch((error)=>{
//         console.log(error);
//         res.status(400).send(`${session} 조회에 에러가 발생했습니다.`);
//     });
// });

// router.post('/onLogin', async (req, res) => {
//     const { user_id, user_pw } = req.body;
//     const user = await user_informs.findOne({ where: { 'user_id': user_id } });
//     console.log(user);
//     // console.log('user_pw', user_pw);
//     // console.log('user.user_pw', user.user_pw);
    
//     // if(!user) res.json({ 'msg': '입력하신 id 가 일치하지 않습니다.'});
//     if(!user) res.json({ 'msg': '입력하신 id 가 존재하지 않습니다.'});
    
//     bcrypt.compare(user_pw, user.user_pw).then((match) => {
//         if (!match){
//             // res.json({ error: "등록되지않은 유저입니다."});
//             res.json({ 'msg': '비밀번호가 일치하지 않습니다.'})
//         }else{//비밀번호가 맞으면 이거 
//             const accessToken = sign({user_id: user.user_id, id: user.id},"importansecret");
//             console.log('accessToken :',accessToken);
//             console.log('accessToken.user_id : ', accessToken.user_id);
//             console.log('accessToken.id :', accessToken.id);
            
//             res.cookie("x_auth",accessToken);
            
//             // res.json(accessToken);
//             res.json({"user_id":user_id,"user_pw":user_pw});
//         } 
//     }).catch((error) => {
//         console.log(error);
//     });
// });
// router.post('/idCheck', async (req, res) => {
//     const user_id = req.body.user_id;
//     const user = await user_informs.findOne({ where: {'user_id':user_id}});

//     if(user_id == ''){
//         res.json({'msg':'빈값'})
//     }else if(user_id.length < 2 || user_id.length > 12 ){    
//         res.json({'msg':'닉네임은 2글자 이상 12글자 미만 입력해주세요.'})
//     }else if(user){
//         res.json({'msg':'중복'})
//     }else{
//         res.json({'msg':'가능'})
//     }
// });

// router.post('/PassWordEmail', async (req, res) => {

//     const { user_email } = req.body;
//     const user = await user_informs.findOne({ where: {'user_email':user_email} });

//     const variable = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,j,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(",");
//     const randomPassword = createRandomPassword(variable, 8);
    
//     //비밀번호 랜덤함수 
//     function createRandomPassword(variable, passwordLength) {
//         var randomString = '';
//         for (var j=0; j<passwordLength; j++)
//             randomString += variable[Math.floor(Math.random()*variable.length)];
//             return randomString
//     }
//     bcrypt.hash(randomPassword,10).then((hash) => {
//         user_informs.update({
//             user_pw:hash
//         },{
//             where: { 'user_email':user_email }
//         })
//     })

//     if(!user){
//         res.json({ 'msg': '이메일로 등록된 정보가 없습니다.'});
//     }else{
//         main(user_email,randomPassword).catch(console.error);
//         res.json({ 'msg': '임시비밀번호를 발송하였습니다.'});
//     }
// });

// async function main(user_email2,randomPassword2) {
//     // Generate test SMTP service account from ethereal.email
//     // Only needed if you don't have a real mail account for testing
//     let testAccount = await nodemailer.createTestAccount();

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true, // true for 465, false for other ports
//         auth: {
//         user: "djdjdjk2002@gmail.com", // generated ethereal user
//         pass: "adgjl30230@", // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: 'djdjdjk2002@gmail.com',
//         to: user_email2,
//         subject:'라즈베리에서 임시비밀번호를 알려드립니다1.',
//         text:'라즈베리에서 임시비밀번호를 알려드립니다2.',
//         html: 
//         "<h1 >라즈베리에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " + randomPassword2 + "</h2>"
//         +'<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>'
//         +'<img src="https://aurorafac.co.kr/img/raspberrylogo.png">'      
//         ,
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

/* 알리고 알림톡 */


/* 알리고 알림톡 */
module.exports = router;