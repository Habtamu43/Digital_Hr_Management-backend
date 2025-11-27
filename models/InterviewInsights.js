'use strict';

const InterviewInsight = (sequelize,DataTypes) => {
  const InterviewInsight = sequelize.define('InterviewInsight', {
    applicantID: {
      type: DataTypes.INTEGER,
      allowNull: false, // required: true
      references: {
        model: 'Applicants', // must match your Applicant model/table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    feedback: {
      type: DataTypes.STRING,
      allowNull: true, // not required
    },
    interviewerID: {
      type: DataTypes.INTEGER,
      allowNull: false, // required: true
      references: {
        model: 'HumanResources',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    interviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    responseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Canceled', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending',
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
    timestamps: true, // adds createdAt and updatedAt
    tableName: 'InterviewInsights', // consistent table name for PostgreSQL
  });

  // ✅ Associations
  InterviewInsight.associate = (models) => {
    // Each interview belongs to one applicant
    InterviewInsight.belongsTo(models.Applicant, {
      foreignKey: 'applicantID',
      as: 'applicant',
    });

    // Each interview belongs to one HR interviewer
    InterviewInsight.belongsTo(models.HumanResources, {
      foreignKey: 'interviewerID',
      as: 'interviewer',
    });

    // Each interview belongs to one organization
    InterviewInsight.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });
  };

  return InterviewInsight;
};

export default InterviewInsight;