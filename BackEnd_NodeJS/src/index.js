
const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const novedadesRoutes = require('./routes/novedades.routes');
const cors = require('cors');

const app = express();

//CORS

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));


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

