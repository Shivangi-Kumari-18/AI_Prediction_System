# ----------------- train_save.py -----------------
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE
from scipy.stats import randint
import joblib
import lime
import lime.lime_tabular

# ----------------- 1. Load Data -----------------
df = pd.read_csv("students_dropout_academic_success (1).csv")
df = df.dropna()

# Encode target: Dropout = 1, Enrolled/Graduate = 0
target_map = {"Dropout": 1, "Enrolled": 0, "Graduate": 0}
df["target"] = df["target"].map(target_map)

# Identify categorical/numeric columns
categorical_cols = [col for col in df.columns if df[col].dtype == "object" and col != "target"]
numeric_cols = [col for col in df.columns if col not in categorical_cols + ["target"]]

# Fill missing values
for col in numeric_cols:
    df[col] = df[col].fillna(df[col].median())
for col in categorical_cols:
    df[col] = df[col].fillna(df[col].mode()[0])

print(f"Dataset shape after cleaning: {df.shape}")
print(f"Target distribution: {df['target'].value_counts().to_dict()}")

# ----------------- 2. Target & Features -----------------
y = df["target"]
X = df.drop(["target"], axis=1)

# ----------------- 3. Train/Test Split -----------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
# ----------------- Save Training Data -----------------
import pandas as pd
X_train.to_csv("X_train.csv", index=False)
print("✅ X_train.csv saved successfully with shape:", X_train.shape)
# ----------------- 4. Preprocessing + Pipeline -----------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
        ("num", "passthrough", numeric_cols),
    ]
)

pipeline = ImbPipeline(steps=[
    ("preprocessor", preprocessor),
    ("smote", SMOTE(random_state=42)),
    ("model", RandomForestClassifier(
        n_estimators=500,
        random_state=42,
        class_weight="balanced"
    ))
])

# ----------------- 5. Fit Pipeline -----------------
pipeline.fit(X_train, y_train)

# ----------------- 6. Evaluate -----------------
y_pred = pipeline.predict(X_test)
y_prob = pipeline.predict_proba(X_test)[:, 1]

print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.3f}")
print("Classification Report:\n", classification_report(y_test, y_pred))

# ----------------- 7. Hyperparameter Tuning (RandomizedSearchCV) -----------------
param_dist = {
    "model__n_estimators": randint(200, 1000),
    "model__max_depth": randint(5, 50),
    "model__min_samples_split": randint(2, 20),
    "model__min_samples_leaf": randint(1, 10),
    "model__max_features": ["sqrt", "log2", None]
}

random_search = RandomizedSearchCV(
    estimator=pipeline,
    param_distributions=param_dist,
    n_iter=20,
    scoring="roc_auc",
    cv=3,
    verbose=2,
    random_state=42,
    n_jobs=-1
)

random_search.fit(X_train, y_train)
print("Best Hyperparameters:", random_search.best_params_)

best_model = random_search.best_estimator_

# ----------------- 8. Evaluate Best Model -----------------
y_pred = best_model.predict(X_test)
y_prob = best_model.predict_proba(X_test)[:, 1]

print(f"Accuracy (best): {accuracy_score(y_test, y_pred):.3f}")
print(f"ROC-AUC (best): {roc_auc_score(y_test, y_prob):.3f}")
print("Classification Report (best):\n", classification_report(y_test, y_pred))

# ----------------- 9. Save Pipeline -----------------
joblib.dump(best_model, "ml_model_best.pkl")

# ----------------- 9b. Save Feature Order -----------------
import json
MODEL_FEATURES = X.columns.tolist()
with open("model_features.json", "w") as f:
    json.dump(MODEL_FEATURES, f)

# ----------------- 10. LIME Explainer -----------------
feature_names = best_model.named_steps["preprocessor"].get_feature_names_out().tolist()


import os

if not os.path.exists("models"):
    os.makedirs("models")

# Save preprocessed training data
X_train_preprocessed = pipeline.named_steps["preprocessor"].transform(X_train)
joblib.dump(X_train_preprocessed, "models/models/X_train_preprocessed.pkl")
print("✅ X_train_preprocessed.pkl saved successfully")




