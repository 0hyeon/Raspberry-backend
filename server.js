const express = require('express');
const cors = require("cors");
const db = require('./models');
const app = express();
const user_inform = require('./routes/user_inform');
const bodyParser = require('body-parser');
const multer = require('multer');
const logger = require('morgan');
const Router = require('./routes/index');
const cookieParser = require('cookie-parser');
const upload = require('./upload');
// const bodyParser = require('body-parser');
var dotenv = require('dotenv');

dotenv.config(); //LOAD CONFIG
const env = process.env.DB_HOST;

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
// 미들웨어 셋팅

// headers:{
//   'Content-Type': 'application/x-www-form-urlencoded',
//   'Accept': 'application/json'}
// }



// 선생님이 주신 서버 
// var allowlist = ['http://localhost:3000'];
// var corsOptionsDelegate = function (req, callback) {
//     var corsOptions;
//     if (allowlist.indexOf(req.header('Origin')) !== -1) {
//         corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//     } else {
//         corsOptions = { origin: false } // disable CORS for this request
//     }
//     callback(null, corsOptions) // callback expects two parameters: error and options
// }
// app.use(cors(corsOptionsDelegate));


// const allowCORS = function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//   res.header('cookie1=value1; SameSite=Lax');
//   res.header('cookie2=value2; SameSite=None; Secure')
//   next();
// }
// app.use(allowCORS);


//내가한 코드 
app.use(cors({
    origin: true,
    credentials: true
}));

app.use('/v1', Router)//버전

// app.use('/user_inform', user_inform);
app.use('/auth', user_inform);

// const upload = multer({
//     storage: multer.diskStorage({
//         destination : function(req,file,cb){
//         cb(null,'uploads/')
//         },
//         filename: function(req,file,cb){
//         cb(null, file.originalname);
//         }
//     })
// })

// const storage = multer.diskStorage({
//     destination : function(req,file,cb){
//     cb(null,'uploads/')
//     },
//     filename: function(req,file,cb){
//     cb(null, file.originalname);
//     }
// })
// // const maxSize = 5 * 1024 * 1024

// // 로컬일경우
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }
// })

const uploadBanner = multer({
    storage: multer.diskStorage({
        destination : function(req,file,cb){
        cb(null,'uploads/banners/')
        },
        filename: function(req,file,cb){
        cb(null, file.originalname);
        }
    })
})


app.use('/uploads',express.static('uploads'));//업로드 경로 설정 

