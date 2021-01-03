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
