import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-16 sm:pt-20 pb-10 sm:pb-12 text-left">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-200">
          
          {/* Logo & Description Column */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <h4 className="text-lg font-extrabold text-[#002147] font-display tracking-tight">
              CIISIC
            </h4>
            <p className="text-xs leading-relaxed font-semibold text-slate-500">
              CII Industry–Academia Excellence Initiative — Bhopal, Madhya Pradesh. Turning industry challenges into student-led innovation.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002147] uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs font-bold text-slate-500">
              <li>
                <button 
                  onClick={() => handleScrollTo('hero')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollTo('about-ciisic')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  About CIISIC
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollTo('how-it-works')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollTo('our-ecosystem')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Excellence Cells
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollTo('challenge-areas')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Industry Challenges
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollTo('partner-institutions')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Partner Institutions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollTo('challenge-areas')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Events
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002147] uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold text-slate-500">
              <li>
                <span className="text-slate-800 font-extrabold block mb-0.5">
                  CII Industry–Academia Excellence Initiative
                </span>
                <span>Bhopal, Madhya Pradesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <a href="mailto:contact@ciisic.org" className="hover:text-blue-700 transition-colors">
                  contact@ciisic.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <span>+91 11 4901 0200</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Confederation of Indian Industry, Mantosh Sondhi Centre, 23, Institutional Area, Lodi Road, New Delhi, Delhi 110003
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002147] uppercase tracking-widest">
              Follow Us
            </h4>
            <ul className="space-y-3 text-xs font-bold text-slate-500">
              <li>
                <a 
                  href="https://www.linkedin.com/company/confederation-of-indian-industry/?originalSubdomain=in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  LinkedIn <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@FollowCII" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  YouTube <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/followcii/?hl=en" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  Instagram <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Info Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-550 font-bold uppercase tracking-wider gap-4">
          <p className="text-center sm:text-left">
            © 2026 CII Student Innovation Challenge (CIISIC)
          </p>
          <p className="text-slate-500">
            Platform Edition • Powered by Oriental Group
          </p>
        </div>

      </div>
    </footer>
  );
};
