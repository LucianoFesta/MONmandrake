
const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const novedadesRoutes = require('./routes/novedades.routes')


const app = express();
//routes
app.use(express.json());
app.use(novedadesRoutes);


//mongodb conection

mongoose.connect(config.MONGODB_URI)
.then(()=> console.log("Connected to MongoDB Atlas"))
.catch((error) => console.error(error))

//servidor

app.listen(config.PORT, () => {
  console.log("Server is running on port" + config.PORT);
});

