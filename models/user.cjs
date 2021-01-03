'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // リレーションを定義する
      // User.hasMany(Review);
      User.hasMany(models.Review,{
        foreignKey: 'userId',
        // as: 'Reviews',
      });
    }
  };
  User.init({
    sub: DataTypes.STRING,
    nickname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    // underscored: true,
  });
  return User;
};