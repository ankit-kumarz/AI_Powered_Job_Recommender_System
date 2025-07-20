# 🚀 AI Powered Job Recommender System

A modern, AI-powered web application that analyzes your resume and recommends personalized jobs from LinkedIn and Naukri.com. Featuring a beautiful gradient UI, glassmorphism effects, and seamless user experience.

---

## ✨ Features
- **AI Resume Analysis:** Extracts, summarizes, and analyzes your resume using OpenAI GPT models.
- **Skill Gap Detection:** Identifies missing skills, certifications, and experiences.
- **Personalized Roadmap:** Suggests a tailored career improvement plan.
- **Job Recommendations:** Fetches top jobs from LinkedIn and Naukri.com based on your profile.
- **Modern UI:** Stunning animated gradient background, glassmorphism cards, and responsive design.

---

## 🖼️ Screenshots
> _Add your screenshots here!_

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS (Poppins, Font Awesome, gradients, glassmorphism), JavaScript
- **Backend:** Python, Flask, flask-cors
- **AI:** OpenAI GPT (via API)
- **PDF Parsing:** PyPDF2 or similar

---

## ⚡ Setup Instructions

### 1. **Clone the Repository**
```sh
git clone https://github.com/ankit-kumarz/AI_Powered_Job_Recommender_System.git
cd AI_Powered_Job_Recommender_System_main
```

### 2. **Install Backend Dependencies**
```sh
pip install -r requirements.txt
```

### 3. **Set Up OpenAI API Key**
- Open `src/helper.py` and set your OpenAI API key, or set the `OPENAI_API_KEY` environment variable.

### 4. **Run the Backend (Flask API)**
```sh
python backend_api.py
```
- The backend runs at `http://127.0.0.1:5000`

### 5. **Run the Frontend (Static Server)**
```sh
cd frontend
python -m http.server 8000
```
- The frontend runs at `http://localhost:8000`

---

## ⚙️ Environment Variables
- `OPENAI_API_KEY` (or hardcoded in `src/helper.py`)

---

## 🚦 Usage
1. Open [http://localhost:8000](http://localhost:8000) in your browser.
2. Upload your resume (PDF).
3. View AI-generated summary, skill gaps, and roadmap.
4. Click "Get Job Recommendations" to see jobs from LinkedIn and Naukri.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)
