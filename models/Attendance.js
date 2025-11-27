'use strict';
const  Attendance = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    employeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Employees', // must match your Employee table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent', 'Not Specified'),
      allowNull: false,
      defaultValue: 'Not Specified',
    },
    organizationID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Organizations', // must match your Organization table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    timestamps: true,
    tableName: 'Attendances',
  });

  // Associations
  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Employee, {
      foreignKey: 'employeeID',
      as: 'employee',
    });

    Attendance.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });
  };

  return Attendance;
};
 

export default Attendance