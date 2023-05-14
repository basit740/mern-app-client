const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TurnerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    use: {
        type: Number,
        default: 0
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true
    }
});

TurnerSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

TurnerSchema.set('toJSON', {
    virtuals: true
});

module.exports = Turner = mongoose.model("turners", TurnerSchema);
