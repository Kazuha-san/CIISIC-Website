import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export const GetInvolvedSection: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="get-involved" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/60 scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide">
            Get Involved
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight font-display">
            Ready to Solve the Next Industry Challenge?
          </h2>
          <p className="text-slate-650 text-sm sm:text-base leading-relaxed">
            Whether you're an industry partner looking to solve business challenges or an institution preparing future innovators, join the CII Industry–Academia Excellence Initiative driving real-world innovation through collaboration.
          </p>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Become an Industry Partner */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-[28px] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest block">
                    Connect &amp; Innovate
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-950 font-display">
                    Become an Industry Partner
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                Submit real business challenges, get matched with expert faculty-led student teams, and co-develop practical, research-backed solutions.
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  <div className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] font-bold shrink-0">✓</div>
                  <span>Verified faculty &amp; student team matching</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  <div className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] font-bold shrink-0">✓</div>
                  <span>Structured challenge submission process</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  <div className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] font-bold shrink-0">✓</div>
                  <span>Milestone tracking &amp; solution reports</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to="/industry/login"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 bg-[#002147] hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-sm"
              >
                Enter Industry Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: CII Platform Admin */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-[28px] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-amber-500 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block">
                    Ecosystem Control
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-950 font-display">
                    CII Platform Admin
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                Review submitted industry challenges, manage partner institutions and Excellence Cells, and coordinate ecosystem engagements.
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  <div className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] font-bold shrink-0">✓</div>
                  <span>Centralized challenge review &amp; routing</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  <div className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] font-bold shrink-0">✓</div>
                  <span>Multi-institution coordination dashboard</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  <div className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] font-bold shrink-0">✓</div>
                  <span>Secure access to platform insights</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to="/admin/login"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 bg-slate-900 hover:bg-slate-950 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-sm"
              >
                Access Admin Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Additional Buttons underneath */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-12">
          <button
            onClick={() => handleScrollTo('partner-institutions')}
            className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Become a Partner Institution
          </button>
          <button
            onClick={() => handleScrollTo('about-ciisic')}
            className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Explore CIISIC
          </button>
        </div>

      </div>
    </section>
  );
};
