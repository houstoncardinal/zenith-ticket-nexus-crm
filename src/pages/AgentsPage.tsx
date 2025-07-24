import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, Star, Clock, CheckCircle, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AgentsPage = () => {
  const { state } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = state.agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAgentStats = (agentId: string) => {
    const agentTickets = state.tickets.filter(t => t.agentId === agentId);
    const resolvedTickets = agentTickets.filter(t => t.status === "resolved" || t.status === "closed");
    const activeTickets = agentTickets.filter(t => t.status === "open" || t.status === "in_progress");
    
    return {
      totalTickets: agentTickets.length,
      resolvedTickets: resolvedTickets.length,
      activeTickets: activeTickets.length,
      resolutionRate: agentTickets.length > 0 ? Math.round((resolvedTickets.length / agentTickets.length) * 100) : 0
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Agents</h1>
        <Button onClick={() => toast({ title: "Add Agent", description: "Agent management coming soon!" })}>
          <Plus className="mr-2 h-4 w-4" /> Add Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.agents.length}</div>
            <p className="text-xs text-muted-foreground">All active agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.tickets.filter(t => t.agentId).length}</div>
            <p className="text-xs text-muted-foreground">Assigned tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2h</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Active Tickets</TableHead>
              <TableHead>Resolved</TableHead>
              <TableHead>Resolution Rate</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.map((agent) => {
              const stats = getAgentStats(agent.id);
              return (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">{agent.name.toLowerCase().replace(' ', '.')}@zenith.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{stats.resolutionRate}%</span>
                      </div>
                      <Progress value={stats.resolutionRate} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      {stats.activeTickets}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-3.5 w-3.5 text-green-500" />
                      {stats.resolvedTickets}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={stats.resolutionRate >= 80 ? "default" : "secondary"}>
                      {stats.resolutionRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AgentsPage;