import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'
import dns from 'node:dns'
import taskRoutes from './routes/tasks.route.js'

dns.setServers(['1.1.1.1', '8.8.8.8']);


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1/task', taskRoutes)

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('MongoDB connected!');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
}

startServer();