const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: String,
    email: {
        type: String,
        // required: true,
        // unique: true,
        // TODO - implement passport
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    project_managers: [{
        type: Schema.Types.ObjectId,
        ref: 'Project Manager'
    }]

});


module.exports = mongoose.model('Admin', adminSchema);


//ADMIN CRUD FOR PROJECTS, ASSIGN TO PM