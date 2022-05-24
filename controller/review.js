
const db = require('../models');
//qna register 

exports.reviewRegister = async(req,res) => {
    try {
        const { user_id,user_name,title,thumbnail_image,description,createDate,product_option_id,response_result } = req.body;
        
        const product11Pk = await db.Product.findByPk(product_option_id);
        // console.log("product11Pk :",product11Pk);
        //   create + as명 (models에서 association에서 적은내용)
        // await productOptionPk.createOption(req.body)
        // const { seSsionId } = req.body;

        //ex)
        // {as: 'Review', foreignKey: 'product_option_id', sourceKey: 'id' , onDelete: 'CASCADE'});
        await product11Pk.createReviewCreate({
            user_id,
            user_name,
            title,
            thumbnail_image,
            description,
            createDate,
            response_result
        })
        .then((result)=>{
            console.log(result);
            res.send({
                result
            });  
        });

        // db.review.create({
        //     user_id,
        //     user_name,
        //     title,
        //     thumbnail_image,
        //     description,
        //     createDate,
        //     product_option_id,
        //     response_result:'1'
        // }).then((result)=>{
        //     console.log(result);
        //     res.send({
        //         result
        //     });  
        // });

    } catch (error) {
        console.log(error);
    }
    
};
//qna All read (get방식)
exports.reviewAll = async(req,res) => {
    try {
        db.review.findAll({
            order : [["createdAt","DESC"]],//불러오는 순서
            attributes: ["createdAt","id","thumbnail_image","title","description","user_id","user_name","createDate","response_result"],
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