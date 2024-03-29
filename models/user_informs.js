module.exports = function (sequelize, DataTypes) {
    const user_informs = sequelize.define("user_informs", {
      user_id: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      user_pw: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      user_name: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      user_email: {
        type: DataTypes.STRING(510),
        allowNull: true,
      },
      user_address : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      user_address_detail : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      user_address_postzone : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      user_phonenumber : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      user_token : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      role : {
        type :DataTypes.STRING(510),
        allowNull: true,
      },
      join_date : {
        type :DataTypes.STRING(510),
        allowNull: true,
      }
    });
    return user_informs;
  };