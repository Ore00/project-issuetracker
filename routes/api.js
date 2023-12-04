'use strict';
const expect = require('chai').expect;
const issuesController = require('../controllers/issues.js');
const ObjectId = require('mongoose').Types.ObjectId;
const { validate } = require('../controllers/validate.js')
const { body, check } = require('express-validator');

module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(async function(req, res, next) {
      let project = req.params.project;
      let data = Object.assign(req.query, { project: project });

      let result = await issuesController.getAllIssues(data);

      if (result.error) {
        res.status(500).json(result.error);
      } else {
        res.send(result);
      }
      next();

    })

    .post(validate([
      body('issue_title').notEmpty(),
      body('issue_text').notEmpty(),
      body('created_by').notEmpty()
    ]), async function(req, res, next) {
      let project = req.params.project;
      let data = Object.assign(req.body, { project: project });

      let result = await issuesController.createIssue(data);
      if (result.error) {
        res.status(500).json(result.error);
      } else {
        res.status(200).json(result);
      }
      next();
    })

    .put(async function(req, res, next) {
      try {
        const result = await check('_id').notEmpty().run(req);
        
        if (result.isEmpty() && Object.keys(req.body).length === 1) {
          return res.json({ error: 'no update field(s) sent', _id: req.body._id });
        } else if (!result.isEmpty()) {
          return res.json({ error: 'missing _id' });
        } else if (!ObjectId.isValid(req.body._id)) {
          res.json({ error: 'could not update', _id: req.body._id });
        } else {
          const id = req.body._id;
          let data = req.body;
          delete data._id;
          let result = await issuesController.updateIssue(id, data);

          if (result == null) {
             res.json({ error: 'could not update', _id: id });
          } else if (!Object.hasOwn(result, 'error')) {
            res.json({ 
              result: 'successfully updated', 
              _id: id 
            });
          } else {
            res.json({ error: 'could not update', _id: id });
          }
        }
      } catch (err) {
        console.log({ error: err.message });
        next(err);
      }
    })

    .delete(async function(req, res, next) {
      try {
        const result = await check('_id').notEmpty().run(req);
        if (!result.isEmpty()) {
          return res.json({ error: 'missing _id' });
        } else {
          let id = req.body._id;
          let result = await issuesController.deleteIssueById(id);
          if (result === null) {
            res.json({ error: 'could not delete', _id: id });
          } else if (result.error) {
            res.status(500).json({ error: result.error });
          } else {
            res.status(200).json({ result: 'successfully deleted', _id: id });
          }
        }
      } catch (err) {
        console.log(err.message);
        next(err);
      }
    });

};
