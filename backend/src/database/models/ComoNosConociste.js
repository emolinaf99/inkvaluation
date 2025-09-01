import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ComoNosConociste = sequelize.define('ComoNosConociste', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    Status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'como_nos_conociste_options',
    timestamps: true,
    createdAt: 'Created_At',
    updatedAt: false // No tiene columna Updated_At según el SQL
  });

  ComoNosConociste.associate = function(models) {
    ComoNosConociste.hasMany(models.User, {
      foreignKey: 'Como_Nos_Conociste_Id',
      as: 'Users'
    });
  };

  return ComoNosConociste;
};