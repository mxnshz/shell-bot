const schema = mongoose.Schema({
  DiscordID: String,
  PrivateName: String,
  PrivateIsLocked: { type: String, default: false },
  PrivateSlots: { type: Number, default: 0 },
});

module.exports = mongoose.model(`Users`, schema);
