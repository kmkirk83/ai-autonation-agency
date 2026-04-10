import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<"date" | "service">("date");
  
  const leadsQuery = trpc.leads.getAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const updateStatusMutation = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Lead status updated");
      leadsQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to update lead status");
    },
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

  const leads = leadsQuery.data || [];
  
  const sortedLeads = [...leads].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return a.serviceInterest.localeCompare(b.serviceInterest);
    }
  });

  const handleStatusChange = (leadId: number, newStatus: "New" | "Contacted" | "Closed") => {
    updateStatusMutation.mutate({ leadId, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-blue-500/20 bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-blue-400">Admin Dashboard</div>
          <div className="text-sm text-gray-400">Logged in as: {user?.name}</div>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-2">Lead Management</h1>
        <p className="text-gray-300 mb-8">Track and manage all captured leads from the landing page.</p>

        {/* Sort Controls */}
        <div className="mb-8 flex gap-4">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48 bg-slate-800 border-blue-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-blue-500/30">
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="service">Sort by Service</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-gray-400 flex items-center">
            Total Leads: <span className="font-bold text-blue-400 ml-2">{leads.length}</span>
          </div>
        </div>

        {/* Leads Table */}
        {sortedLeads.length === 0 ? (
          <Card className="blueprint-card p-8 border-blue-500/30 text-center">
            <p className="text-gray-300">No leads yet. Promote your landing page to start capturing leads.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-500/20">
                  <th className="text-left py-4 px-4 font-bold text-blue-400">Business Name</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-400">Contact</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-400">Email</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-400">Phone</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-400">Service Interest</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-400">Status</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-blue-500/10 hover:bg-blue-500/5 transition">
                    <td className="py-4 px-4">{lead.businessName}</td>
                    <td className="py-4 px-4">{lead.contactName}</td>
                    <td className="py-4 px-4 text-blue-400">{lead.email}</td>
                    <td className="py-4 px-4">{lead.phone}</td>
                    <td className="py-4 px-4 text-sm">{lead.serviceInterest}</td>
                    <td className="py-4 px-4">
                      <Select value={lead.status} onValueChange={(value: any) => handleStatusChange(lead.id, value)}>
                        <SelectTrigger className="w-32 bg-slate-800 border-blue-500/30 text-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-blue-500/30">
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
