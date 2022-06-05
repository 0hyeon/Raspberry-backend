const db = require('../models');
const axios = require('axios');
const dayjs = require('dayjs');
const aligoapi = require('aligoapi');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);


exports.payment = async(req,res) => {//장바구니
    try {
        const body = req.body;
        const {od_id,mb_id,product_option_id,product_it_id,name,size,color,ordernum,stock,od_name,od_email,od_tel,od_zip,od_addr1,od_addr2,od_memo,od_cart_price,od_send_cost,od_bank_account,od_receipt_time,od_status,od_hope_data,od_settle_case} = body;
        
        // if(!name || !description || !price || !seller || !imageUrl){//방어코드 
        //     res.status(400).send("모든필드를 입력해주세요");
        // }
        db.shop_orders.create({
            od_id,mb_id,product_option_id,product_it_id,name,size,color,ordernum,stock,od_name,od_email,od_tel,od_zip,od_addr1,od_addr2,od_memo,od_cart_price,od_send_cost,od_bank_account,od_receipt_time,od_status,od_hope_data,od_settle_case}).then((result)=>{
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
                // imp_key: "imp_apikey", // REST API 키
                // imp_secret: "ekKoeW8RyKuT0zgaZsUtXXTLQ4AhPFW3ZGseDA6bkA5lamv9OqDMnxyeB9wqOsuO9W3Mx9YSJ4dTqJ3f" 
                imp_key: "5955693315212708", // REST API 키
                imp_secret: "CP5LAPTaNtIqr3MDA1PRMQF6ZQqhnRxZHCLhsEsf8aGzetcOu2GgSlmRcM8zEGzljkDLZ517gIGubTjF" 
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
        // console.log('paymentData!!!!!!!!!!!',paymentData);
        //console.log('paymentData!!!!!!!!!!!',paymentData.name);

        // DB에서 결제되어야 하는 금액 조회
        const order = await db.shop_orders.findOne({where: {od_id:paymentData.merchant_uid} });//db에 있는 
        const amountToBePaid = Number(order.od_cart_price); // (아임포트서버쪽)결제 되어야 하는 금액

        //결제검증하기
        // console.log('amountToBePaid',amountToBePaid);
        const { amount, status} = paymentData;//아임포트에서 결제된금액
        // console.log('amount',amount);

        if (amount === amountToBePaid) { // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
        //   await db.shop_orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
            let user_merchant_uid = await db.shop_orders.findAll({ 
                    raw: true,
                    where: {
                        od_id: paymentData.merchant_uid, 
                    }
                })
            let [{product_it_id,stock,ordernum,product_option_id,od_tel,od_addr1,od_cart_price}] = user_merchant_uid
            
            switch (status) {
                
                case "ready": // 가상계좌 발급
                // DB에 가상계좌 발급 정보 저장
                // console.log("paymentData : ",paymentData);
                    const { vbank_num, vbank_date, vbank_name} = paymentData;
                    
                    await db.shop_orders.update({//유저 가상계좌정보 업데이트
                    vbank_num,
                    vbank_date,
                    vbank_name
                    },{ 
                        where : { od_id:paymentData.merchant_uid } 
                    }).then(()=>{
                            let company = '라즈베리베리'
                            let tpl_code="TI_3624"
                            let msg=`[${company}]
입금계좌 안내
□ 상품명: ${paymentData.name}
□ 주문번호 : ${paymentData.od_id}
□ 배송지 : ${paymentData.od_addr1}
□ 결제금액 : ${od_cart_price}원

□ 입금은행: ${vbank_name}
□ 가상계좌번호: ${vbank_num}
□ 입금기한: ${Unix_timestamp(vbank_date)}

? have a good berry berry!! ?`;
                            let subject="가상계좌"
                            alimtalk(name, od_tel, msg, subject, tpl_code)
                    })
                    // 가상계좌 발급 안내 문자메시지 발송
                    res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });

                    break;
                case "paid": // 결제 완료
                    const { name,pg_tid,merchant_uid, custom_data } = paymentData;//name:상품이름 , pg_tid:결제완료표식 , merchant_uid: ,customer_uid : 구입한상품 옵션
                    // const paymentData_name = paymentData.name.split(',');
                    // console.log("paymentData_name[0]",paymentData_name[0]);
                    // console.log("paymentData_name[1]",paymentData_name[1]);
                    //유저 결제정보 업데이트
                    await db.shop_orders.update({
                        pg_tid
                    },{ 
                        where : { od_id : merchant_uid } 
                    })

                    await db.shop_orders.update({
                        od_status:'결제완료',
                    },{ 
                        where : { od_id:paymentData.merchant_uid } 
                    })
                    // console.log("custom_data!!!!!!!!!!!!!",custom_data);
                    //단일결제시 : {"name":"2"}
                    //다중결제시 : {"name":"1,2"}                    

                    jsonObj = JSON.parse(custom_data);
                    console.log("jsonObj : ",jsonObj);
                    // console.log("jsonObj : ",jsonObj.desc);
                    //{ name: '2' }
                    
                    const splitResult = jsonObj.name.split(',');
                    // const splitResult2 = jsonObj.desc.split(',');
                    console.log("splitResult : ",splitResult);//'2' , [ '1', '2' ]
                    // console.log("splitResult2 : ",splitResult2);//'2' , [ '1', '2' ]

                    console.log("splitResult.length",splitResult.length);
                    // console.log("splitResult2.length",splitResult2.length);

                
                    console.log('user_merchant_uid',user_merchant_uid);
                    console.log('product_it_id',product_it_id);
                    console.log('product_option_id',product_option_id);
                    console.log('stock',stock);
                    console.log('ordernum',ordernum);

                    const user_it_id = product_it_id.split(',');
                    const user_stock = stock.split(',');
                    const user_order = ordernum.split(',');
                    const user_opt_id = product_option_id.split(',');
                    for(i=0;i<splitResult.length; i++){//splitResult.length만큼 반복 product optionId만큼 (1,2)

                        Number(splitResult[i])//option id 1,2

                        //const [{ordernum,stock}] =user_merchant_uid// [{ordernum:'1,1'} , {stock:'1,1'}]
                        console.log("user_it_id[i]",user_it_id[i]);
                        console.log("ordernum[i]",ordernum[i]);
                        console.log("stock[i]",stock[i]);
                        console.log("user_opt_id[i]",user_opt_id[i]);

                        const sellCountValue = user_it_id[i];
                        const sellCountValueFind = await db.Product.findOne({where: {id:sellCountValue} })//sellcount값 가져오기 findOne
                        const sellCountValue_Real = Number(sellCountValueFind.sellCount); //+1하기전 값가져옴

                        console.log("sellCountValue : ",sellCountValue);
                        console.log("sellCountValueFind : ",sellCountValueFind);
                        console.log("sellCountValue_Real : ",sellCountValue_Real);

                        await db.ProductOption.update({//해당제품의 옵션 재고업데이트 재고 : 기존재고 - 주문수량 // 두번째 오류 
                            quantity1:Number(user_stock[i])-Number(user_order[i])//split으로 잘라서 넣어야 
                        },{ 
                            where : { id:splitResult[i] } //optionid 각각 1,2의 수량을  통과
                        }).then(
                            await db.shop_orders.update({//주문 테이블에 기존재고 리셋 
                                stock:0
                            },{ 
                                where : { od_id : merchant_uid } 
                            }),
                            await db.ProductOption.findAll({ //결제한 제품의 ProductOption 전부 조회
                                raw: true,
                                where: {
                                    id: user_opt_id[i], //productopt의 ID
                                }
                            }).then((result)=>{
                                console.log("result!!!",result)
                                console.log("result!!!",result.quantity1)
                                const quantity1_result = result.map((item)=>item.quantity1)//ProductOption 재고
                                console.log("quantity1_result",quantity1_result) // [0]
                                const quantity1_result2 = [quantity1_result]

                                if(quantity1_result2 <= 0){
                                    db.ProductOption.update({
                                        soldout:0
                                    },{ 
                                        where : { 
                                            // name : name 
                                            id : user_opt_id[i]//productopt의 ID
                                        } 
                                    })
                                }
                            }),
                            await db.shop_cart.destroy({
                                where: {
                                    mb_id:order.mb_id,
                                    it_id:user_it_id[i],
                                    it_option_id:user_opt_id[i]
                                }
                            }),
                            await db.Product.update({
                                sellCount:sellCountValue_Real+1
                            },{ 
                                where : { 
                                    id : user_it_id[i] 
                                } 
                            }),
                            await db.ProductOption.findAll({ //결제한 제품의 ProductOption 전부 조회
                                raw: true,
                                where: {
                                    product_id: user_it_id[i], //productopt의 ID
                                }
                            }).then((result)=>{
                                // console.log("result!!!",result)
                                // console.log("result!!!",result.quantity1)
                                const soldout_result = result.map((item)=>item.soldout)//ProductOption 재고
                                console.log("soldout_result",soldout_result);
                                const sum1 = soldout_result.reduce((accumulator, currentNumber) => accumulator + currentNumber,0);
                                console.log("sum1",sum1)

                                let company = '라즈베리베리'
                                let tpl_code="TI_0937"
                                let msg=`[${company}]
구매가 성공적으로 완료되었습니다!
□ 상품명: ${name}
□ 주문번호 : ${od_id}
□ 배송지 : ${od_addr1}
□ 결제금액 : ${od_cart_price}원

? have a good berry berry!! ?`;
                                let subject="구매완료"
                                alimtalk(name, od_tel, msg, subject, tpl_code)
                                
                                if(sum1 == 0){
                                    db.Product.update({
                                        soldout:1
                                    },{ 
                                        where : { 
                                            id : user_it_id[i] 
                                        } 
                                    })
                                }
                            })
                        )
                    }                    
                    //product soldout update
                    res.send({ status: "success", message: "일반 결제 성공" });
                    // shop_order 테이블에 필드를 추가, 구매한 productOptions id를 update 그리고 
                    // 그id를 가져와서 productOptions필드의 수량을 -1 한다 
                    //merchant_uid, name,pg_tid 로

                    // find로 찾아야한다. 뭘? shop_orders에서 od_id에 size와 color를 

                    // console.log("user_Item!!!!!!!!!!!",user_Item);
                    //상품정보 업데이트 (- 마이너스)
                    // await db.ProductOption.update({
                    //     //컬러와 상품 이름 받아온후, 상품수량만큼 -1 만약에 0이하로 가면 soldout 처리 
                    //     },{ 
                    //         where : { od_id:paymentData.merchant_uid } 
                    // })
                    break;
                }
                
        
        } else { // 결제금액 불일치. 위/변조 된 결제
            throw { status: "forgery", message: "위조된 결제시도" };
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).send("paymentUpdate에 문제가 발생했습니다.");
    }
};
exports.orderCheck = async(req,res) => {//비회원 주문조회
    try {
        const body = req.body;
        const {merchant_uid,od_tel
        } = body;
        
        await db.shop_orders.findAll({ 
            raw: true,
            where: {
                od_id: merchant_uid, 
                od_tel:od_tel
            }
        }).then((result)=>{
            res.send({
                result,
            })
        })
        // if(!name || !description || !price || !seller || !imageUrl){//방어코드 
        //     res.status(400).send("모든필드를 입력해주세요");
        // }

    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
        // res.status(400).json({"resultCode":-1, "data": null})
    }

};
exports.getOrderResult = async(req,res) => {//회원 주문조회
    try {
        const body = req.body;
        const {
            mb_id,
        } = body;
        
        await db.shop_orders.findAll({ 
            raw: true,
            order : [["createdAt","DESC"]],//불러오는 순서
            where: {
                mb_id
            }
        }).then((result)=>{
            res.send({
                result,
            })
        })
        // if(!name || !description || !price || !seller || !imageUrl){//방어코드 
        //     res.status(400).send("모든필드를 입력해주세요");
        // }

    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
        // res.status(400).json({"resultCode":-1, "data": null})
    }

};
//주문조회에서 해당내역 삭제 
exports.deleteToCart2 = async(req,res) => {
    try {
        const { id } = req.body;
        db.shop_orders.destroy({
            where: { 
                id:id 
            }
        }).then((result)=>{
            res.send({
                result
            });
        })    
    } catch (error) {
        console.log(error);
    }
};
//order table 주소업데이트  
exports.ModifyAddress = async(req,res) => {//장바구니
    try {
        const { od_addr1, od_addr2, od_id } = req.body;
        await db.shop_orders.update({//유저 가상계좌정보 업데이트
            
            od_addr1,
            od_addr2,
        },{ 
            where : { od_id } 
        }).then((result)=>{
            res.send({
                result
            });
        })
    } catch (error) {
        console.log(error);
    }
};
//결제대기갯수 (adminPage)
exports.setOrderWait = async(req,res) => {
    try {
        await db.shop_orders.findAll({
            where: {od_status: "결제대기"},
            order : [["createdAt","DESC"]],//불러오는 순서
        }).then((result)=>{
            res.send({
                result
            })
        })
        
    } catch (error) {
        console.log(error);
    }
};
//결제완료갯수 (adminPage)
exports.setOrderSuccess = async(req,res) => {
    try {
        await db.shop_orders.findAll({
            where: {od_status: "상품준비중"},
            order : [["createdAt","DESC"]],//불러오는 순서
        }).then((result)=>{
            res.send({
                result
            })
        })
        
    } catch (error) {
        console.log(error);
    }
};
//all갯수 (adminPage)
exports.setOrderAll = async(req,res) => {
    try {
        await db.shop_orders.findAll({
            order : [["createdAt","DESC"]],//불러오는 순서
        }).then((result)=>{
            res.send({
                result
            })
        })
        
    } catch (error) {
        console.log(error);
    }
};
//송장등록 (adminPage)
exports.ModifySongJang = async(req,res) => {
    try {
        const { od_id,od_songjang,name,od_addr1,od_cart_price,od_tel } = req.body;
        await db.shop_orders.update({//유저 가상계좌정보 업데이트
            od_songjang,
            od_status:'출고완료'
        },{ 
            where : { od_id } 
        }).then((result)=>{
                let company = '라즈베리베리'
                let tpl_code="TI_1516"
                let od_songjang2="334864651561656156"

                let msg=`[${company}]
${name}  상품배송이 시작되었습니다.

□ 상품명: ${name}
□ 주문번호 : ${od_id}
□ 배송지 : ${od_addr1}
□ 결제금액 : ${od_cart_price}원
□ 택배사(송장번호): ${od_songjang} (클릭시 배송조회)
                
? have a good berry berry!! ?`;
                let subject="배송버튼"
                alimtalk(name, od_tel, msg, subject, tpl_code)
                console.log("카카오알림톡 발송 : ",msg)
        }).then((result)=>{
            res.send({
                result
            });
            
        })
        
    } catch (error) {
        console.log(error);
    }
};
//결제상태변경api (adminPage)
exports.ModifyOrderStatus = async(req,res) => {
    try {
        const { od_id, od_status,name,od_addr1,od_cart_price,od_tel } = req.body;
        // 출고완료에서 ModifyOrderStatus 사용할때 파라미터 값을 3개 안보내기 때문에 null 처리
        if(name ==  undefined ){
            name == null
            od_addr1 == null
            od_cart_price == null
            od_tel == null
        }
      
        await db.shop_orders.update({
            od_status
        },{ 
            where : { od_id } 
        }).then((result)=>{
            if( od_status == '상품준비중'){//배송준비
                let company = '라즈베리베리'
                let tpl_code="TI_1148"
                let msg=`[${company}]
${name} 배송준비중입니다.

□ 상품명: ${name}
□ 주문번호 : ${od_id}
□ 배송지 : ${od_addr1}
□ 결제금액 : ${od_cart_price}원
                
? have a good berry berry!! ?`;
                let subject="배송준비"
                alimtalk(name, od_tel, msg, subject, tpl_code)
                console.log("카카오알림톡 발송 : ",msg)
            }
            
        }).then((result)=>{
            res.send({
                result
            });
        })
        
    } catch (error) {
        console.log(error);
    }
};

