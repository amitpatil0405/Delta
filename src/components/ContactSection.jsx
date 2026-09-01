import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
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
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#060608] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Mail className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            CONTACT DELTAFOX
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto font-sans">
            Connect with our team regarding institutional options intelligence, strategies, or collaboration inquiries.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 relative">

          {submitted ? (
            <div className="py-12 text-center space-y-4 font-mono">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-white">MESSAGE TRANSMITTED</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto font-sans">
                Thank you for contacting DeltaFox. Our options intelligence desk will review your message and respond shortly.
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
                  placeholder="Inquiry subject"
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
                  placeholder="Enter your message details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_25px_rgba(217,119,6,0.3)] flex items-center justify-center space-x-2 uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>SUBMIT INQUIRY</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
