const router = require('express').Router()

const test = require('./default')
const user_inform = require('./user_inform')
const product = require('./product')
const cart = require('./cart')
const order = require('./order')
const qna = require('./qna')

//테스트
router.use('/test', test)

//회원가입관련 
router.use('/user_inform', user_inform)

//상품관련
router.use('/product', product)

//장바구니관련
router.use('/cart', cart)

//결제관련 
router.use('/order', order)
//Qna
router.use('/qna', qna)


module.exports = router