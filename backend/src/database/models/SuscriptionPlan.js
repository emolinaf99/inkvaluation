import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SuscriptionPlan = sequelize.define('SuscriptionPlan', {
    Plan_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Plan_Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Monthly_Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    Annual_Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    Max_Users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    Max_Quotations: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    Visual_Customization: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Features: {
      type: DataTypes.JSON,
      allowNull: true
    },
    Status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'suscription_plans',
    timestamps: true,
    createdAt: 'Created_At',
    updatedAt: 'Updated_At'
  });

  SuscriptionPlan.associate = function(models) {
    SuscriptionPlan.hasMany(models.UserSuscription, {
      foreignKey: 'Plan_Id',
      as: 'UserSuscriptions'
    });
  };

  return SuscriptionPlan;
};