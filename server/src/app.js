import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*'
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Planora Task Management API',
    routes: ['/tasks', '/tasks/:id']
  });
});

app.use('/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
