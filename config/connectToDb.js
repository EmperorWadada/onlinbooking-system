const mongoose = require('mongoose');

const connecToDb =  async () => {
  const conn = await mongoose.connect(process.env.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`Dabase connected to server sucessfully on ${conn.connection.host}`)
};

module.exports = connecToDb;

