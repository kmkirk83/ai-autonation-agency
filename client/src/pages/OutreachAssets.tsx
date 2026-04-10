import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2 } from "lucide-react";

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

        {/* Previously Generated Assets */}
        {assets.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Previously Generated Assets</h2>
            <div className="space-y-6">
              {assets.map((asset) => (
                <Card key={asset.id} className="blueprint-card p-8 border-blue-500/30">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-blue-400">{asset.businessName}</h3>
                    <p className="text-sm text-gray-400">{asset.niche} • {new Date(asset.createdAt).toLocaleDateString()}</p>
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
