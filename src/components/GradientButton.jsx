import React from 'react';
import { Link } from 'react-router-dom';

export default function GradientButton({ children, to, className = "", ...props }) {
  const baseClasses = `bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-6 py-2 rounded-full shadow transition ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
}
