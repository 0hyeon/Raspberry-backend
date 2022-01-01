const db = require('../models');


exports.decideToCart = async(req,res) => {
    try {
        const { productId , seSsionId, price, uploadImage, productName,it_Detail_color,it_Detail_size,it_Detail_quanity } = req.body;
    
        if(productId == null || seSsionId == null){
            return;
        }
        //유저찾기
        const user_Cart = await db.shop_cart.findAll({ 
            where: {
                it_id: productId, 
                mb_id: seSsionId,
                it_Detail_color:it_Detail_color,
                it_Detail_size:it_Detail_size 
            }
        })
        // console.log(user_Cart);
        db.shop_cart.findAll({
            where: {it_id: productId, mb_id: seSsionId}
        }).then((result)=>{
            if(user_Cart == ''){//카트비었으면,
                db.shop_cart.create({
                    it_id : productId,
                    mb_id :seSsionId,
                    it_sc_price:Number(price),
                    thumb_name:uploadImage,
                    it_name:productName,
                    it_Detail_color:it_Detail_color,
                    it_Detail_size:it_Detail_size,
                    it_Detail_quanity:Number(it_Detail_quanity)
                })  
                res.send({
                    product : result,
                    msg:'/decideToCart 1'
                });
            }else{
                res.send({
                    product : result,
                    msg:'/decideToCart 2'
                });  
            }
        });
    } catch (error) {
        console.log(error);
    }
}


//post장바구니 가능한지 조회
exports.addToCart = async(req,res) => {//장바구니
    try {
        const { productId , seSsionId, it_Detail_color, it_Detail_size } = req.body;

        const user_Cart = await db.shop_cart.findAll({ 
            where: {
            it_id: productId, 
            mb_id: seSsionId,
            it_Detail_color:it_Detail_color,
            it_Detail_size:it_Detail_size 
            }
        })

        db.shop_cart.findAll({
            where: {
                it_id: productId, 
                mb_id: seSsionId
            }
        }).then((result)=>{
            if(user_Cart == ''){
                res.send({
                    msg:'장바구니 저장완료'
                });
            }else{
                res.send({
                    msg:'이미 장바구니에 담겼습니다'
                });  
            }
        }); 
    } catch (error) {
        console.log(error);
    }
    
};

exports.setCartItem = async(req,res) => {//장바구니
    try {
        const { seSsionId } = req.body;

        db.shop_cart.findAll({
            where: { mb_id: seSsionId}
        }).then((result)=>{
            res.send({
                cartItem : result,
            });  
        });

    } catch (error) {
        console.log(error);
    }
    
};
//프론트에서 장바구니 삭제
exports.deleteToCart = async(req,res) => {//장바구니
    try {
        const { cartId } = req.body;
        db.shop_cart.destroy({
            where: { id: cartId}
        }).then((result)=>{
            res.send({
                result
            });
        })    
    } catch (error) {
        console.log(error);
    }
};