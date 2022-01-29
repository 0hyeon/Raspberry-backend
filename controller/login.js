//db랑 관련된 모든 코딩을 컨트롤러에서 
const { user_informs } = require("../models");
const bcrypt = require("bcrypt");
const {sign} = require('jsonwebtoken');
// secretkey
var dotenv = require('dotenv');
dotenv.config(); //LOAD CONFIG

//회원가입
exports.signUp = async(req,res) => {
    try {
        const { user_id, user_email,user_name, user_pw, user_address,user_address_detail,user_address_postzone,user_phonenumber } = req.body;
        await bcrypt.hash(user_pw,10).then((hash)=>{
            user_informs.create({
                user_id:user_id,
                user_pw: hash,
                user_name: user_name,
                user_email:user_email,
                user_address:user_address,
                user_address_postzone:user_address_postzone,
                user_address_detail:user_address_detail,
                user_phonenumber:user_phonenumber
            });
            
        })
    } catch (error) {
        console.log(error);
        res.status(400).send("상품업로드에 문제가 발생하였습니다.")
        // res.status(400).json({"resultCode":-1, "data": null})
    }
}

//결제전 로그인정보 상태관리 데이터보내기 (setUserSV)
exports.onLoginData = async (req, res) => {
    try {
        const { session } = req.body;
        console.log('onLoginData session',session);
        user_informs.findOne({
            where: {
                user_id: session,
            },
        }).then((result)=>{
            res.send({
                user:result
            });
        })
    } catch (error) {
        console.log(error);
        res.status(400).send(`${session} 조회에 에러가 발생했습니다.`);
    }
    
};

//로그인
exports.onLogin =  async (req, res) => {
    try {
        const { user_id, user_pw } = req.body;
        const user = await user_informs.findOne({ where: { 'user_id': user_id } });
        console.log(user);
        // console.log('user_pw', user_pw);
        // console.log('user.user_pw', user.user_pw);
        
        // if(!user) res.json({ 'msg': '입력하신 id 가 일치하지 않습니다.'});
        if(!user) res.json({
            'loginSuccess': false,
            'msg': '입력하신 id 가 존재하지 않습니다.'
        });
        //user_pw  : react에서보낸값 ,  user.user_pw : db에서 찾은 user의 pw
        console.log("user_pw",user_pw);
        console.log("user.user_pw",user.user_pw);

        bcrypt.compare(user_pw, user.user_pw).then((match) => {
            if (!match){
                // res.json({ error: "등록되지않은 유저입니다."});
                res.json({
                    'loginSuccess': false, 
                    'msg': '비밀번호가 일치하지 않습니다.'
                })
            }
            else{//비밀번호가 맞으면 이거
                const accessToken = sign({user_id},process.env.LOGIN_SECRET)
                // console.log('accessToken :',accessToken);
                // console.log('accessToken.user_id : ', accessToken.user_id);
                // console.log('accessToken.id :', accessToken.id);
                res.json({'loginSuccess': true,'msg': '로그인 성공', "user_id":accessToken});

            } 
        })
    } catch (error) {
        console.log(error);
    }
    
};

//아이디중복체크
exports.idCheck = async (req, res) => {
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
};

// 비밀번호찾기 시 이메일로 랜덤비밀번호 발송 모듈
exports.PassWordEmail = async (req, res) => {

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
};

//메일발송 모듈
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
        subject:'라즈베리에서 임시비밀번호를 알려드립니다.',
        text:'라즈베리에서 임시비밀번호를 알려드립니다.',
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