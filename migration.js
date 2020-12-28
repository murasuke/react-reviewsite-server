/**
 * データベースマイグレーション
 * ・DBスキーマ作成と、サンプルデータ登録
 * ・[$ node migration.js] で先に実行しておく
 */
import { sequelize, Restaurant, Review, User} from "./model.js";
import * as data from "./sample-data.js"

// 定義したmodelとDBを同期する
await sequelize.sync({ force: true });

// 作成したテーブルにデータを登録する(jsonの配列分登録)
for( const{name, image, map } of data.restaurants ){
    await Restaurant.create({ name, image, map });
}

for( const{ sub, nickname } of data.users ){
    await User.create({ sub, nickname });
}

for ( const {title, comment, userId, restaurantId } of data.reviews ){
    await Review.create({ title, comment, userId, restaurantId });
}