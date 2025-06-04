import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-4 bg-gray-50 text-center text-black-800 text-sm mt-12 border-t">
      &copy; {new Date().getFullYear()} MyResume. All rights reserved.
    </footer>
  );
}
