const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submitterSchema = new Schema({
    username: String,
    email: {
        type: String,
    },
    submitted_issues: {
        type: Schema.Types.ObjectId,
        ref: 'Issue'
    }, //can work only on one project at a time
});


module.exports = mongoose.model('Submitter', submitterSchema);


//SUBMITTER CRUD FOR ISSUES
