'use strict';

const HumanResources = (sequelize,DataTypes) => {
  const HumanResources = sequelize.define('HumanResources', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // validates proper email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactnumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('HR-Admin', 'Employee'),
      allowNull: false,
      defaultValue: 'HR-Admin',
    },
    lastlogin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isverified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationtoken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationtokenexpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetpasswordtoken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetpasswordexpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    departmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Departments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    organizationID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Organizations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    timestamps: true,
    tableName: 'HumanResources',
  });

  // ✅ Associations
  HumanResources.associate = (models) => {
    // HR belongs to a Department
    HumanResources.belongsTo(models.Department, {
      foreignKey: 'departmentID',
      as: 'department',
    });

    // HR belongs to an Organization
    HumanResources.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });
  };

  return HumanResources;
};

export default HumanResources