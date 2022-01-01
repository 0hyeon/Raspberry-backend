const db = require('../models');


//모든상품조회
exports.products = async(req,res) => {
    try {
        db.Product.findAll({//상품정보들 복수개를 조회할때는,
            order : [["createdAt","DESC"]],//불러오는 순서
            attributes: ["id","name","price","createdAt","seller","color1","colorName1","size1","quantity1","size1_2","quantity1_2","size1_3","quantity1_3","color2","colorName2","size2","quantity2","size2_2","quantity2_2","size2_3","quantity2_3","color3","colorName3","size3","quantity3","size3_2","quantity3_2","size3_3","quantity3_3","imageUrl","imageUrl2","imageUrl3","imageUrl4","imageUrl5","detailPage","relateProduct1","relateProduct2","relateProduct3","relateProduct4","relateProduct5","soldout"],//이정보들만 받겠다.    
        }).then((result)=>{
            // console.log("PRODUCTS :",result);
            res.send({
            products:result
            })
        })
    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
        // res.status(400).json({"resultCode":-1, "data": null})
    }
}

//상품등록 
exports.products_post = async(req,res) => {
    try {
        const body = req.body;
        
        const {name, description, price, seller, color1, colorName1, size1, quantity1, size1_2, quantity1_2, size1_3, quantity1_3, color2, colorName2, size2, quantity2, size2_2, quantity2_2, size2_3, quantity2_3, color3, colorName3, size3, quantity3, size3_2, quantity3_2, size3_3, quantity3_3, imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage} = body;
        
        if(!name || !description || !price || !seller || !imageUrl){//방어코드 
        res.status(400).send("모든필드를 입력해주세요");
        }

        db.Product.create({
            name,description,price,seller,color1,colorName1,size1,quantity1,size1_2,quantity1_2,size1_3,
            quantity1_3,color2,colorName2,size2,quantity2,size2_2,quantity2_2,size2_3,quantity2_3,color3,
            colorName3,size3,quantity3,size3_2,quantity3_2,size3_3,quantity3_3,imageUrl,imageUrl2,imageUrl3,
            imageUrl4,imageUrl5,detailPage,
        }).then((result)=>{
            res.send({
                result,
            })
        })

    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
        // res.status(400).json({"resultCode":-1, "data": null})
    }
}

// 상품 업데이트 
exports.Updateproducts = async(req, res) => {
    try {
        const params = req.params;
        const { id } = params;
        console.log(id);
        const body = req.body;
        const {name, description, price, seller, color1, colorName1, size1, quantity1, size1_2, quantity1_2, size1_3, quantity1_3, color2, colorName2, size2, quantity2, size2_2, quantity2_2, size2_3, quantity2_3, color3, colorName3, size3, quantity3, size3_2, quantity3_2, size3_3, quantity3_3, imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage,relateProduct1,relateProduct2,relateProduct3,relateProduct4,relateProduct5} = body;
        
        if(!name || !description || !price || !seller || !imageUrl){//방어코드 
        // console.log("name",name);
        // console.log("description",description);
        // console.log("price",price);
        // console.log("seller",seller);
        // console.log("imageUrl",imageUrl);
        }
    
        db.Product.update({
            name,description,price,seller,color1,colorName1,size1,quantity1,size1_2,quantity1_2,size1_3,quantity1_3,color2,colorName2,size2,quantity2,size2_2,quantity2_2,size2_3,quantity2_3,color3,colorName3,size3,quantity3,size3_2,quantity3_2,size3_3,quantity3_3,imageUrl,imageUrl2,imageUrl3,imageUrl4,imageUrl5,detailPage,relateProduct1,relateProduct2,relateProduct3,relateProduct4,relateProduct5,
        },{ 
            where : { id:id } 
        }
    ).then((result)=>{
      // console.log("상품 생성결과 :",result);
        res.send({
            result,
        })
    })
    } catch (error) {
        console.log(error);
        res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    }
};

//상품조회 1개
exports.productsId = (req,res) => {
    try {
        const params = req.params;
        const { id } = params;
        db.Product.findOne({
            where: {
            id: id,
            },
        }).then((result)=>{
            res.send({
                product : result
            });
        })
    } catch (error) {
        console.log(error);
        res.status(400).send("상품 조회에 에러가 발생했습니다.");
    }
    
};

//관리자페이지에서 상품삭제 
exports.AdmdeleteToItem = async(req,res) => {//장바구니
    try {
        const { ItemId } = req.body;
            db.Product.destroy(
            {
                where: { id: ItemId}
            }
            )
        .then(()=>{
            db.shop_cart.destroy(
            {
                where: { it_id: ItemId}
            }
            ) 
        })
        .then((result)=>{
            res.send({
                result
            });
        })
    } catch (error) {
        console.log(error);
        res.status(400).send("관리자페이지 상품삭제 도중 문제가 발생했습니다.");
    }
};
