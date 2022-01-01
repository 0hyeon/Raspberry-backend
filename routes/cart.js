const express = require('express');
const router = express.Router();
const db = require('../models');

//컨트롤러
const cart = require('../controller/cart');

//테스트
router.get('/' , (req,res) => { res.send('test cart'); })

//장바구니 저장
router.post('/decideToCart', cart.decideToCart)

//post장바구니 가능한지 조회
router.post('/addToCart', cart.addToCart)

//set 카트아이템 cart number couting => components RightMenu.js
router.post('/setCartItem', cart.setCartItem)

//장바구니 삭제
router.post('/deleteToCart', cart.deleteToCart)

module.exports = router;