import React from 'react';
import GradientButton from './GradientButton';
import resumeSample2 from '../assets/resume-sample-2.png';
import resumeSample3 from '../assets/resume-sample-3.jpeg'; 
export default function HeroSection() {
  return (
    <section className="px-8  bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Text Section */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Build a standout resume with AI <br />
            <span className="text-green-500">effortlessly!</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Just enter your details, and let AI do the hard part. Generate resumes in seconds.
          </p>
          <GradientButton to="/resume-form">
            Get Started ➝
          </GradientButton>
        </div>

        {/* Right: Resume Preview Section */}
        <div className="flex-1 flex justify-center md:justify-end mt-12 md:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
            <img
              src={resumeSample2}
              alt="Resume sample 2"
              className="w-72 rounded-xl shadow-lg border border-gray-400"
            />
            <img
              src={resumeSample3}
              alt="Resume sample 3"
              className="w-72 rounded-xl shadow-lg mt-36 border border-gray-500 "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
