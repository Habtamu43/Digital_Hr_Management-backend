'use strict';

const Applicant = (sequelize, DataTypes) => {
  const Applicant = sequelize.define('Applicant', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email format"
        }
      }
    },
    contactnumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    appliedrole: {
      type: DataTypes.STRING,
      allowNull: false
    },
    recruitmentstatus: {
      type: DataTypes.ENUM(
        "pending",
        "Interview-Scheduled",
        "Interview-Completed",
        "Hired",
        "Rejected"
      ),
      defaultValue: "pending",
    },
    recruitmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Recruitments', // make sure this table exists
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    tableName: 'Applicants',
    timestamps: true
  });

  // Associations
  Applicant.associate = (models) => {
    Applicant.belongsTo(models.Recruitment, {
      foreignKey: 'recruitmentID',
      as: 'recruitment'
    });
  };

  return Applicant;
};

export default Applicant;
