import React from 'react';
import Header from '../components/header';
import HeroSection from '../components/herosection';
import Footer from '../components/footer';
import GradientButton from '../components/GradientButton';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header>
        <GradientButton to="/resume-form" className="ml-2">
          Build my resume
        </GradientButton>
        <GradientButton to="/about" variant="outline" className="ml-2">
          About us
        </GradientButton>
      </Header>
      <main className="flex-grow">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
