/**
 * テーブル定義(sequelize)
 */
import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

let db;
if (process.env.DATABASE_URL){
    // 環境変数でDATABASE_URLが与えられた場合は、URLで初期化する(PostgresやMySQL用)
    db = new Sequelize(url);
}else{
    // 環境変数でURLが与えられない場合(ローカル環境)は、sqliteで実行する
    // ・プロセス内でデータベースを自動実行する
    db = new Sequelize({
        dialect: 'sqlite',
        storage: 'db/review_app.sqlite'
    });
}

export const sequelize = db;

// ユーザテーブル定義
// ・定義する項目は順に、テーブル名, 列定義, その他オプション
export const User = sequelize.define(
    "user",
    {
        sub:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        nickname:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { underscorred: true}
);

// レストランテーブル定義
export const Restaurant = sequelize.define(
    "restaurant",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
        map:{
            type: DataTypes.STRING,
        },
    },
    { underscored: true },
);


// レビューテーブル定義
export const Review = sequelize.define(
    "review",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: User,
            },
        },
        restaurantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Restaurant,
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { underscored: true },
);

// リレーションを定義する
Restaurant.hasMany(Review);
Review.belongsTo(Restaurant);
User.hasMany(Review);
Review.belongsTo(User);


