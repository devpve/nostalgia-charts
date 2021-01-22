const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { ensureAuth } = require('../middleware/auth');

// @desc Index groups page
// @route GET /groups
router.get('/', ensureAuth, groupController.group_index);

// @desc Create group
// @route POST /groups
router.post('/', ensureAuth, groupController.group_create);

// @desc Edit group
// @route EDIT /groups
router.put('/:id', ensureAuth, groupController.group_edit);

// @desc Delete group
// @route DELETE /groups
router.delete('/:id', ensureAuth, groupController.group_delete);

// @desc Add member to a group
// @route POST /groups/:id/add
router.post('/:id/add', ensureAuth, groupController.group_member_add);

// @desc Remove member of a group
// @route DELETE /groups/:id/delete
router.delete('/:id/delete', ensureAuth, groupController.group_member_delete);

module.exports = router;