module.exports = function (sequelize, DataTypes) {
  const review = sequelize.define("review", {
      user_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      },
      user_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      },
      title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      },
      thumbnail_image: {
      type: DataTypes.STRING(100),
      allowNull: true,
      },
      description: {
      type: DataTypes.STRING(999),
      allowNull: false,
      },
      createDate: {
      type: DataTypes.STRING(999),
      allowNull: false,
      },
      response_result: {
      type: DataTypes.STRING(10),
      allowNull: false,
      }
  },{
      tableName: 'review'
  });
  //제품 모델 관계도 
      //메모 모델에 외부키를 건다
      //onDelete 옵션의 경우 하나가 삭제되면 외부키가 걸린다.
      
      //as : 변수명과 맵핑
      //foreignKey : 해당db에 생길 필드명
      //sourceKey : 복사할필드명
      //onDelete : product의 한줄이 삭제시 option도 모두삭제
  return review;
};