// module.exports = function alimtalk(mb_name, mb_hp, msg, subject, tpl_code){
//     const apikey = 'ba8omf5kfpdon6e74rz4d130bai7z1xq';
//     const userid = 'djdjdjk2006';
//     const senderkey = 'cd0e3a2b9549589491efae77c9115b9407ff0992';
//     get_token_alimtalk(apikey,userid).then(function (result){
//         // console.log(result);
//         const token = result;
//         // 템플릿이 여러개일 경우 'get_tpllist_alimtalk' 함수의 결과 처리 부분을 수정해야한다. (템플릿 선택 부분 제작 필요)
//         get_tpllist_alimtalk(apikey,userid,token,senderkey).then(function (result2){
//             console.log(result2.list[0]);
//             const templtCode = result2.list[0]['templtCode'];
//             send_alimtalk(apikey, userid, token, senderkey, mb_name, mb_hp, msg, subject, templtCode).then(function (result3){
//                 console.log("result3 :",result3);
//             });
//         });
//     });
// }

// const get_token_alimtalk=(apikey,userid)=>{
//     return new Promise(function (resolve, reject){
//         $.ajax({
//             type: "POST",
//             url: "https://kakaoapi.aligo.in/akv10/token/create/30/s/",
//             contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//             dataType: 'json',
//             data: {
//                 apikey:apikey,
//                 userid:userid,
//             },
//             cache: false,
//             success: function (data) {
//                 //console.log(data);
//                 if(data.code==0){
//                     resolve(data.token);
//                     console.log("data.token (order.js) :",data.token);
//                     // console.log("data.token1");
//                 }else{
//                     console.log(data.message);
//                 }
//             }
//         })
//     })
// }
// const get_tpllist_alimtalk=(apikey,userid,token,senderkey)=>{
//     return new Promise(function (resolve, reject){
//         $.ajax({
//             type: "POST",
//             url: "https://kakaoapi.aligo.in/akv10/template/list/",
//             contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//             dataType: 'json',
//             data: {
//                 apikey:apikey,
//                 userid:userid,
//                 token:token,
//                 senderkey:senderkey,
//             },
//             cache: false,
//             success: function (data) {
//                 //console.log(data);
//                 if(data.code==0){
//                     resolve(data);
//                     // console.log("data :",data)
//                 }else{
//                     console.log(data.message);
//                 }
//             }
//         })
//     })
// }
// const send_alimtalk=(apikey,userid,token,senderkey,mb_name, mb_hp, msg, subject, tpl_code)=>{
//     return new Promise(function (resolve, reject){
//         $.ajax({
//             type: "POST",
//             url: "https://kakaoapi.aligo.in/akv10/alimtalk/send/",
//             contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//             dataType: 'json',
//             data: {
//                 apikey:apikey,
//                 userid:userid,
//                 token:token,
//                 senderkey:senderkey,
//                 tpl_code:tpl_code,
//                 sender:'010-4109-6590',
//                 receiver_1:mb_hp,
//                 recvname_1:mb_name,
//                 subject_1:subject,
//                 message_1:msg,
//                 //testMode:'Y',
//             },
//             cache: false,
//             success: function (data) {
//                 //console.log(data);
//                 if(data.code==0){
//                     resolve(data);
//                 }else{
//                     console.log(data.message);
//                 }
//             }
//         })
//     })
// }

const aligoapi = require('aligoapi');

// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;

// var $ = jQuery = require('jquery')(window);
let AuthData = { 
    apikey: 'ba8omf5kfpdon6e74rz4d130bai7z1xq', // 이곳에 발급받으신 api key를 입력하세요 
    userid: 'djdjdjk2006', // 이곳에 userid를 입력하세요 
    // token: '' // 이곳에 token api로 발급받은 토큰을 입력하세요 
}

exports.alimtalkSend = (req, res) => { 
    let company = '라즈베리베리'
            let msg=`[${company}]
    ${name_naming}(${name_naming})님

    ${company}에 회원가입 감사합니다.`;
    req.body = { 
        senderkey: "cd0e3a2b9549589491efae77c9115b9407ff0992", 
        tpl_code : "TI_0549",
        sender: "010-4109-6590", 
        receiver_1: "010-4109-6590", 
        subject_1: '회원가입', 
        message_1: msg  
    }
    // senddate: 예약일 // YYYYMMDDHHMMSS 
    // recvname: 수신자 이름 
    // button: 버튼 정보 
    // JSON string 
    // failover: 실패시 대체문자 전송기능 
    // Y or N 
    // fsubject: 실패시 대체문자 제목 
    // fmessage: 실패시 대체문자 내용 
     // } 
    // req.body 요청값 예시입니다. 
    // _로 넘버링된 최대 500개의 receiver, subject, message, button, fsubject, fmessage 값을 보내실 수 있습니다 
    // failover값이 Y일때 fsubject와 fmessage값은 필수입니다.

    aligoapi.alimtalkSend(req, AuthData).then((r) => {
        res.send(r) 
        console.log("r :",r);
    }).catch((e) => { 
        res.send(e) 
        console.log("e :",e);
    }) 
}


