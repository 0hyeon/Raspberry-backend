const db = require('../models');
const multer = require('multer');
const upload = require('../upload')
//banner 등록 - admin
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
    // filename: function(req,file,cb){
    //     cb(null,`${Date.now()}_${file.originalname}`);
    // }
})

var upload3 = upload.single("file");

exports.setBanner = async(req,res) => {
    try {
        upload3(req, res, err => {
            if(err){
                return req.json({success:false, err })
            }
            console.log("res :",res);
            console.log("req :",req);
            console.log("res.req :",res.req);
            console.log("res.req.file.path :",res.req.file.path);
            console.log("path :",path);
            return res.json({ success:true , filePath:res.req.file.path, fileName:res.req.file.filename})
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
        console.log('imageUrl,href,category :',req.body);
        
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