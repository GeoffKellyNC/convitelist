import express from "express";
import cors from "cors";

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: 'https://example.com',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Minecraft Registration API!' });
});

app.use('/user', userRoutes);
app.use('/admin', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
