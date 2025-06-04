import React from 'react';
import logo from '../assets/logo.png';

export default function Header({ children }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b">
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="h-10 w-10 rounded" />
        <span className="font-bold text-xl text-gray-800">MyResume</span>
      </div>
      <nav className="flex items-center gap-6">
        {children}
      </nav>
    </header>
  );
}
