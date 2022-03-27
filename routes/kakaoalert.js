const express = require('express');
const router = express.Router();
const db = require('../models');

//컨트롤러
const kakaoalert = require('../controller/kakaoalert');
//테스트

//결제전 결제대기 & 유저정보 insert
router.post('/alimtalkSend', kakaoalert.alimtalkSend)

module.exports = router;