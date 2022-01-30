const express = require('express');
const router = express.Router();
const db = require('../models');
//컨트롤러
const product = require('../controller/product');

//테스트
router.get('/' , (req,res) => { res.send('test product'); })

//상품조회(전체)
router.get('/products', product.products)

//상품조회(1개)
router.get('/products/:id', product.productsId)

//상품등록
router.post("/products_post", product.products_post)

//상품 업데이트
router.post("/Updateproducts/:id", product.Updateproducts)

//관리자페이지에서 상품 삭제
router.post("/AdmdeleteToItem", product.AdmdeleteToItem)

//상품옵션api
router.post("/productsOptions", product.productsOptions)

//상품Qna
router.post("/productQna", product.productQna)




module.exports = router;