// DB authentication
db.sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync();
    // return db.sequelize.drop();
})
.then(() => {
    console.log('DB Sync complete.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

app.get("/", (req, res) => {
  res.send('Raspberry server on');
});
//상품조회
// app.get("/products", (req, res) => {
//   db.Product.findAll({//상품정보들 복수개를 조회할때는,
//       order : [["createdAt","DESC"]],//불러오는 순서
//       attributes: ["id","name","price","createdAt","seller","color1","colorName1","size1","quantity1","size1_2","quantity1_2","size1_3","quantity1_3","color2","colorName2","size2","quantity2","size2_2","quantity2_2","size2_3","quantity2_3","color3","colorName3","size3","quantity3","size3_2","quantity3_2","size3_3","quantity3_3","imageUrl","imageUrl2","imageUrl3","imageUrl4","imageUrl5","detailPage","relateProduct1","relateProduct2","relateProduct3","relateProduct4","relateProduct5","soldout"],//이정보들만 받겠다.    
//   }).then((result)=>{
//       // console.log("PRODUCTS :",result);
//       res.send({
//       products:result
//       })
//   }).catch((error)=>{
//       console.log(error);
//       res.status(400).send("에러발생");
//   })
// });
//상품등록
// app.post("/products", (req, res) => {
//   const body = req.body;
//   const {name, description, price, seller, color1, colorName1, size1, quantity1, size1_2, quantity1_2, size1_3, quantity1_3, color2, colorName2, size2, quantity2, size2_2, quantity2_2, size2_3, quantity2_3, color3, colorName3, size3, quantity3, size3_2, quantity3_2, size3_3, quantity3_3, imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage} = body;
//   if(!name || !description || !price || !seller || !imageUrl){//방어코드 
//     res.status(400).send("모든필드를 입력해주세요");
//   }
//   db.Product.create({
//     name,
//     description,
//     price,
//     seller,
//     color1,
//     colorName1,
//     size1,
//     quantity1,
//     size1_2,
//     quantity1_2,
//     size1_3,
//     quantity1_3,
//     color2,
//     colorName2,
//     size2,
//     quantity2,
//     size2_2,
//     quantity2_2,
//     size2_3,
//     quantity2_3,
//     color3,
//     colorName3,
//     size3,
//     quantity3,
//     size3_2,
//     quantity3_2,
//     size3_3,
//     quantity3_3,
//     imageUrl,
//     imageUrl2,
//     imageUrl3,
//     imageUrl4,
//     imageUrl5,
//     detailPage,
//   }).then((result)=>{
//     // console.log("상품 생성결과 :",result);
//     res.send({
//       result,
//     })
//   }).catch((error)=>{
//     console.log(error);
//     res.status(400).send("상품 업로드에 문제가 발생했습니다.");
//   })
// });
// // 상품 업데이트 
// app.post("/Updateproducts/:id", (req, res) => {
//   const params = req.params;
//   const { id } = params;
//   console.log(id);
//   const body = req.body;
//   const {name, description, price, seller, color1, colorName1, size1, quantity1, size1_2, quantity1_2, size1_3, quantity1_3, color2, colorName2, size2, quantity2, size2_2, quantity2_2, size2_3, quantity2_3, color3, colorName3, size3, quantity3, size3_2, quantity3_2, size3_3, quantity3_3, imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage,relateProduct1,relateProduct2,relateProduct3,relateProduct4,relateProduct5} = body;
  
//   if(!name || !description || !price || !seller || !imageUrl){//방어코드 
//     // console.log("name",name);
//     // console.log("description",description);
//     // console.log("price",price);
//     // console.log("seller",seller);
//     // console.log("imageUrl",imageUrl);
//   }
  
//   db.Product.update({
//     name,
//     description,
//     price,
//     seller,
//     color1,
//     colorName1,
//     size1,
//     quantity1,
//     size1_2,
//     quantity1_2,
//     size1_3,
//     quantity1_3,
//     color2,
//     colorName2,
//     size2,
//     quantity2,
//     size2_2,
//     quantity2_2,
//     size2_3,
//     quantity2_3,
//     color3,
//     colorName3,
//     size3,
//     quantity3,
//     size3_2,
//     quantity3_2,
//     size3_3,
//     quantity3_3,
//     imageUrl,
//     imageUrl2,
//     imageUrl3,
//     imageUrl4,
//     imageUrl5,
//     detailPage,
//     relateProduct1,
//     relateProduct2,
//     relateProduct3,
//     relateProduct4,
//     relateProduct5,
//   },{ where : { id:id } }
//   ).then((result)=>{
//     // console.log("상품 생성결과 :",result);
//     res.send({
//       result,
//     })
//   }).catch((error)=>{
//     console.log(error);
//     res.status(400).send("상품 업로드에 문제가 발생했습니다.");
//   })
// });

//상품조회
// app.get("/products/:id",(req,res)=>{
//     const params = req.params;
//     const { id } = params;
//     db.Product.findOne({
//         where: {
//         id: id,
//         },
//     }).then((result)=>{
//         // console.log("PRODUCT :",result);
//         res.send({
//           product : result
//         });
//     }).catch((error)=>{
//         console.log(error);
//         res.status(400).send("상품 조회에 에러가 발생했습니다.");
//     });
// });

//배너등록
app.get('/banners',(req,res)=> {
    db.Banner.findAll({//Banners가 아닌 banner
      limit:5
    }).then((result)=>{
      res.send({
        banners: result,
      });
    }).catch((error)=>{
      console.log(error);
      res.status(500).send('에러가 발생했습니다.');
    })
  });

  app.post("/banners", (req, res) => {
    const body = req.body;
    const {imageUrl,href} = body;
    if(!imageUrl || !href){//방어코드 
      res.status(400).send("모든필드를 입력해주세요");
    }
    db.Banners.create({
        imageUrl,
        href,
    }).then((result)=>{
      console.log("배너 생성결과 :",result);
      res.send({
        result,
      })
    }).catch((error)=>{
      console.log(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    })
  });

//multer사용 post 상품업로드 http://localhost:8080/image
app.post('/image',upload.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
    const file = req.file;//저장된 이미지 정보 
    console.log(file);
    if(env === 'production'){//개발일때
      return res.json({ imageUrl:file.location})    
    }else {//로컬일때
        return res.json({ imageUrl:file.path})
    }
});
app.post('/image2',upload.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
    const file = req.file;//저장된 이미지 정보 
    console.log(file);
    if(env === 'production'){//개발일때
      return res.json({ imageUrl2:file.location})    
    }else {//로컬일때
        return res.json({ imageUrl2:file.path})
    }
  
});
app.post('/image3',upload.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
    const file = req.file;//저장된 이미지 정보 
    console.log(file);
    if(env === 'production'){//개발일때
      return res.json({ imageUrl3:file.location})    
    }else {//로컬일때
        return res.json({ imageUrl3:file.path})
    }
});
app.post('/image4',upload.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
    const file = req.file;//저장된 이미지 정보 
    console.log(file);
    if(env === 'production'){//개발일때
      return res.json({ imageUrl4:file.location})    
    }else {//로컬일때
        return res.json({ imageUrl4:file.path})
    }
});
app.post('/image5',upload.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
    const file = req.file;//저장된 이미지 정보 
    console.log(file);
    if(env === 'production'){//개발일때
      return res.json({ imageUrl5:file.location})    
    }else {//로컬일때
        return res.json({ imageUrl5:file.path})
    }
});
app.post('/detailPage1',upload.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
    const file = req.file;//저장된 이미지 정보 
    console.log(file);
    if(env === 'production'){//개발일때
      return res.json({ detailPage1:file.location})    
    }else {//로컬일때
        return res.json({ detailPage1:file.path})
    }
});
app.post('/detailPage2',upload.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
    const file = req.file;//저장된 이미지 정보 
    console.log(file);
    if(env === 'production'){//개발일때
      return res.json({ detailPage2:file.location})    
    }else {//로컬일때
        return res.json({ detailPage2:file.path})
    }
    
});
app.post('/detailPage3',upload.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
    const file = req.file;//저장된 이미지 정보 
    console.log(file);
    if(env === 'production'){//개발일때
      return res.json({ detailPage3:file.location})    
    }else {//로컬일때
        return res.json({ detailPage3:file.path})
    }
});
// 배너 이미지 업로드 
// app.post('/imageBanner',uploadBanner.single('image'),(req,res)=>{//single은 img파일 하나만 보냈을때
//     const file = req.file;//저장된 이미지 정보 
//     console.log(file);
//     res.send({
//         imageUrl : file.path,
//     })
//     if(env === 'production'){//개발일때
//       return res.json({ detailPage3:file.location})    
//     }else {//로컬일때
//         return res.json({ detailPage3:file.path})
//     }
// });
//get장바구니
// app.get('/addToCart', async(req,res) => {
//     // const { seSsionId2 } = req.body;
//     // console.log('req.body.seSsionId2',req.body.seSsionId2);
//     db.shop_cart.findAll({
//         where: {
//           mb_id: seSsionId2,
//         },
//     }).then((result)=>{
//         console.log("seSsionId2 :",seSsionId2);
//         console.log("장바구니get!!! :",result);
//         res.send({
//           product : result
//         });
//     }).catch((error)=>{
//         // console.log(error);
//         res.status(400).send("에러가 발생했습니다.");
//     });
// });

