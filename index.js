// Assurez-vous que vous avez installé le module dotenv : npm install dotenv
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/books');

const app = express();
const PORT = process.env.PORT || 5463;

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in the environment.');
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Routes
app.get('/', (req, res) => {
  res.send({ title: 'Books' });
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/add-note', async (req, res) => {
  try {
    await Book.insertMany([
      {
        title: 'Sons Of Anarchy',
        body: 'Body text goes here...',
      },
      {
        title: 'Games of Thrones',
        body: 'Body text goes here...',
      },
    ]);
    res.json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
