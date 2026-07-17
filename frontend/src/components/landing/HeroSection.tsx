import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, GraduationCap, Users, Brain, ShieldCheck, Lock } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9] pt-16 pb-20 md:py-24 lg:py-28 border-b border-slate-200/60 scroll-mt-24">
      {/* Subtle high-tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
      
      {/* Ambient gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-100/30 filter blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-amber-100/20 filter blur-3xl pointer-events-none"></div>

      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start">
          
          {/* Left Column: Wording and hierarchy aligned with the screenshot */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#002147] tracking-tight leading-[1.1] pt-2 font-display">
              Where industry challenges meet student innovation
            </h1>
            
            <div className="w-16 h-1 bg-[#0056b3] rounded-full my-6"></div>
            
            <div className="space-y-1 text-[#0056b3] text-lg font-bold tracking-wide italic leading-relaxed">
              <p>"Every challenge has the potential to inspire innovation."</p>
              <p>"Every student has the potential to create change."</p>
            </div>
            
            <p className="text-slate-650 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Whether you are an industry partner seeking innovative solutions, a student looking for meaningful projects, or an institution committed to applied research and collaboration, CII provides a structured pathway to turn ideas into impact.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/industry/login"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl text-sm font-bold text-white bg-[#002147] hover:bg-[#001A66] transition-all duration-300 shadow-sm active:scale-98"
              >
                <Building2 className="h-5 w-5" /> Register as Industry
              </Link>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl text-sm font-bold text-[#002147] bg-white border-2 border-[#002147] hover:bg-slate-50 transition-all duration-300 shadow-sm active:scale-98"
              >
                <ShieldCheck className="h-5 w-5" /> CII Admin
              </Link>
            </div>
          </div>

          {/* Right Column: High Fidelity Collaboration Pillars Card */}
          <div className="lg:col-span-6 relative flex justify-end w-full self-center">
            <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-200 w-full max-w-[640px] p-6 sm:p-8 md:p-10 flex flex-col space-y-8 sm:space-y-10 shadow-sm">
              
              {/* Section 1: Header with custom ecosystem subtitle */}
              <div className="space-y-1.5 text-left">
                <h3 className="text-sm font-extrabold text-[#002147] uppercase tracking-wider">
                  Collaboration Pillars
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  A unified framework connecting research, industry, and next-generation talent to safely prototype real-world solutions.
                </p>
              </div>

              {/* Section 2: 2x2 Grid of Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 sm:gap-y-10 text-left">
                
                {/* Pillar 1: Industry */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50/70 text-blue-600 rounded-xl shrink-0">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#002147] text-sm sm:text-base">Industry</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Share real-world problems and drive student prototypes.
                    </p>
                  </div>
                </div>

                {/* Pillar 2: Academia */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50/70 text-amber-600 rounded-xl shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#002147] text-sm sm:text-base">Academia</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Provide deep domain mentorship and research oversight.
                    </p>
                  </div>
                </div>

                {/* Pillar 3: Students */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50/70 text-emerald-600 rounded-xl shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#002147] text-sm sm:text-base">Students</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Apply technical talent to solve complex industrial issues.
                    </p>
                  </div>
                </div>

                {/* Pillar 4: AI Hub */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50/70 text-purple-600 rounded-xl shrink-0">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#002147] text-sm sm:text-base">AI Hub</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Co-create, iterate, and deploy secure enterprise solutions.
                    </p>
                  </div>
                </div>

              </div>

              {/* Section 3: Metadata Badges */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-full border border-slate-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-500" /> Unified Platform
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-full border border-slate-100">
                  <Lock className="h-3.5 w-3.5 text-slate-500" /> Secure Matching
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
