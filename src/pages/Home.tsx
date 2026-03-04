import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, ArrowRight, Download, Trophy, Filter, PieChart, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { extractVideoId } from '../utils/youtubeParser';

export const Home: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Invalid YouTube video link. Please check the URL.');
      return;
    }
    setError('');
    navigate(`/tool?v=${videoId}`);
  };

  const features = [
    { icon: <Download className="w-5 h-5" />, title: 'Export to CSV', description: 'Download all comments in a clean CSV format for spreadsheets.' },
    { icon: <Trophy className="w-5 h-5" />, title: 'Giveaway Picker', description: 'Run fair giveaways with random winner selection and filters.' },
    { icon: <Filter className="w-5 h-5" />, title: 'Keyword Filtering', description: 'Search and filter comments instantly by any keyword.' },
    { icon: <PieChart className="w-5 h-5" />, title: 'Sentiment Analysis', description: 'Understand your audience mood with AI sentiment detection.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-50/50 via-transparent to-transparent opacity-70" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold mb-8 border border-red-100">
              <Youtube className="w-4 h-4" />
              <span>YouTube Creator Tools</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              Export and Analyze <br />
              <span className="text-red-600">YouTube Comments</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Fetch comments from any YouTube video, export them, filter them, run giveaways, and analyze sentiment instantly.
            </p>

            <form onSubmit={handleFetch} className="max-w-2xl mx-auto relative group">
              <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-2xl shadow-2xl shadow-red-600/10 border border-gray-100 focus-within:border-red-200 transition-all">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube video URL here..."
                  className="flex-1 px-6 py-4 text-lg outline-none rounded-xl"
                />
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  Fetch Comments <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              {error && (
                <p className="mt-4 text-red-600 font-semibold text-sm flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                  {error}
                </p>
              )}
            </form>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No login required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Unlimited exports</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Powerful Features for Creators</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to manage your YouTube community engagement in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">How many comments can I export?</h4>
              <p className="text-gray-600">Our tool can fetch up to 500 comments per video in the free version. This is usually more than enough for most giveaways and analysis.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Is my data safe?</h4>
              <p className="text-gray-600">We don't store any of your data or the comments you fetch. Everything is processed in real-time and remains private to you.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Does it work with private videos?</h4>
              <p className="text-gray-600">No, the tool only works with public YouTube videos as it uses the official YouTube Data API.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
