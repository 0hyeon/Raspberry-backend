const db = require('../models');
const multer = require('multer');

//banner 등록 - admin
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}_${file.originalname}`);
    }
})

var upload = multer({storage:storage}).single("file")

exports.setBanner = async(req,res) => {
    try {
        upload(req, res, err => {
            if(err){
                return req.json({success:false, err })
            }
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