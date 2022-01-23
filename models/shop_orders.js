module.exports = function (sequelize, DataTypes) {
    const shop_orders = sequelize.define("shop_orders", {
        od_id: {//거래번호
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        mb_id: {//사용자 id
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        product_it_id:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        product_option_id:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        name:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        size:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        color:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        ordernum:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        stock:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_name: {//배송받을 이름
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_email: {//이메일
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_tel: {//핸드폰번호
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_zip: {//우편번호 5자리
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_addr1: {//주소
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_addr2: {//상세주소
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_memo: {//상세주소
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_cart_price: {//주문금액
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_send_cost:{//배송비
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_bank_account:{//가상계좌번호
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_receipt_time:{//승인시간
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_status:{//거래상태 (결제대기 , 결제완료, 배송준비, 배송중, 배송완료 )
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_hope_data:{//무통장 희망입금일 
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_settle_case:{//결제수단
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        od_tno:{//거래번호
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        vbank_num:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        vbank_date:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        vbank_name:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
        pg_tid:{
            type: DataTypes.STRING(510),
            allowNull: true,
        },
    });
    return shop_orders;
};