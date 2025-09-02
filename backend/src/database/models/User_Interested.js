import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User_Interested = sequelize.define('User_Interested', {
    Id: {
      type: DataTypes.MEDIUMINT,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    Correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    Fecha_Inscripcion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_interested',
    timestamps: false
  });

  return User_Interested;
};