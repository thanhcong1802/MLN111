import express from 'express';
import cors from 'cors';
import contentRoutes from './routes/contentRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/content', contentRoutes);
app.use('/api/quiz', quizRoutes);
app.get('/api/health', (req, res) => res.json({ ok: true }));

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log('API: http://localhost:' + port));
}

export default app;
