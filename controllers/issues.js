const { Issue } = require('../models/issues.js');

const createIssue = async (data) => {
  try {
    const issue = new Issue(data);
    const savedIssue = await issue.save();
    return savedIssue;

  } catch (error) {
    return { error: error.message };
  }
};
const getAllIssues = async (conditions) => {
  try {
    const Issues = await Issue.find(conditions);
    return Issues;

  } catch (error) {
    return { error: error.message };
  }
};

const deleteIssueById = async (id) => {
  try {
    const Issues = await Issue.findByIdAndDelete(id);
    return Issues;
  } catch (error) {
    return { error: error.message };
  }
};

const deleteIssueByConditions = async (conditions) => {
  try {
    const Issues = await Issue.deleteMany(conditions);
    return Issues;
  } catch (error) {
    return { error: error.message };
  }
};

const updateIssue = async (id, data) => {
  let issue = null;
  let updated = new Date();
  data.updated_on = updated.toISOString();
  await Issue.findByIdAndUpdate(id, data, { new: true })
    .then(function(data) {
      issue = data;
    })
    .catch(function(error) {
      return { error: error};
    });
  return issue;
};

exports.createIssue = createIssue;
exports.deleteIssueByConditions = deleteIssueByConditions;
exports.deleteIssueById = deleteIssueById;
exports.getAllIssues = getAllIssues;
exports.updateIssue = updateIssue;