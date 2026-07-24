import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const CONTACT_CARDS = [
  { icon: Mail,    color: 'text-brand-500',  bg: 'bg-brand-50',  gradient: 'from-brand-500 to-brand-600',
    label: 'Email Us', value: 'hello@foodbridge.org', sub: 'We respond within 24 hours' },
  { icon: Phone,   color: 'text-blue-500',   bg: 'bg-blue-50',   gradient: 'from-blue-500 to-blue-600',
    label: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Sat, 9 AM – 7 PM IST' },
  { icon: MapPin,  color: 'text-accent-500', bg: 'bg-accent-50', gradient: 'from-accent-500 to-accent-600',
    label: 'Visit Us', value: 'Mumbai HQ', sub: 'BKC, Mumbai, Maharashtra 400051' },
  { icon: Clock,   color: 'text-violet-500', bg: 'bg-violet-50', gradient: 'from-violet-500 to-violet-600',
    label: 'Response Time', value: '< 24 Hours', sub: 'Average first-response time' },
];

const SUBJECTS = [
  'General Inquiry', 'Partnership Proposal', 'Volunteer Program',
  'Donation Support', 'Technical Issue', 'Press / Media',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="overflow-hidden">
      <PageHeader
        title="Get in Touch"
        subtitle="Have a question, partnership idea, or just want to say hello? We'd love to hear from you."
      />

      {/* Contact cards */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-green opacity-30 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_CARDS.map(({ icon: Icon, color, bg, gradient, label, value, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="card p-6 card-hover group text-center"
              >
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <p className="text-xs font-semibold text-surface-300 uppercase tracking-widest mb-2">{label}</p>
                <p className="font-bold text-surface-dark">{value}</p>
                <p className="text-xs text-surface-300 mt-1">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Left info panel */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="badge-green mb-4 block w-fit">Let's Connect</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-surface-dark mb-4">
                  We're Here to <span className="text-gradient-green">Help</span>
                </h2>
                <p className="text-surface-300 leading-relaxed">
                  Whether you want to partner with us, volunteer, donate, or simply learn more about how Food Bridge works — our team is always here.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                {[
                  { icon: MessageSquare, color: 'text-brand-500', bg: 'bg-brand-50',  text: 'Partnership inquiries welcome' },
                  { icon: Clock,         color: 'text-blue-500',  bg: 'bg-blue-50',   text: 'Response within 24 hours' },
                  { icon: CheckCircle2,  color: 'text-brand-500', bg: 'bg-brand-50',  text: 'Dedicated support team' },
                ].map(({ icon: Icon, color, bg, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <span className="text-sm font-medium text-surface-dark">{text}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card p-6"
              >
                <h4 className="font-bold text-surface-dark mb-3">Our Office</h4>
                <p className="text-sm text-surface-300 leading-relaxed">
                  Food Bridge Headquarters<br />
                  Tower B, BKC Hub, G-Block<br />
                  Bandra Kurla Complex<br />
                  Mumbai, MH 400051, India
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="card p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-brand-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-surface-dark mb-3">Message Sent!</h3>
                    <p className="text-surface-300 mb-6">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="btn-primary">Send Another Message</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h3 className="text-xl font-bold text-surface-dark mb-1">Send a Message</h3>
                      <p className="text-sm text-surface-300">Fill in the form and we'll get back to you shortly.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-dark mb-1.5">Full Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                          className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-dark mb-1.5">Email Address</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                          className="input-field" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-dark mb-1.5">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} required className="input-field">
                        <option value="">Select a subject…</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-dark mb-1.5">Message</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                        placeholder="Tell us how we can help you…" className="input-field resize-none" />
                    </div>

                    <button type="submit" disabled={submitting}
                      className="btn-primary w-full py-3.5 text-base disabled:opacity-70">
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
