const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema (
    {
    title: {type: String, required: true },
    text: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, required: true, ref: 'user'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    timestamp: {type: Date, default: Date.now },
    published: {type: Boolean, required: true, default: false}
    }
);

CommentSchema.virtual('datetime').get(function() {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED); //format 'October 22, 9:38 PM'
});

module.exports = mongoose.model('Post', PostSchema);