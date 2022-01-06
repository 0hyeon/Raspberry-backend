const db = require('../models');
const axios = require('axios');
exports.payment = async(req,res) => {//장바구니
    try {
        const body = req.body;
        const {od_id,mb_id,name,size,color,od_name,od_email,od_tel,od_zip,od_addr1,od_addr2,od_momo,od_cart_price,od_send_cost,od_bank_account,od_receipt_time,od_status,od_hope_data,od_settle_case,
        } = body;
        
        // if(!name || !description || !price || !seller || !imageUrl){//방어코드 
        //     res.status(400).send("모든필드를 입력해주세요");
        // }
        db.shop_orders.create({
            od_id,mb_id,name,size,color,od_name,od_email,od_tel,od_zip,od_addr1,od_addr2,od_momo,od_cart_price,od_send_cost,od_bank_account,od_receipt_time,od_status,od_hope_data,od_settle_case,
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
        const {
            od_id, //거래번호 
            od_status,//거래상태 (결제대기 , 결제완료, 배송준비, 배송중, 배송완료 )
            od_tno//imp_uid//거래번호,
        } = body;
        
         // 액세스 토큰(access token) 발급 받기
         const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
              imp_key: "imp_apikey", // REST API 키
              imp_secret: "ekKoeW8RyKuT0zgaZsUtXXTLQ4AhPFW3ZGseDA6bkA5lamv9OqDMnxyeB9wqOsuO9W3Mx9YSJ4dTqJ3f" 
              // REST API Secret
            }
          });
        const { access_token } = getToken.data.response; // 인증 토큰
        
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${od_tno}`,
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        
        const paymentData = getPaymentData.data.response; // 아임포트 서버에서 조회한 결제 정보

        // DB에서 결제되어야 하는 금액 조회
        const order = await db.shop_orders.findOne({where: {od_id:paymentData.merchant_uid} });//db에 있는 
        const amountToBePaid = Number(order.od_cart_price); // (아임포트서버쪽)결제 되어야 하는 금액

        //결제검증하기
        console.log('amountToBePaid',amountToBePaid);
        const { amount, status } = paymentData;//아임포트에서 결제된금액
        console.log('amount',amount);

        if (amount === amountToBePaid) { // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
        //   await db.shop_orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
            await db.shop_orders.update({
            od_status:'결제완료',
            },{ 
                where : { od_id:paymentData.merchant_uid } 
            })

          switch (status) {
            case "ready": // 가상계좌 발급
              // DB에 가상계좌 발급 정보 저장
              const { vbank_num, vbank_date, vbank_name } = paymentData;
            //   await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});


              await db.shop_orders.update({//유저 가상계좌정보 업데이트
                vbank_num,
                vbank_date,
                vbank_name
                },{ 
                    where : { od_id:paymentData.merchant_uid } 
                })

            await db.Product.update({//상품정보 수량 1 빼기 
                vbank_num,
                vbank_date,
                vbank_name
                },{ 
                    where : { od_id:paymentData.merchant_uid } 
                })

              // 가상계좌 발급 안내 문자메시지 발송
              SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
              res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
              break;
            case "paid": // 결제 완료
              res.send({ status: "success", message: "일반 결제 성공" });
              break;
          }
        } else { // 결제금액 불일치. 위/변조 된 결제
          throw { status: "forgery", message: "위조된 결제시도" };
        }

            
        // }).then((result)=>{
        // // console.log("상품 생성결과 :",result);
        //     res.send({
        //         result
        //     })
        // })
    
    } catch (error) {
        console.log(error);
        res.status(400).send("paymentUpdate에 문제가 발생했습니다.");
    }
};