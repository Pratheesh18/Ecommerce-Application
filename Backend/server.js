const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const productRoutes = require('./Routes/productRoutes');

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

app.use('/api/auth',authRoutes);
app.use('/uploads',express.static('uploads'));
app.use('/api/products',productRoutes);

mongoose.connect(MONGO_URI,{
    useNewUrlParser : true,
    useUnifiedTopology:true
}).then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB',error));

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})