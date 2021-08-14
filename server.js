const dotenv = require('dotenv');

dotenv.config();
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 2000;
const server = app.listen(PORT, () =>
  console.log(`Server is accepting request at: ${PORT} `)
);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection, shutting down.........');
  server.close(() => {
    process.exit(1);
  });
});
