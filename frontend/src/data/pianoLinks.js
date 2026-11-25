/**
 * Piano Studio Configuration
 * Update Instagram profile details or add authorized studio audio tracks below.
 * Note: Only configure legitimate, authorized audio sources.
 */

export const pianoInstagramProfile = {
  profileUrl: "https://www.instagram.com/pianopeaceby_lee/",
  username: "@pianopeaceby_lee",
  displayName: "Likith Naidu",
  bio: "Countless Symphony Melodies",
  category: "Musician / Band",
  stats: {
    posts: 22,
    followers: 43,
    following: 0,
  },
};

/**
 * Authorized audio tracks for the Piano Studio Music Player.
 * Add objects in the format:
 * {
 *   id: "track-1",
 *   title: "Track Title",
 *   artist: "Likith Naidu",
 *   duration: "03:45",
 *   audioUrl: "/audio/authorized-recording.mp3",
 *   artworkUrl: "/images/track-cover.jpg",
 * }
 */
export const authorizedTracks = [];

export default {
  pianoInstagramProfile,
  authorizedTracks,
};
