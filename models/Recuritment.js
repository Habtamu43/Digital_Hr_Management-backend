'use strict';

const  Recruitment  = (sequelize,DataTypes) => {
  const Recruitment = sequelize.define('Recruitment', {
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false, // required: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false, // required: true
    },
    departmentID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Departments', // must match the Department model table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    organizationID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Organizations', // must match the Organization model table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    timestamps: true,
    tableName: 'Recruitments',
  });

  // ✅ Associations
  Recruitment.associate = (models) => {
    // One recruitment belongs to one department
    Recruitment.belongsTo(models.Department, {
      foreignKey: 'departmentID',
      as: 'department',
    });

    // One recruitment belongs to one organization
    Recruitment.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });

    // One recruitment has many applications (Applicants)
    Recruitment.hasMany(models.Applicant, {
      foreignKey: 'recruitmentID',
      as: 'applications',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Recruitment;
};

export default Recruitment 