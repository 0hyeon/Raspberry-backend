module.exports = function (sequelize, DataTypes) {
    const shop_cart = sequelize.define("shop_cart", {
      ct_id: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      od_id: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      mb_id: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      it_id: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      it_name: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      it_Detail_color: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      it_Detail_size: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      it_Detail_quanity: {
        type: DataTypes.INTEGER(50),
        allowNull: true,
      },
      it_sc_price : {
        type :DataTypes.INTEGER(50),
        allowNull: true,
      },
      it_sc_qty : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      ct_price : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      ct_time : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      ct_ip : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      ct_direct : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      ct_select_time : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      thumb_name : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      result : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      delivery_cost : {
        type :DataTypes.STRING(510),
        allowNull: true,
      }
    });
    return shop_cart;
  };