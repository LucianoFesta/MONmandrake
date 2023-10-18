
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
//  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/test';
    PORT:process.env.PORT || 4000
}