import React from 'react';

const LogoIcon = ({ color = "#0f4a30" }) => (
  <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M58 85 L78 35 L95 85 Z" fill={color}/>
    <path d="M30 85 L58 15 L82 85 Z" fill={color}/>
    <path d="M5 85 L30 30 L55 85 Z" fill={color}/>
    <path d="M15 65 L32 45 L36 50 L19 70 Z" fill={color === '#0f4a30' ? 'white' : '#0f4a30'}/>
    <path d="M22 80 L39 60 L43 65 L26 85 Z" fill={color === '#0f4a30' ? 'white' : '#0f4a30'}/>
  </svg>
);

export default LogoIcon;
