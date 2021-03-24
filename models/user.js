const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
    },
    issues: [{
        type: Schema.Types.ObjectId,
        ref: 'IssueTemp'
    }]
});


module.exports = mongoose.model('User', userSchema);
