/**
 * Social Media Service for DeltaFox Options
 * Handles official YouTube Data API v3 integrations and Instagram fallback structures.
 *
 * Restrictions:
 * - Never invent or estimate metrics.
 * - Dislikes are omitted unless authorized API access provides them.
 * - Shares are omitted as live metrics.
 * - Public subscriber counts may be rounded by YouTube.
 * - Graceful fallback when VITE_YOUTUBE_API_KEY is missing or quota is exhausted.
 */

const YOUTUBE_HANDLE = 'deltafox.trading';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@deltafox.trading';
const INSTAGRAM_HANDLE = '@DELTAFOX_OPTIONS';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/deltafox_options/';

// Sample fallback video metadata (used when API key is unconfigured)
// Note: Metrics (views/likes) remain null when API stats are unavailable to prevent fake numbers.
const FALLBACK_VIDEOS = [
  {
    id: 'dQw4w9WgXcQ', // Default structural sample if API unavailable, or channel uploads placeholder
    title: 'DeltaFox Options Trading Framework & Market Architecture',
    publishedAt: '2025-01-15T00:00:00Z',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    duration: null,
    views: null,
    likes: null,
    description: 'Systematic options trading strategy breakdown, volatility positioning, and risk management framework by DeltaFox.'
  }
];

export async function fetchYouTubeChannelData() {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      hasApiKey: false,
      channelUrl: YOUTUBE_CHANNEL_URL,
      handle: `@${YOUTUBE_HANDLE}`,
      channelTitle: 'DeltaFox Trading',
      stats: null, // Null indicates live metrics unavailable
      videos: [],
      error: 'API key not configured. Direct channel links available.'
    };
  }

  try {
    // 1. Fetch channel details & uploads playlist ID using handle
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forHandle=${YOUTUBE_HANDLE}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);

    if (!channelRes.ok) {
      throw new Error(`YouTube API returned status ${channelRes.status}`);
    }

    const channelData = await channelRes.json();
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('YouTube channel not found');
    }

    const channelItem = channelData.items[0];
    const stats = {
      subscriberCount: channelItem.statistics?.subscriberCount ? Number(channelItem.statistics.subscriberCount) : null,
      videoCount: channelItem.statistics?.videoCount ? Number(channelItem.statistics.videoCount) : null,
      viewCount: channelItem.statistics?.viewCount ? Number(channelItem.statistics.viewCount) : null,
      hiddenSubscriberCount: channelItem.statistics?.hiddenSubscriberCount || false
    };

    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
    let videos = [];

    // 2. Fetch uploaded videos if playlist exists
    if (uploadsPlaylistId) {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=9&key=${apiKey}`;
      const playlistRes = await fetch(playlistUrl);

      if (playlistRes.ok) {
        const playlistData = await playlistRes.json();
        const videoItems = playlistData.items || [];
        const videoIds = videoItems.map(item => item.contentDetails?.videoId).filter(Boolean);

        if (videoIds.length > 0) {
          // 3. Fetch detailed statistics and duration for each video
          const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${apiKey}`;
          const videoDetailsRes = await fetch(videoDetailsUrl);

          if (videoDetailsRes.ok) {
            const videoDetailsData = await videoDetailsRes.json();
            videos = (videoDetailsData.items || []).map(v => ({
              id: v.id,
              title: v.snippet?.title || 'Untitled Video',
              publishedAt: v.snippet?.publishedAt,
              description: v.snippet?.description || '',
              thumbnail: v.snippet?.thumbnails?.maxres?.url || v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url,
              duration: formatDuration(v.contentDetails?.duration),
              views: v.statistics?.viewCount ? Number(v.statistics.viewCount) : null,
              likes: v.statistics?.likeCount ? Number(v.statistics.likeCount) : null
            }));
          }
        }
      }
    }

    return {
      hasApiKey: true,
      channelUrl: YOUTUBE_CHANNEL_URL,
      handle: `@${YOUTUBE_HANDLE}`,
      channelTitle: channelItem.snippet?.title || 'DeltaFox Trading',
      avatar: channelItem.snippet?.thumbnails?.high?.url || channelItem.snippet?.thumbnails?.default?.url,
      stats,
      videos,
      error: null
    };

  } catch (err) {
    console.warn('[DeltaFox Options] YouTube API Fetch Error:', err.message);
    return {
      hasApiKey: true,
      channelUrl: YOUTUBE_CHANNEL_URL,
      handle: `@${YOUTUBE_HANDLE}`,
      channelTitle: 'DeltaFox Trading',
      stats: null,
      videos: [],
      error: err.message || 'Failed to load YouTube Data'
    };
  }
}

// Helper to parse ISO 8601 YouTube duration (e.g., PT15M33S -> 15:33)
function formatDuration(isoDuration) {
  if (!isoDuration) return null;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export const SOCIAL_CONFIG = {
  youtube: {
    handle: '@deltafox.trading',
    url: YOUTUBE_CHANNEL_URL,
  },
  instagram: {
    handle: INSTAGRAM_HANDLE,
    url: INSTAGRAM_PROFILE_URL,
  }
};
