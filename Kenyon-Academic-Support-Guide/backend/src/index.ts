
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import interests from './routes/interests.js';
import recommendations from './routes/recommendations.js';
import alumni from './routes/alumni.js';
import organizations from './routes/organizations.js';
import explanations from './routes/explanations.js';
import profile from './routes/profile.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({ origin: (process.env.CORS_ORIGINS||'http://localhost:3000').split(','), credentials: true }));

app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

app.use('/api/v1/interests', interests);
app.use('/api/v1/recommendations', recommendations);
app.use('/api/v1/alumni', alumni);
app.use('/api/v1/recommendations/organizations', organizations);
app.use('/api/v1/explanations', explanations);
app.use('/api/v1/profile', profile);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API running on :${port}`));
