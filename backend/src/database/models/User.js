import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    User_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    Apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255]
      }
    },
    Telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    Pais_Residencia: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: [0, 10]
      }
    },
    Fecha_Nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Como_Nos_Conociste_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'como_nos_conociste_options',
        key: 'Id'
      }
    },
    Profile_Picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    Email_Verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Email_Verification_Token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Password_Reset_Token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Password_Reset_Expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Last_Login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    Refresh_Token: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = function(models) {
    User.belongsTo(models.ComoNosConociste, {
      foreignKey: 'Como_Nos_Conociste_Id',
      as: 'ComoNosConociste'
    });
  };

  return User;
};