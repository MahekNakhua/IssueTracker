const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    title: String,
    description: String,
    identified_by: String,
    identified_date: Date,
    assigned_to: String,
    status: {
        type: String,
        enum: ['Unassigned', 'Assigned', 'Resolved'],
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low']
    },
});


// TODO default values and required keywords

module.exports = mongoose.model('Issue', issueSchema);

// CRUD FOR NEW ISSUE BY SUBMITTER
