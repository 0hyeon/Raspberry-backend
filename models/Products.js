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
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(999),
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
      type: DataTypes.STRING(300),
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
    detailPage: {
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
    productVideo: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    soldout : {
      type :DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    }
  });
  //제품 모델 관계도 
  product.associate = (models) => {
    //메모 모델에 외부키를 건다
    //onDelete 옵션의 경우 하나가 삭제되면 외부키가 걸린다.

    product.hasMany(models.ProductOption, 
      {as: 'Option', foreignKey: 'product_id', sourceKey: 'id' , onDelete: 'CASCADE'});
      //as : 변수명과 맵핑
      //foreignKey : 해당db에 생길 필드명
      //sourceKey : 복사할필드명
      //onDelete : product의 한줄이 삭제시 option도 모두삭제
  }

  return product;
};