exports.setwebhook = async(req,res) => {
    
    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
        // 액세스 토큰(access token) 발급 받기
        console.log('imp_uid : ',imp_uid);
        console.log('merchant_uid : ',merchant_uid);
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                // imp_key: "imp_apikey", // REST API 키
                // imp_secret: "ekKoeW8RyKuT0zgaZsUtXXTLQ4AhPFW3ZGseDA6bkA5lamv9OqDMnxyeB9wqOsuO9W3Mx9YSJ4dTqJ3f" 
                imp_key: "5955693315212708", // REST API 키
                imp_secret: "CP5LAPTaNtIqr3MDA1PRMQF6ZQqhnRxZHCLhsEsf8aGzetcOu2GgSlmRcM8zEGzljkDLZ517gIGubTjF" 
              // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            // url: `https://api.iamport.kr/payments/${od_tno}`,
            url: `https://api.iamport.kr/payments/${imp_uid}`,
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        const user_merchant_uid = await db.shop_orders.findAll({ 
            raw: true,
            where: {
                od_id: merchant_uid, 
            }
        })
        const [{product_it_id,stock,ordernum,product_option_id,od_tel,od_addr1,od_cart_price}] = user_merchant_uid
        // DB에서 결제되어야 하는 금액 조회
        const order = await db.shop_orders.findOne({where: {od_id:merchant_uid} });
        // console.log ("order : ",order );
        const amountToBePaid = Number(order.od_cart_price); // (아임포트서버쪽)결제 되어야 하는 금액 
        
        // 결제 검증하기
        console.log("paymentData !!!!: ",paymentData);
        const { vbank_num, vbank_date, vbank_name,name,buyer_addr,amount,status,pg_tid,custom_data } = paymentData;
        if (amount === amountToBePaid) { // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
          switch (status) {
            case "ready": // 가상계좌 발급
              // DB에 가상계좌 발급 정보 저장
                
                await db.shop_orders.update({//유저 가상계좌정보 업데이트
                    vbank_num,
                    vbank_date,
                    vbank_name
                },{ 
                    where : { od_id:paymentData.merchant_uid } 
                }).then(()=>{
                    let company = '라즈베리베리'
                    let tpl_code="TI_3624"
                    let msg=`[${company}]
입금계좌 안내
□ 상품명: ${name}
□ 주문번호 : ${merchant_uid}
□ 배송지 : ${buyer_addr}
□ 결제금액 : ${amount}원

□ 입금은행: ${vbank_name}
□ 가상계좌번호: ${vbank_num}

□ 입금기한: ${Unix_timestamp(vbank_date)}

? have a good berry berry!! ?`;
                    let subject="가상계좌"
                    alimtalk(paymentData.name, od_tel, msg, subject, tpl_code)
            })

              // 가상계좌 발급 안내 문자메시지 발송
            //   SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
              res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
              break;
            case "paid": // 결제 완료
                await db.shop_orders.update({
                    pg_tid
                },{ 
                    where : { od_id : paymentData.merchant_uid } 
                })
                await db.shop_orders.update({
                    od_status:'결제완료',
                },{ 
                    where : { od_id:paymentData.merchant_uid } 
                })
                jsonObj = JSON.parse(custom_data);
                    console.log("jsonObj : ",jsonObj);
                    // console.log("jsonObj : ",jsonObj.desc);
                    //{ name: '2' }
                    
                    const splitResult = jsonObj.name.split(',');
                    // const splitResult2 = jsonObj.desc.split(',');
                    console.log("splitResult : ",splitResult);//'2' , [ '1', '2' ]
                    // console.log("splitResult2 : ",splitResult2);//'2' , [ '1', '2' ]

                    console.log("splitResult.length",splitResult.length);
                    // console.log("splitResult2.length",splitResult2.length);

                
                    console.log('user_merchant_uid',user_merchant_uid);
                    console.log('product_it_id',product_it_id);
                    console.log('product_option_id',product_option_id);
                    console.log('stock',stock);
                    console.log('ordernum',ordernum);

                    const user_it_id = product_it_id.split(',');
                    const user_stock = stock.split(',');
                    const user_order = ordernum.split(',');
                    const user_opt_id = product_option_id.split(',');
                    for(i=0;i<splitResult.length; i++){//splitResult.length만큼 반복 product optionId만큼 (1,2)

                        Number(splitResult[i])//option id 1,2

                        //const [{ordernum,stock}] =user_merchant_uid// [{ordernum:'1,1'} , {stock:'1,1'}]
                        console.log("user_it_id[i]",user_it_id[i]);
                        console.log("ordernum[i]",ordernum[i]);
                        console.log("stock[i]",stock[i]);
                        console.log("user_opt_id[i]",user_opt_id[i]);
                        const sellCountValue = user_it_id[i];
                        const sellCountValueFind = await db.Product.findOne({where: {id:sellCountValue} })//sellcount값 가져오기 findOne
                        const sellCountValue_Real = Number(sellCountValueFind.sellCount); //+1하기전 값가져옴

                        console.log("sellCountValue : ",sellCountValue);
                        console.log("sellCountValueFind : ",sellCountValueFind);
                        console.log("sellCountValue_Real : ",sellCountValue_Real);

                        await db.ProductOption.update({//해당제품의 옵션 재고업데이트 재고 : 기존재고 - 주문수량 // 두번째 오류 
                            quantity1:Number(user_stock[i])-Number(user_order[i])//split으로 잘라서 넣어야 
                        },{ 
                            where : { id:splitResult[i] } //optionid 각각 1,2의 수량을  통과
                        }).then(
                            await db.shop_orders.update({//주문 테이블에 기존재고 리셋 
                                stock:0
                            },{ 
                                where : { od_id : merchant_uid } 
                            }),
                            await db.ProductOption.findAll({ //결제한 제품의 ProductOption 전부 조회
                                raw: true,
                                where: {
                                    id: user_opt_id[i], //productopt의 ID
                                }
                            }).then((result)=>{
                                console.log("result!!!",result)
                                console.log("result!!!",result.quantity1)
                                const quantity1_result = result.map((item)=>item.quantity1)//ProductOption 재고
                                console.log("quantity1_result",quantity1_result) // [0]
                                const quantity1_result2 = [quantity1_result]

                                if(quantity1_result2 <= 0){
                                    db.ProductOption.update({
                                        soldout:0
                                    },{ 
                                        where : { 
                                            // name : name 
                                            id : user_opt_id[i]//productopt의 ID
                                        } 
                                    })
                                }
                            }),
                            await db.shop_cart.destroy({
                                where: {
                                    mb_id:order.mb_id,
                                    it_id:user_it_id[i],
                                    it_option_id:user_opt_id[i]
                                }
                            }),
                            await db.Product.update({
                                sellCount:sellCountValue_Real+1
                            },{ 
                                where : { 
                                    id : user_it_id[i] 
                                } 
                            }),
                            await db.ProductOption.findAll({ //결제한 제품의 ProductOption 전부 조회
                                raw: true,
                                where: {
                                    product_id: user_it_id[i], //productopt의 ID
                                }
                            }).then((result)=>{
                                console.log("result!!!",result)
                                // console.log("result!!!",result.quantity1)
                                const soldout_result = result.map((item)=>item.soldout)//ProductOption 재고
                                console.log("soldout_result",soldout_result);
                                const sum1 = soldout_result.reduce((accumulator, currentNumber) => accumulator + currentNumber,0);
                                console.log("sum1",sum1)

                                let company = '라즈베리베리'
                                let tpl_code="TI_0937"
                                let msg=`[${company}]
구매가 성공적으로 완료되었습니다!
□ 상품명: ${name}
□ 주문번호 : ${merchant_uid}
□ 배송지 : ${buyer_addr}
□ 결제금액 : ${amount}원

? have a good berry berry!! ?`;
                                let subject="구매완료"
                                alimtalk(paymentData.name, od_tel, msg, subject, tpl_code)
                                if(sum1 == 0){
                                    db.Product.update({
                                        soldout:1
                                    },{ 
                                        where : { 
                                            id : user_it_id[i] 
                                        } 
                                    })
                                }
                            })
                        )
                    }            
              res.send({ status: "success", message: "일반 결제 성공" });
              break;
          }
        } else { // 결제금액 불일치. 위/변조 된 결제
          throw { status: "forgery", message: "위조된 결제시도" };
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
        // res.status(400).json({"resultCode":-1, "data": null})
    }
}

