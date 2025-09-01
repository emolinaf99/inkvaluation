import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserSuscription = sequelize.define('UserSuscription', {
    Suscription_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    User_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'User_Id'
      }
    },
    Plan_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'suscription_plans',
        key: 'Plan_Id'
      }
    },
    Start_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    End_Date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Automatic_Renovation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Status: {
      type: DataTypes.ENUM('active', 'expired', 'cancelled'),
      defaultValue: 'active'
    },
    Payment_Method: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Transaction_Id: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'user_suscriptions',
    timestamps: true,
    createdAt: 'Created_At',
    updatedAt: 'Updated_At'
  });

  UserSuscription.associate = function(models) {
    UserSuscription.belongsTo(models.User, {
      foreignKey: 'User_Id',
      as: 'User'
    });
    
    UserSuscription.belongsTo(models.SuscriptionPlan, {
      foreignKey: 'Plan_Id',
      as: 'SuscriptionPlan'
    });
  };

  return UserSuscription;
};