
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Server, Shield, Terminal } from "lucide-react";
import MainNav from "@/components/layout/MainNav";
import Footer from "@/components/layout/Footer";

const SelfHost = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Complete Data Control",
      description: "Host on your infrastructure for maximum security and privacy"
    },
    {
      icon: <Server className="w-12 h-12 text-primary" />,
      title: "Scalable Infrastructure",
      description: "Scale your deployment based on your needs and requirements"
    },
    {
      icon: <Terminal className="w-12 h-12 text-primary" />,
      title: "Full Customization",
      description: "Customize and extend functionality to match your workflow"
    }
  ];

  const plans = [
    {
      title: "Self-Host Free",
      price: "Free",
      description: "Perfect for DIY developers",
      features: [
        "20 AI UGC videos",
        "Full documentation access",
        "Video tutorial guide",
        "Community support"
      ]
    },
    {
      title: "Premium Self-Host",
      price: "$200",
      description: "Enhanced features & support",
      features: [
        "100+ AI UGC videos",
        "1 year dedicated support",
        "Meme generator feature",
        "UGC avatar lipsync",
        "Premium features access",
        "Regular updates"
      ]
    },
    {
      title: "Enterprise Setup",
      price: "$400",
      description: "Full service & support",
      features: [
        "Complete setup by our team",
        "Priority support channel",
        "All premium features",
        "Custom feature requests",
        "Direct technical support",
        "Deployment assistance"
      ]
    }
  ];

  const handleSupportClick = () => {
    window.open("https://x.com/rushabtated4", "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-20">
          <div className="container">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Host ReelAgent on Your Infrastructure
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Take full control of your content generation with our self-hosted solution. Perfect for businesses that need complete data sovereignty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" variant="outline" onClick={handleSupportClick}>
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-background">
                  <CardHeader>
                    <div className="p-3 w-fit rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Self-Hosting Plans</h2>
              <p className="text-lg text-muted-foreground">
                Choose the perfect self-hosting option for your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.title} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold mt-4">{plan.price}</div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={handleSupportClick}
                      className="w-full mt-6 gap-2"
                    >
                      Contact for Details
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SelfHost;
