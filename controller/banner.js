const db = require('../models');
const multer = require('multer');
const upload = require('../upload');
var dotenv = require('dotenv');

dotenv.config(); //LOAD CONFIG
const env = process.env.DB_HOST;

//banner 등록 - admin
// const storage = multer.diskStorage({
//     destination : function(req,file,cb){
//         cb(null,'uploads/')
//     },
//     filename: function(req,file,cb){
//         cb(null, file.originalname);
//     }
//     // filename: function(req,file,cb){
//     //     cb(null,`${Date.now()}_${file.originalname}`);
//     // }
// })

// var upload = multer({storage:storage}).single("file")
var upload2 = upload.single("file")

exports.setBanner = async(req,res) => {
    try {
        upload2(req, res, err => {
            if(err){
                return res.json({success:false, err })
            }
            // console.log("setBanner => req.file :",req.file);

            console.log("req.file.path :",req.file.path);//응답해라 요청을한것을 
            // console.log("req.file.path :",req.file.path);//응답해라 요청을한것을 
            // console.log("set Banner => res.req :",res.req);
            // console.log("res :",res);
            //로컬일때
            // return res.json({ success:true , filePath:res.req.file.path, fileName:res.req.file.filename})
            if(env !== 'localhost'){//개발일때
                return res.json({ success:true , filePath:req.file.location, fileName:'file'})    
            }else {//로컬일때
                return res.json({ success:true , filePath:res.req.file.path, fileName:res.req.file.filename})
            }
            //배포모드일때
            //return res.json({ success:true , filePath:req.file.location, fileName:'file'})
        })
        // const { seSsionId } = req.body;

        // db.shop_cart.findAll({
        //     where: { mb_id: seSsionId}
        // }).then((result)=>{
        //     res.send({
        //         cartItem : result,
        //     });  
        // });

    } catch (error) {
        console.log(error);
    }
    
};
exports.inSertBanner = async(req,res) => {
    try {
        const { imageUrl,href,category } = req.body;
        console.log('req.body :',req.body);
        
        db.Banner.create({
            imageUrl,
            href,
            category
        }).then((result)=>{
            res.send({
                result
            })
        });

    } catch (error) {
        console.log(error);
    }
    
};

//fetchBanner
exports.fetchBanner = async(req,res) => {
    try {
        db.Banner.findAll({
            order : [["createdAt","DESC"]],//불러오는 순서
        }).then((result)=>{
            res.send({
                result
            })
        });

    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
    }
};

//배너삭제
exports.DeleteBanner = async(req,res) => {
    try {
        const { category } = req.body;
        db.Banner.destroy({
            where: { category }
        }).then((result)=>{
            res.send({
                result
            });
        })
    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
    }
};