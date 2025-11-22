'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Highlight} from '@/components/ui/hero-highlight';
import {GlowingStarsBackground} from '@/components/ui/glowing-stars';

export default function Hero() {
  const router = useRouter();
  const [radarVisible, setRadarVisible] = useState(false);
  const [moveToTop, setMoveToTop] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // RADAR fades in
    const timer1 = setTimeout(() => setRadarVisible(true), 300);
    // RADAR moves to top
    const timer2 = setTimeout(() => setMoveToTop(true), 2000);
    // Tagline starts appearing
    const timer3 = setTimeout(() => setShowTagline(true), 2500);
    // Tagline becomes fully visible
    const timer4 = setTimeout(() => setTaglineVisible(true), 3000);
    // Typing animation completes and highlight appears
    const timer5 = setTimeout(() => setTypingComplete(true), 5500);
    // Button appears
    const timer6 = setTimeout(() => setShowButton(true), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  return (
    <div className='relative min-h-screen overflow-hidden bg-background'>
      <GlowingStarsBackground />

      <div
        className={`absolute left-0 right-0 z-10 mx-8 transition-all duration-[1500ms] ease-in-out ${
          moveToTop ? 'top-5' : 'top-1/2 -translate-y-1/2'
        } ${radarVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transition:
            'opacity 1.5s ease-in-out, top 1.5s ease-in-out, transform 1.5s ease-in-out',
        }}>
        <h1
          className='font-akira text-center font-black tracking-wider text-primary leading-none'
          style={{
            fontFamily: 'var(--font-akira)',
            fontSize: 'clamp(4rem, 20vw, 28rem)',
            textAlign: 'center',
          }}>
          RADAR
        </h1>
      </div>

      <div
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-32 sm:pt-40 md:pt-48 lg:pt-56 transition-all duration-[1500ms] ease-in-out ${
          showTagline ? 'opacity-100' : 'opacity-0'
        }`}>
        <div className='mb-8 text-center sm:mb-10 md:mb-12 lg:mb-16'>
          <h2
            className={`font-poppins text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-relaxed transition-all duration-[1500ms] ease-in-out ${
              taglineVisible ? 'opacity-100' : 'opacity-20'
            }`}>
            {!typingComplete ? (
              <span className='inline-block text-foreground'>
                Don't guess your AI visibility. Radar it
              </span>
            ) : (
              <span className='text-foreground'>
                Don't guess your AI visibility.{' '}
                <Highlight className='font-semibold text-foreground bg-gradient-to-r from-primary to-primary'>
                  Radar it
                </Highlight>
              </span>
            )}
          </h2>
        </div>

        <div
          className={`transition-all duration-700 ease-in-out ${
            showButton
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}>
          <button
            onClick={() => router.push('/company-input')}
            className='relative inline-flex items-center justify-center px-8 py-3 font-poppins text-base font-medium text-foreground bg-background rounded-full overflow-hidden group cursor-pointer hover:scale-105 transition-transform'>
            <span
              className='absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] animate-[border-spin_3s_linear_infinite]'
              style={{
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}></span>
            <span className='relative z-10'>Check my visibility</span>
          </button>
        </div>
      </div>
    </div>
  );
}
