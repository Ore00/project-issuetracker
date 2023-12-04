const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const { faker } = require('@faker-js/faker');
const issuesController = require('../controllers/issues.js');
const server = require('../server');
const project = 'apitest';
chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST request to /api/issues/{project} should', function() {
    test('Create an issue with every field', function(done) {
      const issue = {
        issue_title: faker.lorem.sentence(5),
        issue_text: faker.lorem.sentence(10),
        created_by: faker.person.fullName(),
        assigned_to: faker.person.firstName(),
        status_text: 'open'
      };
      chai
        .request(server)
        .keepOpen()
        .post(`/api/issues/${project}/`)
        .send(issue)
        .end(function(err, res) {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, issue.issue_title);
          done();
        });
    });

    test('Create an issue with only required fields', function(done) {
      const issue = {
        issue_title: faker.lorem.sentence(5),
        issue_text: faker.lorem.sentence(10),
        created_by: faker.person.fullName()
      };
      chai
        .request(server)
        .keepOpen()
        .post(`/api/issues/${project}/`)
        .send(issue)
        .end(function(err, res) {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, issue.issue_title);
          done();
        });
    });

    test('Create an issue with missing required fields', function(done) {
      const issue = {
        issue_title: faker.lorem.sentence(5),
        issue_text: faker.lorem.sentence(10)
      };
      chai
        .request(server)
        .keepOpen()
        .post(`/api/issues/${project}/`)
        .send(issue)
        .end(function(err, res) {
          if (err) done(err);
          // assert.equal(res.status, 400);
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done();
        });
    });
  });
  suite('GET request to /api/issues/{project} should', function() {
    test('View issues on a project', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get(`/api/issues/${project}/`)
        .end(function(err, res) {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.equal(res.body[0].project, project);
          assert.hasAllKeys(res.body[0], [
            'project', 'issue_title', 'issue_text', 'created_by',
            'assigned_to', 'status_text', 'created_on', 'updated_on',
            'open', '_id', '__v'
          ]);
          done();
        });
    });

    test('View issues on a project with one filter', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get(`/api/issues/${project}/?open=true`)
        .end(function(err, res) {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.equal(res.body[0].project, project);
          assert.hasAllKeys(res.body[0], [
            'project', 'issue_title', 'issue_text', 'created_by',
            'assigned_to', 'status_text', 'created_on', 'updated_on',
            'open', '_id', '__v'
          ]);
          done();
        });
    });

    test('View issues on a project with multiple filters', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get(`/api/issues/${project}/?open=true&status_text=open`)
        .end(function(err, res) {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.equal(res.body[0].project, project);
          assert.hasAllKeys(res.body[0], [
            'project', 'issue_title', 'issue_text', 'created_by',
            'assigned_to', 'status_text', 'created_on', 'updated_on',
            'open', '_id', '__v'
          ]);
          done();
        });
    });
  });
  suite('PUT request to /api/issues/{project} should', function() {
    test('Update one field on an issue', async function() {
      const issues = await issuesController.getAllIssues();
      const item = Math.floor(Math.random() * issues.length);
      const id = issues[item]._id.toString();
      chai
        .request(server)
        .keepOpen()
        .put(`/api/issues/${project}/`)
        .send({ _id: id, status_text: 'in-progress' })
        .then(function(res) {
          assert.deepEqual(res.body, { result: 'successfully updated', _id: id });
        })
        .catch(function(err) {
          console.error("Error", err);
        });
    });

    test('Update multiple fields on an issue', async function() {
      const issues = await issuesController.getAllIssues();
      const item = Math.floor(Math.random() * issues.length);
      const id = issues[item]._id.toString();
      chai
        .request(server)
        .keepOpen()
        .put(`/api/issues/${project}/`)
        .send({ _id: id, status_text: 'closed', open: false, issue_title: 'updated' })
        .then(function(res) {
          assert.deepEqual(res.body, { result: 'successfully updated', _id: id });
        })
        .catch(function(err) {
          console.error("Error", err);
        });
    });

    test('Update an issue with missing _id', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put(`/api/issues/${project}/`)
        .end(function(err, res) {
          if (err) done(err);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });
    test('Update an issue with no fields to update', async function() {
      let issues = await issuesController.getAllIssues();
      const item = Math.floor(Math.random() * issues.length);
      let id = issues[item]._id.toString();
      chai
        .request(server)
        .keepOpen()
        .put(`/api/issues/${project}/`)
        .send({ _id: id })
        .then(function(res) {
          assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: id });
        })
        .catch(function(err) {
          console.error("Error", err);
        });
    });
    test('Update an issue with an invalid _id', function(done) {
      let id = "5f665eb46e296f6b9b6a504d"; 
      chai
        .request(server)
        .keepOpen()
        .put(`/api/issues/${project}/`)
        .send({ _id: id, status_text: 'New Issue Text' })
        .end(function(err, res) {
          if (err) {console.log("eror:", error)};
          assert.deepEqual(res.body, { error: 'could not update', _id: id });
          done();
        });
    });
    test('Update an issue with an invalid _id', function(done) {
      let id = faker.string.alphanumeric(10);
      chai
        .request(server)
        .keepOpen()
        .put(`/api/issues/${project}/`)
        .send({ _id: id, status_text: 'New Issue Text' })
        .end(function(err, res) {
          if (err) {console.log("eror:", error)};
          assert.deepEqual(res.body, { error: 'could not update', _id: id });
          done();
        });
    });
  });
  suite('DELETE request to /api/issues/{project} should', function() {

    test('Delete an issue', async function() {
      let issues = await issuesController.getAllIssues({ status_text: 'open' });
      const item = Math.floor(Math.random() * issues.length);
      let id = issues[item]._id.toString();
      chai
        .request(server)
        .keepOpen()
        .delete(`/api/issues/${project}/`)
        .send({ _id: id })
        .then(function( res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully deleted', _id: id });
        })
        .catch(function(err) {
          console.error("Error", err);
        });
    });

    test('Delete an issue with an invalid _id', function(done) {
      let id = faker.database.mongodbObjectId();
      chai
        .request(server)
        .keepOpen()
        .delete(`/api/issues/${project}/`)
        .send({ _id: id })
        .end(function(err, res) {
          if (err) done(err);
          assert.deepEqual(res.body, { error: 'could not delete', _id: id });
          done();
        });
    });

    test('Delete an issue with missing_id', function(done) {
      chai
        .request(server)
        .keepOpen()
        .delete(`/api/issues/${project}/`)
        .end(function(err, res) {
          if (err) done(err);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });
  });
});
