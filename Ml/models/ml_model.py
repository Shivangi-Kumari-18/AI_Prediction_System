import pandas as pd
import joblib
import lime.lime_tabular
import json

# Load model and explainer once
model = joblib.load("ml_model_best.pkl")

# Load feature order
with open("model_features.json", "r") as f:
    MODEL_FEATURES = json.load(f)
feature_names = model.named_steps["preprocessor"].get_feature_names_out().tolist()

# Transform training data if needed for explainer
# Assume this is precomputed and saved for efficiency
X_train = pd.read_csv("X_train.csv")  # Or save/load the transformed version
X_train = X_train.reindex(columns=MODEL_FEATURES, fill_value=0)
X_train_preprocessed = model.named_steps["preprocessor"].transform(X_train)  # X_train is your training DataFrame used in ml_pipeline.py

# X_train_preprocessed = model.named_steps["preprocessor"].transform(X_train)

explainer = lime.lime_tabular.LimeTabularExplainer(
    training_data=X_train_preprocessed,
    feature_names=feature_names,
    class_names=['Not Dropout', 'Dropout'],
    mode='classification'
)

def predict_probability(sample_df):
    """Return dropout probability for the given sample."""
    try:
        sample_df = sample_df.reindex(columns=MODEL_FEATURES, fill_value=0)
        prob = float(model.predict_proba(sample_df)[0, 1]) * 100
        return {"dropout_probability": round(prob, 2)}
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

def predict_with_explanation(sample_df, num_features=5):
    """Return prediction and explanation for the given sample."""
    try:
        sample_df = sample_df.reindex(columns=MODEL_FEATURES, fill_value=0)
        prob = float(model.predict_proba(sample_df)[0, 1]) * 100
        label = int(model.predict(sample_df)[0])

        transformed_row = model.named_steps["preprocessor"].transform(sample_df)

        exp = explainer.explain_instance(
            transformed_row[0],
            model.predict_proba,
            num_features=num_features
        )

        return {
            "prediction": label,
            "dropout_probability": round(prob, 2),
            "explanations": [
                {"feature": f, "weight": round(float(w), 3)}
                for f, w in exp.as_list()
            ]
        }
    except Exception as e:
        return {"error": f"Prediction with explanation failed: {str(e)}"}

def batch_predict_probabilities(X_df):
    """Return dropout probabilities for each row in X_df."""
    try:
        X_df = X_df.reindex(columns=MODEL_FEATURES, fill_value=0)
        y_prob = model.predict_proba(X_df)[:, 1]
        results = []
        for i in range(len(X_df)):
            results.append({
                "student_index": int(i),
                "dropout_probability": round(float(y_prob[i]) * 100, 2)
            })
        return results
    except Exception as e:
        return [{"error": f"Batch prediction failed: {str(e)}"}]
