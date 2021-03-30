const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comments')

const issueSchema = new Schema({
    title: String,
    description: String,
    identified_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    identified_date: Date,
    assigned_to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Unassigned', 'Assigned', 'Resolved'],
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low']
    },
    images: [String], //url
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

issueSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

// TODO default values and required keywords

module.exports = mongoose.model('Issue', issueSchema);

// CRUD FOR NEW ISSUE BY SUBMITTER
