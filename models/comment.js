const mongoose = require('mongoose')
const { DateTime, } = require("luxon");

const { Schema } = mongoose;

const CommentSchema = new Schema (
    {
        name: {type: String, required: true},
        text: {type: String , required: true},
        timestamp: {type: Date, default: Date.now },
    }
)

CommentSchema.virtual('datetime').get(function() {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED); //format 'October 22, 9:38 PM'
});

module.exports = mongoose.model('Comment', CommentSchema)