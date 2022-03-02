exports.setwebhook = async(req,res) => {
    
    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
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
            // url: `https://api.iamport.kr/payments/${od_tno}`,
            url: `https://api.iamport.kr/payments/${imp_uid}`,
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        // DB에서 결제되어야 하는 금액 조회
        const order = await db.shop_orders.findById({where: {od_id:paymentData.merchant_uid} });//db에 있는 
        const amountToBePaid = order.amount; // 결제 되어야 하는 금액
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if (amount === amountToBePaid) { // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
          switch (status) {
            case "ready": // 가상계좌 발급
              // DB에 가상계좌 발급 정보 저장
                const { vbank_num, vbank_date, vbank_name } = paymentData;
                await db.shop_orders.update({//유저 가상계좌정보 업데이트
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
    } catch (error) {
        console.log(error);
        res.status(400).send("에러발생");
        // res.status(400).json({"resultCode":-1, "data": null})
    }
}

exports.setMobile = async(req,res) => {
    try {
        const { imp_uid, merchant_uid } = req.query; // req의 query에서 imp_uid, merchant_uid 추출
        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
          url: "https://api.iamport.kr/users/getToken",
          method: "post", // POST method
          headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
          data: {
            imp_key: "5955693315212708", // REST API 키
            imp_secret: "CP5LAPTaNtIqr3MDA1PRMQF6ZQqhnRxZHCLhsEsf8aGzetcOu2GgSlmRcM8zEGzljkDLZ517gIGubTjF" // REST API Secret
          }
        });
        const { access_token } = getToken.data.response; // 인증 토큰
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
          url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
          method: "get", // GET method
          headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        
        // DB에서 결제되어야 하는 금액 조회
        const order = await db.shop_orders.findById({where: {od_id:paymentData.merchant_uid} });//db에 있는 
        const amountToBePaid = Number(order.od_cart_price); // (아임포트서버쪽)결제 되어야 하는 금액
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if (amount === amountToBePaid) { // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
          await Orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
          switch (status) {
            case "ready": // 가상계좌 발급
              // DB에 가상계좌 발급 정보 저장
              const { vbank_num, vbank_date, vbank_name } = paymentData;
              await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
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
      } catch (e) {
        res.status(400).send(e);
      }
}
