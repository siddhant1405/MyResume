import React from 'react';
import Header from '../components/header';
import GradientButton from '../components/GradientButton';
import Footer from '../components/footer';

export default function AboutUs() {
  return (
       <div className="min-h-screen bg-white flex flex-col">
              <Header>
        <GradientButton to="/resume-form" className="ml-2">
          Build my resume
        </GradientButton>
        <GradientButton to="/export" variant="outline" className="ml-2">
          Home
        </GradientButton>
      </Header>
       <section className="px-8 py-10 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
          About <span className="text-green-500">MyResume</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10">
          MyResume is a modern AI-powered resume builder designed to help job seekers create standout, ATS-friendly resumes in seconds.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-12">
        {/* Mission */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
          <p className="text-gray-700 text-base leading-relaxed">
            We aim to democratize resume building by using AI to simplify the process for everyone — from freshers to seasoned professionals.
            Our goal is to make resume creation fast, intuitive, and accessible to all.
          </p>
        </div>

        {/* Why MyResume */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Why MyResume?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>AI-assisted content generation tailored to your role and industry</li>
            <li>Built for the most widely used Jake's resume template</li>
            <li>Optimized for Applicant Tracking Systems (ATS)</li>
            <li>No design skills needed — just input, generate, and apply!</li>
          </ul>
        </div>
      </div>


    </section>
        <Footer />
    </div>
  );
}
