import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2 } from "lucide-react";

const HVAC_TEMPLATES = [
  {
    businessName: "ABC HVAC Services",
    niche: "HVAC",
    coldEmail: `Subject: 62% of Your Calls Go Unanswered - Here's the Solution\n\nHi [Owner Name],\n\nI noticed ABC HVAC Services is getting calls from homeowners needing emergency AC repairs, but I'm guessing some of those calls are going to voicemail or getting missed entirely.\n\nHere's the problem: The average HVAC company loses $187K/year from missed calls alone. That's money left on the table.\n\nHere's the solution: We've deployed AI voice agents for 50+ HVAC companies in your area. They answer every call 24/7, qualify leads, and book appointments automatically. No more missed opportunities.\n\nThe result? Our clients see a 30% increase in booked appointments within the first 30 days.\n\nWant to see how it works? I can show you in 15 minutes.\n\n[Schedule a demo]\n\nBest,\n[Your Name]\nAI Automation Agency`,
    loomScript: `[0:00-0:05] "Hey [Owner Name], I wanted to show you something that's been game-changing for HVAC companies like yours."\n\n[0:05-0:15] "Right now, 62% of service calls go unanswered. That's missed revenue, missed customers, and missed growth."\n\n[0:15-0:25] "We've built an AI voice agent that answers every call, books appointments, and qualifies leads 24/7. No more missed opportunities."\n\n[0:25-0:35] "Our clients see a 30% increase in booked appointments in the first month. One company went from losing $187K/year to capturing all their calls."\n\n[0:35-0:45] "The setup takes 2 hours. The ROI is immediate. Want to see it in action?"\n\n[0:45-0:60] "Book a 15-minute demo with me. I'll show you exactly how it works for HVAC companies. Link in the description."`,
  },
  {
    businessName: "Premier Plumbing Co",
    niche: "Plumbing",
    coldEmail: `Subject: Your Plumbing Business Is Leaving $150K+ on the Table Every Year\n\nHi [Owner Name],\n\nI work with plumbing companies across the country, and I see the same problem over and over: missed calls = missed revenue.\n\nThe average plumbing company loses $150K+ annually from unanswered calls. That's money that should be in your pocket.\n\nWe've built an AI solution that:\n- Answers every call 24/7 (even at 3 AM)\n- Books emergency appointments automatically\n- Qualifies leads before they reach your team\n- Reduces your phone staff workload by 70%\n\nOur plumbing clients are seeing:\n- 35% more booked appointments\n- $50K+ additional revenue in the first 90 days\n- Zero missed emergency calls\n\nWant to see how it works? I can walk you through it in 15 minutes.\n\n[Schedule a demo]\n\nBest,\n[Your Name]\nAI Automation Agency`,
    loomScript: `[0:00-0:05] "Hi [Owner Name], I'm reaching out because I think we can help you capture every plumbing call that's currently going to voicemail."\n\n[0:05-0:15] "Here's the reality: Your competitors are losing money on missed calls too. But the ones using AI are capturing all of it."\n\n[0:15-0:25] "We've deployed AI voice agents for 40+ plumbing companies. They answer calls, book emergency appointments, and qualify leads 24/7."\n\n[0:25-0:35] "One of our clients went from losing $150K/year to capturing every single call. That's $50K+ in new revenue in just 90 days."\n\n[0:35-0:45] "Setup is simple. ROI is immediate. Want to see it?"\n\n[0:45-0:60] "Book a 15-minute discovery call. I'll show you exactly how it works for your plumbing business. Link in the description."`,
  },
];

export default function OutreachAssets() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [generatedAsset, setGeneratedAsset] = useState<any>(null);

  const generateAssetMutation = trpc.outreach.generateAsset.useMutation({
    onSuccess: (data) => {
      setGeneratedAsset(data);
      toast.success("Outreach assets generated successfully!");
    },
    onError: () => {
      toast.error("Failed to generate outreach assets");
    },
  });

  const assetsQuery = trpc.outreach.getAssets.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="blueprint-card p-8 border-blue-500/30 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-300">You do not have permission to access this page.</p>
        </Card>
      </div>
    );
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !niche.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    generateAssetMutation.mutate({ businessName, niche });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const assets = assetsQuery.data || [];
  const allAssets = [...HVAC_TEMPLATES, ...assets];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-blue-500/20 bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-blue-400">Outreach Assets</div>
          <div className="text-sm text-gray-400">LLM-Powered Outreach Generator</div>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-2">Generate Personalized Outreach Assets</h1>
        <p className="text-gray-300 mb-12">
          Use AI to generate copy-ready cold emails and Loom video scripts for any prospect.
        </p>

        {/* Generator Form */}
        <Card className="blueprint-card p-8 border-blue-500/30 mb-12">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white font-bold mb-2 block">Business Name</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., ABC Plumbing Co."
                  className="bg-slate-800 border-blue-500/30 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <Label className="text-white font-bold mb-2 block">Niche/Industry</Label>
                <Input
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., Plumbing, HVAC, Roofing"
                  className="bg-slate-800 border-blue-500/30 text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
              disabled={generateAssetMutation.isPending}
            >
              {generateAssetMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Outreach Assets"
              )}
            </Button>
          </form>
        </Card>

        {/* Generated Asset Display */}
        {generatedAsset && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Cold Email */}
            <Card className="blueprint-card p-8 border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Cold Email</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedAsset.coldEmail)}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-blue-500/20 max-h-96 overflow-y-auto">
                <p className="text-gray-200 whitespace-pre-wrap text-sm">{generatedAsset.coldEmail}</p>
              </div>
            </Card>

            {/* Loom Script */}
            <Card className="blueprint-card p-8 border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Loom Video Script</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedAsset.loomScript)}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-blue-500/20 max-h-96 overflow-y-auto">
                <p className="text-gray-200 whitespace-pre-wrap text-sm">{generatedAsset.loomScript}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Prebuilt Templates & Previously Generated Assets */}
        {allAssets.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Previously Generated Assets</h2>
            <div className="space-y-6">
              {allAssets.map((asset, idx) => (
                <Card key={idx} className="blueprint-card p-8 border-blue-500/30">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-blue-400">{asset.businessName}</h3>
                    <p className="text-sm text-gray-400">{asset.niche}{(asset as any).createdAt ? " • " + new Date((asset as any).createdAt).toLocaleDateString() : " • Template"}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-bold text-gray-300 mb-2">Cold Email</p>
                      <div className="bg-slate-900/50 p-3 rounded border border-blue-500/20 max-h-32 overflow-y-auto">
                        <p className="text-gray-200 text-xs whitespace-pre-wrap">{asset.coldEmail.substring(0, 200)}...</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(asset.coldEmail)}
                        className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 w-full"
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy Email
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-300 mb-2">Loom Script</p>
                      <div className="bg-slate-900/50 p-3 rounded border border-blue-500/20 max-h-32 overflow-y-auto">
                        <p className="text-gray-200 text-xs whitespace-pre-wrap">{asset.loomScript.substring(0, 200)}...</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(asset.loomScript)}
                        className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 w-full"
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy Script
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
