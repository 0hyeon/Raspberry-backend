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
    size1_2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    quantity1_2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    size1_3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    quantity1_3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    color2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    colorName2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    size2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    quantity2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    size2_2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    quantity2_2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    size2_3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    quantity2_3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    color3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    colorName3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    size3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    quantity3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    size3_2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    quantity3_2: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    size3_3: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    quantity3_3: {
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
  return product;
};