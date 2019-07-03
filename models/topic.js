'use strict';
module.exports = (sequelize, DataTypes) => {
  var Topic = sequelize.define('Topic', {
    UserId: DataTypes.INTEGER,
    title:DataTypes.STRING,
    category:DataTypes.STRING,
    lastReply:DataTypes.STRING,
    replyCount:DataTypes.INTEGER,
    viewCount:DataTypes.INTEGER,
    userCount:DataTypes.INTEGER,
    likeCount:DataTypes.INTEGER,
    content:DataTypes.STRING,
  });

  Topic.associate = function (models) {
    models.Topic.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Topic;
};
