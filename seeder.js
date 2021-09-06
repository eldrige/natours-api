const fs = require('fs');
const Tour = require('./models/Tour');
const Review = require('./models/Review');
const User = require('./models/User');

const connectDB = require('./config/db');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`)
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`)
);

connectDB();

const importData = async () => {
  try {
    await User.create(users);
    await Review.create(reviews);
    await Tour.create(tours, { validateBeforeSave: false });
    // await Tour.create(tours, {validateBeforeSave: false});  to skip validation rules before saving
    console.log('Data succesfully loaded');
  } catch (e) {
    console.log(e.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log('Data succesfully deleted');
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
