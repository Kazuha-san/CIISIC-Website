import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { PartnerInstitutionsSection } from '../components/landing/PartnerInstitutionsSection';
import { WhyCiiSection } from '../components/landing/WhyCiiSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { ExcellenceCellsSection } from '../components/landing/ExcellenceCellsSection';
import { ChallengeAreasSection } from '../components/landing/ChallengeAreasSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FAQSection } from '../components/landing/FAQSection';
import { GetInvolvedSection } from '../components/landing/GetInvolvedSection';
import { FooterSection } from '../components/landing/FooterSection';

export const Home: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-600/10 selection:text-blue-900 scroll-smooth">
      <HeroSection />
      <AboutSection />
      <PartnerInstitutionsSection />
      <WhyCiiSection />
      <WorkflowSection />
      <ExcellenceCellsSection />
      <ChallengeAreasSection />
      <TestimonialsSection />
      <FAQSection />
      <GetInvolvedSection />
      <FooterSection />
    </div>
  );
};
