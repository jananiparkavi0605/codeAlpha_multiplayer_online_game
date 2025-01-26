const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
});

module.exports = mongoose.model("Player", PlayerSchema);
