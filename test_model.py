import joblib
import pandas as pd
import os

# Mapping from app input names to actual training data names (same as predict_model.py)
AREA_MAPPING = {
    'Afghanistan': 'Afghanistan',
    'Brazil': 'Brazil',
    'Somalia': 'Somalia',
    'Uganda': 'Uganda',
    'Philippines': 'Philippines',
    'Lebanon': 'Lebanon',
    'India': 'India',
    'USA': 'United States of America',
    'China': 'China, mainland',
    'France': 'France'
}

ITEM_MAPPING = {
    'Maize': 'Maize',
    'Potatoes': 'Potatoes',
    'Wheat': 'Wheat',
    'Rice': 'Rice, paddy',
    'Yams': 'Yams',
    'Cassava': 'Cassava',
    'Soybeans': 'Soybeans',
    'Sorghum': 'Sorghum'
}

try:
    # Check if model exists
    model_path = 'model.pkl'
    if not os.path.exists(model_path):
        print(f"❌ Model file not found at {model_path}")
        exit(1)
    
    print(f"✓ Model file found: {model_path}")
    
    # Load model
    model = joblib.load(model_path)
    print(f"✓ Model loaded successfully")
    print(f"  Model type: {type(model).__name__}")
    
    # Check feature names
    if hasattr(model, 'feature_names_in_'):
        print(f"✓ Feature names loaded ({len(model.feature_names_in_)} features)")
    else:
        print("⚠ Model doesn't have feature_names_in_")
    
    # Test with different inputs
    print("\n--- Testing Predictions ---")
    
    test_cases = [
        {'Year': 2024, 'Annual Rainfall': 1200, 'Pesticide Use': 25000, 'Avg Temperature': 22, 'Area': 'Brazil', 'Item': 'Maize'},
        {'Year': 2024, 'Annual Rainfall': 500, 'Pesticide Use': 10000, 'Avg Temperature': 20, 'Area': 'India', 'Item': 'Rice'},
        {'Year': 2024, 'Annual Rainfall': 2000, 'Pesticide Use': 30000, 'Avg Temperature': 25, 'Area': 'USA', 'Item': 'Wheat'},
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test_case}")
        
        # Map to actual training names
        mapped_case = test_case.copy()
        mapped_case['Area'] = AREA_MAPPING.get(test_case['Area'], test_case['Area'])
        mapped_case['Item'] = ITEM_MAPPING.get(test_case['Item'], test_case['Item'])
        
        input_df = pd.DataFrame([mapped_case])
        
        # Apply same preprocessing as production code
        if hasattr(model, 'feature_names_in_'):
            feature_names = model.feature_names_in_
            if any('_' in fname for fname in feature_names):
                # One-hot encoding needed - DON'T use drop_first=True!
                input_encoded = pd.get_dummies(input_df, columns=['Area', 'Item'], drop_first=False)
                input_encoded = input_encoded.reindex(columns=feature_names, fill_value=0)
            else:
                input_encoded = input_df
        else:
            input_encoded = input_df
        
        prediction = model.predict(input_encoded)[0]
        print(f"  Prediction: {prediction:.0f} hg/ha")
    
    print("\n✓ Model is working correctly!")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
