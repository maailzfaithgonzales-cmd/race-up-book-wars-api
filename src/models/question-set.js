module.exports = (sequelize, DataTypes) =>
  sequelize.define('QuestionSet', {
    set_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    host_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    subject: {
      type: DataTypes.STRING(50)
    },
    grade_level: {
      type: DataTypes.STRING(20)
    },
  }, {
    tableName: 'question_sets',
    timestamps: false,
  });