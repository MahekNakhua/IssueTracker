const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/WrapAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const issueRoutes = require('./routes/issues');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comments');
const Comment = require('./models/comments');

// const {adminSchema, projectmanagerSchema, developerSchema, submitterSchema,projectSchema, issueSchema} = require('./validationSchemas')

// const adminSchema = require('./models/admin')
// const projectmanagerSchema = require('./models/projectManager')
// const developerSchema = require('./models/developer')
// const submitterSchema = require('./models/submitter')
// const projectSchema = require('./models/project')
// const issueSchema = require('./models/issue')

const Issue = require('./models/issuesTemp')
const User = require('./models/user')
mongoose.connect('mongodb://localhost:27017/issueTrackerTemp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
// app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'insertasecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnToUrl = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})




// app.get('/', (req, res) => {
//     res.render('homepage')
// })

app.use('/', userRoutes);
app.use('/issues', issueRoutes)
app.use('/issues/:id/comments', commentRoutes)


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found :(', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oops, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})






app.listen(3000, () => {
    console.log('app is listening on port 3000!'.toUpperCase())
})



