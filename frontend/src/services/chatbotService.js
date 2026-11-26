import CONFIG from './config';

/**
 * Sends a chat query to the streaming AI bot endpoint.
 * Calls onChunk with each new text fragment received.
 */
export async function sendMessageStream(text, history, onChunk, onError, onDone, options = {}) {
  const { language = 'en', signal, onAbort } = options;
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text, history, language }),
      signal
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
    if (error?.name === 'AbortError') {
      if (onAbort) onAbort();
      return;
    }
    if (onError) onError(error);
  }
}

/**
 * Offline fallback replies when the AI backend is unreachable.
 */
export function getOfflineReply(text, language = 'en') {
  const lowerText = text.toLowerCase().trim();
  const isTelugu = language === 'te';

  if (
    lowerText.includes('who is') || 
    lowerText.includes('about') || 
    lowerText.includes('likith') || 
    lowerText.includes('background') || 
    lowerText === 'who is likith?' || 
    lowerText === 'identity'
  ) {
    return {
      reply: isTelugu
        ? "లికిత్ నాయుడు అనుమకొండ ఒక AI/ML ఇంజనీర్ మరియు SAKRA VISION వ్యవస్థాపకుడు & CEO. ఆయన PBR VITS, కావలి లో B.Tech CSE (AI) చదువుతున్నారు, IIT పాట్నా (I-HUB) నుండి అడ్వాన్స్‌డ్ AI/ML స్పెషలైజేషన్ పూర్తి చేశారు. ఆయన క్లాసికల్ పియానిస్ట్ మరియు 'Echoes of an Unsaid Goodbye' పుస్తక రచయిత."
        : "Likith Naidu Anumakonda is an AI/ML Engineer and the Founder & CEO of SAKRA VISION. He is currently pursuing a B.Tech in CSE (Artificial Intelligence) at PBR VITS, Kavali, with an Advanced AI/ML specialization programme from IIT Patna (I-HUB). Outside engineering, he is a classical pianist and author of Echoes of an Unsaid Goodbye.",
      card: "none"
    };
  }
  
  if (
    lowerText.includes('contact') || 
    lowerText.includes('phone') || 
    lowerText.includes('email') || 
    lowerText.includes('reach') || 
    lowerText.includes('call')
  ) {
    return {
      reply: `You can reach Likith at ${CONFIG.CONTACT.PRIMARY_EMAIL} or call ${CONFIG.CONTACT.PHONE}.`,
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
    lowerText === 'git archive' ||
    lowerText === 'github repos'
  ) {
    return {
      reply: "Likith has developed projects including RESOLVIT, SAKRA VISION Event Hub, Student Bench AI, Prometheus AI, and AquaSentinel AI. You can explore the source repositories on the GitHub Repositories page.",
      card: "git"
    };
  }
  
  if (
    lowerText.includes('collab') || 
    lowerText.includes('hire') || 
    lowerText.includes('work with') || 
    lowerText.includes('partnership') ||
    lowerText === 'collaborate'
  ) {
    return {
      reply: "Likith is open to AI/ML engineering roles, product collaborations, and software development inquiries. You can share details through the Collaboration Form.",
      card: "collab"
    };
  }
  
  if (
    lowerText.includes('watch') || 
    lowerText.includes('video') || 
    lowerText.includes('youtube') || 
    lowerText.includes('performance') || 
    lowerText.includes('piano') || 
    lowerText === 'youtube hub' ||
    lowerText === 'media & piano'
  ) {
    return {
      reply: "You can watch Likith's project demos and classical piano performances on the Media Hub or visit the Piano Studio.",
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
      reply: "Likith works across AI/ML (Machine Learning, Deep Learning, NLP, Computer Vision, RAG pipelines, AI Agents), Backend & Web Development (Python, FastAPI, Node.js, React, Next.js), and Databases & Infrastructure (PostgreSQL, MySQL, Resend, Twilio, Vercel, Render). See the Technical Skills section on the homepage.",
      card: "none"
    };
  }
  
  if (
    lowerText.includes('resume') || 
    lowerText.includes('cv') || 
    lowerText.includes('experience')
  ) {
    return {
      reply: "You can review Likith's background and contact him via the Contact section or Collaboration page.",
      card: "contact"
    };
  }

  return null;
}
