'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
    UserId: DataTypes.INTEGER,
    TopicId:DataTypes.INTEGER,
    content:DataTypes.STRING
  });

  Comment.associate = function (models) {
    models.Comment.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  Comment.associate = function (models) {
    models.Comment.belongsTo(models.Topic, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Comment;
};
