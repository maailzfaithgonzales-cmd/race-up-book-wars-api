module.exports = (sequelize, DataTypes) =>
  sequelize.define('Player', {
    player_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    session_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    nickname: { type: DataTypes.STRING(50), allowNull: false },
    player_token_hash: { type: DataTypes.STRING(255) },
    token_expires_at: { type: DataTypes.DATE },
    shelf_position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ranking: { type: DataTypes.INTEGER },
    session_output: { type: DataTypes.JSON },
  }, {
    tableName: 'players',
    timestamps: true,
    createdAt: 'joined_at',
    updatedAt: false,
  });