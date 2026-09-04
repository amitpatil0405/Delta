import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Inbox, Trash2, RefreshCw } from 'lucide-react';

const ADMIN_SESSION_KEY = 'deltafox_admin_logged_in';
const INQUIRIES_DB_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a06ca4d7d11100';

export default function ContactSection() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Admin view inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [showInquiriesPanel, setShowInquiriesPanel] = useState(false);

  // Fetch inquiries from Cloud DB on mount or when panel opens
  const fetchInquiries = async () => {
    try {
      const res = await fetch(INQUIRIES_DB_URL);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && Array.isArray(json.data.inquiries)) {
          setInquiries(json.data.inquiries);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch inquiries:', e);
    }
  };

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdminLoggedIn(sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
    };
    window.addEventListener('storage', checkAdmin);
    checkAdmin();
    fetchInquiries();
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  const saveInquiryToCloud = async (newInquiry) => {
    try {
      const updatedList = [newInquiry, ...inquiries].slice(0, 100);
      setInquiries(updatedList);
      await fetch(INQUIRIES_DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'deltafox_inquiries',
          data: { inquiries: updatedList }
        })
      });
    } catch (err) {
      console.warn('Could not save inquiry to cloud:', err);
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (window.confirm('Delete this inquiry record?')) {
      const updated = inquiries.filter(i => i.id !== inquiryId);
      setInquiries(updated);
      try {
        await fetch(INQUIRIES_DB_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'deltafox_inquiries',
            data: { inquiries: updated }
          })
        });
      } catch (err) {
        console.warn('Could not update cloud inquiries:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const inquiryRecord = {
      id: `inq_${Date.now()}`,
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: formData.name,
      email: formData.email,
      subject: formData.subject || 'DeltaFox Inquiry',
      message: formData.message
    };

    // 1. Save to cloud database for Admin visibility
    await saveInquiryToCloud(inquiryRecord);

    // 2. Submit via FormSubmit API to send email directly to amitpatil0405@gmail.com
    try {
      await fetch('https://formsubmit.co/ajax/amitpatil0405@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject ? `[DELTAFOX] ${formData.subject}` : `[DELTAFOX] Inquiry from ${formData.name}`,
          message: formData.message,
          _captcha: 'false'
        })
      });
    } catch (err) {
      console.warn('FormSubmit endpoint dispatch attempt completed:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 scroll-mt-28 bg-[#060608] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Admin Controls */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Mail className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            CONTACT DELTAFOX
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto font-sans">
            Connect with us regarding training programs, options trading strategies, or platform inquiries.
          </p>

          {isAdminLoggedIn && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowInquiriesPanel(!showInquiriesPanel);
                  fetchInquiries();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold hover:bg-amber-500/20 transition-all"
              >
                <Inbox className="w-4 h-4" />
                <span>{showInquiriesPanel ? 'HIDE INQUIRIES' : `VIEW RECEIVED INQUIRIES (${inquiries.length})`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Central Admin Received Inquiries Panel */}
        {isAdminLoggedIn && showInquiriesPanel && (
          <div className="glass-card rounded-3xl p-6 mb-10 border border-amber-500/40 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <Inbox className="w-4 h-4" />
                <span>RECEIVED USER INQUIRIES — CENTRAL ADMIN PANEL</span>
              </div>
              <button
                onClick={fetchInquiries}
                className="inline-flex items-center space-x-1 text-gray-400 hover:text-white text-[11px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>REFRESH</span>
              </button>
            </div>

            {inquiries.length === 0 ? (
              <p className="py-8 text-center text-gray-500">NO INQUIRIES RECORDED YET.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 rounded-xl bg-neutral-900/90 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{inq.name} ({inq.email})</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-gray-500">{inq.date}</span>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="text-gray-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-gray-300 font-bold text-[11px]">SUBJECT: {inq.subject}</div>
                    <p className="text-gray-400 font-sans text-xs bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form Container */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 relative">

          {submitted ? (
            <div className="py-12 text-center space-y-4 font-mono">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-white">INQUIRY SENT</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto font-sans">
                Your message has been received and routed to <strong className="text-amber-400">amitpatil0405@gmail.com</strong>.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-4 px-6 py-2.5 bg-neutral-900 border border-amber-500/40 text-amber-400 text-xs font-bold rounded-xl hover:bg-neutral-800 transition-all"
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 uppercase">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 uppercase">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 uppercase">SUBJECT</label>
                <input
                  type="text"
                  placeholder="Inquiry subject / Training Enrollment"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 uppercase">MESSAGE *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Enter your message details or training inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_25px_rgba(217,119,6,0.3)] flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'SENDING INQUIRY...' : 'Submit enquiry'}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
