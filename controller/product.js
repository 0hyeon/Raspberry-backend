const db = require('../models');


//모든상품조회
exports.products = async(req,res) => {
    try {
        db.Product.findAll({//상품정보들 복수개를 조회할때는,
            order : [["createdAt","DESC"]],//불러오는 순서
            attributes: ["id","name","price","createdAt","seller","color1","colorName1","size1","quantity1","imageUrl","imageUrl2","imageUrl3","imageUrl4","imageUrl5","detailPage","relateProduct1","relateProduct2","relateProduct3","relateProduct4","relateProduct5","soldout"],//이정보들만 받겠다.    
        }).then((result)=>{
            console.log("PRODUCTS :",result);
            res.send({
                products:result
            })
        })
    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
        // res.status(400).json({"resultCode":-1, "data": null})
    }
};

//상품등록 
exports.products_post = (req,res) => {
    try {
        console.log("상품등록 req.body",req);
        
        const {name, description, price, seller,imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage} = req.body;

        // // if(!name || !description || !price ||  !imageUrl){//방어코드 
        // //     res.status(400).send("입력안한값이 있습니다.");
        // // }
        // // let datas = [];
        // const body = req.body;
        // const {name, description, price, seller, color1, colorName1, size1, quantity1, size1_2, quantity1_2, size1_3, quantity1_3, color2, colorName2, size2, quantity2, size2_2, quantity2_2, size2_3, quantity2_3, color3, colorName3, size3, quantity3, size3_2, quantity3_2, size3_3, quantity3_3, imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage,relateProduct1,relateProduct2,relateProduct3,relateProduct4,relateProduct5} = body;
        
        // // console.log("datas!!!!",datas);
        // //product 한개만 생성 
        db.Product.create({
            name,price,seller,description,imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage
                
        })
        .then((result)=>{
            res.send({
                result,
            })
        })
            
        //productoption 생성    
        
        //ProductOption 테이블에 외부키로 모든 옵션설정 
        //컬러1 있으면 3가지 사이즈와수량 insert
        

        // db.Product.create({
        //     name,description,price,seller,color1,colorName1,size1,quantity1,size1_2,quantity1_2,size1_3,
        //     quantity1_3,color2,colorName2,size2,quantity2,size2_2,quantity2_2,size2_3,quantity2_3,color3,
        //     colorName3,size3,quantity3,size3_2,quantity3_2,size3_3,quantity3_3,imageUrl,imageUrl2,imageUrl3,
        //     imageUrl4,imageUrl5,detailPage,
        // }).then((result)=>{
        //     res.send({
        //         result,
        //     })
        // })
        
    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
        // res.status(400).json({"resultCode":-1, "data": null})
    }
};

// 상품 업데이트 
exports.Updateproducts = async(req, res) => {
    try {
        // fk적용 
        const params = req.params;
        const { id } = params;
        const productOptionPk = await db.Product.findByPk(id);
        //create + as명 (models에서 association에서 적은내용)
        // await productOptionPk.createOption(req.body)
        db.ProductOption.destroy({
            where: { 
                product_id:id 
            }
        })
        

        // console.log(id);
        const body = req.body;
        const {name, description, price, seller, color1, colorName1, size1, quantity1, size1_2, quantity1_2, size1_3, quantity1_3, color2, colorName2, size2, quantity2, size2_2, quantity2_2, size2_3, quantity2_3, color3, colorName3, size3, quantity3, size3_2, quantity3_2, size3_3, quantity3_3, imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage,relateProduct1,relateProduct2,relateProduct3,relateProduct4,relateProduct5} = body;
        
        if({size1_2:size1_2} == undefined){
            size1_2 == null
        }
        if({size1_3:size1_3} == undefined){
            size1_3 == null
        }
        if({size2:size2} == undefined){
            size2 == null
        }
        if({size2_2:size2_2} == undefined){
            size2_2 == null
        }
        if({size2_3:size2_3} == undefined){
            size2_3 == null
        }
        if({size3:size3} == undefined){
            size3 == null
        }
        if({size3_2:size3_2} == undefined){
            size3_2 == null
        }
        if({size3_3:size3_3} == undefined){
            size3_3 == null
        }
        // if(!name || !description || !price || !seller || !imageUrl){//방어코드 
        //     res.status(400).send("입력안한 값이 있습니다.");
        // }
        if(size1 != undefined){
            await productOptionPk.createOption({
                name,description,price,seller,
                    color1,colorName1,
                    size1,quantity1,colorType:"1"
            })
        }
        if(size1_2 != undefined){
            await productOptionPk.createOption({
                name,description,price,seller,
                    color1,colorName1,
                    size1:size1_2,quantity1:quantity1_2,colorType:"1"
            })
        }
        if(size1_3 != undefined){
            await productOptionPk.createOption({
                name,description,price,seller,
                    color1,colorName1,
                    size1:size1_3,quantity1:quantity1_3,colorType:"1"
            })
        }
        
        //컬러2 있으면 3가지 사이즈와수량 insert
        if(color2 != undefined){
            if(size2 != undefined){
                await productOptionPk.createOption({
                    name,description,price,seller,
                        color1:color2,colorName1:colorName2,
                        size1:size2,quantity1:quantity2,colorType:"2"
                })
            }
            if(size2_2 != undefined){
                await productOptionPk.createOption({
                    name,description,price,seller,
                        color1:color2,colorName1:colorName2,
                        size1:size2_2,quantity1:quantity2_2,colorType:"2"
                })
            }
            if(size2_3 != undefined){
                await productOptionPk.createOption({
                    name,description,price,seller,
                        color1:color2,colorName1:colorName2,
                        size1:size2_3,quantity1:quantity2_3,colorType:"2"
                })
            }
        }
        //컬러3 있으면 3가지 사이즈와수량 insert
        if(color3 != undefined){
            if(size3 != undefined){
                await productOptionPk.createOption({
                    name,description,price,seller,
                        color1:color3,colorName1:colorName3,
                        size1:size3,quantity1:quantity3,colorType:"3"
                })
            }
            if(size3_2 != undefined){
                await productOptionPk.createOption({
                    name,description,price,seller,
                        color1:color3,colorName1:colorName3,
                        size1:size3_2,quantity1:quantity3_2,colorType:"3"
                })
            }
            if(size3_3 != undefined){
                await productOptionPk.createOption({
                    name,description,price,seller,
                        color1:color3,colorName1:colorName3,
                        size1:size3_3,quantity1:quantity3_3,colorType:"3"
                })
            }
        }
        db.Product.update({
            name,price,seller,description,imageUrl, imageUrl2, imageUrl3, imageUrl4,imageUrl5, detailPage,relateProduct1,relateProduct2,relateProduct3,relateProduct4,relateProduct5
        },{ 
            where : { id:id } 
        }).then((result)=>{
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

//상품옵션 api
exports.productsOptions = async(req,res) => {
    const body = req.body;
    const {
        productname
    } = body;
    try {
        db.ProductOption.findAll({//상품정보들 복수개를 조회할때는,
            where: {name: productname},
            // order : [["DESC"]],//불러오는 순서
            order : [["createdAt","DESC"]],//불러오는 순서
            attributes: ["id","name","price","seller","color1","colorName1","size1","quantity1","colorType","createdAt"],//이정보들만 받겠다.    
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