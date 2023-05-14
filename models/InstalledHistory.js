const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InstalledHistorySchema = new Schema({
    hostname: {
        type: String
    },
    ip: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

InstalledHistorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

InstalledHistorySchema.set('toJSON', {
    virtuals: true
});

module.exports = InstalledHistory = mongoose.model("installed_histories", InstalledHistorySchema);
