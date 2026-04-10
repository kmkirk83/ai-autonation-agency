import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const HVAC_TEMPLATES = [
  {
    businessName: "ABC HVAC Services",
    niche: "HVAC",
    coldEmail: `Subject: 62% of Your Calls Go Unanswered\n\nHi [Owner Name],\n\nI noticed ABC HVAC Services is getting calls from homeowners, but some are going to voicemail.\n\nThe average HVAC company loses $187K/year from missed calls.\n\nWe've deployed AI voice agents for 50+ HVAC companies. They answer every call 24/7, qualify leads, and book appointments automatically.\n\nOur clients see a 30% increase in booked appointments within 30 days.\n\nWant to see how it works? I can show you in 15 minutes.\n\nBest,\n[Your Name]`,
    loomScript: `Hi [Owner Name], this is [Your Name] from AI Automation Agency.\n\nI wanted to show you something quick - it's a 15-minute walkthrough of how our AI voice agent works for HVAC companies.\n\nHere's what happens: Every call comes in 24/7. The AI answers, qualifies the lead, and books appointments automatically. No more missed calls, no more lost revenue.\n\nOur clients see a 30% increase in booked appointments within the first month.\n\nIf you're interested in seeing this in action for your business, let's schedule a quick demo.\n\nThanks!`,
  },
];

export default function OutreachAssets() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [generatedAsset, setGeneratedAsset] = useState<any>(null);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="p-8 border-border text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            This page is only accessible to administrators.
          </p>
        </Card>
      </div>
    );
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !niche) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.info("Outreach asset generation feature coming soon");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const allAssets = HVAC_TEMPLATES;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-foreground">Outreach Assets</div>
          <div className="text-sm text-muted-foreground">LLM-Powered Generator</div>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-2">Generate Personalized Outreach Assets</h1>
        <p className="text-muted-foreground mb-12">
          Use AI to generate copy-ready cold emails and Loom video scripts for any prospect.
        </p>

        {/* Generator Form */}
        <Card className="p-8 border-border mb-12">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-foreground font-bold mb-2 block">Business Name</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., ABC Plumbing Co."
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div>
                <Label className="text-foreground font-bold mb-2 block">Niche/Industry</Label>
                <Input
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., Plumbing, HVAC, Roofing"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Generate Outreach Assets
            </Button>
          </form>
        </Card>

        {/* Prebuilt Templates */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Prebuilt HVAC Templates</h2>
          <div className="space-y-8">
            {allAssets.map((asset, idx) => (
              <Card key={idx} className="p-8 border-border">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {asset.businessName}
                  </h3>
                  <p className="text-sm text-muted-foreground">Niche: {asset.niche}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Cold Email */}
                  <div>
                    <h4 className="font-bold text-foreground mb-4">Cold Email</h4>
                    <div className="bg-background border border-border rounded p-4 mb-4 max-h-64 overflow-y-auto">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {asset.coldEmail}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(asset.coldEmail)}
                      className="w-full"
                    >
                      Copy Email
                    </Button>
                  </div>

                  {/* Loom Script */}
                  <div>
                    <h4 className="font-bold text-foreground mb-4">Loom Video Script</h4>
                    <div className="bg-background border border-border rounded p-4 mb-4 max-h-64 overflow-y-auto">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {asset.loomScript}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(asset.loomScript)}
                      className="w-full"
                    >
                      Copy Script
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
