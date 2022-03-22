const express = require('express');
const router = express.Router();
const db = require('../models');

//컨트롤러
const banner = require('../controller/banner');
//테스트
router.get('/' , (req,res) => { res.send('test order'); })

//배너사진 upload 폴더에 저장
router.post('/setBanner', banner.setBanner)

//배너사진 db에 저장
router.post('/inSertBanner', banner.inSertBanner)

//배너 fetch 조회 
router.get('/fetchBanner', banner.fetchBanner)
//배너 삭제 
router.post('/DeleteBanner', banner.DeleteBanner)

module.exports = router;