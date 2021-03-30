const express = require('express');
const router = express.Router({ mergeParams: true });
const Issue = require('../models/issuesTemp');
const Comment = require('../models/comments');
const { isLoggedIn, isCommentAuthor } = require('../middleware')
const ExpressError = require('../utils/ExpressError')
const wrapAsync = require('../utils/WrapAsync');

router.post('/', isLoggedIn, wrapAsync(async (req, res) => {
    const issue = await Issue.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    issue.comments.push(comment);
    await comment.save();
    await issue.save();
    // req.flash('success', 'Added a new comment!');
    res.redirect(`/issues/${issue._id}`);
}))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, wrapAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Issue.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    // req.flash('success', 'Successfully deleted comment')
    res.redirect(`/issues/${id}`);
}))

module.exports = router;