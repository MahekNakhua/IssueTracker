const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectmanagerSchema = new Schema({
    username: String,
    email: {
        type: String,
    },
    assigned_project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }, //can work only on one project at a time
});


module.exports = mongoose.model('Project Manager', projectmanagerSchema);


//PM CRUD FOR ISSUE ASSIGNMENT 
