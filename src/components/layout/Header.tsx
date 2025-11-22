"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src={require('@/assets/radar-logo.svg')} 
            alt="RADAR Logo" 
            width={120} 
            height={40}
            className="h-8 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
