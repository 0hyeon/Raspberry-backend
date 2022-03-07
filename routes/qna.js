const express = require('express');
const router = express.Router();
const db = require('../models');

//컨트롤러
const qna = require('../controller/qna');
//테스트
router.get('/' , (req,res) => { res.send('test order'); })

//qna등록 
router.post('/qnaregister', qna.qnaregister)

//작성제목,날짜,작성자 
router.get('/qnaAll', qna.qnaAll)

//비밀번호 입력후 all open
router.post('/qnaAnswer', qna.qnaAnswer)

//관리자 qnalist 비밀번호 x 입력후 opne
router.post('/qnaAnswerAdmin', qna.qnaAnswerAdmin)

//댓글작성
router.post('/qnaComment/:id', qna.qnaComment)

//댓글불러오기(조건)
router.post('/qnaAllComent', qna.qnaAllComent)

//댓글불러오기(모든)
router.get('/qnaAllComentGET', qna.qnaAllComentGET)
//댓글삭제(조건)
router.post('/qnaComentDelete', qna.qnaComentDelete)

//qna글 수정
router.post('/qnaUpdate', qna.qnaUpdate)
//qna삭제 
router.post('/qnaDelete', qna.qnaDelete)

//답변해야할 댓글갯수 조회(adminpage)
// router.get('/commentsLength', qna.commentsLength)


module.exports = router;