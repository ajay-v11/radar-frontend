import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4" aria-label="Hero section">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-6 shadow-lg" aria-hidden="true">
          <TrendingUp className="h-16 w-16 text-white md:h-20 md:w-20" aria-label="Trending up icon" />
        </div>
        
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl px-4">
          Track Your Brand's AI Visibility
        </h1>
        
        <p className="mb-8 max-w-2xl text-base text-gray-600 md:text-lg lg:text-xl px-4">
          Discover how often AI models mention your company across industry queries. 
          Compare your visibility against competitors and optimize your AI presence.
        </p>
        
        <Link href="/dashboard" aria-label="Navigate to dashboard">
          <Button size="lg" className="text-lg">
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}
