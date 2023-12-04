const DB = require("../db/db.js");

let db = new DB();

const issueSchema = new db.mongoose.Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: "" }
});

const Issue = db.mongoose.model("Issue", issueSchema);

exports.Issue = Issue;
exports.issueSchema = issueSchema;