explainer = lime.lime_tabular.LimeTabularExplainer(
    training_data=X_train_preprocessed,
    feature_names=feature_names,
    class_names=['Not Dropout', 'Dropout'],
    mode='classification'
)
# ----------------- 7. Model Features -----------------
# MODEL_FEATURES = X.columns.tolist()  # ensures all columns exist

# ----------------- 8. Helper Functions -----------------
def predict_probability_only(model, sample_df):
    prob = float(model.predict_proba(sample_df)[0, 1]) * 100
    return {"dropout_probability": round(prob, 2)}

def predict_with_explanation_raw(model, explainer, sample_df, model_features, num_features=5):
    """
    Predict probability + LIME explanation on raw new student data.
    """
    # Ensure all columns exist
    for col in model_features:
        if col not in sample_df.columns:
            sample_df[col] = 0  # default for missing numeric/categorical

    # Reorder columns
    sample_df = sample_df[model_features]

    # Predict probability and label
    prob = float(model.predict_proba(sample_df)[0, 1]) * 100
    label = int(model.predict(sample_df)[0])

    # Preprocess for LIME
    transformed_row = model.named_steps["preprocessor"].transform(sample_df)

    exp = explainer.explain_instance(
        transformed_row[0],
        lambda x: model.named_steps["model"].predict_proba(x),
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
def batch_predict_with_explanations_raw(model, explainer, X_df, model_features, num_features=5):
    """
    Batch version: probability + LIME explanation on raw new student data.
    """
    # Ensure all columns exist
    for col in model_features:
        if col not in X_df.columns:
            X_df[col] = 0

    # Reorder columns
    X_df = X_df[model_features]

    y_prob = model.predict_proba(X_df)[:, 1]
    results = []
    transformed_data = model.named_steps["preprocessor"].transform(X_df)

    for i in range(len(X_df)):
        exp = explainer.explain_instance(
            transformed_data[i],
            lambda x: model.named_steps["model"].predict_proba(x),
            num_features=num_features
        )
        results.append({
            "student_index": int(i),
            "dropout_probability": round(float(y_prob[i]) * 100, 2),
            "explanations": [
                {"feature": f, "weight": round(float(w), 3)}
                for f, w in exp.as_list()
            ]
        })
    return results




































# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
# from sklearn.ensemble import RandomForestClassifier
# from imblearn.over_sampling import SMOTE
# import joblib
# import json

# # Explainability
# import lime
# import lime.lime_tabular

# from sklearn.compose import ColumnTransformer
# from sklearn.preprocessing import OneHotEncoder
# from sklearn.pipeline import Pipeline

# # ----------------- 1. Load Data -----------------
# df = pd.read_csv("students_dropout_academic_success (1).csv")
# df = df.dropna()

# # Encode target into binary: Dropout = 1, Enrolled/Graduate = 0
# target_map = {"Dropout": 1, "Enrolled": 0, "Graduate": 0}
# df["target"] = df["target"].map(target_map)

# # Target and features
# y = df["target"]
# X = df.drop(["target"], axis=1)

# # Identify categorical/numeric columns
# categorical_cols = [col for col in X.columns if X[col].dtype == "object"]
# numeric_cols = [col for col in X.columns if col not in categorical_cols]

# # ----------------- 2. Preprocessing + Model -----------------
# preprocessor = ColumnTransformer(
#     transformers=[
#         ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
#         ("num", "passthrough", numeric_cols),
#     ]
# )

# pipeline = Pipeline(steps=[
#     ("preprocessor", preprocessor),
#     ("model", RandomForestClassifier(
#         n_estimators=500,
#         random_state=42,
#         class_weight="balanced"
#     ))
# ])

# # ----------------- 3. Train/Test Split -----------------
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42, stratify=y
# )

# # ----------------- 4. Balance Data with SMOTE -----------------
# smote = SMOTE(random_state=42)
# X_train_preprocessed = preprocessor.fit_transform(X_train)
# X_train_bal, y_train_bal = smote.fit_resample(X_train_preprocessed, y_train)

# # Fit model directly on resampled preprocessed data
# pipeline.named_steps["model"].fit(X_train_bal, y_train_bal)

# # ----------------- 5. Save Full Pipeline -----------------
# joblib.dump(pipeline, "ml_model.pkl")
# loaded_model = joblib.load("ml_model.pkl")

# # ----------------- 6. LIME Explainer -----------------
# feature_names = preprocessor.get_feature_names_out().tolist()

# explainer = lime.lime_tabular.LimeTabularExplainer(
#     training_data=X_train_bal,
#     feature_names=feature_names,
#     class_names=['Not Dropout', 'Dropout'],
#     mode='classification'
# )

# # ----------------- 7. Model Features -----------------
# MODEL_FEATURES = X.columns.tolist()  # ensures all columns exist

# # ----------------- 8. Helper Functions -----------------
# def predict_probability_only(model, sample_df):
#     prob = float(model.predict_proba(sample_df)[0, 1]) * 100
#     return {"dropout_probability": round(prob, 2)}

# def predict_with_explanation_raw(model, explainer, sample_df, model_features, num_features=5):
#     """
#     Predict probability + LIME explanation on raw new student data.
#     """
#     # Ensure all columns exist
#     for col in model_features:
#         if col not in sample_df.columns:
#             sample_df[col] = 0  # default for missing numeric/categorical

#     # Reorder columns
#     sample_df = sample_df[model_features]

#     # Predict probability and label
#     prob = float(model.predict_proba(sample_df)[0, 1]) * 100
#     label = int(model.predict(sample_df)[0])

#     # Preprocess for LIME
#     transformed_row = model.named_steps["preprocessor"].transform(sample_df)

#     exp = explainer.explain_instance(
#         transformed_row[0],
#         lambda x: model.named_steps["model"].predict_proba(x),
#         num_features=num_features
#     )

#     return {
#         "prediction": label,
#         "dropout_probability": round(prob, 2),
#         "explanations": [
#             {"feature": f, "weight": round(float(w), 3)}
#             for f, w in exp.as_list()
#         ]
#     }

# def batch_predict_with_explanations_raw(model, explainer, X_df, model_features, num_features=5):
#     """
#     Batch version: probability + LIME explanation on raw new student data.
#     """
#     # Ensure all columns exist
#     for col in model_features:
#         if col not in X_df.columns:
#             X_df[col] = 0

#     # Reorder columns
#     X_df = X_df[model_features]

#     y_prob = model.predict_proba(X_df)[:, 1]
#     results = []
#     transformed_data = model.named_steps["preprocessor"].transform(X_df)

#     for i in range(len(X_df)):
#         exp = explainer.explain_instance(
#             transformed_data[i],
#             lambda x: model.named_steps["model"].predict_proba(x),
#             num_features=num_features
#         )
#         results.append({
#             "student_index": int(i),
#             "dropout_probability": round(float(y_prob[i]) * 100, 2),
#             "explanations": [
#                 {"feature": f, "weight": round(float(w), 3)}
#                 for f, w in exp.as_list()
#             ]
#         })
#     return results





# import pandas as pd
# import numpy as np

# # ML imports
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, roc_auc_score, f1_score, roc_curve, auc, precision_recall_curve
# from sklearn.ensemble import RandomForestClassifier
# from imblearn.over_sampling import SMOTE

# # Visualization
# import matplotlib.pyplot as plt

# # Explainability
# import lime
# import lime.lime_tabular
# import eli5
# from eli5.sklearn import PermutationImportance

# # Model persistence
# import joblib
# import json  # 👈 for safe JSON dumps if needed

# # 1. Load and preprocess data
# df = pd.read_csv("students_dropout_academic_success (1).csv")
# df = df.dropna()
# df = pd.get_dummies(df, drop_first=True)

# # 2. Prepare features and target
# y = df["target_Enrolled"]
# X = df.drop(["target_Enrolled", "target_Graduate"], axis=1)

# # 3. Train/test split
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# # 4. Balance training data with SMOTE
# smote = SMOTE(random_state=42)
# X_train_bal, y_train_bal = smote.fit_resample(X_train, y_train)

# # 5. Train Random Forest model
# model = RandomForestClassifier(
#     n_estimators=500,
#     random_state=42,
#     class_weight='balanced'
# )
# model.fit(X_train_bal, y_train_bal)

# # 6. Predict dropout probability
# y_prob = model.predict_proba(X_test)[:, 1]

# # 7. Threshold tuning for best F1-score
# thresholds = np.arange(0.0, 1.0, 0.01)
# f1_scores = []
# for t in thresholds:
#     y_pred = (y_prob > t).astype(int)
#     f1_scores.append(f1_score(y_test, y_pred))
# best_threshold = thresholds[np.argmax(f1_scores)]
# best_f1 = max(f1_scores)
# print(f"Best Threshold: {best_threshold:.2f}")
# print(f"Best F1-score: {best_f1:.4f}")

# # 8. Final evaluation
# y_pred = (y_prob > best_threshold).astype(int)
# print("Accuracy:", accuracy_score(y_test, y_pred))
# print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
# print("\nClassification Report:\n", classification_report(y_test, y_pred))

# # 9. ROC and Precision-Recall curves (optional display)
# fpr, tpr, _ = roc_curve(y_test, y_prob)
# roc_auc = auc(fpr, tpr)
# precision, recall, _ = precision_recall_curve(y_test, y_prob)

# # 10. Feature importance (Permutation Importance)
# perm = PermutationImportance(model, scoring='f1', random_state=42).fit(X_test, y_test)
# eli5.show_weights(perm, feature_names=X_test.columns.tolist())

# # 11. LIME explainability
# explainer = lime.lime_tabular.LimeTabularExplainer(
#     training_data=X_train_bal.values,
#     feature_names=X.columns.tolist(),
#     class_names=['Not Dropout', 'Dropout'],
#     mode='classification'
# )

# # -------- JSON-FRIENDLY HELPERS -------- #

# def predict_with_explanation_json(model, explainer, sample, feature_names):
#     """Return JSON-safe dict for one student"""
#     prob = float(model.predict_proba(sample.reshape(1, -1))[0, 1]) * 100
#     label = int(model.predict(sample.reshape(1, -1))[0])
    
#     exp = explainer.explain_instance(sample, model.predict_proba, num_features=5)
    
#     return {
#         "prediction": label,
#         "dropout_probability": round(prob, 2),
#         "explanations": [
#             {"feature": f, "weight": round(float(w), 3)}
#             for f, w in exp.as_list()
#         ]
#     }

# def batch_predict_with_explanations_json(model, explainer, X):
#     """Return JSON-safe list for multiple students"""
#     results = []
#     y_prob = model.predict_proba(X)[:, 1]

#     for i in range(len(X)):
#         exp = explainer.explain_instance(X.values[i], model.predict_proba, num_features=5)
#         results.append({
#             "student_index": int(i),
#             "dropout_probability": round(float(y_prob[i]) * 100, 2),
#             "explanations": [
#                 {"feature": f, "weight": round(float(w), 3)}
#                 for f, w in exp.as_list()
#             ]
#         })
#     return results

# # -------- Example usage -------- #

# # Save model
# joblib.dump(model, "rf_enrollment_model.pkl")
# loaded_model = joblib.load("rf_enrollment_model.pkl")

# # Single student JSON
# sample_result = predict_with_explanation_json(
#     loaded_model, explainer, X_test.iloc[0].values, X.columns.tolist()
# )
# print(json.dumps(sample_result, indent=2))  # 👈 clean JSON print

# # Batch student JSON
# batch_result = batch_predict_with_explanations_json(
#     loaded_model, explainer, X_test.head(3)
# )
# print(json.dumps(batch_result, indent=2))  