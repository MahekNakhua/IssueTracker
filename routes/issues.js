const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/WrapAsync');
const ExpressError = require('../utils/ExpressError');
const Issue = require('../models/issuesTemp');
const Joi = require('joi');
const { isLoggedIn, hasAccess } = require('../middleware')
let identifiedByUser;
// const validateIssue = (req, res, next) => {
//     const issueSchema = Joi.object({
//         issue: Joi.object({
//             title: Joi.string().min(3).max(50).required(),
//             description: Joi.string().required(),
//             priority: Joi.string().valid(...['High', 'Medium', 'Low']).required(),
//             status: Joi.string().valid(...['Unassigned', 'Assigned', 'Resolved']).required(),
//             images: Joi.string().required(),   //url sorta?!
//             identified_by: Joi.string(),
//             identified_date: Joi.date(),
//             assigned_to: Joi.string(), //chnage to ref later
//         }).required()

//     })

//     const issue = new Issue(req.body);
//     const { error } = issueSchema.validate(issue);
//     if (error) {
//         const msg = error.details.map(ele => ele.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next()
//     }

// }


router.get('/', wrapAsync(async (req, res) => {
    const issues = await Issue.find({});
    res.render('issues/index', { issues })
}));



router.get('/new', isLoggedIn, (req, res) => {
    res.render('issues/newForm');
})
router.post('/', isLoggedIn, wrapAsync(async (req, res) => {
    const issue = new Issue(req.body.issue)
    issue.status = 'Unassigned';
    identifiedByUser = req.user;
    issue.identified_by = identifiedByUser._id;
    console.log(issue)
    await issue.save();
    // const updateIssue = Issue.findByIdAndUpdate(issue._id, { $set: { identified_by: identifiedByUser } }, { new: true })
    req.flash('success', "Successfully added an issue")
    //TODO to set priority, status, submitted by, assigned to
    res.redirect(`/issues/${issue._id}`)
}))




router.get('/:id', wrapAsync(async (req, res, next) => {
    const issue = await Issue.findById(req.params.id).populate('assigned_to').populate('identified_by');
    console.log(issue)
    if (!issue) {
        req.flash('error', 'Issue not found!');
        return res.redirect('/issues');
    }
    res.render('issues/display', { issue });
}));


//TODO define edit access and all
router.get('/:id/edit', isLoggedIn, hasAccess, wrapAsync(async (req, res) => {
    const issue = await (await Issue.findById(req.params.id)).populate('assigned_to').populate('identified_by');
    if (!issue) {
        req.flash('error', 'Issue not found!');
        return res.redirect('/issues');
    }
    res.render('issues/editForm', { issue });
}))
router.put('/:id', isLoggedIn, hasAccess, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const issue = await Issue.findByIdAndUpdate(id, { ...req.body.issue });
    req.flash('success', "Successfully updated the issue")
    res.redirect(`/issues/${issue._id}`)
}));




router.delete('/:id', isLoggedIn, hasAccess, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Issue.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted the issue")
    res.redirect('/issues');
}))

module.exports = router;