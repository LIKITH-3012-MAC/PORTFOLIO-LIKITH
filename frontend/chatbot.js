document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const chatArea = document.getElementById('ai-chat-area');
    const panel = document.getElementById('ai-agent-panel');
    const launcher = document.getElementById('ai-agent-launcher');
    const closeBtn = document.getElementById('ai-agent-close');
    const quickBtns = document.querySelectorAll('.ai-quick-btn');

    let chatHistory = [];

    // Toggle Panel
    launcher.addEventListener('click', () => {
        panel.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
        panel.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        launcher.classList.add('opacity-0', 'pointer-events-none');
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
        panel.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        launcher.classList.remove('opacity-0', 'pointer-events-none');
    });

    const addMessage = (role, text, cardType = 'none') => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex gap-3 max-w-[85%] ${role === 'user' ? 'ml-auto flex-row-reverse' : ''} reveal active`;
        
        const icon = role === 'user' ? 'user' : 'cpu';
        const iconColor = role === 'user' ? 'text-blue-400' : 'text-amber-400';
        const bgColor = role === 'user' ? 'bg-blue-500/10' : 'bg-white/5';
        const borderColor = role === 'user' ? 'border-blue-500/20' : 'border-white/10';

        let cardHtml = '';
        if (cardType !== 'none') {
            cardHtml = `<div class="mt-4 pt-4 border-t border-white/5">${renderCard(cardType)}</div>`;
        }

        msgDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full ${bgColor} flex items-center justify-center shrink-0 border ${borderColor}">
                <i data-lucide="${icon}" class="w-4 h-4 ${iconColor}"></i>
            </div>
            <div class="${bgColor} border ${borderColor} rounded-2xl p-3 text-sm text-slate-300 max-w-full overflow-hidden break-words">
                <div class="prose prose-invert prose-sm break-words max-w-full">
                    ${text}
                </div>
                ${cardHtml}
            </div>
        `;

        chatArea.appendChild(msgDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
        if (window.lucide) lucide.createIcons();
    };

    const renderCard = (type) => {
        const config = window.APP_CONFIG;
        const nav = window.Navigation || { buildUrl: (p, pr) => { 
            const s = new URLSearchParams(pr).toString();
            return `${p}${s ? '?' + s : ''}`;
        }};

        switch(type) {
            case 'contact':
            case 'social':
            case 'collab':
                return `
                    <div class="space-y-3">
                        <a href="mailto:${config.CONTACT.PRIMARY_EMAIL}" class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                            <div class="flex items-center gap-3">
                                <i data-lucide="mail" class="w-4 h-4 text-amber-500"></i>
                                <span class="text-[10px] text-slate-300">Email Likith</span>
                            </div>
                            <i data-lucide="chevron-right" class="w-3 h-3 text-slate-600 group-hover:translate-x-1 transition-transform"></i>
                        </a>
                        <a href="tel:${config.CONTACT.PHONE}" class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                            <div class="flex items-center gap-3">
                                <i data-lucide="phone" class="w-4 h-4 text-blue-500"></i>
                                <span class="text-[10px] text-slate-300">Call Likith</span>
                            </div>
                            <i data-lucide="chevron-right" class="w-3 h-3 text-slate-600 group-hover:translate-x-1 transition-transform"></i>
                        </a>
                        <div class="grid grid-cols-4 gap-2">
                            <a href="${config.CONTACT.GITHUB}" target="_blank" class="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"><i data-lucide="github" class="w-4 h-4 text-white"></i></a>
                            <a href="${config.CONTACT.LINKEDIN}" target="_blank" class="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"><i data-lucide="linkedin" class="w-4 h-4 text-blue-400"></i></a>
                            <a href="${config.CONTACT.X}" target="_blank" class="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"><i data-lucide="twitter" class="w-4 h-4 text-slate-400"></i></a>
                            <a href="${config.CONTACT.INSTAGRAM}" target="_blank" class="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"><i data-lucide="instagram" class="w-4 h-4 text-pink-400"></i></a>
                        </div>
                        <a href="${nav.buildUrl('collab.html', { source: 'agent' })}" class="w-full btn-premium py-2 text-[10px] flex items-center justify-center gap-2">
                            <span>Open Collab Portal</span>
                            <i data-lucide="zap" class="w-3 h-3"></i>
                        </a>
                    </div>
                `;
            case 'git':
                return `
                    <div class="space-y-3">
                        <p class="text-[10px] text-slate-400 leading-relaxed">Explore Likith's curated showcase of 22+ public repositories and AI systems.</p>
                        <a href="${nav.buildUrl('likith-git-profile.html', { source: 'agent' })}" class="w-full btn-glass py-2 text-[10px] flex items-center justify-center gap-2">
                            <span>Open Engineering Archive</span>
                            <i data-lucide="github" class="w-3 h-3"></i>
                        </a>
                    </div>
                `;
            case 'youtube':
                return `
                    <div class="space-y-3">
                        <p class="text-[10px] text-slate-400 leading-relaxed">Watch Likith's project deep dives and cinematic piano performances.</p>
                        <a href="${nav.buildUrl('likith-youtube.html', { source: 'agent' })}" class="w-full btn-glass py-2 text-[10px] flex items-center justify-center gap-2">
                            <span>Open Media Hub</span>
                            <i data-lucide="play" class="w-3 h-3"></i>
                        </a>
                    </div>
                `;
            case 'error':
                return `
                    <div class="space-y-3">
                        <div class="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-center mb-4">
                            <i data-lucide="alert-triangle" class="w-6 h-6 text-red-400 mx-auto mb-2 animate-pulse"></i>
                            <p class="text-[10px] text-slate-400 leading-relaxed">The connection to my neural backend was interrupted.</p>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <a href="${nav.buildUrl('problem.html', { result: 'error', type: 'chatbot', source: 'agent' })}" class="w-full py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-[10px] text-slate-300">
                                <i data-lucide="life-buoy" class="w-3 h-3"></i> Support
                            </a>
                            <button onclick="document.getElementById('ai-chat-input').focus()" class="w-full py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-[10px] text-slate-300">
                                <i data-lucide="refresh-cw" class="w-3 h-3"></i> Retry
                            </button>
                        </div>
                        <a href="${nav.buildUrl('collab.html', { source: 'agent' })}" class="w-full btn-premium py-2 text-[10px] flex items-center justify-center gap-2 mt-2">
                            <span>Contact Likith</span>
                            <i data-lucide="mail" class="w-3 h-3"></i>
                        </a>
                    </div>
                `;
            default:
                return '';
        }
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage('user', text);
        chatInput.value = '';
        
        // Create assistant message placeholder
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex gap-3 max-w-[85%] reveal active`;
        msgDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <i data-lucide="cpu" class="w-4 h-4 text-amber-400"></i>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-slate-300 max-w-full overflow-hidden break-words">
                <div class="prose prose-invert prose-sm assistant-content break-words max-w-full">
                    <span class="typing-cursor"></span>
                </div>
                <div class="assistant-card-container"></div>
            </div>
        `;
        chatArea.appendChild(msgDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
        if (window.lucide) lucide.createIcons();

        const contentDiv = msgDiv.querySelector('.assistant-content');
        const cardContainer = msgDiv.querySelector('.assistant-card-container');
        let fullReply = '';
        let cardType = 'none';

        try {
            const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: chatHistory })
            });

            if (!response.ok) throw new Error('API Unavailable');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            contentDiv.innerHTML = '<span class="typing-cursor"></span>';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullReply += chunk;

                // Clean the text from the tag for display
                const displayMsg = fullReply.replace(/\[\[CARD:.*?\]\]/g, '').trim();
                
                // Update content with cursor at the end
                contentDiv.innerHTML = `${displayMsg}<span class="typing-cursor"></span>`;

                // Check for card tags in the reply (progressive extraction)
                const cardMatch = fullReply.match(/\[\[CARD:(.*?)\]\]/);
                if (cardMatch) cardType = cardMatch[1];

                chatArea.scrollTop = chatArea.scrollHeight;
            }

            // Remove cursor on completion
            const finalMsg = fullReply.replace(/\[\[CARD:.*?\]\]/g, '').trim();
            contentDiv.innerHTML = finalMsg;

            // Final card rendering if detected
            if (cardType !== 'none') {
                cardContainer.innerHTML = `<div class="mt-4 pt-4 border-t border-white/5">${renderCard(cardType)}</div>`;
                if (window.lucide) lucide.createIcons();
            }

            chatHistory.push({ role: 'user', content: text });
            chatHistory.push({ role: 'assistant', content: fullReply.replace(/\[\[CARD:.*?\]\]/g, '').trim() });

        } catch (error) {
            console.error('Chat Error:', error);
            
            // Check if we can handle the response locally (Offline Fallback Mode)
            const lowerText = text.toLowerCase().trim();
            let offlineReply = '';
            let offlineCard = 'none';
            
            if (lowerText.includes('who is') || lowerText.includes('about') || lowerText.includes('likith') || lowerText.includes('background') || lowerText === 'who is likith?') {
                offlineReply = "Likith Naidu Anumakonda is a premium AI/ML Engineer, Full Stack Systems Architect, and the Founder of SAKRA VISION. He specializes in designing autonomous AI agents, machine learning models, and building end-to-end full-stack systems with rigorous engineering discipline.";
            } else if (lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email') || lowerText.includes('reach') || lowerText.includes('call')) {
                offlineReply = `You can reach Likith at ${window.APP_CONFIG.CONTACT.PRIMARY_EMAIL} or call ${window.APP_CONFIG.CONTACT.PHONE}. He is open to high-stakes collaborations.`;
                offlineCard = 'contact';
            } else if (lowerText.includes('project') || lowerText.includes('portfolio') || lowerText.includes('build') || lowerText.includes('repo') || lowerText.includes('github') || lowerText.includes('git')) {
                offlineReply = "Likith has built several production-grade systems including RESOLVIT, Prometheus AI, SAKRA VISION Event Hub, and AquaSentinel AI. Check out his Engineering Archive.";
                offlineCard = 'git';
            } else if (lowerText.includes('collab') || lowerText.includes('hire') || lowerText.includes('work with') || lowerText.includes('partnership')) {
                offlineReply = "Likith is open to high-stakes collaborations, technical architecture design, and AI agent implementations. You can pitch your project through the secure Collab Portal.";
                offlineCard = 'collab';
            } else if (lowerText.includes('watch') || lowerText.includes('video') || lowerText.includes('youtube') || lowerText.includes('performance') || lowerText.includes('piano')) {
                offlineReply = "You can watch Likith's technical deep-dives and piano performances on his Media Hub.";
                offlineCard = 'youtube';
            } else if (lowerText.includes('skill') || lowerText.includes('tech stack') || lowerText.includes('technologies') || lowerText.includes('expert') || lowerText.includes('skills matrix')) {
                offlineReply = "Likith specializes in AI/ML (Agent Development, RAG, Computer Vision), Full Stack Systems (Python, Node.js, FastAPI, Next.js), and complete infrastructure deployment (Cloud Databases, Secure APIs, Domain setups). Check out the Technical Ecosystem section on the homepage.";
            } else if (lowerText.includes('resume') || lowerText.includes('cv') || lowerText.includes('experience')) {
                offlineReply = "You can view Likith's experience and download his resume through the Contact section.";
                offlineCard = 'contact';
            }
            
            if (offlineReply) {
                contentDiv.innerHTML = offlineReply;
                if (offlineCard !== 'none') {
                    cardContainer.innerHTML = `<div class="mt-4 pt-4 border-t border-white/5">${renderCard(offlineCard)}</div>`;
                }
                chatHistory.push({ role: 'user', content: text });
                chatHistory.push({ role: 'assistant', content: offlineReply });
                if (window.lucide) lucide.createIcons();
                chatArea.scrollTop = chatArea.scrollHeight;
                return;
            }

            contentDiv.innerHTML = "I encountered a technical glitch. Please visit <a href='problem.html?result=error&type=chatbot&source=agent' class='text-white underline hover:text-amber-400 transition-colors duration-300'>support</a>.";
            cardContainer.innerHTML = `<div class="mt-4 pt-4 border-t border-white/5">${renderCard('error')}</div>`;
            if (window.lucide) lucide.createIcons();
        }
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.innerText;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });

    // Speech Recognition integration
    const micBtn = document.getElementById('ai-mic-btn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition && micBtn) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = navigator.language || 'en-US';

        let isListening = false;

        recognition.onstart = () => {
            isListening = true;
            micBtn.classList.add('mic-listening');
            chatInput.placeholder = 'Listening... Speak now';
            const micIcon = micBtn.querySelector('i');
            if (micIcon) {
                micIcon.setAttribute('data-lucide', 'mic-off');
                if (window.lucide) lucide.createIcons();
            }
        };

        recognition.onend = () => {
            isListening = false;
            micBtn.classList.remove('mic-listening');
            chatInput.placeholder = 'Initiate query...';
            const micIcon = micBtn.querySelector('i');
            if (micIcon) {
                micIcon.setAttribute('data-lucide', 'mic');
                if (window.lucide) lucide.createIcons();
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
            isListening = false;
            micBtn.classList.remove('mic-listening');
            chatInput.placeholder = 'Initiate query...';
            const micIcon = micBtn.querySelector('i');
            if (micIcon) {
                micIcon.setAttribute('data-lucide', 'mic');
                if (window.lucide) lucide.createIcons();
            }
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            chatForm.dispatchEvent(new Event('submit'));
        };

        micBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else if (micBtn) {
        micBtn.style.display = 'none';
    }
});
