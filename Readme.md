# このサンプルアプリについて

https://zenn.dev/likr/articles/react-with-heroku

をベースして、勉強用に機能強化をしています。
* DBをsqliteに変更(別環境で簡単に利用できるようにする目的)
* 未認証の場合、自動的に認証ページへリダイレクトするリンク(profile)を追加
* sequelizeのマイグレーション機能を利用したDB、データ作成(commonjs)　・・・ 完了
* swaggerでのAPI定義
* mockを利用したユニットテスト



## マイグレーション
* model作成
```bash
yarn sequelize-cli init
yarn sequelize model:generate --name Restaurant --attributes name:string,image:string,map:string
yarn sequelize model:generate --name Review --attributes restaurantId:integer,userId:integer,title:string,comment:string
yarn sequelize model:generate --name User --attributes sub:string,nickname:string
```

* ファイルの拡張子を「.js」⇒「.cjs」に変更する

package.jsonに「type: module」を追加すると、jsファイルはesmoduleと認識される。
sequelizeのmodelはcommonjs形式で生成しているので拡張子を変更する必要がある。

* 生成されたcreate-reviewを修正し関連の設定を追加する
    * 関連のmodelは複数形にする必要がある

``javascript
restaurantId: {
    type: Sequelize.INTEGER,
    references:{
        model:"restaurants",
        key: "id"
    }
},
userId: {
    type: Sequelize.INTEGER,
    references:{
        model:"users",
        key: "id"
    }
},
```

* マイグレーション実行

```bash
yarn sequelize db:migrate
```

* マイグレーションを全て戻す
```bash
yarn sequelize db:migrate:undo:all
```


## シード作成
* シード用のファイルを生成

```bash
yarn sequelize seed:generate --name test-restaurants
yarn sequelize seed:generate --name test-users
yarn sequelize seed:generate --name test-reviews
```

* ファイルを修正(jsファイルを元にデータ登録を行う)

test-restaurants.js
```javascript
'use strict';

const data = require("../sample-data.cjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const seeds = [];    

    for( const{ name, image, map } of data.restaurants ){
      seeds.push({ name, image, map, createdAt: now, updatedAt: now });
    }
    return await queryInterface.bulkInsert("restaurants",seeds, {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("restaurants", null, {} );
  }
};

```

test-users.js
```javascript
'use strict';
const data = require("../sample-data.cjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const seeds = [];    

    for( const{ sub, nickname } of data.users ){
      seeds.push({ sub, nickname, createdAt: now, updatedAt: now });
    }
    return await queryInterface.bulkInsert("users",seeds, {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("users", null, {} );
  }
};
```

test-reviews.js
```javascript
'use strict';
const data = require("../sample-data.cjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const seeds = [];    

    for( const{ title, comment, userId, restaurantId } of data.reviews ){
      seeds.push({ restaurantId, userId, title, comment,createdAt: now, updatedAt: now });
    }
    return await queryInterface.bulkInsert("reviews",seeds, {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("reviews", null, {} );
  }
};
```


* ファイルの拡張子を「.js」⇒「.cjs」に変更する

package.jsonに「type: module」を追加すると、jsファイルはesmoduleと認識される。
sequelizeのmodelはcommonjs形式で生成しているので拡張子を変更する必要がある。

* データ登録
```bash
yarn sequelize db:seed:all
```

データ削除
```bash
yarn sequelize db:seed:undo:all
```



