'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    email:DataTypes.STRING,
    profileImage:DataTypes.STRING,
    password:DataTypes.STRING
  });
  return User;
};
