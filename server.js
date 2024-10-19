const app=require('./src/app');

require("dotenv").config({ path: './config/.env' });
const port = process.env.PORT || 5000;

//connecting to the PORT 
app.listen(port, () => console.log(`express on ${port}`));