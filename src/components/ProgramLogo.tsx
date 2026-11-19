import React from 'react';

interface ProgramLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}

export const ProgramLogo: React.FC<ProgramLogoProps> = React.memo(({
  className = '',
  size = 'md'
}) => {
  // Size definitions for official HGP1 transparent logo - Upscaled for Large LED Screens
  const sizeClass =
    size === 'sm'
      ? 'h-9 md:h-12 lg:h-14 w-auto'
      : size === 'md'
      ? 'h-14 md:h-20 lg:h-24 w-auto'
      : size === 'lg'
      ? 'h-36 md:h-56 lg:h-72 w-auto'
      : size === 'xl'
      ? 'w-full max-w-[650px] md:max-w-[850px] lg:max-w-[1100px] xl:max-w-[1300px] h-auto'
      : 'w-full max-w-[800px] md:max-w-[1100px] lg:max-w-[1350px] xl:max-w-[1550px] h-auto'; // 'hero'

  const isSmall = size === 'sm' || size === 'md';
  const webpSrc = isSmall ? '/program-logo-thumb.webp' : '/program-logo.webp';
  const pngSrc = isSmall ? '/program-logo-thumb.png' : '/program-logo.png';

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={pngSrc}
          alt="BELL & BLOOM"
          decoding="async"
          loading="eager"
          className={`${sizeClass} object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300 will-change-transform`}
        />
      </picture>
    </div>
  );
});
