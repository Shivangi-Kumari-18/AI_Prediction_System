# ml_service/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import joblib
import pandas as pd
import os
import lime
import lime.lime_tabular


# -------------------- FastAPI App --------------------
app = FastAPI()

# CORS settings (allow frontend dev access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Load Model Pipeline --------------------
PIPELINE_PATH = os.getenv("PIPELINE_PATH", "models\\ml_model_best.pkl")

if not os.path.exists(PIPELINE_PATH):
    raise FileNotFoundError(f"Pipeline file not found: {PIPELINE_PATH}")

pipeline = joblib.load(PIPELINE_PATH)

# Extract feature names from training data
FEATURE_ORDER = pipeline.named_steps["preprocessor"].feature_names_in_.tolist()

# Identify categorical and numeric columns
categorical_cols = [col for col in pipeline.named_steps["preprocessor"].feature_names_in_ 
                    if str(pipeline.named_steps["preprocessor"].transformers_[0][2]).find(col) != -1]
numeric_cols = [col for col in FEATURE_ORDER if col not in categorical_cols]

# LIME explainer (for optional explanations)
# X_train_preprocessed = pipeline.named_steps["preprocessor"].transform(
#     pd.DataFrame(columns=FEATURE_ORDER)
# )
# explainer = lime.lime_tabular.LimeTabularExplainer(
#     training_data=X_train_preprocessed,
#     feature_names=pipeline.named_steps["preprocessor"].get_feature_names_out().tolist(),
#     class_names=['Not Dropout', 'Dropout'],
#     mode='classification'
# )

# -------------------- Request/Response Models --------------------
class PredictRequest(BaseModel):
    records: List[Dict[str, Any]]
    explain: Optional[bool] = False

class PredictResponse(BaseModel):
    results: List[Dict[str, Any]]

# -------------------- Helper Functions --------------------
def preprocess_input(df: pd.DataFrame):
    """Ensure dataframe has all columns and correct types"""
    # Add missing columns
    for col in FEATURE_ORDER:
        if col not in df.columns:
            df[col] = 0  # default for numeric/categorical

    # Reorder columns
    df = df[FEATURE_ORDER]

    # Convert types
    for col in categorical_cols:
        df[col] = df[col].astype(str)
    for col in numeric_cols:
        # df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        df.loc[:, col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

    
    return df

def predict_probability_only(df: pd.DataFrame):
    """Return dropout probabilities using pipeline"""
    probs = pipeline.predict_proba(df)[:, 1]
    return [round(float(p)*100, 2) for p in probs]

def predict_with_explanations(df: pd.DataFrame, explainer,num_features=5):
    """Return LIME explanations for each row"""
    results = []
    transformed_data = pipeline.named_steps["preprocessor"].transform(df)
    for i in range(len(df)):
        exp = explainer.explain_instance(
            transformed_data[i],
            lambda x: pipeline.named_steps["model"].predict_proba(x),
            num_features=num_features
        )
        results.append([
            {"feature": f, "weight": round(float(w), 3)} for f, w in exp.as_list()
        ])
    return results











# -------------------- Prediction Endpoint --------------------
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    explanations = []
    if not req.records:
        raise HTTPException(status_code=400, detail="No records sent")
    
    df = pd.DataFrame(req.records)

    # Keep student ids if provided
    student_ids = df["Student ID"] if "Student ID" in df.columns else [None]*len(df)
    
    # Preprocess input
    df_prepared = preprocess_input(df)

    # Predict probabilities
    probs = predict_probability_only(df_prepared)
    preds = pipeline.predict(df_prepared)

    # Optionally compute LIME explanations
    # explanations = predict_with_explanations(df_prepared) if req.explain else [None]*len(df)
    # --- SAFE LIME EXPLANATIONS ---
    if req.explain:
        X_train_preprocessed = joblib.load("models/models/X_train_preprocessed.pkl")
        feature_names = pipeline.named_steps["preprocessor"].get_feature_names_out().tolist()

        explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data=X_train_preprocessed,
            feature_names=feature_names,
            class_names=['Not Dropout', 'Dropout'],
            mode='classification'
        )
        transformed_input = pipeline.named_steps["preprocessor"].transform(df_prepared)
        for i in range(len(df_prepared)):
            exp = explainer.explain_instance(
                transformed_input[i],
                lambda x: pipeline.named_steps["model"].predict_proba(x),
                num_features=5
            )
            explanations.append([
                {"feature": f, "weight": round(float(w),3)}
                for f,w in exp.as_list()
            ])
        # explanations = predict_with_explanations(df_prepared,explainer)
    else:
        explanations = [None] * len(df_prepared)


    # Build response
    results = []
    for i in range(len(df_prepared)):
        results.append({
    
            # "Student ID": int(student_ids[i]) if student_ids[i] is not None else None,
            "Student ID": str(student_ids[i]) if student_ids[i] is not None else None,
            "prediction": int(preds[i]),
            "dropout_probability": probs[i],
            "explanations": explanations[i]
        })
    
    return {"results": results}























































































