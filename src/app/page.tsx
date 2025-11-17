"use client";

import { useEffect, useState } from "react";
import { Highlight } from "@/components/ui/hero-highlight";

export default function Home() {
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
      <div
        className={`absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out ${
          moveToTop
            ? "top-8 sm:top-12 md:top-16 lg:top-20"
            : "top-1/2 -translate-y-1/2"
        }`}
      >
        <h1 className="font-akira flex text-[3rem] font-black tracking-wider text-[#f59e0b] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem]">
          <span className="inline-block">R</span>
          <span
            className={`inline-block overflow-hidden transition-all duration-1000 ${
              showRadar
                ? "max-w-[200px] sm:max-w-[300px] md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] opacity-100"
                : "max-w-0 opacity-0"
            }`}
          >
            ADAR
          </span>
        </h1>
      </div>

      <div
        className={`flex min-h-screen flex-col items-center justify-center px-4 pt-32 sm:pt-36 md:pt-40 lg:pt-48 ${
          showTyping ? "" : "opacity-0"
        }`}
      >
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          {showTyping && (
            <h2 className="text-xl font-light text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
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
          className={`rounded-full bg-[#f59e0b] px-6 py-3 text-base font-medium text-[#0a0f0d] transition-all hover:scale-105 hover:bg-[#d97706] sm:px-8 sm:py-4 sm:text-lg ${
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
