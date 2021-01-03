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