//결제완료후 OrderResult 컴포넌트에서 조회 
exports.displayOrderDetail = async(req,res) => {
    try {
        const { od_id } = req.body;
        
        await db.shop_orders.findOne({
            where: {od_id},
            order : [["createdAt","DESC"]],//불러오는 순서
        }).then((result)=>{
            res.send({
                result
            })
        })
        
    } catch (error) {
        console.log(error);
    }
};

function alimtalk(mb_name, mb_hp, msg, subject, tpl_code){
    const apikey = 'ba8omf5kfpdon6e74rz4d130bai7z1xq';
    const userid = 'djdjdjk2006';
    const senderkey = 'cd0e3a2b9549589491efae77c9115b9407ff0992';

    console.log("functional alimtalk tpl_code :",tpl_code);
    let templtCode =  tpl_code;
   
    get_token_alimtalk(apikey,userid).then(function (result){
        // console.log(result);
        const token = result;
        // 템플릿이 여러개일 경우 'get_tpllist_alimtalk' 함수의 결과 처리 부분을 수정해야한다. (템플릿 선택 부분 제작 필요)
        get_tpllist_alimtalk(apikey,userid,token,senderkey,tpl_code).then(function (result2){
            console.log("get_tpllist_alimtalk : ",result2.list[0]);

            // const templtCode = result2.list[0]['templtCode'];
            send_alimtalk(apikey, userid, token, senderkey, mb_name, mb_hp, msg, subject, templtCode).then(function (result3){
                console.log("result3 :",result3);
            });
        });
    });
}

