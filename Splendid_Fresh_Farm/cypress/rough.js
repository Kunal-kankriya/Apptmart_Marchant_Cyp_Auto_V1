const fs = require('fs'); 
const path = require('path'); 
const config_path = path.join(__dirname, '/configuration/config.json');
const test_data = fs.readFileSync(config_path, 'utf8'); 
const data = JSON.parse(test_data) 
console.log(data.url)
console.log(data.mobile_number)
console.log(data.otp)    