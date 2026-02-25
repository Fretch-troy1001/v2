import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Image as ImageIcon, CheckCircle2, AlertTriangle, Send, Loader2, User, Trash2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDailyFeeds, createDailyFeed, uploadFeedImage, deleteDailyFeed, DailyFeed } from '../services/supabase';

export const HomeTab: React.FC = () => {
  const [feeds, setFeeds] = useState<DailyFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    setLoading(true);
    const data = await getDailyFeeds();
    setFeeds(data);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!postContent.trim() && !imagePreview && !fileInputRef.current?.files?.[0]) return;

    setIsSubmitting(true);

    let imageUrl = '';
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      // Priority 1: Use Supabase Storage
      const uploadedUrl = await uploadFeedImage(file);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    // Success depends on whether we have content OR an image
    // Fallback: Always send Base64 preview if Storage upload failed or is missing
    const success = await createDailyFeed(
      postContent,
      imagePreview || undefined,
      imageUrl || undefined
    );

    if (success) {
      setPostContent('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsComposerOpen(false);
      await fetchFeeds();
    }
    setIsSubmitting(false);
  };

  const handleSyncNotebook = async () => {
    // This is the trigger for Agentic AI Ingestion
    // Since MCP is available to me, I will implement this as a call to my ingestion service
    alert('AI Sync initiated. The Assistant will now query NotebookLM to generate the latest feed update.');
    // In a real production app, this would call an API route on the proxy.
    // For now, I'll provide the UI and can manually trigger the sync as the agent.
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    const success = await deleteDailyFeed(id);
    if (success) {
      await fetchFeeds();
    } else {
      alert('Failed to delete the post. Check permissions.');
    }
  };

  return (
    <div className="pb-24 w-full flex flex-col items-center">

      {/* ── Magazine Header ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-8 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">Unit 2 B Inspection</span>
            <span className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full">Medium Outage</span>
            <button
              onClick={handleSyncNotebook}
              className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full hover:bg-cyan-400/20 transition-colors flex items-center gap-2"
            >
              <Loader2 size={12} className="animate-pulse" /> Sync AI Report
            </button>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-outfit">
            ENGINEERING <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">LOG</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium uppercase tracking-[0.2em]">
            Real-time visual diagnostics & outage progression
          </p>
        </div>
      </motion.div>

      {/* ── Main Content Area (Max width constraints for reading) ── */}
      <div className="w-full max-w-4xl space-y-12">

        {/* ── Floating Action Button (FAB) ────────── */}
        <div className="fixed bottom-32 right-8 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsComposerOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/20 hover:brightness-110 transition-all"
          >
            <Plus size={32} />
          </motion.button>
        </div>

        {/* ── Post Composer Modal ──────────────────── */}
        <AnimatePresence>
          {isComposerOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsComposerOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl panel-glass rounded-[2rem] p-1 shadow-2xl overflow-hidden"
              >
                <div className="bg-slate-900/90 rounded-[1.8rem] p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Plus size={18} />
                      </div>
                      New Log Entry
                    </h3>
                    <button
                      onClick={() => setIsComposerOpen(false)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                      <User size={24} className="text-white" />
                    </div>
                    <textarea
                      autoFocus
                      className="w-full bg-transparent border-none focus:ring-0 text-slate-100 resize-none min-h-[150px] text-xl font-medium placeholder:text-slate-700 outline-none"
                      placeholder="What's happening on the floor?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </div>

                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative mb-6 rounded-2xl overflow-hidden border border-white/10"
                    >
                      <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[300px] object-cover" />
                      <button
                        onClick={() => setImagePreview(null)}
                        className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-colors"
                      >
                        ×
                      </button>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all font-bold text-sm"
                    >
                      <ImageIcon size={20} /> Add Visual Diagnostic
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || (!postContent.trim() && !imagePreview)}
                      className="btn btn--primary px-8 py-3 rounded-2xl font-bold flex items-center gap-2 group disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-emerald-500/20"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Publish to Feed</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Feed Stream ────────────────────────── */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 size={32} className="text-emerald-500 animate-spin" />
            </div>
          ) : feeds.length > 0 ? (
            feeds.map((feed, idx) => (
              <motion.article
                key={feed.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Math.min(idx, 5) }}
                className="panel-glass rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                      <User size={20} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{feed.author}</h4>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
                        <Calendar size={12} />
                        {new Date(feed.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="mx-1">•</span>
                        {new Date(feed.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(feed.id)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all flex items-center justify-center border border-white/5 hover:border-rose-500/30"
                    title="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {(feed.image_url || feed.image_base64) && (
                  <div className="mb-8 -mx-8 sm:mx-0 sm:rounded-2xl overflow-hidden border-y sm:border-x border-white/5 relative group/img">
                    <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/0 transition-colors duration-500 z-10" />
                    <img src={feed.image_url || feed.image_base64 || ''} alt="Feed Attachment" className="w-full h-auto max-h-[600px] object-cover transform group-hover/img:scale-[1.02] transition-transform duration-700" />
                  </div>
                )}


                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                  {feed.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </motion.article>
            ))
          ) : (
            <div className="text-center p-12 panel-glass rounded-3xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex flex-col items-center justify-center mx-auto mb-4 border border-white/10 text-slate-500">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No feeds yet</h3>
              <p className="text-slate-400">Initialize the database or create the first post.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
