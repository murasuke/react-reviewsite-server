/**
 * REST用エンドポイント定義(express)
 * ・オリジン間リソース共有 (Cross-Origin Resource Sharing) を利用
 * ・認証用にjwt(Json Web Token)を利用
 *  ■ 課題・・・express-routerを使ってエンドポイント定義を別クラスに移動する
 */
import express from "express";
import cors from "cors";
//import * as data from "./sample-data.js";
import sequelize from "sequelize";
//import { Restaurant, Review, User } from "./model.js"
import * as dbmdl from "./models/index.cjs";
import { checkJwt, getUser } from "./auth0.js"

const db = dbmdl.default;

// express 初期化
const app = express();
app.use(cors());
app.use(express.json());


// /restaurantsエンドポイント
// ・レストランの一覧と全件数(ページング用)を返す
// ・querystringで取得する件数(limit)と先頭から？件目(offset)を指定できる(ページング用)
// ・レストランは、レビュー数の降順に返す
//
app.get("/restaurants", async(req, res) =>{
    const limit = +req.query.limit || 5;
    const offset = +req.query.offset || 0;
    // const restaurants = data.restaurants;
    // res.json({
    //     rows: restaurants.slice(offset, offset + limit),
    //     count: data.restaurants.length,
    // });
  
    const restaurants = await db.Restaurant.findAndCountAll({
        attributes: {
            include: [
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM Reviews AS r WHERE r.restaurantId = Restaurant.id)`,
                    ),
                    "review_count",
                ],
            ],
        },
        include: { model: db.Review, limit: 3, include: { model: db.User } },
        order: [[sequelize.literal("review_count"), "DESC"]],
        limit,
        offset,
    });
    res.json(restaurants);
});

// パラメータで指定されたidのレストランを返す
// ・存在しない場合は、status code 404を返す
app.get("/restaurants/:restaurantId", async(req, res) =>{
    const restaurantId = +req.params.restaurantId;
    // const restaurant = data.restaurants.find(
    //     restaurant => restaurant.id === restaurantId
    // );
    const restaurant = await  db.Restaurant.findByPk(restaurantId);

    if(!restaurant){
        res.status(404).send("not found");
        return;
    }
    res.json(restaurant);
});

// 指定されたレストランのレビュー一覧を返す
// ・レビューと一緒に、Userも返す(リレーションで紐づけ(Review.belongsTo(User))されている)
app.get("/restaurants/:restaurantId/reviews", async (req, res) => {
    const restaurantId = +req.params.restaurantId;
    const limit = +req.query.limit || 5;
    const offset = +req.query.offset || 0;
    // const restaurant = data.restaurants.find( r => r.id === restaurantId);
    const restaurant = await db.Restaurant.findByPk(restaurantId);

    if(!restaurant){
        res.status(404).send("not found");
        return;
    }

    // const reviews = data.reviews.filter( review => review.restaurantId === restaurantId );
    // res.json({
    //     count: reviews.length,
    //     rows: reviews.slice(offset, offset + limit),
    // });
    
    const reviews = await db.Review.findAndCountAll({
        include: {model: db.User},
        // where: {restaurantId },
        where: { restaurantId },
        limit,
        offset,
    });
    res.json( reviews );
});

// [POSTメソッド] レビューを投稿する
// ・先に認証チェック？ユーザが存在しない場合はUserテーブルに登録する
// ・
app.post("/restaurants/:restaurantId/reviews", checkJwt, async  (req, rest) => {
    const auth0User = await getUser(req.get("Authorization"));
    const [user, created] = await user.findOrCreate({
        where: { sub: auth0User.sub },
        defaults: {
            nickname: auth0User.nickname,
        }
    });

    if(!created){
        user.nickname = auth0User.nickname;
        await user.save();
    }

    const restaurantId = +req.params.restaurantId;
    const restaurant = await db.Restaurant.findByPk(restaurantId);
    if( !restaurant ){
        res.status(404).send("not found");
        return;
    }

    // 画面からpostされたタイトルとコメントでレビューを登録する
    const record = {
        title: req.body.title,
        comment: req.body.comment,
        userId: user.id,
        restaurantId,
      };
    
      if (!record.title || !record.comment) {
        res.status(400).send("bad request");
        return;
      }
    
      const review = await db.Review.create(record);
      res.json(review);
});

// ポート5000番で待ち受け
const port = process.env.PORT || 5000;
app.listen(port , () =>{
    console.log(`Listening at http://localhost:${port}`);
});

