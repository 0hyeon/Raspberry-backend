const db = require('../models');
//qna register 
exports.qnaregister = async(req,res) => {
    try {
        const { user_id,user_name,qna_password,title, description,createDate,product_id } = req.body;
        
        // const { seSsionId } = req.body;

        db.Qna.create({
            user_id,
            user_name,
            qna_password,
            title,
            description,
            createDate,
            product_id
        }).then((result)=>{
            console.log(result);
            res.send({
                result
            });  
        });

    } catch (error) {
        // console.log(error);
    }
    
};
//qna All read (get방식)
exports.qnaAll = async(req,res) => {
    try {
        db.Qna.findAll({
            order : [["createdAt","DESC"]],//불러오는 순서
            attributes: ["createdAt","id","product_id","title","user_id","user_name","createDate"],
        }).then((result)=>{
            console.log(result);
            res.send({
                result
            });  
        });

    } catch (error) {
        // console.log(error);
    }
    
};
exports.qnaAnswer = async (req,res) => {
    try {
        const { id,qna_password } = req.body;
        const qnaAnswerData = await db.Qna.findOne({where: { id,qna_password }});
        
        if(!qnaAnswerData){
            res.json({
                'Success': false,
                'msg': '비밀번호가 틀렸습니다.'
            })
        }else{
            res.json({
                'Success': true,
                'msg': '접속 성공',
                'data':qnaAnswerData
            })
        }

    } catch (error) {
        console.log(error);
    }
    
};

//댓글작성
exports.qnaComment = async (req,res) => {
    try {
        const params = req.params;
        const { id } = params;

        const { user_id,user_name, description } = req.body;
        //{as: 'Coment', foreignKey: 'Qna_id', sourceKey: 'id' , onDelete: 'CASCADE'});
        const QnaPk = await db.Qna.findByPk(id);
        await QnaPk.createComent({
            user_id,
            user_name, 
            description
        }).then((result)=>{
            console.log(result);
            res.send({
                result
            });  
        });

    } catch (error) {
        console.log(error);
    }
    
};

// 댓글조회(조건)
exports.qnaAllComent = async (req,res) => {
    try {
        const { id } = req.body;
        await db.QnaComent.findAll({
            where: {Qna_id: id},
            // order : [["DESC"]],//불러오는 순서
            order : [["createdAt","DESC"]],//불러오는 순서
        }).then((result)=>{
            console.log(result);
            res.send({
                result
            });  
        });
    } catch (error) {
        console.log(error);
    }
};
//모든댓글조회
exports.qnaAllComentGET = async (req,res) => {
    try {
        const { id } = req.body;
        await db.QnaComent.findAll({
            order : [["createdAt","DESC"]],//불러오는 순서
        }).then((result)=>{
            console.log(result);
            res.send({
                result
            });  
        });
    } catch (error) {
        console.log(error);
    }
};
//댓글수정 
exports.qnaUpdate = async (req,res) => {
    try {
        
        const { id, title, description  } = req.body;
        db.Qna.update({
            title, 
            description
        },{ 
            where : { id:id } 
        }).then((result)=>{
        // console.log("상품 생성결과 :",result);
            res.send({
                result,
            })
        })
        
    } catch (error) {
        console.log(error);
    }
};
// qna삭제
exports.qnaDelete = async (req,res) => {
    try {
        
        const { id } = req.body;
        db.Qna.destroy({
            where: { 
                id 
            }
        }).then((result)=>{
        // console.log("상품 생성결과 :",result);
            res.send({
                result,
            })
        })
        
    } catch (error) {
        console.log(error);
    }
};
// qna댓글삭제
exports.qnaComentDelete = async (req,res) => {
    try {
        
        const { id } = req.body;
        db.QnaComent.destroy({
            where: { 
                id 
            }
        }).then((result)=>{
        // console.log("상품 생성결과 :",result);
            res.send({
                result,
            })
        })
        
    } catch (error) {
        console.log(error);
    }
};