# Quick Setup Guide - Your Model is Ready! 🚀

Since you've already uploaded **model.pkl**, follow these simple steps:

## Step 1: Install Python Dependencies (One-time)

Open a **PowerShell terminal** and run:

```powershell
pip install scikit-learn pandas joblib
```

This installs the required Python packages for the trained model.

## Step 2: Start the Backend Server

In a **PowerShell terminal**, run:

```powershell
npm run server
```

You should see:

```
Model prediction server running on http://localhost:3001
```

✓ Keep this terminal open!

## Step 3: Start the Frontend (Different Terminal)

Open a **new PowerShell terminal** in the same directory and run:

```powershell
npm run dev
```

You should see:

```
  VITE v6.2.0  ready in 234 ms

  ➜  Local:   http://localhost:3000
```

✓ Keep this terminal open too!

## Step 4: Use Your Model in the App

1. Open your browser and go to: **http://localhost:3000**
2. Go to the **Predictor** tab
3. Look for the **"ML Model"** toggle button (should now be enabled)
4. Click it to switch from Gemini AI to your trained model
5. Enter agricultural parameters and click **"Calculate Prediction"**

You should see your trained model making predictions! 🎉

---

## Verification Checklist

✓ Terminal 1: `npm run server` → Shows "running on http://localhost:3001"
✓ Terminal 2: `npm run dev` → Shows "VITE ready on http://localhost:3000"
✓ Browser: http://localhost:3000 works
✓ "ML Model" button is **enabled** (not grayed out)
✓ Predictions show **purple** result cards (not green)

---

## If Something Goes Wrong

### Issue: "ML Model" button still says "(N/A)"

- ✓ Make sure `model.pkl` is in folder: `f:\ML assignment\project\`
- ✓ Stop and restart `npm run server` (close terminal, open new one)
- ✓ Refresh the browser (Ctrl+R or Cmd+R)

### Issue: Terminal shows error when running `npm run server`

```
Error: Cannot find module 'express'
```

→ Run this first: `npm install`

### Issue: "Python not found" error

```
Error: spawn python ENOENT
```

→ Try: `python --version` in PowerShell
→ If that doesn't work, Python isn't installed or not in PATH

### Issue: "joblib not found" error

→ Run: `pip install scikit-learn pandas joblib`

---

## Terminal Layout (Recommended)

```
TERMINAL 1                          TERMINAL 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
npm run server                      npm run dev

Model running on                    VITE ready on
http://localhost:3001              http://localhost:3000

[Keep open]                         [Keep open]
```

Then open **http://localhost:3000** in your browser!

---

## That's It!

Your trained Random Forest model from Colab is now integrated and ready to make predictions!

The app will now let you:

- Compare **Gemini AI** predictions (fast, general)
- Compare **Your Trained Model** predictions (accurate, based on your data)

Switch between them and see which works better for your use case!

---

**Need help?** Check the detailed guide: `TRAINED_MODEL_SETUP.md`
