# Using the Trained ML Model for Predictions

This guide explains how to set up and use your trained Random Forest model from Colab for predictions in the CropYield AI application.

## Step 1: Download the Trained Model

1. Open your Colab notebook: https://colab.research.google.com/drive/1N3cAZrVsAglGMbcDrUEUAn2QrKdM1Z5Q
2. Run the cell that saves the model:
   ```python
   import joblib
   joblib.dump(rf_model, "model.pkl")
   ```
3. Download `model.pkl` from Colab:
   - Click the Files icon (📁) in the left sidebar
   - Right-click `model.pkl` and select "Download"

## Step 2: Place Model in Project

1. Place the downloaded `model.pkl` file in the **project root directory**:
   ```
   f:\ML assignment\project\
   ├── model.pkl          ← Place it here
   ├── src/
   ├── package.json
   └── ...
   ```

## Step 3: Install Dependencies

Make sure all Python packages are installed (required by the backend):

```bash
pip install scikit-learn pandas joblib
```

## Step 4: Start the Backend Server

In a **separate terminal**, run:

```bash
npm run server
```

This will start the backend server on `http://localhost:3001` which loads and uses your trained model for predictions.

Expected output:

```
Model prediction server running on http://localhost:3001
```

## Step 5: Use the Trained Model in the App

1. Start your frontend in another terminal:

   ```bash
   npm run dev
   ```

2. Open the app and go to the **Predictor** tab

3. Click on the **"ML Model"** button to switch to your trained model

4. Enter agricultural parameters and click **"Calculate Prediction"**

The app will now use your Random Forest model instead of Gemini AI for predictions!

## Testing the Model

You can test if the model is properly connected by checking:

1. **Browser Console**: Should not show connection errors
2. **Backend Terminal**: Should log incoming prediction requests
3. **Model Results**: Should match the accuracy metrics from your Colab notebook (R² = 74.11%)

## How It Works

```
┌─ Frontend (React App) ─────┐
│   User inputs parameters   │
│   Clicks "Calculate"       │
└────────────┬────────────────┘
             │
             ↓
┌─ Backend Server (Node.js) ─┐
│   Receives prediction req   │
│   Calls Python script       │
└────────────┬────────────────┘
             │
             ↓
┌─ Python Script ────────────┐
│   Loads model.pkl          │
│   Prepares input features  │
│   Gets prediction from RF  │
│   Returns JSON result      │
└────────────┬────────────────┘
             │
             ↓
┌─ Frontend Display ─────────┐
│   Shows prediction value   │
│   Displays confidence %    │
│   Shows reasoning text     │
└────────────────────────────┘
```

## Troubleshooting

### Issue: "ML Model (N/A)" button appears disabled

**Solution**:

- Check that `model.pkl` is in the project root
- Verify the backend server is running (`npm run server`)
- Check backend console for errors

### Issue: "Backend server not running" error

**Solution**:

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run dev
```

Keep both terminals open!

### Issue: "Python not found" error

**Solution**:

- Ensure Python 3.8+ is installed
- Install required packages: `pip install scikit-learn pandas joblib`
- Or use: `python -m pip install scikit-learn pandas joblib`

### Issue: Model predictions seem incorrect

**Solution**:

- Verify the training data hasn't changed
- Check that the same preprocessing (one-hot encoding) is applied
- Compare with your Colab notebook's test results

## Model Performance Reference

From your Colab training:

- **Algorithm**: Random Forest Regressor
- **Parameters**: n_estimators=50, max_depth=10
- **R² Score**: 0.7411 (74.11% accuracy)
- **MSE**: 1.349 × 10⁹
- **MAPE**: ~2.5% average error
- **Features**: Year, Annual Rainfall, Pesticide Use, Temperature, Area, Item

## API Endpoint Reference

If you want to call the backend directly:

```bash
# Check backend health
curl http://localhost:3001/api/health

# Check model status
curl http://localhost:3001/api/model-status

# Make a prediction
curl -X POST http://localhost:3001/api/predict-model \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2024,
    "rainfall": 1200,
    "pesticides": 25000,
    "avgTemp": 22,
    "area": "Brazil",
    "item": "Maize"
  }'
```

## Questions?

Refer to your Colab notebook for:

- Training data format
- Feature preprocessing details
- Model evaluation metrics
- Feature importance rankings
