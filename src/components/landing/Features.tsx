"use client";

import { Search, BarChart3, Users, FileText } from "lucide-react";
import { GlowingStarsBackground } from "@/components/ui/glowing-stars";
import Image from "next/image";
import RadarLogo from "@/assets/radar-logo.svg";

const features = [
  {
    icon: Search,
    title: "Industry Detection",
    description: "Automatically identifies relevant queries for your industry",
  },
  {
    icon: BarChart3,
    title: "Multi-Model Testing",
    description: "Compare visibility across ChatGPT, Claude, Perplexity, and Gemini",
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description: "See how you rank against competitors in AI responses",
  },
  {
    icon: FileText,
    title: "Complete Query Transparency",
    description: "View every query tested with detailed results",
  },
];

export default function Features() {
  return (
    <section className="relative min-h-screen bg-background px-4 py-20 overflow-hidden">
      <GlowingStarsBackground />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="font-poppins mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Everything You Need to Track AI Visibility
          </h2>
          <p className="font-poppins text-base text-muted-foreground sm:text-lg md:text-xl">
            Comprehensive insights into how AI models perceive your brand
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 border border-border"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-poppins mb-3 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="font-poppins text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Logo at bottom center */}
        <div className="mt-20 flex justify-center">
          <Image 
            src={RadarLogo} 
            alt="RADAR Logo" 
            width={150} 
            height={155}
            className="opacity-70 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>
    </section>
  );
}
