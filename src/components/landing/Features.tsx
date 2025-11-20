"use client";

import { Search, BarChart3, Users, FileText } from "lucide-react";

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
    <section className="min-h-screen bg-gradient-to-b from-[#0a0f0d] to-[#1a1f1d] px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="font-poppins mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Everything You Need to Track AI Visibility
          </h2>
          <p className="font-poppins text-base text-gray-400 sm:text-lg md:text-xl">
            Comprehensive insights into how AI models perceive your brand
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10">
                <feature.icon className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="font-poppins mb-3 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="font-poppins text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
