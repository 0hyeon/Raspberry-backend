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
//결제후 회원 주문조회 
router.post('/getOrderResult', order.getOrderResult)

//주문내역 삭제 
router.post('/deleteToCart2', order.deleteToCart2)

//주문된 주소 재등록 (업데이트)
router.post('/ModifyAddress', order.ModifyAddress)

//결제대기 갯수 (adminpage)
router.get('/setOrderWait', order.setOrderWait)

//결제완료 갯수 (adminpage)
router.get('/setOrderSuccess', order.setOrderSuccess)

//송장등록 (adminpage)
router.post('/ModifySongJang', order.ModifySongJang)

module.exports = router;