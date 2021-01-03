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
