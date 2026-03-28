"use strict";

const CorporateCalendar = (sequelize, DataTypes) => {
  const CorporateCalendar = sequelize.define(
    "CorporateCalendar",
    {
      eventTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      audience: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        field: "organizationId", // ✅ ensures Sequelize uses the exact DB column
        references: {
          model: "Organizations",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
      tableName: "CorporateCalendars",
    },
  );

  // Associations (optional)
  CorporateCalendar.associate = (models) => {
    CorporateCalendar.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });
  };

  return CorporateCalendar;
};

export default CorporateCalendar;
