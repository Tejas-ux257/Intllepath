from pathlib import Path
import joblib
from sklearn.ensemble import RandomForestClassifier

MODEL_PATH = Path(__file__).with_name("career_model.joblib")

X = [
    [9, 8, 5, 9, 5],
    [8, 9, 5, 8, 5],
    [8, 8, 4, 9, 4],
    [4, 5, 7, 5, 10],
    [5, 7, 9, 5, 6],
    [7, 9, 5, 8, 4],
    [6, 6, 9, 4, 6],
    [5, 4, 6, 5, 9],
    [8, 7, 4, 10, 4],
    [6, 8, 8, 5, 5],
]

y = [
    "software-engineer",
    "data-scientist",
    "cybersecurity-analyst",
    "ui-ux-designer",
    "business-analyst",
    "data-scientist",
    "business-analyst",
    "ui-ux-designer",
    "software-engineer",
    "business-analyst",
]


def train():
    model = RandomForestClassifier(n_estimators=80, random_state=42)
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    return MODEL_PATH


if __name__ == "__main__":
    print(f"Saved model to {train()}")