// //post장바구니
// app.post('/decideToCart', async(req,res) => {//장바구니
//   const { productId , seSsionId, price, uploadImage, productName,it_Detail_color,it_Detail_size,it_Detail_quanity } = req.body;
  
//   if(productId == null || seSsionId == null){
//     return;
//   }
//   //유저찾기
//   const user_Cart = await db.shop_cart.findAll({ 
//     where: {
//       it_id: productId, 
//       mb_id: seSsionId,
//       it_Detail_color:it_Detail_color,
//       it_Detail_size:it_Detail_size 
//     }
//   })
//   // console.log(user_Cart);
//   db.shop_cart.findAll({
//     where: {it_id: productId, mb_id: seSsionId}
//   }).then((result)=>{
//     if(user_Cart == ''){//카트비었으면,
//       db.shop_cart.create({
//         it_id : productId,
//         mb_id :seSsionId,
//         it_sc_price:Number(price),
//         thumb_name:uploadImage,
//         it_name:productName,
//         it_Detail_color:it_Detail_color,
//         it_Detail_size:it_Detail_size,
//         it_Detail_quanity:Number(it_Detail_quanity)
//       })  
//       res.send({
//         product : result,
//         msg:'/decideToCart 1'
//       });
//     }else{
//       res.send({
//         product : result,
//         msg:'/decideToCart 2'
//       });  
//     }
//   });
// });
// //post장바구니 가능한지 조회
// app.post('/addToCart', async(req,res) => {//장바구니
//   const { productId , seSsionId, it_Detail_color, it_Detail_size } = req.body;
//   // console.log('seSsionId :',seSsionId);
//   // console.log('productId :',productId);
//   // if(productId == null || seSsionId == null){
//   //   console.log('null이여');
//   //   return;
//   // }
//   //유저찾기
//   const user_Cart = await db.shop_cart.findAll({ 
//     where: {
//       it_id: productId, 
//       mb_id: seSsionId,
//       it_Detail_color:it_Detail_color,
//       it_Detail_size:it_Detail_size 
//     }
//    })
//   // console.log(user_Cart);
//   db.shop_cart.findAll({
//     where: {
//       it_id: productId, 
//       mb_id: seSsionId
//   }
//   }).then((result)=>{
//     if(user_Cart == ''){
//       res.send({
//         msg:'장바구니 저장완료'
//       });
//     }else{
//       res.send({
//         msg:'이미 장바구니에 담겼습니다'
//       });  
//     }
//   });
// });

