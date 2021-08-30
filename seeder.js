const fs = require('fs');
const Tour = require('./models/Tour');
const connectDB = require('./config/db');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`)
);
connectDB();

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data succesfully loaded');
  } catch (e) {
    console.log(e.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
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
