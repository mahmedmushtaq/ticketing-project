import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('starting up...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key must be valid');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('connected to mongodb');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Auth server is listening on the port 3000');
  });
};

start();