//cart number couting => components RightMenu.js
// app.post('/setCartItem', async(req,res) => {//장바구니
//   const { seSsionId } = req.body;
//   console.log('seSsionId :',seSsionId);
//   // if(seSsionId == null){
//   //   console.log('null이여');
//   //   return;
//   // }
//   //유저찾기
//   const user_Cart = await db.shop_cart.findAll({ where: {mb_id: seSsionId} })
//   // console.log(user_Cart);
//   db.shop_cart.findAll({
//     where: { mb_id: seSsionId}
//   }).then((result)=>{
//     //  if(user_Cart == ''){//카트비었으면,
//     //   // db.shop_cart.create({
//     //   //   it_id : productId,
//     //   //   mb_id :seSsionId,
//     //   // })  
//     //   res.send({
//     //     cartItem : result,
//     //   });
//     // }else{
//       res.send({
//         cartItem : result,
//       });  
//     // }
//   });
// });
//cart수량 update
// app.post('/deleteToCart', async(req,res) => {//장바구니
//   const { cartId } = req.body;
  
//   db.shop_cart.destroy(
//     {
//       where: { id: cartId}
//     }
//   ).then((result)=>{
//       res.send({
//         result
//       });
//     // }
//   }).catch((error)=>{
//     console.log(error);
//     res.status(400).send("장바구니삭제 도중 문제가 발생했습니다.");
//   });
// });

// app.post('/AdmdeleteToItem', async(req,res) => {//장바구니
//   const { ItemId } = req.body;
//     db.Product.destroy(
//       {
//         where: { id: ItemId}
//       }
//     )
//   .then(()=>{
//     db.shop_cart.destroy(
//       {
//         where: { it_id: ItemId}
//       }
//     ) 
//   })
//   .then((result)=>{
//       res.send({
//         result
//       });
//   }).catch((error)=>{
//     console.log(error);
//     res.status(400).send("관리자페이지 상품삭제 도중 문제가 발생했습니다.");
//   });
// });

const port = 8000;
app.listen(port, () => console.log(`Node.js Server is running on port ${port}...`));
