const db = require('../models');

exports.payment = async(req,res) => {//장바구니
    try {
        const body = req.body;
        const {od_id,mb_id,od_name,od_email,od_tel,od_zip,od_addr1,od_addr2,od_momo,od_cart_price,od_send_cost,od_bank_account,od_receipt_time,od_status,od_hope_data,od_settle_case,
        } = body;
        
        // if(!name || !description || !price || !seller || !imageUrl){//방어코드 
        //     res.status(400).send("모든필드를 입력해주세요");
        // }
        db.shop_orders.create({
            od_id,mb_id,od_name,od_email,od_tel,od_zip,od_addr1,od_addr2,od_momo,od_cart_price,od_send_cost,od_bank_account,od_receipt_time,od_status,od_hope_data,od_settle_case,
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

};

exports.paymentUpdate = async(req, res) => {
    try {
        const body = req.body;
        const {od_id,mb_id,od_name,od_email,od_tel,od_zip,od_addr1,od_addr2,od_momo,od_cart_price,od_send_cost,od_bank_account,od_receipt_time,od_status,od_hope_data,od_settle_case,
        } = body;
        
        db.shop_orders.update({
            od_id,mb_id,od_name,od_email,od_tel,od_zip,od_addr1,od_addr2,od_momo,od_cart_price,od_send_cost,od_bank_account,od_receipt_time,od_status,od_hope_data,od_settle_case,
        },{ 
            where : { od_id:od_id } 
        }).then((result)=>{
        // console.log("상품 생성결과 :",result);
            res.send({
                result,
            })
        })
    
    } catch (error) {
        console.log(error);
        res.status(400).send("paymentUpdate에 문제가 발생했습니다.");
    }
};