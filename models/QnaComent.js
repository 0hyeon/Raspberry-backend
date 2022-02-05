module.exports = function (sequelize, DataTypes) {
    const QnaComent = sequelize.define("QnaComent", {
        user_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        },
        user_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        },
        description: {
        type: DataTypes.STRING(999),
        allowNull: false,
        }
    },{
        tableName: 'QnaComent'
    });
    //제품 모델 관계도 
    
    return QnaComent;
};