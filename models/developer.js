const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const developerSchema = new Schema({
    username: String,
    email: {
        type: String,
    },
    assigned_issues: [{
        type: Schema.Types.ObjectId,
        ref: 'Issue'
    }], //can work on multiple issues at a time
});


module.exports = mongoose.model('Developer', developerSchema);

//DEVELOPER CRUD FOR ISSUES STATUS UPDATES
