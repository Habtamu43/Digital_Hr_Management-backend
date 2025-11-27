'use strict';

const HumanResources = (sequelize,DataTypes) => {
  const HumanResources = sequelize.define('HumanResources', {
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('HR-Admin'), allowNull: false },
    organizationID: { type: DataTypes.INTEGER },
    departmentID: { type: DataTypes.INTEGER },
  }, {
    timestamps: true,
    tableName: 'HumanResources',
  });

  HumanResources.associate = (models) => {
    HumanResources.belongsTo(models.Organization, { foreignKey: 'organizationID', as: 'organization' });
    HumanResources.belongsTo(models.Department, { foreignKey: 'departmentID', as: 'department' });
    HumanResources.hasMany(models.Notice, { foreignKey: 'createdByID', as: 'notices' });
  };

  return HumanResources;
};

export default HumanResources
