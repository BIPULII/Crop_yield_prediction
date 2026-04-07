import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/**
 * Predict crop yield using the trained Random Forest model
 * POST /api/predict-model
 * Body: { year, rainfall, pesticides, avgTemp, area, item }
 */
app.post('/api/predict-model', (req, res) => {
  const { year, rainfall, pesticides, avgTemp, area, item } = req.body;

  // Validate inputs
  if (!year || !rainfall || !pesticides || !avgTemp || !area || !item) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Spawn Python process to run the model
  const pythonProcess = spawn('python', [
    path.join(__dirname, 'predict_model.py'),
    String(year),
    String(rainfall),
    String(pesticides),
    String(avgTemp),
    area,
    item
  ]);

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Python script error:', errorOutput);
      return res.status(500).json({ 
        error: 'Model prediction failed',
        details: errorOutput 
      });
    }

    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (e) {
      console.error('JSON parse error:', e);
      res.status(500).json({ error: 'Failed to parse model output' });
    }
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

/**
 * Check if model file exists
 */
app.get('/api/model-status', (req, res) => {
  const modelPath = path.join(__dirname, 'model.pkl');
  const exists = fs.existsSync(modelPath);
  
  res.json({
    modelReady: exists,
    message: exists 
      ? 'Model loaded and ready for predictions'
      : 'Model file not found. Download model.pkl from Colab and place in project root.'
  });
});

app.listen(PORT, () => {
  console.log(`Model prediction server running on http://localhost:${PORT}`);
});
