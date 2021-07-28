const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

console.log(process.env);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server is accepting request at: ${PORT} `));
