const mongoose = require('mongoose');
const { DateTime, } = require("luxon");

const { Schema } = mongoose;

const PostSchema = new Schema (
    {
    title: {type: String, required: true },
    text: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    timestamp: {type: Date, default: Date.now },
    published: {type: Boolean, required: true, default: false}
    }
);

PostSchema.virtual('datetime').get(function() {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED); //format 'October 22, 9:38 PM'
});

module.exports = mongoose.model('Post', PostSchema);