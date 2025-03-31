import flask
import joblib
import numpy as np
import pandas as pd
import os
import warnings

# Suppress specific warnings if needed
warnings.filterwarnings('ignore', category=UserWarning)
warnings.filterwarnings('ignore', category=FutureWarning)

# --- Configuration ---
# Directory where models are saved
# For local execution, assuming models are in the same directory as the script:
MODEL_DIR = '.'
# For Kaggle Notebook execution (after running training script):
# MODEL_DIR = '/kaggle/working/'

SCALER_LOAD_PATH = os.path.join(MODEL_DIR, 'segmentation_scaler.joblib')
KMEANS_LOAD_PATH = os.path.join(MODEL_DIR, 'segmentation_kmeans_model.joblib')
DBSCAN_LOAD_PATH = os.path.join(MODEL_DIR, 'segmentation_dbscan_model.joblib')

# Features expected in the input data (MUST match training script)
CLUSTER_FEATURES = [
    'income_annum',
    'loan_amount',
    'residential_assets_value',
    'commercial_assets_value',
    'luxury_assets_value',
    'bank_asset_value'
]

# --- Initialize Flask App ---
app = flask.Flask(__name__)

# --- Load Models ONCE at Startup ---
scaler = None
kmeans_model = None
dbscan_model = None

print("--- Loading Models ---")
try:
    if os.path.exists(SCALER_LOAD_PATH):
        scaler = joblib.load(SCALER_LOAD_PATH)
        print("Scaler loaded successfully.")
    else:
        print(f"ERROR: Scaler file not found at {SCALER_LOAD_PATH}")
        # Optionally exit if scaler is critical: exit()

    if os.path.exists(KMEANS_LOAD_PATH):
        kmeans_model = joblib.load(KMEANS_LOAD_PATH)
        print("K-Means model loaded successfully.")
    else:
        print(f"WARNING: K-Means model file not found at {KMEANS_LOAD_PATH}")

    if os.path.exists(DBSCAN_LOAD_PATH):
        dbscan_model = joblib.load(DBSCAN_LOAD_PATH)
        print("DBSCAN model loaded successfully.")
    else:
        print(f"WARNING: DBSCAN model file not found at {DBSCAN_LOAD_PATH}")

except Exception as e:
    print(f"ERROR loading models: {e}")
    # Depending on severity, you might want the app to exit
    # exit()

print("--- Model Loading Complete ---")


# --- Optional: Define Segment Names (Customize!) ---
#     (Copy these from your analysis of the training output)
kmeans_segment_names = {
    0: "Low Value",    # Example Name
    1: "Mid Income/Loan", # Example Name
    2: "High Asset",    # Example Name
    3: "High Income",   # Example Name
    # Add mappings based on your actual K-Means cluster count/meaning
}
dbscan_segment_names = {
    -1: "Noise/Outlier",
    0: "Dense Core 1", # Example Name
    1: "Dense Core 2", # Example Name
    # Add mappings based on your actual DBSCAN cluster count/meaning
}


# --- API Endpoint for Prediction ---
@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives user input data in JSON format, preprocesses it,
    predicts segments using loaded models, and returns results.
    """
    # Ensure models loaded correctly
    if scaler is None:
        return flask.jsonify({"error": "Scaler model not loaded. Cannot predict."}), 500

    # Get input data from the request body
    try:
        input_data = flask.request.get_json()
        if input_data is None:
             return flask.jsonify({"error": "Request must contain JSON data."}), 400
    except Exception as e:
        return flask.jsonify({"error": f"Failed to parse JSON data: {str(e)}"}), 400


    # --- Input Validation ---
    if not isinstance(input_data, dict):
         return flask.jsonify({"error": "JSON data must be an object/dictionary."}), 400

    missing_features = [f for f in CLUSTER_FEATURES if f not in input_data]
    if missing_features:
        return flask.jsonify({"error": f"Missing required features: {missing_features}"}), 400

    # Convert input features to a DataFrame row (required by scaler)
    try:
        # Create a dictionary ensuring correct feature order
        ordered_input = {feature: [input_data[feature]] for feature in CLUSTER_FEATURES}
        df_input = pd.DataFrame.from_dict(ordered_input)
        # Check if all values are numeric
        if not df_input.apply(lambda s: pd.to_numeric(s, errors='coerce').notnull().all()).all():
             return flask.jsonify({"error": "All feature values must be numeric."}), 400
        df_input = df_input.astype(float) # Ensure float type
    except Exception as e:
        return flask.jsonify({"error": f"Error processing input features: {str(e)}"}), 400

    # --- Preprocessing ---
    try:
        # 1. Clean asset values (clip negatives)
        asset_columns = [col for col in CLUSTER_FEATURES if 'assets' in col]
        for col in asset_columns:
            df_input[col] = df_input[col].clip(lower=0)

        # 2. Scale using the loaded scaler
        X_scaled = scaler.transform(df_input)

    except Exception as e:
        print(f"ERROR during preprocessing: {e}") # Log server-side
        return flask.jsonify({"error": "Failed to preprocess input data."}), 500

    # --- Prediction ---
    results = {"input_data": input_data} # Include input for reference

    # K-Means Prediction
    if kmeans_model:
        try:
            kmeans_pred = kmeans_model.predict(X_scaled)
            kmeans_label = int(kmeans_pred[0]) # Get the single prediction label
            results['kmeans_segment_pred'] = kmeans_label
            results['kmeans_segment_name'] = kmeans_segment_names.get(kmeans_label, f"Unknown KMeans ({kmeans_label})")
        except Exception as e:
            print(f"ERROR during K-Means prediction: {e}")
            results['kmeans_prediction_error'] = str(e)
    else:
        results['kmeans_segment_pred'] = None
        results['kmeans_segment_name'] = "Model not loaded"

    # DBSCAN Prediction
    # IMPORTANT CAVEAT: DBSCAN's `predict` is not standard. `fit_predict` on a
    # single point doesn't really assign it to existing training clusters based
    # on density in the same way K-Means does. It mostly checks if the point
    # itself is dense (usually not) or near *itself* (always true).
    # This will likely classify single points as noise (-1) unless eps is large
    # or min_samples=1. For a more robust assignment, complex neighbor-finding
    # against the original training data might be needed, which is beyond this scope.
    if dbscan_model:
        try:
            # Using fit_predict here, acknowledging the caveat above.
            dbscan_pred = dbscan_model.fit_predict(X_scaled)
            dbscan_label = int(dbscan_pred[0])
            results['dbscan_segment_pred'] = dbscan_label
            results['dbscan_segment_name'] = dbscan_segment_names.get(dbscan_label, f"Unknown DBSCAN ({dbscan_label})")
        except Exception as e:
            print(f"ERROR during DBSCAN prediction: {e}")
            results['dbscan_prediction_error'] = str(e)
    else:
        results['dbscan_segment_pred'] = None
        results['dbscan_segment_name'] = "Model not loaded"

    # Return the results as JSON
    return flask.jsonify(results), 200


# --- Run the Flask App ---
if __name__ == '__main__':
    new_port = 5001 # Or 8000, 8080, etc.
    print(f"--- Starting Flask App on http://0.0.0.0:{new_port} ---")
    # Set host='0.0.0.0' to make it accessible on your network
    # Use debug=True for development (auto-reloads, detailed errors)
    # **IMPORTANT:** Set debug=False for any kind of production use!
    app.run(host='0.0.0.0', port=new_port, debug=True)