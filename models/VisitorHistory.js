const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VisitorHistorySchema = new Schema({
    hostname: {
        type: String
    },
    ip: {
        type: String
    },
    type: {
        type: String,
        default: "Visited"
    },
    redirected_to: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

VisitorHistorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

VisitorHistorySchema.set('toJSON', {
    virtuals: true
});

module.exports = VisitorHistory = mongoose.model("visitor_histories", VisitorHistorySchema);
