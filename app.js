const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
// const {adminSchema, projectmanagerSchema, developerSchema, submitterSchema,projectSchema, issueSchema} = require('./validationSchemas')

// const adminSchema = require('./models/admin')
// const projectmanagerSchema = require('./models/projectManager')
// const developerSchema = require('./models/developer')
// const submitterSchema = require('./models/submitter')
// const projectSchema = require('./models/project')
// const issueSchema = require('./models/issue')

const Issue = require('./models/issuesTemp')

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





app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('dashboard')
})


// app.get('/newissue', async (req, res) => {
//     const newIssue = new Issue({ title: 'My First bug', description: 'yadedada', assigned_to: "meh", status: 'Assigned', priority: 'High' });
//     // newIssue.markModified('issues')
//     await newIssue.save()
//     console.log('issue saved')
//     res.send(newIssue)
// })

app.get('/issues', async (req, res) => {
    const issues = await Issue.find({});
    // res.send(issues)
    res.render('issues/index', { issues })
});



app.get('/issues/new', (req, res) => {
    res.render('issues/newForm');
})
//add new issue pt1

app.post('/issues', async (req, res) => {
    const issue = new Issue(req.body.issue);
    await issue.save();
    // res.send(issue)
    //TODO to set priority, status, submitted by, assigned to
    res.redirect(`/issues/${issue._id}`)
})
//add new issue pt2




app.get('/issues/:id', async (req, res,) => {
    const issue = await Issue.findById(req.params.id)
    res.render('issues/display', { issue });
});
//retrive an issue



app.get('/issues/:id/edit', async (req, res) => {
    const issue = await Issue.findById(req.params.id)
    res.render('issues/editForm', { issue });
})
//edit an issue pt1

app.put('/issues/:id', async (req, res) => {
    const { id } = req.params;
    const issue = await Issue.findByIdAndUpdate(id, { ...req.body.issue });
    res.redirect(`/issues/${issue._id}`)
});
// //edit an issue pt2




app.delete('/issues/:id', async (req, res) => {
    const { id } = req.params;
    await Issue.findByIdAndDelete(id);
    res.redirect('/issues');
})
//delete an issue













app.listen(3000, () => {
    console.log('app is listening on port 3000!'.toUpperCase())
})
// // app.use(express.static(path.join(__dirname, 'public')))



