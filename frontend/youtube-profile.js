const youtubeContent = [
    {
        id: "resolvit-ai",
        title: "Resolvit AI – Turning Community Chaos into Smart Actions",
        type: "video",
        category: "AI / Project Demo",
        duration: "9:04",
        views: "1.2k",
        published: "May 2024",
        description: "A deep dive into the Resolvit AI civic intelligence platform, transforming community data into actionable workflows.",
        youtube_url: "https://youtu.be/FzD2xQicnLU?si=hnCVHIl0AZUZxol9",
        embed_url: "https://www.youtube.com/embed/FzD2xQicnLU",
        featured: true
    },
    {
        id: "blue-piano",
        title: "Blue 💙 Piano Cover | Feel This… 🎹✨",
        type: "short",
        category: "Music",
        duration: "0:59",
        views: "850",
        published: "Recent",
        description: "An emotional piano cover of 'Blue', exploring melodic depth and resonance.",
        youtube_url: "https://youtube.com/shorts/d17Yaw4Kr1U?si=nTK8MxJMRyBcJ-r0",
        embed_url: "https://www.youtube.com/embed/d17Yaw4Kr1U",
        featured: false
    },
    {
        id: "golden-hour",
        title: "GOLDEN HOURS ✨ FT: JVKE | Piano Covered",
        type: "short",
        category: "Music",
        duration: "1:00",
        views: "920",
        published: "Recent",
        description: "Cinematic piano rendition of Golden Hours by JVKE.",
        youtube_url: "https://youtube.com/shorts/Nce-ZdcN3Kc?si=9brfIobY7KC5FQtj",
        embed_url: "https://www.youtube.com/embed/Nce-ZdcN3Kc",
        featured: false
    },
    {
        id: "carols-bells",
        title: "Carols Of The Bells ✨✨ | Piano Cover",
        type: "short",
        category: "Music",
        duration: "0:55",
        views: "1.1k",
        published: "Recent",
        description: "Powerful and atmospheric cover of the classic Carol of the Bells.",
        youtube_url: "https://youtube.com/shorts/zFoOCxgZng0?si=udeP4Le-pdKpSWgR",
        embed_url: "https://www.youtube.com/embed/zFoOCxgZng0",
        featured: false
    },
    {
        id: "interstellar",
        title: "Cornfield Chase – Interstellar Piano Cover 🌌🎹",
        type: "short",
        category: "Music",
        duration: "1:00",
        views: "2.4k",
        published: "Popular",
        description: "Emotional tribute to Hans Zimmer's Interstellar masterpiece.",
        youtube_url: "https://youtube.com/shorts/0B9Ni7Oluaw?si=Ydlqh9ax8W2Peoyw",
        embed_url: "https://www.youtube.com/embed/0B9Ni7Oluaw",
        featured: false
    }
];

function renderMedia(filter = 'all') {
    const grid = document.getElementById('video-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = filter === 'all' 
        ? youtubeContent 
        : youtubeContent.filter(item => item.type === filter);

    filtered.forEach((item, index) => {
        const card = document.createElement('div');
        
        if (item.type === 'short') {
            card.className = 'short-card glass-panel rounded-3xl border border-white/10 overflow-hidden group reveal';
            card.style.transitionDelay = `${index * 50}ms`;
            card.innerHTML = `
                <div class="relative h-full">
                    <iframe class="w-full h-full border-0" src="${item.embed_url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                        <span class="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2 block">Piano Short</span>
                        <h3 class="text-white font-bold text-sm leading-tight mb-2">${item.title}</h3>
                        <div class="flex items-center gap-3 text-[10px] text-slate-500">
                            <span>${item.views} Views</span>
                            <span>${item.published}</span>
                        </div>
                    </div>
                    <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href="${item.youtube_url}" target="_blank" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white" title="Watch on YouTube">
                            <i data-lucide="youtube" class="w-4 h-4"></i>
                        </a>
                        <a href="${item.youtube_url}" target="_blank" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white" title="Open in New Tab">
                            <i data-lucide="external-link" class="w-4 h-4"></i>
                        </a>
                    </div>
                </div>
            `;
        } else {
            card.className = 'glass-panel rounded-3xl border border-white/10 overflow-hidden group reveal';
            card.style.transitionDelay = `${index * 50}ms`;
            card.innerHTML = `
                <div class="video-container">
                    <iframe src="${item.embed_url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <span class="text-[9px] font-bold text-amber-500 border border-amber-500/20 px-2 py-1 rounded bg-amber-500/5 uppercase tracking-widest">${item.category}</span>
                        <span class="text-[10px] text-slate-500 font-mono">${item.duration}</span>
                    </div>
                    <h3 class="text-white font-bold text-lg mb-3 group-hover:text-amber-500 transition-colors">${item.title}</h3>
                    <p class="text-slate-400 text-xs leading-relaxed mb-6 font-light">
                        ${item.description}
                    </p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3 text-[10px] text-slate-500">
                            <span>${item.views} Views</span>
                            <span class="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span>${item.published}</span>
                        </div>
                        <div class="flex gap-2">
                            <a href="${item.youtube_url}" target="_blank" class="btn-glass text-[10px] py-1.5 px-3">Watch on YouTube</a>
                            <a href="${item.youtube_url}" target="_blank" class="w-8 h-8 rounded-full glass-panel border border-white/10 flex items-center justify-center text-white">
                                <i data-lucide="external-link" class="w-3 h-3"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
        
        grid.appendChild(card);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Animate reveals
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    renderMedia();

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderMedia(tab.dataset.tab);
        });
    });
});
