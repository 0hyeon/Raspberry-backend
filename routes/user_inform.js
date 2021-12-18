const express = require('express');
const router = express.Router();
const db = require('../models');
// const db = require('../config/db');
const { user_informs } = require("../models");
const bcrypt = require("bcrypt");
const util = require('util');
const {sign} = require('jsonwebtoken');
const nodemailer = require("nodemailer");
//register
router.post("/", async(req,res)=> {
    const { user_id, user_email, user_pw } = req.body;
    await bcrypt.hash(user_pw,10).then((hash)=>{
        user_informs.create({
            user_id:user_id,
            user_pw: hash,
            user_email:user_email,
        });
        
    })
});
//login 
router.get('/login', (req, res) => {
	// 임시로 값을 넣어 주었다.
    res.send({data: 'data'})
});

// router.post('/onLogin', (req, res) => {
//     console.log(`= = = > req : ${util.inspect(req)}`)
//    	// user_id, user_pw 변수로 선언
//     const user_id = req.query.user_id
//     const user_pw = req.query.user_pw
//     // 입력된 id 와 동일한 id 가 mysql 에 있는 지 확인
//     const sql1 = 'SELECT COUNT(*) AS result FROM user_informs WHERE user_id = ?'
//     db.query(sql1, user_id, (err, data) => {
//         if(!err) {
//         	// 결과값이 1보다 작다면(동일한 id 가 없다면)
//             if(data[0].result < 1) {
//                 res.send({ 'msg': '입력하신 id 가 일치하지 않습니다.'})
//             } else { // 동일한 id 가 있으면 비밀번호 일치 확인
//                 const sql2 = `SELECT 
//                                 CASE (SELECT COUNT(*) FROM user_informs WHERE user_id = ? AND user_pw = ?)
//                                     WHEN '0' THEN NULL
//                                     ELSE (SELECT user_id FROM user_informs WHERE user_id = ? AND user_pw = ?)
//                                 END AS userId
//                                 , CASE (SELECT COUNT(*) FROM user_informs WHERE user_id = ? AND user_pw = ?)
//                                     WHEN '0' THEN NULL
//                                     ELSE (SELECT user_pw FROM user_informs WHERE user_id = ? AND user_pw = ?)
//                                 END AS userPw`;
//                 // sql 란에 필요한 parameter 값을 순서대로 기재
//                 const params = [user_id, user_pw, user_id, user_pw, user_id, user_pw, user_id, user_pw]
//                 db.query(sql2, params, (err, data) => {
//                     if(!err) {
//                         res.send(data[0])
//                     } else {
//                         res.send(err)
//                     }
//                 })
//             }
//         } else {
//             res.send(err)
//         }
//     })
// });


// test
router.post('/onLogin', async (req, res) => {
    const { user_id, user_pw } = req.body;
    const user = await user_informs.findOne({ where: { 'user_id': user_id } });
    console.log(user);
    // console.log('user_pw', user_pw);
    // console.log('user.user_pw', user.user_pw);
    
    // if(!user) res.json({ 'msg': '입력하신 id 가 일치하지 않습니다.'});
    if(!user) res.json({ 'msg': '입력하신 id 가 존재하지 않습니다.'});
    
    bcrypt.compare(user_pw, user.user_pw).then((match) => {
        if (!match){
            // res.json({ error: "등록되지않은 유저입니다."});
            res.json({ 'msg': '비밀번호가 일치하지 않습니다.'})
        }else{//비밀번호가 맞으면 이거 
            const accessToken = sign({user_id: user.user_id, id: user.id},"importansecret");
            console.log('accessToken :',accessToken);
            console.log('accessToken.user_id : ', accessToken.user_id);
            console.log('accessToken.id :', accessToken.id);
            
            res.cookie("x_auth",accessToken);
            
            // res.json(accessToken);
            res.json({"user_id":user_id,"user_pw":user_pw});
        } 
    }).catch((error) => {
        console.log(error);
    });
});
//아이디 중복 체크
router.post('/idCheck', async (req, res) => {
    const user_id = req.body.user_id;
    const user = await user_informs.findOne({ where: {'user_id':user_id}});

    if(user_id == ''){
        res.json({'msg':'빈값'})
    }else if(user_id.length < 2 || user_id.length > 10 ){    
        res.json({'msg':'닉네임은 2글자 이상 10글자 미만 입력해주세요.'})
    }else if(user){
        res.json({'msg':'중복'})
    }else{
        res.json({'msg':'가능'})
    }
});
//이메일찾기
router.post('/PassWordEmail', async (req, res) => {

    //////////////////////////////////////////////////////////////////////////////////////////
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
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: 'djdjdjk2002@gmail.com',
    //         pass: 'adgjl30230@'
    //     }
    // });
    // const emailOptions = {
    //     from: 'djdjdjk2002@gmail.com',
    //     to: user_email,
    //     subject:'라즈베리에서 임시비밀번호를 알려드립니다.',
    //     html: 
    //     "<h1 >라즈베리에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " + randomPassword + "</h2>"
    //     +'<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>'
    //     +'<img src="https://aurorafac.co.kr/img/raspberrylogo.png">'		
    //     ,
    // };
    
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
        pass: "adgjl30230@", // generated ethereal password
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
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
  
 
module.exports = router;