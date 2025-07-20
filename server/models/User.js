const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    tokenExpiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

userSchema.methods.isTokenExpired = function() {
    return new Date() >= this.tokenExpiresAt;
};

userSchema.methods.isTokenExpiringSoon = function() {
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return this.tokenExpiresAt <= fiveMinutesFromNow;
};

module.exports = mongoose.model('User', userSchema); 