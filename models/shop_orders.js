module.exports = function (sequelize, DataTypes) {
    const shop_cart = sequelize.define("shop_orders", {
        ct_id: {
            type: DataTypes.STRING(510),
            allowNull: true,
        }
    });
    return shop_cart;
};