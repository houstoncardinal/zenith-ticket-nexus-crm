
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { state } = useAppContext();
  const [ticketData, setTicketData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  
  // Calculate ticket distribution data from actual tickets
  const ticketsByType = [
    { id: 1, type: "Technical", count: state.tickets.filter(t => t.type === "technical").length, color: "#3498db" },
    { id: 2, type: "Billing", count: state.tickets.filter(t => t.type === "billing").length, color: "#2ecc71" },
    { id: 3, type: "Feature Request", count: state.tickets.filter(t => t.type === "feature_request").length, color: "#9b59b6" },
    { id: 4, type: "General Inquiry", count: state.tickets.filter(t => t.type === "general").length, color: "#f1c40f" },
  ];
  
  // Generate some week data based on tickets
  useEffect(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    // Generate ticket volume data by day
    const ticketsByDay = days.map(day => ({
      name: day,
      value: Math.floor(Math.random() * 30) + 20
    }));
    
    // Generate response time data by day
    const responseTimeByDay = days.map(day => ({
      name: day,
      value: (Math.random() * 3 + 2).toFixed(1)
    }));
    
    setTicketData(ticketsByDay);
    setResponseData(responseTimeByDay);
  }, [state.tickets]);
  
  const totalTickets = ticketsByType.reduce((sum, type) => sum + type.count, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white border border-gray-100 shadow-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard 
              title="Open Tickets" 
              value={state.stats.openTickets.toString()} 
              description={`${state.tickets.filter(t => 
                new Date(t.createdAt).toDateString() === new Date().toDateString()
              ).length} added today`}
              trend="up"
              trendValue="+8%"
              accentColor="#4C6FFF"
            />
            <StatCard 
              title="Resolved Today" 
              value={state.stats.resolvedToday.toString()} 
              description="Avg resolution: 2.4h"
              trend="up"
              trendValue="+14%"
              accentColor="#00C48C"
            />
            <StatCard 
              title="Customer Satisfaction" 
              value={state.stats.customerSatisfaction} 
              description="Based on 86 reviews"
              trend="up"
              trendValue="+2%"
              accentColor="#7B61FF"
            />
            <StatCard 
              title="Response Time" 
              value={state.stats.responseTime} 
              description="Average first response"
              trend="down"
              trendValue="-5%"
              accentColor="#FF6B6B"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-50 pb-4">
                <CardTitle className="text-lg font-medium text-gray-800">Tickets This Week</CardTitle>
                <CardDescription>Daily ticket volume for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #f1f1f1', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        formatter={(value) => [`${value} tickets`, 'Volume']}
                      />
                      <Bar dataKey="value" fill="#4C6FFF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-50 pb-4">
                <CardTitle className="text-lg font-medium text-gray-800">Response Times</CardTitle>
                <CardDescription>Average daily response time in minutes</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #f1f1f1', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        formatter={(value) => [`${value} min`, 'Time']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#7B61FF" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: "#7B61FF" }}
                        activeDot={{ r: 6, fill: "#7B61FF" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket categories and Agent performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border border-gray-100 shadow-sm bg-white">
              <CardHeader className="bg-white border-b border-gray-50 pb-4">
                <CardTitle className="text-lg font-medium text-gray-800">Tickets by Type</CardTitle>
                <CardDescription>Distribution of current open tickets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {ticketsByType.map(ticket => (
                  <div key={ticket.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{ticket.type}</span>
                      <span className="text-sm text-gray-500">{ticket.count}</span>
                    </div>
                    <Progress 
                      value={(ticket.count / totalTickets) * 100} 
                      className={cn("h-2 bg-gray-100")}
                      style={{ 
                        '--progress-background': '#f1f1f1',
                        '--progress-foreground': ticket.color
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 shadow-sm bg-white">
              <CardHeader className="bg-white border-b border-gray-50 pb-4">
                <CardTitle className="text-lg font-medium text-gray-800">Agent Performance</CardTitle>
                <CardDescription>Top performing support agents</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-5">
                  {state.agents.map(agent => (
                    <AgentItem 
                      key={agent.id}
                      name={agent.name} 
                      tickets={agent.tickets} 
                      satisfaction={agent.satisfaction} 
                      avatar={agent.avatar}
                      color="#4C6FFF"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card className="border border-gray-100 shadow-sm bg-white">
            <CardHeader className="bg-white border-b border-gray-50">
              <CardTitle className="text-lg font-medium text-gray-800">Detailed Analytics</CardTitle>
              <CardDescription>Coming soon: More detailed analytics will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-gray-500">
              Analytics dashboard is under development
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card className="border border-gray-100 shadow-sm bg-white">
            <CardHeader className="bg-white border-b border-gray-50">
              <CardTitle className="text-lg font-medium text-gray-800">Reports</CardTitle>
              <CardDescription>Coming soon: Generate and download reports.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-gray-500">
              Reports feature is under development
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  accentColor: string;
}

const StatCard = ({ title, value, description, trend, trendValue, accentColor }: StatCardProps) => {
  return (
    <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden">
      <div className="h-1" style={{ backgroundColor: accentColor }}></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="flex items-center mt-1">
          <p className="text-xs text-gray-500">{description}</p>
          <div className={`ml-auto text-xs font-medium ${
            trend === "up" ? "text-emerald-500" : 
            trend === "down" ? "text-rose-500" : "text-amber-500"
          }`}>
            {trendValue}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface AgentItemProps {
  name: string;
  tickets: string;
  satisfaction: string;
  avatar: string;
  color: string;
}

const AgentItem = ({ name, tickets, satisfaction, avatar, color }: AgentItemProps) => {
  return (
    <div className="flex items-center">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm" style={{ backgroundColor: color }}>
        {avatar}
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{tickets} tickets resolved</p>
      </div>
      <div className="ml-auto">
        <span className="text-sm font-medium text-gray-800">{satisfaction}</span>
        <p className="text-xs text-gray-500 text-right">satisfaction</p>
      </div>
    </div>
  );
};

export default Dashboard;
