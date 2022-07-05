module.exports = function (sequelize, DataTypes) {
  const product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
    },
    marketPrice: {
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
    subDescription:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sizeDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sizeDetail: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    color1: {
      type : DataTypes.JSON,
      allowNull: true,
    },
    colorName1: {
      type : DataTypes.JSON,
      allowNull: true,
    },
    size1: {
      type : DataTypes.JSON,
      allowNull: true,
    },
    quantity1: {
      type : DataTypes.JSON,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    imageUrl2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    imageUrl3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    imageUrl4: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    imageUrl5: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    detailPage1: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    detailPage2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    detailPage3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    detailPage4: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    detailPage5: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    relateProduct1: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    relateProduct2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    relateProduct3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    relateProduct4: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    relateProduct5: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    productVideo: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    soldout : {
      type :DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    sellCount : {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    }
  });
  //제품 모델 관계도 
  product.associate = (models) => {
    //메모 모델에 외부키를 건다
    //onDelete 옵션의 경우 하나가 삭제되면 외부키가 걸린다.

    //상품옵션

    //ProductOption의 외부키 product_id == products의 id
    product.hasMany(models.ProductOption, 
      {as: 'Option', foreignKey: 'product_id', sourceKey: 'id' , onDelete: 'CASCADE'});
    // qna의 product_id는  products의 id
    product.hasMany(models.Qna, 
      {as: 'Qna', foreignKey: 'product_id', sourceKey: 'id' , onDelete: 'CASCADE'});
    // qna댓글 product_id는 products의 id
    product.hasMany(models.QnaComent, 
      {as: 'QnaComent', foreignKey: 'product_id', sourceKey: 'id' , onDelete: 'CASCADE'});

    product.hasMany(models.review, 
      {as: 'ReviewCreate', foreignKey: 'product_option_id', sourceKey: 'id' , onDelete: 'CASCADE'});
      //as : 변수명과 맵핑
      //foreignKey : 해당db에 생길 필드명
      //sourceKey : 복사할필드명
      //onDelete : product의 한줄이 삭제시 option도 모두삭제

      // const productOptionPk = await db.Product.findByPk(id);
      //create + as명 (models에서 association에서 적은내용)
      // await productOptionPk.createOption(req.body)
  }

  return product;
};