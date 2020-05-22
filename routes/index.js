const express = require('express');
const router = express.Router();
const workplacesJson = require('../public/json/workplaces.json');
const skillsJson = require('../public/json/skills.json');

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/getCareersData', function (req, res) {
    res.json(workplacesJson);
});

router.get('/getSkillsData', function (req, res) {
   res.json(skillsJson);
});

module.exports = router;
