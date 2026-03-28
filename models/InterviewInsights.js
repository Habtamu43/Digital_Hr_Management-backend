"use strict";

const InterviewInsight = (sequelize, DataTypes) => {
  const InterviewInsight = sequelize.define(
    "InterviewInsight",
    {
      applicantID: {
        type: DataTypes.INTEGER,
        allowNull: false, // required
        references: {
          model: "Applicants", // must match Applicant table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      interviewerID: {
        type: DataTypes.INTEGER,
        allowNull: false, // required
        references: {
          model: "HumanResources", // must match HR table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      interviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      responseDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      feedback: {
        type: DataTypes.TEXT, // better for long feedback
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("Pending", "Canceled", "Completed"),
        allowNull: false,
        defaultValue: "Pending",
      },

      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Organizations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "InterviewInsights", // consistent PostgreSQL table name
      timestamps: true, // createdAt & updatedAt
    },
  );

  // ================== ASSOCIATIONS ==================
  InterviewInsight.associate = (models) => {
    // Each interview belongs to one applicant
    InterviewInsight.belongsTo(models.Applicant, {
      foreignKey: "applicantID",
      as: "applicant",
    });

    // Each interview belongs to one HR interviewer
    InterviewInsight.belongsTo(models.HumanResources, {
      foreignKey: "interviewerID",
      as: "interviewer",
    });

    // Each interview belongs to an organization
    InterviewInsight.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });
  };

  return InterviewInsight;
};

export default InterviewInsight;
