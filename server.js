const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.LOCAL_MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database Connected'))
  .catch((e) => console.error(e));

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server is accepting request at: ${PORT} `));
