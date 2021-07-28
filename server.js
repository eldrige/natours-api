const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server is accepting request at: ${PORT} `));
