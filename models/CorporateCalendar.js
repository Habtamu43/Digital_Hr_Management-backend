// models/CorporateCalendar.js
'use strict';

const  CorporateCalendar = (sequelize,DataTypes) => {
  const CorporateCalendar = sequelize.define('CorporateCalendar', {
    eventTitle: {
      type: DataTypes.STRING,
      allowNull: false, // same as "required: true" in Mongoose
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false, // required field
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false, // required field
    },
    audience: {
      type: DataTypes.STRING,
      allowNull: false, // required field
    },
    organizationID: {
      type: DataTypes.INTEGER, // assuming Organization has a numeric ID (foreign key)
      references: {
        model: 'Organizations', // must match the table name of your Organization model
        key: 'id',
      },
    },
  }, {
    timestamps: true, // same as Mongoose `{ timestamps: true }`
    tableName: 'CorporateCalendars', // optional: ensures consistent naming
  });

  // Associations (optional)
  CorporateCalendar.associate = (models) => {
    CorporateCalendar.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });
  };

  return CorporateCalendar;
};

export default CorporateCalendar  