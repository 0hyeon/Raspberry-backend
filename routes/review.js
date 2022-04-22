const express = require('express');
const router = express.Router();
const db = require('../models');

//컨트롤러
const review = require('../controller/review');
//테스트
router.get('/' , (req,res) => { res.send('test review'); })



//review등록 
router.post('/reviewRegister', review.reviewRegister)

//review조회
router.get('/reviewAll', review.reviewAll)

// //비밀번호 입력후 all open
// router.post('/reviewAnswer', review.reviewAnswer)

// //관리자 reviewlist 비밀번호 x 입력후 opne
// router.post('/reviewAnswerAdmin', review.reviewAnswerAdmin)

// //댓글작성
// router.post('/reviewComment/:id', review.reviewComment)

// //댓글불러오기(조건)
// router.post('/reviewAllComent', review.reviewAllComent)

// //댓글불러오기(모든)
// router.get('/reviewAllComentGET', review.reviewAllComentGET)
// //댓글삭제(조건)
// router.post('/reviewComentDelete', review.reviewComentDelete)

// //review글 수정
// router.post('/reviewUpdate', review.reviewUpdate)
// //review삭제 
// router.post('/reviewDelete', review.reviewDelete)

//답변해야할 댓글갯수 조회(adminpage)
// router.get('/commentsLength', review.commentsLength)


module.exports = router;