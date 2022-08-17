const schema = mongoose.Schema({
  DiscordID: String,
  SteamID: String,
  msg_id: String,
  amount: Number,
  item: Number,
  docs: String,
  Type: String,
});

module.exports = mongoose.model(`Temps`, schema);
