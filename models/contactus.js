const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contactus', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    phone_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'contactus',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "message",
        using: "BTREE",
        fields: [
          { name: "message" },
        ]
      },
    ]
  });
};
