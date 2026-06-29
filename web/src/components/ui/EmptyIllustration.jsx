import React from 'react';

export default function EmptyIllustration() {
  return (
    <svg viewBox="0 0 200 130" width="160" height="130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M40,65 C35,30 70,20 110,25 C150,30 170,40 165,75 C160,110 125,120 90,115 C55,110 45,100 40,65 Z" 
        fill="#252525" 
        opacity="0.6"
      />
      <circle cx="100" cy="65" r="50" stroke="#333" strokeWidth="1" strokeDasharray="3 3" />
      <rect x="78" y="25" width="44" height="60" rx="3" fill="#e4e4e7" />
      <rect x="91" y="19" width="18" height="8" rx="2" fill="#71717a" />
      <rect x="86" y="38" width="6" height="6" rx="1" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="97" y1="41" x2="114" y2="41" stroke="#d4d4d8" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="86" y="52" width="6" height="6" rx="1" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="97" y1="55" x2="110" y2="55" stroke="#d4d4d8" strokeWidth="2.2" strokeLinecap="round" />
      <g transform="rotate(15 130 60)">
        <rect x="125" y="40" width="6" height="40" rx="1" fill="#3b82f6" />
        <path d="M125,40 L128,35 L131,40 Z" fill="#eab308" />
        <rect x="125" y="76" width="6" height="4" fill="#f43f5e" />
      </g>
    </svg>
  );
}
