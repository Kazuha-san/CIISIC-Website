import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowUpRight, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ChallengeAreasSection: React.FC = () => {
  const domains = [
    "Marketing & Brand Strategy",
    "People & Finance Solutions",
    "Engineering Excellence",
    "Design Innovation",
    "Healthcare & Pharma",
    "Artificial Intelligence",
    "Agriculture & Sustainability",
    "Manufacturing",
    "Digital Transformation",
    "Supply Chain",
    "Business Operations",
    "Smart Cities & Urban Innovation"
  ];

  return (
    <section id="challenge-areas" className="py-24 bg-slate-50 border-t border-slate-200/60 scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 space-y-20">
        
        {/* Main Section: Domains Grid + Flyer Poster split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Descriptions and Grid of Domains */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide">
                Challenge Areas
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
                Every Industry Challenge Creates an Opportunity
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The CII Industry–Academia Excellence Initiative welcomes challenges from diverse sectors and connects them with the most relevant Excellence Cell, academic institution, faculty experts, and student innovators.
              </p>
            </div>

            {/* Grid of Domains */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {domains.map((domain, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 bg-white border border-slate-250 p-4 rounded-xl shadow-sm hover:border-blue-500 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0"></div>
                  <span className="text-xs sm:text-sm text-slate-700 font-bold leading-normal">{domain}</span>
                </div>
              ))}
            </div>

            {/* CTA Submit Button */}
            <div className="pt-2">
              <Link
                to="/industry/login"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-bold text-white bg-[#002147] hover:bg-slate-900 shadow-md transition-all duration-200"
              >
                Submit Your Industry Challenge <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Poster of the Flyer */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-lg w-full max-w-[400px] group transition-all duration-300 hover:shadow-2xl hover:border-slate-300">
              <div className="relative overflow-hidden rounded-2xl shadow-sm">
                <img 
                  src="/images/flyer_2.jpeg" 
                  alt="CII Students Innovation Challenge Flyer" 
                  className="w-full h-auto block group-hover:scale-101 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <Link 
                    to="/industry/login"
                    className="px-4 py-2.5 bg-white text-slate-950 text-xs font-black uppercase rounded-lg shadow-md flex items-center gap-1 hover:bg-slate-100 transition-colors"
                  >
                    Enter Portal <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="p-4 pt-4 text-center space-y-1.5">
                <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest">
                  Featured Challenge Graphic
                </span>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  The Flyer highlights five foundational fields: Marketing Wars, People &amp; Finance, Engineering, Design, and Healthcare.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 10: Events & Announcements Sub-Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 border border-blue-950 rounded-[32px] p-8 sm:p-10 relative overflow-hidden shadow-lg text-white">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 filter blur-[60px] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/35 text-blue-300 text-[10px] font-black uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" /> Events Hub
              </div>
              <h3 className="text-2xl font-extrabold font-display leading-snug">
                Connecting the Innovation Ecosystem
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Stay updated with workshops, seminars, innovation challenges, industry interactions, startup showcases, and collaborative events organized under the CII Industry–Academia Excellence Initiative.
              </p>
            </div>

            <div className="shrink-0 flex items-start">
              <button 
                onClick={() => {
                  const el = document.getElementById('get-involved');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white text-[#002147] hover:bg-slate-100 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all duration-150 whitespace-nowrap active:scale-98"
              >
                View All Events
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
