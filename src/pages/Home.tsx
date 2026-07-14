import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Users, GraduationCap, ArrowRight, Brain, Cpu, Layers, 
  Workflow, CheckCircle2, TrendingUp, Check, Mail, Phone, MapPin, 
  X, ChevronRight, Code, Zap, ShieldCheck, ArrowUpRight, HelpCircle,
  Lock
} from 'lucide-react';

export const Home: React.FC = () => {
  // Modal state for Ecosystem Initiatives
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // State for expanded partner list
  const [showAllPartners, setShowAllPartners] = useState(false);

  // Partner institutions list
  const partnerInstitutions = [
    { name: "Indian Institute of Technology, Delhi", short: "IIT Delhi", type: "Tier 1 Institution" },
    { name: "Indian Institute of Technology, Bombay", short: "IIT Bombay", type: "Tier 1 Institution" },
    { name: "National Institute of Technology, Bhopal", short: "MANIT Bhopal", type: "Tier 1 Institution" },
    { name: "Oriental Group of Institutes", short: "OGI", type: "Academic Partner" },
    { name: "Birla Institute of Technology and Science, Pilani", short: "BITS Pilani", type: "Tier 1 Institution" },
    { name: "Delhi Technological University", short: "DTU Delhi", type: "Academic Partner" },
    { name: "Indian Institute of Science, Bangalore", short: "IISc Bangalore", type: "Research Partner" },
    { name: "Vellore Institute of Technology", short: "VIT Vellore", type: "Academic Partner" }
  ];

  // Ecosystem details for interactive modals
  const ecosystemDetails: Record<string, {
    title: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    points: string[];
  }> = {
    cell: {
      title: "AI in Business Excellence Cell",
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      color: "from-blue-500/10 to-indigo-500/10 border-blue-200",
      description: "Helping organizations begin their AI journey through readiness assessment, low-risk proof-of-concepts, and capability building.",
      points: [
        "AI Readiness Assessment & Gap Analysis for medium to large enterprises",
        "Strategic use-case mapping aligned with core operational bottlenecks",
        "ROI-driven AI implementation consulting and executive alignment",
        "Structured capability building to prepare human resources for agentic AI workflows"
      ]
    },
    ciisic: {
      title: "CIISIC Platform",
      icon: <Cpu className="h-8 w-8 text-amber-600" />,
      color: "from-amber-500/10 to-orange-500/10 border-amber-200",
      description: "A structured digital platform connecting industries with student innovators to solve real business challenges through guided collaboration.",
      points: [
        "Secure problem statement filing and streamlined administrative approval",
        "Vetted matchmaking connecting industry hurdles with expert collegiate professors",
        "Milestone tracking, interactive timeline monitoring, and transparent reviews",
        "Standardized legal terms ensuring IP protection and collaboration safety"
      ]
    },
    hub: {
      title: "AI Hub",
      icon: <Layers className="h-8 w-8 text-emerald-600" />,
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-200",
      description: "A regional capability center focused on developing practical AI solutions while nurturing innovation and entrepreneurship.",
      points: [
        "Vetted evaluation sandboxes with robust high-performance compute guidance",
        "One-on-one mentorship from distinguished silicon architects and industry scientists",
        "Technical audit pipelines verifying model performance and architectural integrity",
        "Direct pathways for students to commercialize prototypes and found tech startups"
      ]
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-[#001A66]/10 selection:text-[#001A66] scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9] pt-16 pb-20 md:py-24 lg:py-28 border-b border-slate-200/60 scroll-mt-24">
        {/* Subtle high-tech grid background representing AWS architecture philosophy */}
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
              
              <p className="text-[#0056b3] text-lg font-bold tracking-wide italic leading-relaxed">
                "Bridging Industry Challenges with Student Innovation"
              </p>
              
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                Helping industries adopt AI with confidence through academic expertise, collaborative innovation, and practical AI solutions. Under the CII Industry Academia Excellence Cell, CIISIC connects industry, academia, and student talent through the AI in Business Excellence Cell, CIISIC, and AI Hub.
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
              <div className="bg-white rounded-[24px] border border-slate-200 w-full max-w-[640px] p-8 sm:p-10 flex flex-col space-y-8 sm:space-y-10">
                
                {/* Section 1: Header with custom ecosystem subtitle */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-[#002147] uppercase tracking-wider">
                    Collaboration Pillars
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    A unified framework connecting research, industry, and next-generation talent to safely prototype real-world solutions.
                  </p>
                </div>

                {/* Section 2: 2x2 Grid of Pillars separated by pure whitespace, horizontal layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 sm:gap-y-10">
                  
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

                {/* Section 3: Lightweight, modern metadata badges */}
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

      {/* 2. WHY THIS INITIATIVE */}
      <section id="about-ciisic" className="py-24 sm:py-32 bg-white scroll-mt-24 relative overflow-hidden">
        {/* Subtle ambient light effects */}
        <div className="absolute top-1/2 -left-48 w-96 h-96 rounded-full bg-blue-50/50 filter blur-3xl pointer-events-none -translate-y-1/2"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-emerald-50/30 filter blur-3xl pointer-events-none"></div>

        <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 xl:gap-28 lg:items-stretch items-center">
            
            {/* Left Column: Problem -> Solution Illustration with modern SaaS cards */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start w-full">
              <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-[24px] w-full max-w-[480px] flex flex-col justify-between shadow-none relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-blue-200 to-emerald-200"></div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center mb-4 lg:mb-2">
                  Strategic Transformation Pathway
                </h3>

                {/* Problem Box */}
                <div className="bg-rose-50/20 border border-rose-100/60 p-4 sm:p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100/80 text-rose-600 shrink-0">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">Industry Problem</h4>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 sm:space-y-2.5 font-semibold leading-relaxed pl-1">
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-400 font-bold mt-0.5 shrink-0">•</span>
                      <span>Difficulty identifying the right high-value AI use cases</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-400 font-bold mt-0.5 shrink-0">•</span>
                      <span>High financial risk in early-stage validation & prototyping</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-400 font-bold mt-0.5 shrink-0">•</span>
                      <span>Critical deficit of specialized in-house machine learning talent</span>
                    </li>
                  </ul>
                </div>

                {/* Transition Arrow with custom badge */}
                <div className="flex justify-center items-center py-2 lg:py-1 relative">
                  <div className="absolute inset-x-0 flex items-center justify-center">
                    <div className="w-full border-t border-dashed border-slate-200"></div>
                  </div>
                  <div className="flex flex-col items-center relative z-10 bg-white px-4">
                    <div className="p-2 bg-blue-50/80 rounded-full border border-blue-100 text-[#0056b3] shadow-sm">
                      <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
                    </div>
                    <span className="text-[9px] text-[#0056b3] font-black uppercase tracking-widest mt-1.5 bg-white px-1">Vetted Matching</span>
                  </div>
                </div>

                {/* Solution Box */}
                <div className="bg-emerald-50/20 border border-emerald-100/60 p-4 sm:p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-600 shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider">Academic Solution</h4>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 sm:space-y-2.5 font-semibold leading-relaxed pl-1">
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                      <span>Trusted, vendor-neutral exploration sandbox environment</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                      <span>Secure, phased proof-of-concept validation portal</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                      <span>Direct collaboration pathways with elite academia & students</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Heading, paragraph, and complementary grid to balance layout */}
            <div className="lg:col-span-7 order-1 lg:order-2 text-left flex flex-col justify-between h-full py-1">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] leading-[1.1] font-extrabold text-[#002147] tracking-tight font-display">
                  Every AI Journey Needs the Right Starting Point.
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Many organizations know AI can transform their business, but struggle to identify the right use cases, reduce implementation risks, and build internal expertise. This initiative provides a trusted, vendor-neutral environment where industries can explore AI, validate ideas, and collaborate with academia before making major technology investments.
                </p>
              </div>

              {/* 2x2 Clean Minimal Highlight Grid to perfectly balance the left card height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-slate-50 text-slate-600 rounded">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <h4 className="font-extrabold text-[#002147] text-sm">Risk Mitigation</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Test hypotheses and run low-risk PoCs with dedicated university resources before committing key capital.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-slate-50 text-slate-600 rounded">
                      <Users className="h-4 w-4" />
                    </span>
                    <h4 className="font-extrabold text-[#002147] text-sm">Elite Matchmaking</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Direct access to specialized student talent pipelines, mentored closely by world-class academic faculty.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-slate-50 text-slate-600 rounded">
                      <Brain className="h-4 w-4" />
                    </span>
                    <h4 className="font-extrabold text-[#002147] text-sm">Vendor Neutrality</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Receive unbiased guidance, open benchmarks, and fully transparent algorithmic development.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-slate-50 text-slate-600 rounded">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <h4 className="font-extrabold text-[#002147] text-sm">Protected IP</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Robust administrative and legal frameworks that completely safeguard company data and project output.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR ECOSYSTEM */}
      <section id="our-ecosystem" className="py-20 bg-[#f8fafc] border-y border-slate-200/60 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002147] tracking-tight font-display">
              One Ecosystem. Three Complementary Initiatives.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Together, the AI in Business Excellence Cell, CIISIC, and AI Hub create a connected ecosystem that helps industries assess AI readiness, solve real-world challenges, and build sustainable innovation through collaboration with academic institutions and students.
            </p>
          </div>

          {/* Three equal-sized bordered cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: AI in Business Excellence Cell */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 flex flex-col justify-between shadow-none transition-all duration-300 hover:border-blue-600 hover:-translate-y-1">
              <div className="space-y-4 text-left">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#002147]">
                  AI in Business Excellence Cell
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Helping organizations begin their AI journey through readiness assessment, low-risk proof-of-concepts, and capability building.
                </p>
              </div>
              <span 
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#0056b3] hover:text-[#002147] transition-colors self-start cursor-default"
              >
                — Learn More →
              </span>
            </div>

            {/* Card 2: CIISIC */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 flex flex-col justify-between shadow-none transition-all duration-300 hover:border-blue-600 hover:-translate-y-1">
              <div className="space-y-4 text-left">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#002147]">
                  CIISIC
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A structured digital platform connecting industries with student innovators to solve real business challenges through guided collaboration.
                </p>
              </div>
              <span 
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#0056b3] hover:text-[#002147] transition-colors self-start cursor-default"
              >
                — Learn More →
              </span>
            </div>

            {/* Card 3: AI Hub */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 flex flex-col justify-between shadow-none transition-all duration-300 hover:border-blue-600 hover:-translate-y-1">
              <div className="space-y-4 text-left">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#002147]">
                  AI Hub
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A regional capability center focused on developing practical AI solutions while nurturing innovation and entrepreneurship.
                </p>
              </div>
              <span 
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#0056b3] hover:text-[#002147] transition-colors self-start cursor-default"
              >
                — Learn More →
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002147] tracking-tight font-display">
              Turning Industry Challenges into AI Solutions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every challenge follows a structured, transparent workflow — from industry problem identification to AI-powered prototype development — ensuring collaboration, accountability, and practical outcomes for all stakeholders.
            </p>
          </div>

          {/* Workflow Timeline */}
          <div className="relative">
            {/* Horizontal timeline line for Desktop */}
            <div className="hidden lg:block absolute top-10 left-12 right-12 h-0.5 bg-slate-200 z-0"></div>

            {/* Responsive steps container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 relative z-10">
              
              {/* Step 1 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-none transition-all duration-300 hover:border-[#0056b3]">
                <div className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-none">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Industry Challenge</h4>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-none transition-all duration-300 hover:border-[#0056b3]">
                <div className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-none">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">AI in Business Excellence Cell</h4>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-none transition-all duration-300 hover:border-[#0056b3]">
                <div className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-none">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">CIISIC Platform</h4>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-none transition-all duration-300 hover:border-[#0056b3]">
                <div className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-none">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Faculty + Student Teams</h4>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-none transition-all duration-300 hover:border-[#0056b3]">
                <div className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-none">
                  5
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Prototype Development</h4>
                </div>
              </div>

              {/* Step 6 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-none transition-all duration-300 hover:border-[#0056b3]">
                <div className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-none">
                  6
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">AI Hub Validation</h4>
                </div>
              </div>

              {/* Step 7 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-none transition-all duration-300 hover:border-[#0056b3]">
                <div className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-none">
                  7
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Industry Implementation</h4>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. WHY PARTNER WITH US */}
      <section className="py-20 bg-[#f8fafc] border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002147] tracking-tight font-display">
              Delivering Value for Every Stakeholder
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Whether you are an industry partner, educational institution, or student, this initiative creates meaningful opportunities to innovate, collaborate, and build practical AI capabilities that generate real-world impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Industry */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 flex flex-col shadow-none transition-all duration-300 hover:border-blue-600 hover:-translate-y-1">
              <div className="space-y-5 text-left">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#002147]">Industry</h3>
                
                <ul className="space-y-3 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#0056b3] shrink-0" />
                    <span>AI readiness</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#0056b3] shrink-0" />
                    <span>Low-risk pilots</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#0056b3] shrink-0" />
                    <span>Expert academic guidance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Institutions */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 flex flex-col shadow-none transition-all duration-300 hover:border-amber-500 hover:-translate-y-1">
              <div className="space-y-5 text-left">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#002147]">Institutions</h3>
                
                <ul className="space-y-3 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Industry collaboration</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Research opportunities</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Faculty engagement</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Students */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 flex flex-col shadow-none transition-all duration-300 hover:border-emerald-500 hover:-translate-y-1">
              <div className="space-y-5 text-left">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#002147]">Students</h3>
                
                <ul className="space-y-3 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Live projects</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Industry mentoring</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Innovation experience</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PARTNER INSTITUTIONS */}
      <section id="partner-institutions" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001A66] tracking-tight font-display">
              Powered by a Growing Academic Network
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              CIISIC brings together leading institutions across Indore and Bhopal to strengthen industry–academia collaboration and create opportunities for students, faculty, and businesses to innovate together.
            </p>
          </div>

          {/* Integrated Statistics display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8 border-y border-slate-100 py-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-[#001A66]">36+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Partner Institutions</div>
            </div>
            <div className="text-center border-y sm:border-y-0 sm:border-x border-slate-100 py-4 sm:py-0">
              <div className="text-3xl font-extrabold text-[#001A66]">20</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Institutions in Indore</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-[#001A66]">16</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Institutions in Bhopal</div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/institutions"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#001A66] hover:text-white bg-white border border-slate-200 px-6 py-3.5 rounded-xl shadow-none transition-all hover:bg-[#001A66] hover:border-[#001A66]"
            >
              View All Institutions →
            </Link>
          </div>

        </div>
      </section>

      {/* 7. GET INVOLVED */}
      <section id="get-involved" className="py-20 bg-slate-50 border-t border-slate-200/60 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002147] tracking-tight font-display leading-tight">
              Ready to Build the Future with AI?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Whether you're an industry partner looking to solve business challenges or an institution preparing future innovators, join the CII initiative driving practical AI adoption through collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-6 text-left">
            
            {/* Card 1: Industry Portal */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#0056b3] group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0056b3]"></div>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-[#0056b3] rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#0056b3] tracking-widest">Connect &amp; Innovate</span>
                    <h3 className="text-xl font-extrabold text-[#002147] font-display">Become an Industry Partner</h3>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Propose corporate challenges, match with expert academic researchers, and co-develop robust AI solutions with managed operational risk.
                </p>

                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                    <span className="text-emerald-500">✓</span> Verified research team matchmaking
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                    <span className="text-emerald-500">✓</span> Standardized IP protections &amp; terms
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                    <span className="text-emerald-500">✓</span> Interactive project milestone tracking
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  to="/industry/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#002147] hover:bg-[#0056b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-150 shadow-sm active:scale-98"
                >
                  Enter Industry Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Admin Portal */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:border-amber-500 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Ecosystem Control</span>
                    <h3 className="text-xl font-extrabold text-[#002147] font-display">CII Platform Admin</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Review submitted corporate requirements, audit researcher matches, manage institutional lists, and coordinate ecosystem engagements.
                </p>

                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                    <span className="text-amber-500">✓</span> Centralized proposal audits &amp; reviews
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                    <span className="text-amber-500">✓</span> Multi-institution coordination dashboard
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                    <span className="text-amber-500">✓</span> Secure access to analytical insights
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  to="/admin/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-150 shadow-sm active:scale-98"
                >
                  Access Admin Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Four-column footer layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 text-left">
            
            {/* Quick Links Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <span className="hover:text-white transition-colors cursor-default">Home</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">Programs</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">How It Works</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">Partner Institutions</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">Contact</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">Privacy Policy</span>
                </li>
              </ul>
            </div>

            {/* Programs Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">
                Programs
              </h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <span className="hover:text-white transition-colors cursor-default">
                    AI in Business Excellence Cell
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">
                    CIISIC
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-default">
                    AI Hub
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">
                Contact
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#0056b3] shrink-0" />
                  <span>contact@ciisic.org</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#0056b3] shrink-0" />
                  <span>+91 11 4901 0200</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#0056b3] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Confederation of Indian Industry, Mantosh Sondhi Centre, 23, Institutional Area, Lodi Road, New Delhi, Delhi 110003</span>
                </li>
              </ul>
            </div>

            {/* Social Icons Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">
                Social Icons
              </h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <a href="https://www.linkedin.com/company/confederation-of-indian-industry/?originalSubdomain=in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                    LinkedIn <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@FollowCII" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                    YouTube <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/followcii/?hl=en" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                    Instagram <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright Section with standard CII alignment */}
          <div className="border-t border-slate-800 pt-8 mt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-4">
            <p className="font-semibold text-center sm:text-left">
              © CII Industry Academia Excellence Cell | Oriental Group of Institutes
            </p>
            <p className="font-medium text-slate-600">
              Platform Edition • Powered by Oriental Group
            </p>
          </div>

        </div>
      </footer>

      {/* ECOSYSTEM DETAILS MODALS */}
      {activeModal && ecosystemDetails[activeModal] && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveModal(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 overflow-hidden z-10 transition-all duration-300 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Content */}
            <div className="space-y-6">
              
              <div className={`p-4 rounded-2xl bg-gradient-to-tr ${ecosystemDetails[activeModal].color} border flex items-center gap-4`}>
                <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0 border border-slate-100">
                  {ecosystemDetails[activeModal].icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#002147] font-display text-lg">
                    {ecosystemDetails[activeModal].title}
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {ecosystemDetails[activeModal].description}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Program Offerings</h4>
                <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-semibold">
                  {ecosystemDetails[activeModal].points.map((point, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Close
                </button>
                <Link
                  to="/industry/login"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-[#002147] hover:bg-[#0056b3] text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  Get Started <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
