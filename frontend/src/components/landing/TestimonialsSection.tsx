import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Working with students through the CII Industry–Academia Excellence Initiative brought fresh perspectives and innovative solutions to our business challenges.",
      role: "Industry Partner",
      avatarBg: "bg-blue-100 text-blue-800",
      avatarTxt: "IP"
    },
    {
      quote: "CIISIC gave me the opportunity to work on a real industry problem and transform classroom learning into practical experience.",
      role: "Student Innovator",
      avatarBg: "bg-emerald-100 text-emerald-800",
      avatarTxt: "SI"
    },
    {
      quote: "This initiative has strengthened collaboration between academia and industry while creating meaningful opportunities for students.",
      role: "Faculty Mentor",
      avatarBg: "bg-amber-100 text-amber-800",
      avatarTxt: "FM"
    }
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide">
            Ecosystem Voices
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
            Collaboration That Creates Impact
          </h2>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
            Voices from the CII Ecosystem
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between relative shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
            >
              {/* Quote Icon overlay */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-200/80 pointer-events-none" />

              <div className="space-y-6">
                <p className="text-slate-600 text-sm sm:text-base italic leading-relaxed font-medium relative z-10">
                  “{t.quote}”
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 border-t border-slate-200/60 mt-6">
                {/* Clean Initial Avatar representing the stakeholder */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-extrabold text-xs uppercase shadow-sm ${t.avatarBg}`}>
                  {t.avatarTxt}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-950 font-display">
                    {t.role}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Verified Stakeholder
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
