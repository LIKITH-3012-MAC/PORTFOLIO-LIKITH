import CONFIG from './config';

/**
 * Sends a chat query to the streaming AI bot endpoint.
 * Calls onChunk with each new text fragment received.
 */
export async function sendMessageStream(text, history, onChunk, onError, onDone) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text, history })
    });

    if (!response.ok) {
      throw new Error(`Chat API responded with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
    
    if (onDone) onDone();
  } catch (error) {
    if (onError) onError(error);
  }
}

/**
 * Offline fallback replies when the AI backend is unreachable.
 */
export function getOfflineReply(text) {
  const lowerText = text.toLowerCase().trim();
  
  if (
    lowerText.includes('who is') || 
    lowerText.includes('about') || 
    lowerText.includes('likith') || 
    lowerText.includes('background') || 
    lowerText === 'who is likith?' || 
    lowerText === 'identity'
  ) {
    return {
      reply: "Likith Naidu Anumamkonda is a premium AI-ML Architect, Full Stack Systems Architect, and the Founder of SAKRA VISION. He specializes in designing autonomous AI agents, machine learning models, and building end-to-end full-stack systems with rigorous engineering discipline.",
      card: "none"
    };
  }
  
  if (
    lowerText.includes('contact') || 
    lowerText.includes('phone') || 
    lowerText.includes('email') || 
    lowerText.includes('reach') || 
    lowerText.includes('call') || 
    lowerText === 'collaborate'
  ) {
    return {
      reply: `You can reach Likith at ${CONFIG.CONTACT.PRIMARY_EMAIL} or call ${CONFIG.CONTACT.PHONE}. He is open to high-stakes collaborations.`,
      card: "contact"
    };
  }
  
  if (
    lowerText.includes('project') || 
    lowerText.includes('portfolio') || 
    lowerText.includes('build') || 
    lowerText.includes('repo') || 
    lowerText.includes('github') || 
    lowerText.includes('git') || 
    lowerText === 'systems' || 
    lowerText === 'git archive'
  ) {
    return {
      reply: "Likith has built several production-grade systems including RESOLVIT, Prometheus AI, SAKRA VISION Event Hub, and AquaSentinel AI. Check out his Engineering Archive.",
      card: "git"
    };
  }
  
  if (
    lowerText.includes('collab') || 
    lowerText.includes('hire') || 
    lowerText.includes('work with') || 
    lowerText.includes('partnership')
  ) {
    return {
      reply: "Likith is open to high-stakes collaborations, technical architecture design, and AI agent implementations. You can pitch your project through the secure Collab Portal.",
      card: "collab"
    };
  }
  
  if (
    lowerText.includes('watch') || 
    lowerText.includes('video') || 
    lowerText.includes('youtube') || 
    lowerText.includes('performance') || 
    lowerText.includes('piano') || 
    lowerText === 'youtube hub'
  ) {
    return {
      reply: "You can watch Likith's technical deep-dives and piano performances on his Media Hub.",
      card: "youtube"
    };
  }
  
  if (
    lowerText.includes('skill') || 
    lowerText.includes('tech stack') || 
    lowerText.includes('technologies') || 
    lowerText.includes('expert') || 
    lowerText.includes('skills matrix')
  ) {
    return {
      reply: "Likith specializes in AI/ML (Agent Development, RAG, Computer Vision), Full Stack Systems (Python, Node.js, FastAPI, Next.js), and complete infrastructure deployment (Cloud Databases, Secure APIs, Domain setups). Check out the Technical Ecosystem section on the homepage.",
      card: "none"
    };
  }
  
  if (
    lowerText.includes('resume') || 
    lowerText.includes('cv') || 
    lowerText.includes('experience')
  ) {
    return {
      reply: "You can view Likith's experience and download his resume through the Contact section.",
      card: "contact"
    };
  }

  return null;
}
