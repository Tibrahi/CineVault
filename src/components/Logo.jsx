import React from 'react';

export const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#FCD34D"/>
    <path d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V12Z" stroke="#1F2937" strokeWidth="2"/>
    <circle cx="16" cy="16" r="3" fill="#1F2937"/>
  </svg>
);

export const LogoText = () => (
  <div className="flex items-center space-x-2">
    <Logo />
    <span className="text-2xl font-bold">CineVault</span>
  </div>
);