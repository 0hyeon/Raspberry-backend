
module.exports = function(sequelize, DataTypes){
    const ProductOption = sequelize.define('ProductOption',
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER(20),
                allowNull: false,
            },
            seller: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            color1: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            colorName1: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            size1: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            quantity1: {
                type: DataTypes.INTEGER(20),
                allowNull: true,
            },
            colorType: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            soldout: {
                type: DataTypes.INTEGER(20),
                allowNull: true,
            }
        },{
            tableName: 'ProductOption'
        }
    );
    ProductOption.associate = (models) => {
        //메모 모델에 외부키를 건다
        //onDelete 옵션의 경우 하나가 삭제되면 외부키가 걸린다.
        //상품옵션
    
        //ProductOption의 외부키 product_id == products의 id
        ProductOption.hasMany(models.review, 
          {as: 'Review', foreignKey: 'product_option_id', sourceKey: 'id' , onDelete: 'CASCADE'});
        // qna의 product_id는  products의 id
     
          //as : 변수명과 맵핑
          //foreignKey : 해당db에 생길 필드명
          //sourceKey : 복사할필드명
          //onDelete : product의 한줄이 삭제시 option도 모두삭제
    
          // const productOptionPk = await db.Product.findByPk(id);
          //create + as명 (models에서 association에서 적은내용)
          // await productOptionPk.createOption(req.body)
      }

    return ProductOption;
}