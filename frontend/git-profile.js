const repositories = [
    {
        name: "AQUQ-SENTINEL",
        language: "Python",
        description: "Environmental and risk intelligence system with robust monitoring foundations and Python backend architecture.",
        status: "Updated 16 hours ago",
        category: "featured",
        tags: ["Risk Analysis", "Python"]
    },
    {
        name: "SYNAPTIX_2026_404-FOUND_TEAM",
        language: "HTML",
        description: "Hackathon project repository driving rapid innovation and product-based technical solutions.",
        status: "Updated 4 days ago",
        category: "other",
        tags: ["Innovation", "Frontend"]
    },
    {
        name: "Echoes-of-an-Unsaid-Goodbye",
        language: "HTML",
        description: "Creative literary web experience exploring memory, resonance, and cinematic storytelling.",
        status: "Updated last week",
        category: "web",
        tags: ["Creative", "Identity"]
    },
    {
        name: "Resolvit-Care-AI-Powered-Smart-Resource-Allocation-Platform",
        language: "Python",
        description: "Social intelligence platform optimizing resource allocation for NGOs and crisis response using AI workflows.",
        status: "Updated 3 weeks ago",
        category: "featured",
        tags: ["Social Impact", "AI"]
    },
    {
        name: "TRIMISTER-2-PROJECT-IIT-PATNA-ML-PROJECT",
        language: "Jupyter Notebook",
        description: "Academic machine learning research project focused on applied AI experimentation and model validation.",
        status: "Updated last month",
        category: "featured",
        tags: ["Research", "ML"]
    },
    {
        name: "PORTFOLIO-LIKITH",
        language: "HTML",
        description: "Primary codebase for Likith's digital identity, premium UI systems, and personal branding portal.",
        status: "Updated Mar 19",
        category: "web",
        tags: ["Brand", "UI/UX"]
    },
    {
        name: "STUDENT-BENCH-AI",
        language: "JavaScript",
        description: "Smart classroom intelligence system designed to enhance education through offline AI integration.",
        status: "Updated Mar 18",
        category: "featured",
        tags: ["Education", "AI"]
    },
    {
        name: "HEALTH_APP",
        language: "Dart",
        description: "Health-focused application architecture exploring mobile workflows and user-centric data systems.",
        status: "Updated Mar 3",
        category: "other",
        tags: ["Mobile", "Health"]
    },
    {
        name: "ML-RISK-CREDIT_SCORE",
        language: "Python",
        description: "Machine learning model for risk analysis and credit score prediction utilizing advanced analytics.",
        status: "Updated Feb 17",
        category: "ai-ml",
        tags: ["FinTech", "ML"]
    },
    {
        name: "Prometheus-Core",
        language: "Python",
        description: "The neural intelligence and backend engine for the Prometheus AI ecosystem.",
        status: "Updated Feb 8",
        category: "featured",
        tags: ["Core AI", "Backend"]
    },
    {
        name: "Prometheus-UI",
        language: "TypeScript",
        description: "Advanced frontend layer for the Prometheus system, featuring structured interaction design.",
        status: "Updated Feb 7",
        category: "featured",
        tags: ["UI/UX", "Frontend"]
    },
    {
        name: "llms-app",
        language: "Python",
        description: "Experimental LLM integration project exploring modern AI orchestration and model workflows.",
        status: "Updated Jan 31",
        category: "ai-ml",
        tags: ["LLM", "Orchestration"]
    },
    {
        name: "SAKRA-VISION",
        language: "CSS",
        description: "Visual identity and design system project for the SAKRA VISION brand ecosystem.",
        status: "Updated Jan 30",
        category: "web",
        tags: ["Design", "Vision"]
    },
    {
        name: "personal-db",
        language: "JavaScript",
        description: "Structured project for managing personal data and logic through web-based interface experiments.",
        status: "Updated Jan 29",
        category: "other",
        tags: ["Data", "Systems"]
    },
    {
        name: "portfolio-backend",
        language: "HTML",
        description: "Backend infrastructure and supporting web services for the portfolio ecosystem.",
        status: "Updated Jan 29",
        category: "web",
        tags: ["Systems", "Infrastructure"]
    },
    {
        name: "ALL-RAG-AND-NEURAL-NETWORK-AND-LLL-WORKSHOP",
        language: "Jupyter Notebook",
        description: "Comprehensive workshop archive for RAG systems, neural networks, and LLM implementation.",
        status: "Updated Jan 22",
        category: "ai-ml",
        tags: ["RAG", "Deep Learning"]
    },
    {
        name: "mysql_project",
        language: "HTML",
        description: "Database integration showcase demonstrating MySQL workflows within web-based environments.",
        status: "Updated Jan 7",
        category: "other",
        tags: ["Database", "SQL"]
    },
    {
        name: "prometheus-training",
        language: "Python",
        description: "Dedicated training and experimentation modules for fine-tuning the Prometheus AI models.",
        status: "Updated Jan 5",
        category: "ai-ml",
        tags: ["Training", "AI"]
    },
    {
        name: "COLLEGE-WEB-LIKITH",
        language: "CSS",
        description: "Academic-themed web project showcasing structured design and frontend hierarchies.",
        status: "Updated Jan 5",
        category: "other",
        tags: ["Academic", "Frontend"]
    },
    {
        name: "RESUME_WEB",
        language: "HTML",
        description: "Professional resume portal featuring Java, Python, and Full-stack project showcases.",
        status: "Updated Jan 3",
        category: "web",
        tags: ["Professional", "Resume"]
    },
    {
        name: "MY-PIC-GALLERY",
        language: "N/A",
        description: "Personal media gallery project exploring web-based asset management and viewing.",
        status: "Updated Jan 3",
        category: "other",
        tags: ["Gallery", "Media"]
    },
    {
        name: "ml-ops-demo",
        language: "Python",
        description: "Demonstration repository for MLOps concepts, lifecycle management, and model deployment.",
        status: "Updated Dec 27, 2025",
        category: "ai-ml",
        tags: ["MLOps", "Automation"]
    }
];

