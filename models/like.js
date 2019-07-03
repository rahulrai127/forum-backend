'use strict';
module.exports = (sequelize, DataTypes) => {
  var Like = sequelize.define('Like' , {
    UserId: DataTypes.INTEGER,
    TopicId:DataTypes.INTEGER,
  });

  Like.associate = function (models) {
    models.Like.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  Like.associate = function (models) {
    models.Like.belongsTo(models.Topic, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Like
};
