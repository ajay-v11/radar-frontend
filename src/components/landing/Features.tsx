import { Search, BarChart3, Users, FileText, LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Search,
    title: "Industry Detection",
    description: "Automatically identifies relevant queries for your industry"
  },
  {
    icon: BarChart3,
    title: "Multi-Model Testing",
    description: "Compare visibility across ChatGPT, Claude, Perplexity, and Gemini"
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description: "See how you rank against competitors in AI responses"
  },
  {
    icon: FileText,
    title: "Complete Query Transparency",
    description: "View every query tested with detailed results"
  }
];

export function Features() {
  return (
    <section className="bg-white px-4 py-16 md:py-24" aria-label="Features section">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Everything You Need to Track AI Visibility
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive insights into how AI models perceive your brand
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" role="list">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="transition-shadow hover:shadow-md" role="listitem">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3" aria-hidden="true">
                    <Icon className="h-6 w-6 text-blue-600" aria-label={`${feature.title} icon`} />
                  </div>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
