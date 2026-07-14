import React, { useEffect } from 'react';
import { INDORE_INSTITUTIONS, BHOPAL_INSTITUTIONS } from '../data/institutions';
import { Building2 } from 'lucide-react';

export const Institutions: React.FC = () => {
  // Ensure we start at the top of the page when navigating here
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#001A66] tracking-tight font-display leading-tight">
            Partner Institutions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Connecting leading technical universities, engineering colleges, and research institutes across Indore and Bhopal to drive student-led AI innovations for industry challenges.
          </p>
        </div>

        {/* Two-Column Grid for Cities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Indore Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="p-2.5 bg-blue-50 text-[#001A66] rounded-xl">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Indore Division</h2>
                <p className="text-xs text-slate-500 font-medium">{INDORE_INSTITUTIONS.length} Partner Institutions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INDORE_INSTITUTIONS.map((inst, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-none flex flex-col justify-center h-32 transition-all duration-300 hover:border-[#001A66] hover:-translate-y-0.5"
                >
                  <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2">
                    {inst.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bhopal Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="p-2.5 bg-amber-50/80 text-amber-800 rounded-xl">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Bhopal Division</h2>
                <p className="text-xs text-slate-500 font-medium">{BHOPAL_INSTITUTIONS.length} Partner Institutions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BHOPAL_INSTITUTIONS.map((inst, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-none flex flex-col justify-center h-32 transition-all duration-300 hover:border-[#001A66] hover:-translate-y-0.5"
                >
                  <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2">
                    {inst.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
