const multer = require('multer'); 
const multerS3 = require('multer-s3'); 
const aws = require('aws-sdk'); 
aws.config.loadFromPath(__dirname + '/awsconfig.json');

const s3 = new aws.S3(); 
var dotenv = require('dotenv');

dotenv.config(); //LOAD CONFIG
const env = process.env.DB_HOST;

if (env !== "localhost") {//서버일경우
    const upload = multer({ 
        storage: multerS3({ 
            s3: s3, 
            bucket: 'myapp3.com', 
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read', 
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname }) 
            },
            key: function(req, file, cb) { 
                // cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop()); 
                cb(null,file.originalname); 
            } 
        }), 

        limits: { 
            fileSize: 1024 * 1024 * 10 
        } 
    }); 
    console.log("development upload")
    module.exports = upload;    
}else {
    // 로컬일경우 
    const storage = multer.diskStorage({
        destination : function(req,file,cb){
        cb(null,'uploads/')
        },
        filename: function(req,file,cb){
        cb(null, file.originalname);
        }
    })
    // const maxSize = 5 * 1024 * 1024
    
    // 로컬일경우
    const upload = multer({
      storage: storage,
      limits: { fileSize: 10 * 1024 * 1024 }
    })
    console.log("localhost upload")
    module.exports = upload;
}


            
