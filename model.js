import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

let db;
if (process.env.DATABASE_URL){
    db = new Sequelize(url);
}else{
    db = new Sequelize({
        dialect: 'sqlite',
        storage: 'db/review_app.sqlite'
    });
}

export const sequelize = db;

// テーブル名, 列定義, その他オプション
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

Restaurant.hasMany(Review);
Review.belongsTo(Restaurant);
User.hasMany(Review);
Review.belongsTo(User);


