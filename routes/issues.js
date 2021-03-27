const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/WrapAsync');
const ExpressError = require('../utils/ExpressError');
const Issue = require('../models/issuesTemp');
const Joi = require('joi');
const { isLoggedIn } = require('../middleware')

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
    await issue.save();
    req.flash('success', "Successfully added an issue")
    //TODO to set priority, status, submitted by, assigned to
    res.redirect(`/issues/${issue._id}`)
}))




router.get('/:id', wrapAsync(async (req, res, next) => {
    const issue = await Issue.findById(req.params.id)
    if (!issue) {
        req.flash('error', 'Issue not found!');
        return res.redirect('/issues');
    }
    res.render('issues/display', { issue });
}));



router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const issue = await Issue.findById(req.params.id)
    if (!issue) {
        req.flash('error', 'Issue not found!');
        return res.redirect('/issues');
    }
    res.render('issues/editForm', { issue });
}))
router.put('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const issue = await Issue.findByIdAndUpdate(id, { ...req.body.issue });
    req.flash('success', "Successfully updated the issue")
    res.redirect(`/issues/${issue._id}`)
}));




router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Issue.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted the issue")
    res.redirect('/issues');
}))

module.exports = router;