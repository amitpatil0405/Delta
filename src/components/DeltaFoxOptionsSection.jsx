import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Play,
  X,
  Share2,
  ThumbsUp,
  Eye,
  Tv,
  Users,
  Video,
  QrCode,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

// Custom inline SVG icons for social platforms to ensure 100% compatibility across lucide-react versions
const YoutubeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
import deltafoxOptionsLogo from '../assets/deltafox_options_logo.png';
import instaQrImg from '../assets/insta_qr_cropped.png';
import { fetchYouTubeChannelData, SOCIAL_CONFIG } from '../services/socialMediaService';

export default function DeltaFoxOptionsSection() {
  const [ytData, setYtData] = useState({
    loading: true,
    hasApiKey: false,
    channelUrl: SOCIAL_CONFIG.youtube.url,
    handle: SOCIAL_CONFIG.youtube.handle,
    channelTitle: 'DeltaFox Trading',
    stats: null,
    videos: [],
    error: null
  });

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSocialData() {
      const data = await fetchYouTubeChannelData();
      if (isMounted) {
        setYtData({
          ...data,
          loading: false
        });
      }
    }
    loadSocialData();
    return () => { isMounted = false; };
  }, []);

  // Handle ESC key to close video modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedVideo) {
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo]);

  const handleShareVideo = async (video) => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: 'Check out this video on DeltaFox Options:',
          url: url
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return null;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <section
      id="deltafox-options"
      className="relative min-h-screen pt-12 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto scroll-mt-16 sm:scroll-mt-20 selection:bg-amber-500/30"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/3 right-10 w-[400px] h-[300px] bg-amber-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Main Container Card */}
      <div className="bg-[#0a0a0c]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">

        {/* Subtle top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />

        {/* 1. Header & Sub-Brand Identity */}
        <div className="flex flex-col items-center text-center space-y-6 pb-12 border-b border-white/10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL MEDIA & OPTIONS HUB</span>
          </div>

          {/* Sub-Brand Emblem Logo */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-amber-500/30 rounded-2xl blur-lg group-hover:opacity-100 transition duration-500 opacity-60" />
            <img
              src={deltafoxOptionsLogo}
              alt="DeltaFox Options"
              className="relative h-24 sm:h-32 md:h-36 w-auto object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]"
            />
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono uppercase">
              DeltaFox Options
            </h1>
            <p className="text-amber-400/90 font-mono text-sm sm:text-base font-semibold tracking-wide">
              Official Media & Options Hub of DeltaFox
            </p>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed pt-1">
              Delivering institutional-grade derivatives education, quantitative market analytics, live strategy breakdowns, and tactical trading insights.
            </p>
          </div>
        </div>

        {/* 2. Dual Social Hub Grid (YouTube + Instagram) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10">

          {/* Left Column: YouTube Media Hub (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* YouTube Header Card */}
            <div className="bg-neutral-900/80 border border-red-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-600" />

              <div className="flex items-center space-x-4">
                <div className="p-3.5 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                  <YoutubeIcon className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-white font-mono">DeltaFox Trading</h2>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono border border-red-500/30">
                      YouTube Official
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {ytData.handle} • Educational Videos & Market Intelligence
                  </p>
                </div>
              </div>

              <a
                href={SOCIAL_CONFIG.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>Subscribe Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* YouTube Channel Live Statistics Grid (Only if API data available) */}
            {ytData.stats && (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-neutral-900/60 border border-white/10 rounded-xl p-3.5 sm:p-4 text-center">
                  <div className="flex items-center justify-center space-x-1.5 text-gray-400 text-xs font-mono mb-1">
                    <Users className="w-3.5 h-3.5 text-red-400" />
                    <span>Subscribers</span>
                  </div>
                  <span className="text-lg sm:text-2xl font-extrabold text-white font-mono">
                    {formatNumber(ytData.stats.subscriberCount) || 'N/A'}
                  </span>
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded-xl p-3.5 sm:p-4 text-center">
                  <div className="flex items-center justify-center space-x-1.5 text-gray-400 text-xs font-mono mb-1">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>Public Videos</span>
                  </div>
                  <span className="text-lg sm:text-2xl font-extrabold text-white font-mono">
                    {formatNumber(ytData.stats.videoCount) || 'N/A'}
                  </span>
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded-xl p-3.5 sm:p-4 text-center">
                  <div className="flex items-center justify-center space-x-1.5 text-gray-400 text-xs font-mono mb-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Channel Views</span>
                  </div>
                  <span className="text-lg sm:text-2xl font-extrabold text-white font-mono">
                    {formatNumber(ytData.stats.viewCount) || 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {/* Video Gallery Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tv className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-extrabold font-mono text-white uppercase tracking-wider">
                    Featured Video Gallery
                  </h3>
                </div>
                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center space-x-1 transition-colors"
                >
                  <span>View All on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Video Grid or Fallback State */}
              {ytData.loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-neutral-900/40 border border-white/5 rounded-2xl h-48 animate-pulse p-4 flex flex-col justify-between">
                      <div className="w-full h-28 bg-white/5 rounded-xl" />
                      <div className="w-3/4 h-4 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              ) : ytData.videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ytData.videos.map((video) => (
                    <motion.div
                      key={video.id}
                      whileHover={{ scale: 1.02 }}
                      className="group bg-neutral-900/70 hover:bg-neutral-900 border border-white/10 hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      onClick={() => setSelectedVideo(video)}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Duration Pill */}
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold border border-white/10">
                            {video.duration}
                          </span>
                        )}
                      </div>

                      {/* Info Container */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <h4 className="text-xs font-semibold text-gray-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-relaxed">
                          {video.title}
                        </h4>

                        {(video.views !== null || video.likes !== null) && (
                          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-2 border-t border-white/5">
                            {video.views !== null && (
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3 text-gray-400" />
                                <span>{formatNumber(video.views)} views</span>
                              </span>
                            )}
                            {video.likes !== null && (
                              <span className="flex items-center space-x-1">
                                <ThumbsUp className="w-3 h-3 text-amber-400" />
                                <span>{formatNumber(video.likes)}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Fallback Direct Link Banner when no videos API or channel uploads empty */
                <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs text-gray-300 font-mono">
                    Explore official options trading video modules directly on YouTube.
                  </p>
                  <a
                    href={SOCIAL_CONFIG.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                    <span>Watch @deltafox.trading Videos</span>
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Instagram Profile & QR Scanner (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Instagram Profile Card */}
            <div className="bg-neutral-900/80 border border-pink-500/30 rounded-2xl p-6 relative overflow-hidden shadow-lg space-y-6">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 via-pink-500 to-amber-500" />

              <div className="flex items-center space-x-3.5">
                <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-white font-mono">
                    {SOCIAL_CONFIG.instagram.handle}
                  </h3>
                  <p className="text-[11px] text-pink-400 font-mono">
                    Official Instagram Page
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Follow for daily market charts, non-directional option trade setups, live market commentary, and quick video shorts.
              </p>

              <a
                href={SOCIAL_CONFIG.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(219,39,119,0.35)] hover:shadow-[0_0_30px_rgba(219,39,119,0.5)]"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Frosted Glass Instagram QR Code Card */}
            <div className="bg-black/80 border border-amber-500/30 rounded-2xl p-6 text-center space-y-4 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.9)] relative overflow-hidden group">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-wider">
                <QrCode className="w-3 h-3" />
                <span>SCAN TO FOLLOW</span>
              </div>

              {/* Scanned QR Code Display with Quiet Zone & Amber Glow Frame */}
              <div className="relative mx-auto w-48 sm:w-56 bg-white p-3 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.45)] transition-all duration-300 border-2 border-amber-500/40">
                <img
                  src={instaQrImg}
                  alt="Instagram @DELTAFOX_OPTIONS QR Code"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-white font-mono">
                  {SOCIAL_CONFIG.instagram.handle}
                </p>
                <p className="text-[11px] text-gray-400 font-mono">
                  Point your phone camera to open Instagram
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Interactive Modal YouTube Video Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0c] border border-amber-500/40 rounded-2xl overflow-hidden w-full max-w-4xl shadow-[0_0_50px_rgba(245,158,11,0.3)] relative flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-neutral-900/80">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold">
                  <YoutubeIcon className="w-4 h-4 text-red-500" />
                  <span className="truncate max-w-xs sm:max-w-lg">{selectedVideo.title}</span>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-gray-400 hover:text-white hover:bg-neutral-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Responsive Video Embed Container */}
              <div className="relative aspect-video bg-black w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer / Details */}
              <div className="p-4 sm:p-6 space-y-3 bg-neutral-900/60 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                    {selectedVideo.title}
                  </h3>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleShareVideo(selectedVideo)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-mono transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {selectedVideo.description && (
                  <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-3 bg-black/40 p-3 rounded-xl border border-white/5">
                    {selectedVideo.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
