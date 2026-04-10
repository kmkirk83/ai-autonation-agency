import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Phone, Zap, BarChart3, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    serviceInterest: "AI Voice Receptionist" as const,
  });

  const [roiData, setRoiData] = useState({
    businessType: "HVAC",
    callVolume: 50,
  });

  const submitLeadMutation = trpc.leads.submit.useMutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({ ...prev, serviceInterest: value as any }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitLeadMutation.mutateAsync(formData);
      toast.success("Lead submitted successfully! We'll contact you soon.");
      setFormData({ businessName: "", contactName: "", email: "", phone: "", serviceInterest: "AI Voice Receptionist" });
    } catch (error) {
      toast.error("Failed to submit lead. Please try again.");
    }
  };

  const calculateROILoss = () => {
    const missedCallRate = 0.62; // 62% of calls go unanswered
    const avgJobValue = businessTypeValues[roiData.businessType] || 5000;
    const monthlyMissedCalls = Math.floor(roiData.callVolume * missedCallRate);
    const annualLoss = monthlyMissedCalls * 12 * avgJobValue;
    return annualLoss;
  };

  const businessTypeValues: Record<string, number> = {
    HVAC: 5000,
    Plumbing: 4500,
    Roofing: 10000,
    Electrical: 3500,
    General: 4000,
  };

  const annualLoss = calculateROILoss();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-blue-500/20 bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-blue-400">AI Automation Agency</div>
          <div className="flex gap-6">
            <a href="#services" className="hover:text-blue-400 transition">Services</a>
            <a href="#roi" className="hover:text-blue-400 transition">ROI Calculator</a>
            <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 border-b border-blue-500/20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Stop Losing <span className="text-blue-400">$187K/Year</span> to Missed Calls
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
              AI-powered voice agents that answer every call, book appointments, and capture leads 24/7. For HVAC, plumbing, roofing, and home service businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Book Free Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-500 text-white font-bold px-8 py-6 text-lg hover:bg-blue-500/10"
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 sm:py-32 border-b border-blue-500/20">
        <div className="container">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center">High-Ticket AI Solutions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Voice Receptionist",
                price: "$2,500–$5,000",
                description: "24/7 AI agent answers calls, books appointments, and qualifies leads automatically.",
                icon: <Phone className="w-8 h-8 text-blue-400" />,
              },
              {
                title: "Lead Reactivation Bot",
                price: "$2,500–$5,000",
                description: "Automatically re-engage dormant leads via SMS/Email and convert them into booked calls.",
                icon: <Zap className="w-8 h-8 text-blue-400" />,
              },
              {
                title: "Customer Support Automation",
                price: "$2,500–$5,000",
                description: "AI chatbot handles 70%+ of customer inquiries, reducing support costs and response time.",
                icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
              },
            ].map((service, idx) => (
              <Card key={idx} className="blueprint-card p-8 border-blue-500/30">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-blue-400 font-bold text-lg mb-4">{service.price}</p>
                <p className="text-gray-300">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi" className="py-20 sm:py-32 border-b border-blue-500/20">
        <div className="container">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center">Calculate Your Revenue Loss</h2>
          <div className="max-w-2xl mx-auto">
            <Card className="blueprint-card p-8 border-blue-500/30">
              <div className="space-y-6">
                <div>
                  <Label className="text-white font-bold mb-2 block">Business Type</Label>
                  <Select value={roiData.businessType} onValueChange={(value) => setRoiData(prev => ({ ...prev, businessType: value }))}>
                    <SelectTrigger className="bg-slate-800 border-blue-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-blue-500/30">
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Roofing">Roofing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="General">General Home Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white font-bold mb-2 block">Average Monthly Call Volume: {roiData.callVolume}</Label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={roiData.callVolume}
                    onChange={(e) => setRoiData(prev => ({ ...prev, callVolume: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-6 mt-8">
                  <p className="text-gray-300 mb-2">Estimated Annual Revenue Loss from Missed Calls:</p>
                  <p className="text-4xl font-bold text-blue-400">${(annualLoss / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-400 mt-2">Based on 62% missed call rate and average job value for {roiData.businessType}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 sm:py-32 border-b border-blue-500/20">
        <div className="container">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center">Why This Matters</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { stat: "62%", label: "of business calls go unanswered" },
              { stat: "$187K", label: "average annual revenue lost from missed calls" },
              { stat: "30%", label: "increase in booked appointments with AI receptionist" },
              { stat: "24/7", label: "availability with zero downtime" },
            ].map((item, idx) => (
              <Card key={idx} className="blueprint-card p-8 border-blue-500/30 text-center">
                <p className="text-5xl font-bold text-blue-400 mb-2">{item.stat}</p>
                <p className="text-gray-300">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className="py-20 sm:py-32 border-b border-blue-500/20 bg-blue-500/5">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-gray-300 mb-8 text-lg">Book a free 15-minute discovery call to see how our AI solutions can capture every missed call and increase your revenue.</p>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-6 text-lg"
              onClick={() => window.open("https://calendly.com/ai-automation-agency/15min", "_blank")}
            >
              Schedule 15-Minute Discovery Call
            </Button>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="contact" className="py-20 sm:py-32">
        <div className="container">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center">Get Started Today</h2>
          <p className="text-center text-gray-300 mb-12 text-lg">Or fill out the form below and we'll reach out to schedule your free 15-minute discovery call.</p>
          
          <div className="max-w-2xl mx-auto">
            <Card className="blueprint-card p-8 border-blue-500/30">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white font-bold mb-2 block">Business Name</Label>
                    <Input
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleFormChange}
                      placeholder="Your business name"
                      className="bg-slate-800 border-blue-500/30 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white font-bold mb-2 block">Contact Name</Label>
                    <Input
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleFormChange}
                      placeholder="Your name"
                      className="bg-slate-800 border-blue-500/30 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white font-bold mb-2 block">Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="your@email.com"
                      className="bg-slate-800 border-blue-500/30 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white font-bold mb-2 block">Phone</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="(555) 123-4567"
                      className="bg-slate-800 border-blue-500/30 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white font-bold mb-2 block">Service Interest</Label>
                  <Select value={formData.serviceInterest} onValueChange={handleServiceChange}>
                    <SelectTrigger className="bg-slate-800 border-blue-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-blue-500/30">
                      <SelectItem value="AI Voice Receptionist">AI Voice Receptionist</SelectItem>
                      <SelectItem value="Lead Reactivation Bot">Lead Reactivation Bot</SelectItem>
                      <SelectItem value="Customer Support Automation">Customer Support Automation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
                  disabled={submitLeadMutation.isPending}
                >
                  {submitLeadMutation.isPending ? "Submitting..." : "Book Free Demo"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 py-8">
        <div className="container text-center text-gray-400">
          <p>&copy; 2026 AI Automation Agency. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
