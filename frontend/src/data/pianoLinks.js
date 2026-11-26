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

/**
 * Curated Instagram Reels displayed in Media Hub & Piano Studio.
 * Keep official destination URLs intact and avoid invented metadata.
 */
export const instagramReels = [
  {
    id: "reel-1",
    label: "Instagram Reel 1",
    url: "https://www.instagram.com/reel/DgEw_LCB6un/?cnvx=bzI5ZXdic3hmZWth",
  },
  {
    id: "reel-2",
    label: "Instagram Reel 2",
    url: "https://www.instagram.com/reel/Df9VfnZRDao/?avpt=MzU1NXh5Mzh1NXhm",
  },
  {
    id: "reel-3",
    label: "Instagram Reel 3",
    url: "https://www.instagram.com/reel/Dfw88KGp8s4/?dmpr=MWd5NzV1ejVvcHN1dg==",
  },
];

export default {
  pianoInstagramProfile,
  authorizedTracks,
  instagramReels,
};
