'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

   return queryInterface.createTable('Topics', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    UserId: {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
    },
    title: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    category: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    },
    lastReply: {
      type: Sequelize.STRING
    },
    replyCount: {
      type: Sequelize.INTEGER
    },
    viewCount: {
      type: Sequelize.INTEGER
    },
    likeCount: {
      type: Sequelize.INTEGER
    },
    userCount: {
      type: Sequelize.INTEGER
    },

  });

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.dropTable('Topics');
  }
};