const get_token_alimtalk=(apikey,userid)=>{
    return new Promise(function (resolve, reject){
        $.ajax({
            type: "POST",
            url: "https://kakaoapi.aligo.in/akv10/token/create/30/s/",
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'json',
            data: {
                apikey:apikey,
                userid:userid,
            },
            cache: false,
            success: function (data) {
                //console.log(data);
                if(data.code==0){
                    resolve(data.token);
                    console.log("data.token (order.js) :",data.token);
                    // console.log("data.token1");
                }else{
                    console.log(data.message);
                }
            }
        })
    })
}
const get_tpllist_alimtalk=(apikey,userid,token,senderkey,tpl_code)=>{
    return new Promise(function (resolve, reject){
        $.ajax({
            type: "POST",
            url: "https://kakaoapi.aligo.in/akv10/template/list/",
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'json',
            data: {
                apikey:apikey,
                userid:userid,
                token:token,
                senderkey:senderkey,
                tpl_code:tpl_code
            },
            cache: false,
            success: function (data) {
                //console.log(data);
                if(data.code==0){
                    resolve(data);
                    // console.log("data :",data)
                }else{
                    console.log(data.message);
                }
            }
        })
    })
}
const send_alimtalk=(apikey,userid,token,senderkey,mb_name, mb_hp, msg, subject, tpl_code)=>{
    if( tpl_code == "TI_1516"){//배송 조회 버튼 (배송시작알림)
        return new Promise(function (resolve, reject){
            
            $.ajax({
                type: "POST",
                url: "https://kakaoapi.aligo.in/akv10/alimtalk/send/",
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'json',
                data: {
                    apikey:apikey,
                    userid:userid,
                    senderkey:senderkey,
                    token:token,
                    tpl_code:tpl_code,
                    receiver_1:mb_hp,
                    sender:'010-4109-6590',
                    recvname_1:mb_name,
                    subject_1:subject,
                    message_1:msg,
                    button_1: '{"button": [{"name": "배송조회", "linkType": "DS", "linkTypeName": "배송조회"}]}'
                    // {
                    //     "button": [{
                    //         "name": "배송조회",
                    //         "linkType": "DS",
                    //         "linkTypeName": "배송조회",
                    //     }]
                    // }

                    //testMode:'Y',
                },
                cache: false,
                success: function (data) {
                    //console.log(data);
                    if(data.code==0){
                        resolve(data);
                    }else{
                        console.log(data.message);
                    }
                }
            })
        })
        
    }else{
        return new Promise(function (resolve, reject){
            $.ajax({
                type: "POST",
                url: "https://kakaoapi.aligo.in/akv10/alimtalk/send/",
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'json',
                data: {
                    apikey:apikey,
                    userid:userid,
                    token:token,
                    senderkey:senderkey,
                    tpl_code:tpl_code,
                    sender:'010-4109-6590',
                    receiver_1:mb_hp,
                    recvname_1:mb_name,
                    subject_1:subject,
                    message_1:msg,
                    //testMode:'Y',
                },
                cache: false,
                success: function (data) {
                    //console.log(data);
                    if(data.code==0){
                        resolve(data);
                    }else{
                        console.log(data.message);
                    }
                }
            })
        })
        
    }
}
function Unix_timestamp(t){
    var date = new Date(t*1000);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth()+1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
}