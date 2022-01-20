
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


    return ProductOption;
}