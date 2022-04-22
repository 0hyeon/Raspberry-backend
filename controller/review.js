
const db = require('../models');
//qna register 

// reviewRegister
// reviewAll
exports.reviewRegister = async(req,res) => {
    try {
        const { user_id,user_name,title,thumbnail_image,description,createDate,product_option_id } = req.body;
        
        
        const productOptionPk = await db.Product.findByPk(id);
        //   create + as명 (models에서 association에서 적은내용)
        await productOptionPk.createOption(req.body)
        // const { seSsionId } = req.body;

        //ex)
        // {as: 'Review', foreignKey: 'product_option_id', sourceKey: 'id' , onDelete: 'CASCADE'});
        await productOptionPk.createOption({
            name,description,sizeDesc,price,seller,
                color1,colorName1,
                size1,quantity1,colorType:"1",soldout
        })

        db.review.create({
            user_id,
            user_name,
            title,
            thumbnail_image,
            description,
            createDate,
            response_result:'1'
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
exports.reviewAll = async(req,res) => {
    try {
        db.review.findAll({
            order : [["createdAt","DESC"]],//불러오는 순서
            attributes: ["createdAt","id","thumbnail_image","title","user_id","user_name","createDate","response_result"],
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
