const schema = mongoose.Schema({
  DiscordID: String,
  SteamID: String,
  Coins: { type: Number, default: 0 },
});

module.exports = mongoose.model(`Admins`, schema);
