import pandas as pd
import joblib
import json
import sys
import os

def predict_crop_yield(year, rainfall, pesticides, avg_temp, area, item):
    """
    Load the trained Random Forest model and make predictions.
    
    Args:
        year: int - Year (e.g., 2024)
        rainfall: float - Annual rainfall in mm
        pesticides: float - Pesticide use in tonnes
        avg_temp: float - Average temperature in celsius
        area: str - Area/Country name
        item: str - Crop item name
    
    Returns:
        dict - Prediction result with prediction, confidence, and reasoning
    """
    try:
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'model.pkl')
        
        # Try to load the trained model
        if not os.path.exists(model_path):
            return {
                "error": f"Model file not found at {model_path}. Please place model.pkl in the project root directory.",
                "model_type": "Random Forest (Trained Model)"
            }
        
        model = joblib.load(model_path)
        
        # Create feature dataframe matching the training format
        # The model expects: Year, Annual Rainfall, Pesticide Use, Avg Temperature, Area_encoded, Item_encoded
        
        # Create input dataframe with same structure as training data
        input_data = pd.DataFrame({
            'Year': [year],
            'Annual Rainfall': [rainfall],
            'Pesticide Use': [pesticides],
            'Avg Temperature': [avg_temp],
            'Area': [area],
            'Item': [item]
        })
        
        # Get feature names from model
        feature_names = model.feature_names_in_ if hasattr(model, 'feature_names_in_') else None
        
        # If model expects one-hot encoded features, apply get_dummies
        if feature_names is not None and any('_' in fname for fname in feature_names):
            # Model expects one-hot encoded input
            dummy_columns = [col for col in feature_names if col not in ['Year', 'Annual Rainfall', 'Pesticide Use', 'Avg Temperature']]
            
            # Get dummies for categorical columns
            input_encoded = pd.get_dummies(input_data, columns=['Area', 'Item'], drop_first=True)
            
            # Reindex to match training features
            input_encoded = input_encoded.reindex(columns=feature_names, fill_value=0)
        else:
            # If model can handle raw data
            input_encoded = input_data
        
        # Make prediction
        prediction = float(model.predict(input_encoded)[0])
        
        # Calculate confidence based on the model's actual R² score
        # From your Colab training: Random Forest R² = 0.7411 (74.11%)
        # This represents the model's explained variance
        base_confidence = 0.7411
        
        # Adjust confidence based on input feature reasonableness
        # Check if inputs are within typical ranges from training data
        confidence_adjustments = []
        
        # Rainfall adjustment: typical range 327-3000 mm
        if 200 < rainfall < 3500:
            confidence_adjustments.append(0.02)  # Boost within common range
        elif rainfall < 200 or rainfall > 3500:
            confidence_adjustments.append(-0.05)  # Penalize unusual values
            
        # Pesticide adjustment: typical range 10000-30000 tonnes
        if 5000 < pesticides < 40000:
            confidence_adjustments.append(0.02)
        elif pesticides < 5000 or pesticides > 40000:
            confidence_adjustments.append(-0.05)
            
        # Temperature adjustment: typical range 18-28°C
        if 15 < avg_temp < 32:
            confidence_adjustments.append(0.02)
        else:
            confidence_adjustments.append(-0.05)
        
        # Calculate final confidence (bounded between 0 and 1)
        confidence = base_confidence + sum(confidence_adjustments)
        confidence = max(0.5, min(1.0, confidence))  # Keep between 50% and 100%
        
        # Create reasoning based on input features
        rainfall_status = "adequate" if rainfall > 800 else "low" if rainfall < 500 else "moderate"
        pesticide_status = "high" if pesticides > 20000 else "low" if pesticides < 10000 else "moderate"
        
        reasoning = f"{item} yield prediction for {area} in {year} with {rainfall_status} rainfall ({rainfall}mm) and {pesticide_status} pesticide use."
        
        return {
            "prediction": round(prediction),
            "reasoning": reasoning,
            "confidence": confidence,
            "model_type": "Random Forest (Trained Model)"
        }
    
    except FileNotFoundError:
        return {
            "error": "Model file not found. Please download model.pkl from Colab and place it in the project root.",
            "model_type": "Random Forest (Trained Model)"
        }
    except Exception as e:
        return {
            "error": f"Prediction error: {str(e)}",
            "model_type": "Random Forest (Trained Model)"
        }

if __name__ == "__main__":
    # Read input from CLI arguments
    if len(sys.argv) > 6:
        year = int(sys.argv[1])
        rainfall = float(sys.argv[2])
        pesticides = float(sys.argv[3])
        avg_temp = float(sys.argv[4])
        area = sys.argv[5]
        item = sys.argv[6]
        
        result = predict_crop_yield(year, rainfall, pesticides, avg_temp, area, item)
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "Invalid arguments"}))
