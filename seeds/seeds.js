const mongoose = require('mongoose');
const { titles, descriptors, statuses, priorities } = require('./seedHelpers');
const Issue = require('../models/issuesTemp')

mongoose.connect('mongodb://localhost:27017/issueTrackerTemp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Issue.deleteMany({});

    for (let i = 0; i < 20; i++) {
        const random1 = Math.floor(Math.random() * titles.length);
        const random2 = Math.floor(Math.random() * descriptors.length);
        const random3 = Math.floor(Math.random() * statuses.length);
        const random4 = Math.floor(Math.random() * priorities.length)
        const newIssue = new Issue({ title: titles[random1], description: descriptors[random2], assigned_to: mongoose.Types.ObjectId('605f249133d6e84ff4e02dec'), identified_by: mongoose.Types.ObjectId('6061f3e0f031f63d4c124cfc'), status: statuses[random3], priority: priorities[random4] })
        await newIssue.save();
    }
    console.log("Seeded The Database");
}

seedDB().then(() => {
    mongoose.connection.close();
})