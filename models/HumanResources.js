'use strict';

const HumanResources = (sequelize, DataTypes) => {
  const HumanResources = sequelize.define('HumanResources', {
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true, 
      validate: { isEmail: true } 
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('HR-Admin'), allowNull: false },
    organizationId: { type: DataTypes.INTEGER },
    departmentId: { type: DataTypes.INTEGER },

    // Verification fields
    isverified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verificationotp: { type: DataTypes.STRING, allowNull: true },
    verificationotpexpires: { type: DataTypes.DATE, allowNull: true },

    // Reset password fields
    resetpasswordtoken: { type: DataTypes.STRING, allowNull: true },
    resetpasswordexpires: { type: DataTypes.DATE, allowNull: true },
  }, {
    timestamps: true,
    tableName: 'HumanResources',
  });

  // ✅ Associations
  HumanResources.associate = (models) => {
    HumanResources.belongsTo(models.Organization, { foreignKey: 'organizationId', as: 'organization' });
    HumanResources.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' }); // FIXED here
    HumanResources.hasMany(models.Notice, { foreignKey: 'createdByID', as: 'notices' });
  };

  return HumanResources;
};

export default HumanResources;
