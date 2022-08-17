const schema = mongoose.Schema({
    DiscordID: String,
    created_at: Number,
    created_msg: String,
    mod_msg: String
});

module.exports = mongoose.model(`RoleTemps`, schema)
