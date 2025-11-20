"use client";

import { useEffect, useState } from "react";
import { Highlight } from "@/components/ui/hero-highlight";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Hero() {
  const [showRadar, setShowRadar] = useState(false);
  const [moveToTop, setMoveToTop] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowRadar(true), 300);
    const timer2 = setTimeout(() => setMoveToTop(true), 2000);
    const timer3 = setTimeout(() => setShowTyping(true), 2500);
    const timer4 = setTimeout(() => setTypingComplete(true), 5500);
    const timer5 = setTimeout(() => setShowButton(true), 6000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f0d] px-4">
      <BackgroundBeams />
      <div
        className={`absolute left-1/2 z-10 -translate-x-1/2 transition-all duration-1000 ease-out ${
          moveToTop
            ? "top-8 sm:top-12 md:top-16 lg:top-20"
            : "top-[35%] sm:top-[40%] -translate-y-1/2"
        }`}
      >
        <h1 className="font-akira flex text-[3.5rem] font-black tracking-wider text-[#f59e0b] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem]">
          <span className="inline-block">R</span>
          <span
            className={`inline-block overflow-hidden transition-all duration-1000 ${
              showRadar
                ? "max-w-[240px] sm:max-w-[320px] md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] opacity-100"
                : "max-w-0 opacity-0"
            }`}
          >
            ADAR
          </span>
        </h1>
      </div>

      <div
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 sm:pt-28 md:pt-36 lg:pt-44 ${
          showTyping ? "" : "opacity-0"
        }`}
      >
        <div className="mb-6 text-center sm:mb-8 md:mb-10 lg:mb-12">
          {showTyping && (
            <h2 className="font-poppins text-base font-light leading-relaxed text-white sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              {!typingComplete ? (
                <span className="typing-full-text inline-block">
                  Don't guess your visibility. Radar it
                </span>
              ) : (
                <>
                  Don't guess your visibility.{" "}
                  <Highlight className="font-semibold text-white">
                    Radar it
                  </Highlight>
                </>
              )}
            </h2>
          )}
        </div>

        <button
          className={`font-poppins rounded-full bg-[#f59e0b] px-5 py-2.5 text-sm font-medium text-[#0a0f0d] transition-all hover:scale-105 hover:bg-[#d97706] sm:px-7 sm:py-3.5 sm:text-base md:px-8 md:py-4 md:text-lg ${
            showButton
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
          style={{ transition: "all 0.7s ease-in" }}
        >
          Check my visibility !
        </button>
      </div>
    </div>
  );
}
