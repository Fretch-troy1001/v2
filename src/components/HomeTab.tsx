import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Calendar, Image as ImageIcon, Send, Loader2, User, Trash2, Plus, X, ChevronLeft, ChevronRight, Briefcase, Share2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDailyFeeds, createDailyFeed, updateDailyFeed, uploadFeedImage, deleteDailyFeed, DailyFeed, checkSchema } from '../services/supabase';

export const HomeTab: React.FC = () => {
  const [feeds, setFeeds] = useState<DailyFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [schemaStatus, setSchemaStatus] = useState<{ ok: boolean; missing: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter States
  const [postType, setPostType] = useState<'professional' | 'social'>('professional');
  const [eventFilter, setEventFilter] = useState('B Inspection');
  const [viewDate, setViewDate] = useState(new Date());

  // Composer / Editing States
  const [editingPost, setEditingPost] = useState<DailyFeed | null>(null);
  const [composerPostType, setComposerPostType] = useState<'professional' | 'social'>('professional');
  const [composerEvent, setComposerEvent] = useState('B Inspection');
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState<string>(new Date().toTimeString().slice(0, 5));

  const fetchFeeds = async () => {
    setLoading(true);
    const data = await getDailyFeeds();
    setFeeds(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, [viewDate, postType, eventFilter]);

  useEffect(() => {
    const checkDb = async () => {
      const status = await checkSchema();
      setSchemaStatus(status);
    };
    checkDb();
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input or textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') changeDay(-1);
      if (e.key === 'ArrowRight') changeDay(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewDate]);

  // Modal Control
  const openComposer = (post?: DailyFeed) => {
    if (post) {
      setEditingPost(post);
      setPostContent(post.content);
      setImagePreview(post.image_base64 || post.image_url);
      setComposerPostType(post.post_type || 'professional');
      setComposerEvent(post.event || 'B Inspection');
      const d = new Date(post.created_at);
      setCustomDate(d.toISOString().split('T')[0]);
      setCustomTime(d.toTimeString().slice(0, 5));
    } else {
      setEditingPost(null);
      setPostContent('');
      setImagePreview(null);
      setComposerPostType(postType);
      setComposerEvent(eventFilter);
      setCustomDate(new Date().toISOString().split('T')[0]);
      setCustomTime(new Date().toTimeString().slice(0, 5));
    }
    setIsComposerOpen(true);
  };

  /**
   * Media Optimization: Resize to max 1200px and compress to JPEG 0.6
   */
  const optimizeImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const optimized = await optimizeImage(event.target?.result as string);
      setImagePreview(optimized);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!postContent.trim() && !imagePreview) return;

    setIsSubmitting(true);
    const finalDate = new Date(`${customDate}T${customTime}`);

    let success = false;
    if (editingPost) {
      success = await updateDailyFeed(
        editingPost.id,
        {
          content: postContent,
          image_base64: imagePreview && imagePreview.startsWith('data:') ? imagePreview : undefined,
          image_url: imagePreview && !imagePreview.startsWith('data:') ? imagePreview : undefined,
          post_type: composerPostType,
          event: composerEvent
        },
        finalDate
      );
    } else {
      success = await createDailyFeed(
        postContent,
        imagePreview || undefined,
        undefined,
        composerPostType,
        composerEvent,
        finalDate
      );
    }

    if (success) {
      setIsComposerOpen(false);
      setEditingPost(null);
      await fetchFeeds();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    const success = await deleteDailyFeed(id);
    if (success) await fetchFeeds();
  };

  const changeDay = (offset: number) => {
    const nextDate = new Date(viewDate);
    nextDate.setDate(viewDate.getDate() + offset);
    setViewDate(nextDate);
  };

  const filteredFeeds = useMemo(() => {
    return feeds.filter(feed => {
      const feedDate = new Date(feed.created_at);
      const isSameDay = feedDate.toDateString() === viewDate.toDateString();

      // Legacy data fallback: if columns are missing, assume defaults
      const feedType = feed.post_type || 'professional';
      const feedEvent = feed.event || 'B Inspection';

      const isSameType = feedType === postType;
      const isSameEvent = feedEvent === eventFilter;

      return isSameDay && isSameType && isSameEvent;
    });
  }, [feeds, viewDate, postType, eventFilter]);

  return (
    <div className="pb-24 w-full flex flex-col items-center">

      {/* ── Schema Health Warning ────────────────── */}
      {schemaStatus && !schemaStatus.ok && (
        <div className="w-full max-w-4xl mx-auto mb-4 px-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20">
                <Filter size={18} />
              </div>
              <div>
                <h5 className="text-sm font-bold uppercase tracking-tight">Database Out of Sync</h5>
                <p className="text-xs opacity-80">Missing columns: {schemaStatus.missing.join(', ')}. Posts may disappear until updated.</p>
              </div>
            </div>
            <button
              onClick={() => alert(`Please run this SQL in Supabase:\n\nALTER TABLE daily_feeds ADD COLUMN IF NOT EXISTS post_type TEXT;\nALTER TABLE daily_feeds ADD COLUMN IF NOT EXISTS event TEXT;`)}
              className="text-xs font-black uppercase tracking-widest bg-rose-500/20 px-3 py-1.5 rounded-lg hover:bg-rose-500/30 transition-all border border-rose-500/20"
            >
              How to fix
            </button>
          </div>
        </div>
      )}

      {/* ── Top Bar Filters (Sticky) ────────────────── */}
      <div className="sticky top-0 w-full z-40 mb-8 py-2 px-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPostType('professional')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${postType === 'professional' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}
            >
              <Briefcase size={12} /> Prof
            </button>
            <button
              onClick={() => setPostType('social')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${postType === 'social' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/20' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}
            >
              <Share2 size={12} /> Soc
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-400">
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer p-0"
              >
                <option value="B Inspection">B Insp</option>
              </select>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => changeDay(-1)}
                className="p-1 hover:bg-white/5 rounded-md text-slate-600 hover:text-slate-300 transition-all"
                title="ArrowLeft"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-2 text-[10px] font-bold text-slate-400 min-w-[100px] text-center uppercase tracking-tighter">
                {viewDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <button
                onClick={() => changeDay(1)}
                className="p-1 hover:bg-white/5 rounded-md text-slate-600 hover:text-slate-300 transition-all"
                title="ArrowRight"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl space-y-12">
        {/* ── Post Composer Trigger ────────── */}
        <div className="fixed bottom-12 right-12 z-[50]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openComposer()}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/20 hover:brightness-110 transition-all font-black text-2xl"
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
                className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
                      {editingPost ? 'Edit Entry' : 'New Engineering Entry'}
                    </h3>
                    <button onClick={() => setIsComposerOpen(false)} className="text-slate-500 hover:text-white transition-all"><X size={24} /></button>
                  </div>

                  {/* Composer Controls */}
                  <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</span>
                      <select
                        value={composerPostType}
                        onChange={(e) => setComposerPostType(e.target.value as any)}
                        className="bg-black/20 border border-white/10 rounded-lg text-xs font-bold p-2 text-emerald-400 outline-none"
                      >
                        <option value="professional">Professional</option>
                        <option value="social">Social</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Event</span>
                      <select
                        value={composerEvent}
                        onChange={(e) => setComposerEvent(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg text-xs font-bold p-2 text-sky-400 outline-none"
                      >
                        <option value="B Inspection">B Inspection</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</span>
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg text-xs font-bold p-2 text-slate-300 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time</span>
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg text-xs font-bold p-2 text-slate-300 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-slate-950" />
                    </div>
                    <textarea
                      autoFocus
                      className="w-full bg-transparent border-none focus:ring-0 text-slate-100 resize-none min-h-[120px] text-lg font-medium placeholder:text-slate-700 outline-none"
                      placeholder="Technical observations or social updates..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </div>

                  {imagePreview && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative mb-6 rounded-2xl overflow-hidden border border-white/10">
                      <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[250px] object-contain bg-black/40" />
                      <button onClick={() => setImagePreview(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-colors">×</button>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all font-bold text-sm">
                      <ImageIcon size={20} /> Attach Image
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting || (!postContent.trim() && !imagePreview)} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-xl shadow-emerald-500/20">
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> {editingPost ? 'Update' : 'Publish'}</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Feed Stream ────────────────────────── */}
        <div className="space-y-12">
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 size={32} className="text-emerald-500 animate-spin" /></div>
          ) : filteredFeeds.length > 0 ? (
            filteredFeeds.map((feed) => (
              <motion.article
                key={feed.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-500"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <User size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{feed.author.split('@')[0]}</h4>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                          {new Date(feed.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    {feed.post_type === 'social' ? <Share2 size={16} className="text-sky-400" /> : <Briefcase size={16} className="text-emerald-400" />}
                    <div className="flex items-center gap-2">
                      <button onClick={() => openComposer(feed)} className="p-2 text-slate-600 hover:text-sky-400 transition-colors">
                        <ImageIcon size={16} />
                      </button>
                      <button onClick={() => handleDelete(feed.id)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Caption (First) */}
                  <div className="text-slate-200 text-lg leading-relaxed font-medium mb-8">
                    {feed.content.split('\n').map((p, i) => <p key={i} className="mb-4">{p}</p>)}
                  </div>

                  {/* Image (Second) */}
                  {(feed.image_base64 || feed.image_url) && (
                    <div className="rounded-2xl overflow-hidden bg-black/20 border border-white/5">
                      <img src={feed.image_base64 || feed.image_url || ''} alt="" className="w-full h-auto max-h-[600px] object-contain" />
                    </div>
                  )}
                </div>
              </motion.article>
            ))
          ) : feeds.length > 0 ? (
            <div className="text-center p-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
              <div className="text-slate-600 mb-4 font-black text-4xl uppercase tracking-tighter opacity-20">NO MATCHES</div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Adjust filters to see entries for this day</p>
              {feeds.some(f => new Date(f.created_at).toDateString() !== viewDate.toDateString()) && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                  <Calendar size={12} /> Posts found on other days
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
              <div className="text-slate-600 mb-4 font-black text-4xl uppercase tracking-tighter opacity-20">NULL DATA</div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No entries found in the database</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
