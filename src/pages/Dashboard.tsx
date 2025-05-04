
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";

// Sample data for charts
const ticketData = [
  { name: "Mon", value: 28 },
  { name: "Tue", value: 40 },
  { name: "Wed", value: 35 },
  { name: "Thu", value: 50 },
  { name: "Fri", value: 42 },
  { name: "Sat", value: 25 },
  { name: "Sun", value: 20 },
];

const responseData = [
  { name: "Mon", value: 4.2 },
  { name: "Tue", value: 3.8 },
  { name: "Wed", value: 5.1 },
  { name: "Thu", value: 4.5 },
  { name: "Fri", value: 3.9 },
  { name: "Sat", value: 2.8 },
  { name: "Sun", value: 4.0 },
];

const ticketsByType = [
  { id: 1, type: "Technical", count: 45, color: "#3498db" },
  { id: 2, type: "Billing", count: 32, color: "#2ecc71" },
  { id: 3, type: "Feature Request", count: 28, color: "#9b59b6" },
  { id: 4, type: "General Inquiry", count: 22, color: "#f1c40f" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Open Tickets" 
              value="127" 
              description="12 added today"
              trend="up"
              trendValue="+8%"
            />
            <StatCard 
              title="Resolved Today" 
              value="42" 
              description="Avg resolution: 2.4h"
              trend="up"
              trendValue="+14%"
            />
            <StatCard 
              title="Customer Satisfaction" 
              value="94%" 
              description="Based on 86 reviews"
              trend="up"
              trendValue="+2%"
            />
            <StatCard 
              title="Response Time" 
              value="24m" 
              description="Average first response"
              trend="down"
              trendValue="-5%"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tickets This Week</CardTitle>
                <CardDescription>Daily ticket volume for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                        formatter={(value) => [`${value} tickets`, 'Volume']}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
                <CardDescription>Average daily response time in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                        formatter={(value) => [`${value} min`, 'Time']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket categories and Agent performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Type</CardTitle>
                <CardDescription>Distribution of current open tickets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticketsByType.map(ticket => (
                  <div key={ticket.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{ticket.type}</span>
                      <span className="text-sm text-muted-foreground">{ticket.count}</span>
                    </div>
                    <Progress value={(ticket.count / 127) * 100} className="h-2" 
                      style={{ backgroundColor: 'hsl(var(--secondary))', '--tw-gradient-from': ticket.color }} />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Top performing support agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AgentItem name="Alex Morgan" tickets="32" satisfaction="98%" avatar="AM" />
                  <AgentItem name="Jamie Wilson" tickets="29" satisfaction="96%" avatar="JW" />
                  <AgentItem name="Sam Rodriguez" tickets="27" satisfaction="94%" avatar="SR" />
                  <AgentItem name="Taylor Chen" tickets="24" satisfaction="92%" avatar="TC" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Coming soon: More detailed analytics will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              Analytics dashboard is under development
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Coming soon: Generate and download reports.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
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
}

const StatCard = ({ title, value, description, trend, trendValue }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <p className="text-xs text-muted-foreground">{description}</p>
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
}

const AgentItem = ({ name, tickets, satisfaction, avatar }: AgentItemProps) => {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
        {avatar}
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{tickets} tickets resolved</p>
      </div>
      <div className="ml-auto">
        <span className="text-sm font-medium">{satisfaction}</span>
        <p className="text-xs text-muted-foreground text-right">satisfaction</p>
      </div>
    </div>
  );
};

export default Dashboard;
