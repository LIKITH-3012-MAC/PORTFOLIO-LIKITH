/**
/**
 * Structured Portfolio Knowledge Service.
 * Fetches JSON files dynamically from /knowledge/ and caches them in memory.
 */

const knowledgeCache = {};

export async function loadKnowledgeFile(filename) {
  if (knowledgeCache[filename]) {
    return knowledgeCache[filename];
  }

  try {
    const response = await fetch(`/knowledge/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} loading ${filename}`);
    }
    const data = await response.json();
    knowledgeCache[filename] = data;
    return data;
  } catch (err) {
    console.error(`Error loading knowledge file ${filename}:`, err);
    throw err;
  }
}

export const getProjects = () => loadKnowledgeFile("projects.json");
export const getFounder = () => loadKnowledgeFile("founder.json");
export const getProfile = () => loadKnowledgeFile("likith-profile.json");
export const getSocials = () => loadKnowledgeFile("socials.json");
export const getEducation = () => loadKnowledgeFile("education.json");
export const getAchievements = () => loadKnowledgeFile("achievements.json");
export const getFaq = () => loadKnowledgeFile("faq.json");
export const getSiteMeta = () => loadKnowledgeFile("site-meta.json");
export const getContact = () => loadKnowledgeFile("contact.json");
export const getCreative = () => loadKnowledgeFile("creative.json");

export default {
  loadKnowledgeFile,
  getProjects,
  getFounder,
  getProfile,
  getSocials,
  getEducation,
  getAchievements,
  getFaq,
  getSiteMeta,
  getContact,
  getCreative
};
