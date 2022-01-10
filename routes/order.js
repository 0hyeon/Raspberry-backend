const express = require('express');
const router = express.Router();
const db = require('../models');

//컨트롤러
const order = require('../controller/order');
//테스트
router.get('/' , (req,res) => { res.send('test order'); })

//결제전 결제대기 & 유저정보 insert
router.post('/payment', order.payment)

//결제후 결제완료 db처리
router.post('/paymentUpdate', order.paymentUpdate)

//결제후 비회원 주문조회 
router.post('/orderCheck', order.orderCheck)

module.exports = router;