function renderRepos(filter = 'all') {
    const grid = document.getElementById('repo-grid');
    grid.innerHTML = '';

    const filteredRepos = filter === 'all' 
        ? repositories 
        : repositories.filter(repo => repo.category === filter);

    filteredRepos.forEach((repo, index) => {
        const card = document.createElement('div');
        card.className = 'repo-card glass-panel p-8 rounded-3xl border border-white/10 flex flex-col h-full group reveal';
        card.style.transitionDelay = `${index * 50}ms`;

        const tagsHtml = repo.tags.map(tag => `
            <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500 uppercase tracking-widest">${tag}</span>
        `).join('');

        card.innerHTML = `
            <div class="flex justify-between items-start mb-6">
                <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-amber-500/50 transition-colors">
                    <i data-lucide="${repo.language === 'Python' || repo.language === 'Jupyter Notebook' ? 'brain' : 'code'}" class="w-5 h-5"></i>
                </div>
                ${repo.category === 'featured' ? '<span class="text-[9px] font-bold text-amber-500 border border-amber-500/20 px-2 py-1 rounded bg-amber-500/5 uppercase tracking-widest">Featured</span>' : ''}
            </div>
            
            <h3 class="text-xl font-display font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">${repo.name}</h3>
            
            <p class="text-slate-400 text-sm font-light leading-relaxed mb-6 flex-grow">
                ${repo.description}
            </p>

            <div class="flex flex-wrap gap-2 mb-6">
                ${tagsHtml}
            </div>

            <div class="pt-6 border-t border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full ${repo.language === 'Python' ? 'bg-blue-400' : repo.language === 'HTML' ? 'bg-red-400' : 'bg-amber-400'}"></span>
                    <span class="text-xs text-slate-500 font-mono">${repo.language}</span>
                </div>
                <a href="https://github.com/LIKITH-3012-MAC/${repo.name}" target="_blank" class="text-white hover:text-amber-400 transition-colors">
                    <i data-lucide="external-link" class="w-4 h-4"></i>
                </a>
            </div>
        `;
        
        grid.appendChild(card);
    });

    lucide.createIcons();
    
    // Add active class animation for reveal
    setTimeout(() => {
        document.querySelectorAll('.repo-card').forEach(card => card.classList.add('active'));
    }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    renderRepos();

    const buttons = document.querySelectorAll('.btn-filter');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderRepos(btn.dataset.filter);
        });
    });
});
