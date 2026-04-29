from pathlib import Path
import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS

try:
    from train_model import train
except ImportError:
    from .train_model import train

MODEL_PATH = Path(__file__).with_name("career_model.joblib")
CAREERS = [
    "software-engineer",
    "data-scientist",
    "cybersecurity-analyst",
    "ui-ux-designer",
    "business-analyst",
]

app = Flask(__name__)
CORS(app)


def load_model():
    if not MODEL_PATH.exists():
        train()
    return joblib.load(MODEL_PATH)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "intellipath-ml"})


@app.post("/predict")
def predict():
    payload = request.get_json(force=True) or {}
    scores = payload.get("scores", {})
    vector = [[
        float(scores.get("logical", 0)),
        float(scores.get("analytical", 0)),
        float(scores.get("verbal", 0)),
        float(scores.get("technical", 0)),
        float(scores.get("creative", 0)),
    ]]

    model = load_model()
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(vector)[0]
        ranked = sorted(zip(model.classes_, probabilities), key=lambda item: item[1], reverse=True)
        recommendations = [{"id": career_id, "confidence": round(float(score), 3)} for career_id, score in ranked[:3]]
    else:
        recommendations = [{"id": model.predict(vector)[0], "confidence": 1.0}]

    return jsonify({"recommendations": recommendations})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)
