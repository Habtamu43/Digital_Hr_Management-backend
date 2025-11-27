'use strict';

const Applicant = (sequelize,DataTypes) => {
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
        isEmail: true
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
    }
  }, {
    tableName: 'Applicants',
    timestamps: true
  });

  // Associations (if any) go here
  Applicant.associate = (models) => {
    // Example: Applicant.belongsTo(models.Organization, { foreignKey: 'organizationID', as: 'organization' });
  };

  return Applicant;
};

export default Applicant;