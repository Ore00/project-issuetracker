class db {
  mongoose = require("mongoose");
  mySecret = process.env['MONGO_URI'];

  constructor() {
    try {
      this.mongoose.connect(this.mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

      this.mongoose.set('useNewUrlParser', true);
      this.mongoose.set('useFindAndModify', false);
      this.mongoose.set('useCreateIndex', true);
    } catch (err) {
      return err.code;
    }
  }
};
module.exports = db;