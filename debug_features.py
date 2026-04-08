import joblib
import pandas as pd
import os

# Mapping from app input names to actual training data names
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
    model = joblib.load('model.pkl')
    feature_names = list(model.feature_names_in_)
    
    print("="*80)
    print("Sample Area features from model:")
    area_features = [f for f in feature_names if f.startswith('Area_')][:5]
    print(area_features)
    
    print("\nSample Item features from model:")
    item_features = [f for f in feature_names if f.startswith('Item_')]
    print(item_features)
    
    print("\n" + "="*80)
    print("Testing Feature Encoding:")
    
    # Test case 1
    test_data = {
        'Year': [2024],
        'Annual Rainfall': [1200],
        'Pesticide Use': [25000],
        'Avg Temperature': [22],
        'Area': [AREA_MAPPING['Brazil']],  # 'Brazil'
        'Item': [ITEM_MAPPING['Maize']]  # 'Maize'
    }
    
    df = pd.DataFrame(test_data)
    print(f"\nOriginal dataframe:\n{df}")
    
    # One-hot encode WITHOUT drop_first (that was causing the issue!)
    encoded = pd.get_dummies(df, columns=['Area', 'Item'], drop_first=False)
    print(f"\nEncoded columns: {list(encoded.columns)}")
    
    # Reindex
    reindexed = encoded.reindex(columns=feature_names, fill_value=0)
    print(f"\nReindexed shape: {reindexed.shape}")
    print(f"Reindexed non-zero columns: {[col for col in reindexed.columns if reindexed[col].iloc[0] != 0]}")
    
    # Test prediction
    pred = model.predict(reindexed)
    print(f"\nPrediction: {pred[0]:.0f}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
