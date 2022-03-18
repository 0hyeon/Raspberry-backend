module.exports = function(sequelize, dataTypes){
    const Banner = sequelize.define('Banner',{
        imageUrl : {
            type : dataTypes.JSON,
            allowNull : false
        },
        href : {
            type : dataTypes.STRING(200),
            allowNull: false,
        },
        category : {
            type : dataTypes.STRING(200),
            allowNull: false,
        },
    },{
        tableName: 'Banner'
    }
    );
    return Banner;
}