import React from 'react';
import { Building2, GraduationCap, Users } from 'lucide-react';

export const WhyCiiSection: React.FC = () => {
  const stakeholders = [
    {
      title: "Industry",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
      bg: "bg-blue-50/50",
      border: "hover:border-blue-500",
      text: "Transform business challenges into practical, research-backed solutions while engaging with future talent and discovering new partnerships."
    },
    {
      title: "Students",
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      bg: "bg-emerald-50/50",
      border: "hover:border-emerald-500",
      text: "Gain real-world experience by solving meaningful industry challenges under expert mentorship, building a strong portfolio and career-ready skills."
    },
    {
      title: "Institutions",
      icon: <GraduationCap className="h-6 w-6 text-amber-600" />,
      bg: "bg-amber-50/50",
      border: "hover:border-amber-500",
      text: "Strengthen innovation ecosystems through applied research, collaboration, and sustained industry engagement that benefits students and faculty alike."
    }
  ];

  return (
    <section id="why-cii" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Core Philosophy Section (Section 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16 sm:mb-20">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide">
              Our Purpose
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
              Why the CII Industry–Academia Excellence Initiative
            </h2>
            <p className="text-blue-700 text-base font-semibold italic">
              "Solving real problems through collaborative innovation."
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-2">
              Most organizations know innovation matters — what's missing is research capacity, fresh thinking, or a low-risk way to test new ideas. The CII Industry–Academia Excellence Initiative bridges industry with academia, creating opportunities to solve real-world challenges through collective expertise, innovation, and shared purpose.
            </p>
          </div>
        </div>

        {/* Stakeholder Value Cards Section (Section 8) */}
        <div className="space-y-6">
          <div className="text-left border-b border-slate-100 pb-4 mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Stakeholder Ecosystem</h3>
            <p className="text-lg font-bold text-slate-800 mt-1">Creating Value for Every Stakeholder</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stakeholders.map((s, idx) => (
              <div 
                key={idx}
                className={`bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-sm transition-all duration-300 ${s.border}`}
              >
                <div className="space-y-6">
                  <div className={`p-3.5 ${s.bg} rounded-2xl w-fit`}>
                    {s.icon}
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900 font-display">{s.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
