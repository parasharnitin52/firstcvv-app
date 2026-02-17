import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, ArrowRight, Star, Shield, Cpu } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const LandingPage = () => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Neural Parsing',
      description: 'Advanced heuristic engine that decodes your existing resume in milliseconds.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Preview',
      description: 'Real-time rendering of your career data across multiple premium templates.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'ATS Proof',
      description: 'Engineered for high-compatibility with modern recruitment algorithms.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Black & Bold',
      description: 'Exclusive high-impact design language for the modern professional.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black relative overflow-hidden">
      <ParticleBackground />
      {/* Navigation */}
      <nav className="container mx-auto px-8 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src="/logo.svg" alt="FirstCV Logo" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all">
              Signup
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-8 py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-end">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">The Next Generation of Career Presentation</span>
                <h1 className="text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter uppercase grayscale">
                  Master<br />
                  Your<br />
                  <span className="text-white">Impact</span>
                </h1>
              </div>
              <p className="text-xl text-white/40 leading-relaxed max-w-lg font-medium">
                Ditch the generic. Build a career identity that commands attention with our premium high-contrast design system.
              </p>
              <div className="flex flex-wrap gap-6 pt-6">
                <Link to="/register" className="bg-white text-black px-12 py-6 font-black uppercase tracking-widest group flex items-center gap-4 hover:scale-105 transition-all">
                  Create Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-white group overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
                  alt="CV Preview"
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-12 hidden lg:block">
                <div className="text-5xl font-black text-black leading-none uppercase tracking-tighter italic">99th<br />Percentile</div>
                <div className="mt-4 text-[8px] font-bold text-black/40 uppercase tracking-[0.3em]">Hiring Probability Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-8 py-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32">
            <h2 className="text-5xl font-black uppercase max-w-xl leading-none tracking-tighter">
              Engineered for the
              Highest Level of
              <span className="text-white/40 block">Executive Presence</span>
            </h2>
            <p className="text-white/40 max-w-sm font-medium">Our system is designed to remove the noise and focus purely on your career trajectory.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#050505] p-12 group hover:bg-white transition-all duration-500"
              >
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-8 group-hover:border-black/10 group-hover:text-black">
                  {feature.icon}
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-4 group-hover:text-black">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium group-hover:text-black/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-8 py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { val: '100K+', label: 'Documents' },
            { val: '4.9/5', label: 'Satisfaction' },
            { val: '50K+', label: 'Hires' },
            { val: 'ATS+', label: 'Compliant' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl font-black tracking-tighter uppercase">{stat.val}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-8 py-40">
        <div className="relative bg-white p-24 text-black text-center overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-6xl font-black uppercase tracking-tighter mb-8 max-w-2xl leading-none">
              Initialize Your Career Upgrade Today
            </h2>
            <p className="text-sm font-bold opacity-40 uppercase tracking-[0.4em] mb-12">No Credit Card Required • Instant Access</p>
            <Link to="/register" className="bg-black text-white px-16 py-8 font-black uppercase tracking-widest hover:scale-105 transition-all text-xl">
              Get Started
            </Link>
          </div>
          {/* Decorative background text */}
          <div className="absolute -bottom-20 -left-20 text-[20vw] font-black text-black/[0.03] select-none tracking-tighter uppercase leading-none">CV</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-8 py-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 bg-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-black" />
            </div>
            <span className="font-black uppercase tracking-[0.3em] text-xs">FirstCV</span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
            © 2024 FirstCV DESIGN SYSTEM. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
