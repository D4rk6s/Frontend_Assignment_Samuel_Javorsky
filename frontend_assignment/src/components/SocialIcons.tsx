import React from 'react';

interface SocialIconProps extends React.SVGProps<SVGSVGElement> {}

export const FacebookIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.04c0 5.08 3.7 9.31 8.55 10.2V14.7H8.07v-2.66h2.48V9.7c0-2.45 1.49-3.78 3.67-3.78 1.05 0 1.96.08 2.23.12v2.57h-1.52c-1.2 0-1.44.57-1.44 1.41v1.85h2.86l-.47 2.66h-2.39v7.54C18.3 21.35 22 17.12 22 12.04 22 6.53 17.5 2.04 12 2.04z"/>
  </svg>
);

export const InstagramIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2.2c-2.4 0-4.2 1.8-4.2 4.2v8.4c0 2.4 1.8 4.2 4.2 4.2h8.4c2.4 0 4.2-1.8 4.2-4.2V7.8c0-2.4-1.8-4.2-4.2-4.2H7.6zm9.6 1.4c0 .8-.6 1.4-1.4 1.4s-1.4-.6-1.4-1.4.6-1.4 1.4-1.4 1.4.6 1.4 1.4zM12 9c-1.6 0-3 1.4-3 3s1.4 3 3 3 3-1.4 3-3-1.4-3-3-3zm0 2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
  </svg>
);
