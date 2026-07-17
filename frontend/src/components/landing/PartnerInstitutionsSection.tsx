import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PartnerInstitutionsSection: React.FC = () => {
  const logos = [
    { name: 'Jagran Lakecity University', src: '/images/jagran_lakecity_logo.jpg' },
    { name: 'LNCT Group', src: '/images/lnct_g_logo.png' },
    { name: 'LNCT University', src: '/images/lnct_university_logo.png' },
    { name: 'Oriental Group of Institutes', src: '/images/oriental_group_logo.png' },
    { name: 'Rabindranath Tagore University', src: '/images/rntu_logo.png' },
    { name: 'Scope Global Skills University', src: '/images/scope_global_logo.png' },
  ];

  return (
    <section id="partner-institutions" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200/60 scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide">
            Partner Network
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
            Powered by the CII Industry–Academia Excellence Initiative
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            A growing network of leading academic institutions across Madhya Pradesh, united by the Confederation of Indian Industry (CII) to strengthen industry–academia collaboration and innovation. Each partner institution hosts a CII Excellence Cell, bringing domain expertise, faculty leadership, and student innovation together to solve real industry challenges.
          </p>
        </div>

        {/* Integrated Statistics display (Section 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16 border-y border-slate-200/60 py-8">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#002147] tracking-tight font-display">35+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1.5">Partner Institutions</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">16 Bhopal, 20 Indore</p>
          </div>
          <div className="text-center sm:border-x border-slate-200/60 py-2 sm:py-0">
            <div className="text-3xl font-extrabold text-[#002147] tracking-tight font-display">7</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1.5">CII Excellence Cells</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Domain-Specific Hubs</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#002147] tracking-tight font-display">36</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1.5">Active Cooperations</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Madhya Pradesh Network</p>
          </div>
        </div>

        {/* Brand Logos Showcase Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-center">
          {logos.map((logo, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-center h-28 hover:shadow-md hover:border-slate-350 transition-all duration-300"
            >
              <img 
                src={logo.src} 
                alt={`${logo.name} logo`} 
                className="max-h-full max-w-full object-contain filter grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}

          {/* "+35 More" Special Grid Tile */}
          <div 
            className="bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-950 p-6 rounded-2xl flex flex-col items-center justify-center h-28 text-center text-white"
          >
            <span className="text-xl font-extrabold tracking-tight">35+</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 mt-1">Institutions</span>
          </div>
        </div>

        {/* View All CTAs */}
        <div className="mt-12 text-center">
          <Link
            to="/institutions"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:bg-[#002147] hover:text-white hover:border-[#002147] shadow-sm transition-all duration-300"
          >
            View All Partner Institutions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
