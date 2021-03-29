const Issue = require('./models/issuesTemp');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER = ", req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.notAlreadyLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash('success', 'You are already logged in!');
    const redirectUrl = req.session.returnToUrl || '/issues';
    delete req.session.returnToUrl;
    res.redirect(redirectUrl);
}


module.exports.hasAccess = async (req, res, next) => {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    // if (req.user == 'Submitter' || !issue.assigned_to.equals(req.user._id)) {
    if (req.user.role == 'Submitter') {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/issues/${id}`);
    }
    next();
}

