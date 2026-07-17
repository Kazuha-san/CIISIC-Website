import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const steps = [
    "Industries submit real business challenges.",
    "Challenges are routed to the appropriate CII Excellence Cell.",
    "Faculty mentor multidisciplinary student teams.",
    "Students develop innovative, research-backed solutions.",
    "Industries evaluate solutions for implementation and future collaboration."
  ];

  return (
    <section id="about-ciisic" className="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden scroll-mt-20">
      {/* Decorative vector background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-blue-50/40 filter blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-50/30 filter blur-3xl pointer-events-none"></div>

      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Heading and detailed bullet list */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide">
                About CIISIC
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.1] text-slate-900 font-display">
                One Platform. Endless Possibilities.
              </h2>
            </div>
            
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              CIISIC is the official collaboration platform developed under the CII Industry–Academia Excellence Initiative, designed to connect industries with students, faculty experts, and partner institutions through a structured innovation ecosystem.
            </p>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">The Collaboration Flow</h3>
              <ul className="space-y-4">
                {steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4 items-start group">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-blue-700 text-base font-semibold leading-relaxed border-t border-slate-100 pt-6">
              CIISIC transforms classroom knowledge into real-world impact while strengthening the connection between industry and academia.
            </p>
          </div>

          {/* Right Column: Premium Visual Classroom-to-Impact Pathway Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <div className="bg-slate-50 border border-slate-200/80 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] w-full max-w-[500px] flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">
                Transformation Pathway
              </h3>

              <div className="space-y-6">
                {/* Pathway Step 1 */}
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm transition-all hover:border-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs shrink-0">
                      IN
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Industry Input</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                    Corporate partners upload operational challenges, technical bottlenecks, or research-intensive goals to the platform.
                  </p>
                </div>

                {/* Connection Indicator */}
                <div className="flex justify-center items-center py-1">
                  <div className="h-6 w-[2px] bg-dashed border-l border-slate-300"></div>
                </div>

                {/* Pathway Step 2 */}
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm transition-all hover:border-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs shrink-0">
                      MID
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Excellence Matching</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                    CII reviews the proposal and maps it to the specialized Excellence Cell hosted by a regional partner academic institution.
                  </p>
                </div>

                {/* Connection Indicator */}
                <div className="flex justify-center items-center py-1">
                  <div className="h-6 w-[2px] bg-dashed border-l border-slate-300"></div>
                </div>

                {/* Pathway Step 3 */}
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm transition-all hover:border-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">
                      OUT
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Innovation Output</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                    Faculty-guided student innovators develop prototype solutions, running low-risk validation pilots.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
