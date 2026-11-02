module.exports = (sequelize, DataTypes) =>
  sequelize.define('GameSession', {
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    join_code: { type: DataTypes.STRING(6), allowNull: false },
    host_user_id: { type: DataTypes.INTEGER, allowNull: false },
    set_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'WAITING',
    },
    started_at: { type: DataTypes.DATE },
    ended_at: { type: DataTypes.DATE },
    time_limit_sec: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
  }, {
    tableName: 'game_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });