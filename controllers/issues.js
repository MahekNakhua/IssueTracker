const Issue = require('../models/issuesTemp');
const User = require('../models/user');
let identifiedByUser;

module.exports.issuesIndex = async (req, res) => {
    const issues = await Issue.find({});
    res.render('issues/index', { issues })
}

module.exports.renderNewForm = (req, res) => {
    res.render('issues/newForm');
}

module.exports.createIssue = async (req, res) => {
    const issue = new Issue(req.body.issue)
    issue.status = 'Unassigned';
    identifiedByUser = req.user;
    issue.identified_by = identifiedByUser._id;
    await issue.save();
    req.flash('success', "Successfully added an issue")
    //TODO to set priority, status, submitted by, assigned to
    res.redirect(`/issues/${issue._id}`)
}

module.exports.displayIssue = async (req, res, next) => {
    const issue = await Issue.findById(req.params.id).populate('assigned_to').populate('identified_by').populate({ path: 'comments', populate: { path: 'author' } });
    if (!issue) {
        req.flash('error', 'Issue not found!');
        return res.redirect('/issues');
    }
    res.render('issues/display', { issue });
}

module.exports.renderEditForm = async (req, res) => {
    const issue = await Issue.findById(req.params.id).populate('assigned_to').populate('identified_by');
    if (!issue) {
        req.flash('error', 'Issue not found!');
        return res.redirect('/issues');
    }
    console.log(issue)
    res.render('issues/editForm', { issue });
}

module.exports.editIssue = async (req, res) => {
    const { id } = req.params;
    const username = req.body.tempUsername;
    const assignedUser = await User.findOne({ username: username });
    let currentIssue = { ...req.body.issue };
    currentIssue.assigned_to = assignedUser._id;
    const issue = await Issue.findByIdAndUpdate(id, { ...currentIssue }, { new: true }).populate('assigned_to').populate('identified_by');
    req.flash('success', "Successfully updated the issue")
    res.redirect(`/issues/${issue._id}`)
}

module.exports.deleteIssue = async (req, res) => {
    const { id } = req.params;
    await Issue.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted the issue")
    res.redirect('/issues');
}