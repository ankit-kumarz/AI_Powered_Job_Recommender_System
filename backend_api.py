from flask import Flask, request, jsonify
from flask_cors import CORS
from src.helper import extract_text_from_pdf, ask_openai
from src.job_api import fetch_linkedin_jobs, fetch_naukri_jobs
import io

app = Flask(__name__)
CORS(app)

@app.route('/api/upload_resume', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['resume']
    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    resume_text = extract_text_from_pdf(file)
    return jsonify({'resume_text': resume_text})

@app.route('/api/analyze_resume', methods=['POST'])
def analyze_resume():
    data = request.get_json()
    resume_text = data.get('resume_text')
    if not resume_text:
        return jsonify({'error': 'No resume text provided'}), 400
    summary = ask_openai(f"Summarize this resume highlighting the skills, edcucation, and experience: \n\n{resume_text}", max_tokens=500)
    gaps = ask_openai(f"Analyze this resume and highlight missing skills, certifications, and experiences needed for better job opportunities: \n\n{resume_text}", max_tokens=400)
    roadmap = ask_openai(f"Based on this resume, suggest a future roadmap to improve this person's career prospects (Skill to learn, certification needed, industry exposure): \n\n{resume_text}", max_tokens=400)
    return jsonify({'summary': summary, 'gaps': gaps, 'roadmap': roadmap})

@app.route('/api/job_keywords', methods=['POST'])
def job_keywords():
    data = request.get_json()
    summary = data.get('summary')
    if not summary:
        return jsonify({'error': 'No summary provided'}), 400
    keywords = ask_openai(
        f"Based on this resume summary, suggest the best job titles and keywords for searching jobs. Give a comma-separated list only, no explanation.\n\nSummary: {summary}",
        max_tokens=100
    )
    return jsonify({'keywords': keywords.replace('\n', '').strip()})

@app.route('/api/job_recommendations', methods=['POST'])
def job_recommendations():
    data = request.get_json()
    keywords = data.get('keywords')
    if not keywords:
        return jsonify({'error': 'No keywords provided'}), 400
    linkedin_jobs = fetch_linkedin_jobs(keywords, rows=60)
    naukri_jobs = fetch_naukri_jobs(keywords, rows=60)
    return jsonify({'linkedin_jobs': linkedin_jobs, 'naukri_jobs': naukri_jobs})

if __name__ == '__main__':
    app.run(debug=True) 