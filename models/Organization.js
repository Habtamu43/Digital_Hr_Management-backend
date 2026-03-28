'use strict';
const Organization  = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationURL: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    organizationMail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  }, {
    timestamps: true,
    tableName: 'Organizations',
  });

  // Associations
  Organization.associate = (models) => {
    Organization.hasMany(models.Employee, {
      foreignKey: 'organizationId',
      as: 'employees',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Organization.hasMany(models.HumanResources, {
      foreignKey: 'organizationId',
      as: 'HRs',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Organization;
};

export default Organization 