const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project.controller');

router.get('/', ProjectController.getProjects);
router.post('/', ProjectController.createProject);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', ProjectController.updateProject);
router.patch('/:id', ProjectController.updateProject);

module.exports = router;
