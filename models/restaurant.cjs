'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // リレーションを定義する
      // Restaurant.hasMany(Review);
      Restaurant.hasMany(models.Review,{
        foreignKey: 'restaurantId',
        //as: 'Reviews',
      });
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    map: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Restaurant',
    // underscored: true,
  });
  return Restaurant;
};