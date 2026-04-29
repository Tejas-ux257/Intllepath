# Intellipath

Intellipath is an intelligent career path recommendation system built from the project report requirements. It includes:

- React Native Expo mobile frontend
- Node.js and Express REST backend
- MongoDB-ready data models with in-memory fallback for demos
- JWT authentication
- Aptitude test scoring
- Career, course, college, and scholarship recommendations
- Python Flask ML prediction service
- Chatbot endpoint with OpenAI/Gemini-ready fallback
- Gamification progress with points and badges

## Run

```bash
npm run install:all
npm run ml
npm run backend
npm run mobile
```

Copy `backend/.env.example` to `backend/.env` if you want to configure MongoDB, API keys, or a custom ML service URL.

The backend works without MongoDB by using an in-memory demo store. The chatbot works without external API keys by using a local guidance response.
