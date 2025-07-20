const BACKEND_URL = 'http://127.0.0.1:5000';

document.addEventListener('DOMContentLoaded', function() {
    const resumeForm = document.getElementById('resumeForm');
    const resumeInput = document.getElementById('resumeInput');
    const loading = document.getElementById('loading');
    const summarySection = document.getElementById('summarySection');
    const gapsSection = document.getElementById('gapsSection');
    const roadmapSection = document.getElementById('roadmapSection');
    const summaryDiv = document.getElementById('summary');
    const gapsDiv = document.getElementById('gaps');
    const roadmapDiv = document.getElementById('roadmap');
    const getJobsBtn = document.getElementById('getJobsBtn');
    const jobsSection = document.getElementById('jobsSection');
    const linkedinJobsDiv = document.getElementById('linkedinJobs');
    const naukriJobsDiv = document.getElementById('naukriJobs');

    let resumeText = '';
    let summary = '';
    let keywords = '';

    resumeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!resumeInput.files.length) return;
        loading.classList.remove('hidden');
        summarySection.classList.add('hidden');
        gapsSection.classList.add('hidden');
        roadmapSection.classList.add('hidden');
        getJobsBtn.classList.add('hidden');
        jobsSection.classList.add('hidden');
        linkedinJobsDiv.innerHTML = '';
        naukriJobsDiv.innerHTML = '';

        // 1. Upload resume and extract text
        const formData = new FormData();
        formData.append('resume', resumeInput.files[0]);
        try {
            const uploadRes = await fetch(`${BACKEND_URL}/api/upload_resume`, {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');
            resumeText = uploadData.resume_text;
        } catch (err) {
            loading.classList.add('hidden');
            alert('Error uploading resume: ' + err.message);
            return;
        }

        // 2. Analyze resume
        try {
            const analyzeRes = await fetch(`${BACKEND_URL}/api/analyze_resume`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resume_text: resumeText })
            });
            const analyzeData = await analyzeRes.json();
            if (!analyzeRes.ok) throw new Error(analyzeData.error || 'Analysis failed');
            summary = analyzeData.summary;
            summaryDiv.innerHTML = summary;
            gapsDiv.innerHTML = analyzeData.gaps;
            roadmapDiv.innerHTML = analyzeData.roadmap;
            summarySection.classList.remove('hidden');
            gapsSection.classList.remove('hidden');
            roadmapSection.classList.remove('hidden');
            getJobsBtn.classList.remove('hidden');
        } catch (err) {
            loading.classList.add('hidden');
            alert('Error analyzing resume: ' + err.message);
            return;
        }
        loading.classList.add('hidden');
    });

    getJobsBtn.addEventListener('click', async function() {
        getJobsBtn.disabled = true;
        loading.classList.remove('hidden');
        jobsSection.classList.add('hidden');
        linkedinJobsDiv.innerHTML = '';
        naukriJobsDiv.innerHTML = '';
        // 3. Get job keywords
        try {
            const keywordsRes = await fetch(`${BACKEND_URL}/api/job_keywords`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ summary })
            });
            const keywordsData = await keywordsRes.json();
            if (!keywordsRes.ok) throw new Error(keywordsData.error || 'Keyword extraction failed');
            keywords = keywordsData.keywords;
        } catch (err) {
            loading.classList.add('hidden');
            getJobsBtn.disabled = false;
            alert('Error extracting job keywords: ' + err.message);
            return;
        }
        // 4. Fetch job recommendations
        try {
            const jobsRes = await fetch(`${BACKEND_URL}/api/job_recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords })
            });
            const jobsData = await jobsRes.json();
            if (!jobsRes.ok) throw new Error(jobsData.error || 'Job fetch failed');
            // LinkedIn jobs
            if (jobsData.linkedin_jobs && jobsData.linkedin_jobs.length) {
                jobsData.linkedin_jobs.forEach(job => {
                    const jobDiv = document.createElement('div');
                    jobDiv.className = 'job-card';
                    jobDiv.innerHTML = `<strong>${job.title}</strong> at <em>${job.companyName}</em><br>📍 ${job.location}<br><a href="${job.link}" target="_blank">View Job</a>`;
                    linkedinJobsDiv.appendChild(jobDiv);
                });
            } else {
                linkedinJobsDiv.innerHTML = '<em>No LinkedIn jobs found.</em>';
            }
            // Naukri jobs
            if (jobsData.naukri_jobs && jobsData.naukri_jobs.length) {
                jobsData.naukri_jobs.forEach(job => {
                    const jobDiv = document.createElement('div');
                    jobDiv.className = 'job-card';
                    jobDiv.innerHTML = `<strong>${job.title}</strong> at <em>${job.companyName}</em><br>📍 ${job.location}<br><a href="${job.url}" target="_blank">View Job</a>`;
                    naukriJobsDiv.appendChild(jobDiv);
                });
            } else {
                naukriJobsDiv.innerHTML = '<em>No Naukri jobs found.</em>';
            }
            jobsSection.classList.remove('hidden');
        } catch (err) {
            alert('Error fetching jobs: ' + err.message);
        }
        loading.classList.add('hidden');
        getJobsBtn.disabled = false;
    });
}); 