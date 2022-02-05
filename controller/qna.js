const db = require('../models');
//qna register 
exports.qnaregister = async(req,res) => {
    try {
        const { user_id,user_name,qna_password,title, description } = req.body;
        
        // const { seSsionId } = req.body;

        db.Qna.create({
            user_id,
            user_name,
            qna_password,
            title,
            description
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
            attributes: ["createdAt","id","product_id","title","user_id","user_name"],
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

// 댓글조회
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
// 댓글삭제