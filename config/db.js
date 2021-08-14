const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = () => {
  // try {
  //   await mongoose.connect(process.env.LOCAL_MONGO_URI, {
  //     useNewUrlParser: true,
  //     useCreateIndex: true,
  //     useFindAndModify: false,
  //     useUnifiedTopology: true,
  //   });
  //   console.log('Database connection succesful');
  // } catch (e) {
  //   console.log('Something went wrong');
  // }

  mongoose
    .connect(process.env.LOCAL_MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Database connection succesful'));
};

module.exports = connectDB;
