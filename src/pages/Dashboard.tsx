
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Download, 
  Calendar,
  Filter,
  RefreshCcw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Star,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { state } = useAppContext();
  const [ticketData, setTicketData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("7d");
  
  // Calculate ticket distribution data from actual tickets
  const ticketsByType = [
    { id: 1, type: "Technical", count: state.tickets.filter(t => t.type === "technical").length, color: "#4C6FFF", percentage: 0 },
    { id: 2, type: "Billing", count: state.tickets.filter(t => t.type === "billing").length, color: "#00C48C", percentage: 0 },
    { id: 3, type: "Feature Request", count: state.tickets.filter(t => t.type === "feature_request").length, color: "#7B61FF", percentage: 0 },
    { id: 4, type: "General Inquiry", count: state.tickets.filter(t => t.type === "general").length, color: "#FF6B6B", percentage: 0 },
  ];

  const totalTickets = ticketsByType.reduce((sum, type) => sum + type.count, 0);
  
  // Calculate percentages for pie chart
  ticketsByType.forEach(type => {
    type.percentage = totalTickets > 0 ? (type.count / totalTickets) * 100 : 0;
  });

  // Advanced analytics data
  const [analyticsData, setAnalyticsData] = useState({
    monthlyTrends: [],
    priorityDistribution: [],
    resolutionTimes: [],
    customerSatisfactionTrends: [],
    agentPerformanceRadial: [],
    hourlyDistribution: []
  });

  // Generate comprehensive analytics data
  useEffect(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const priorities = ["low", "medium", "high", "urgent"];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    // Monthly trends
    const monthlyTrends = months.map(month => ({
      month,
      tickets: Math.floor(Math.random() * 200) + 100,
      resolved: Math.floor(Math.random() * 180) + 80,
      pending: Math.floor(Math.random() * 50) + 10,
      satisfaction: (Math.random() * 2 + 3.5).toFixed(1)
    }));

    // Priority distribution
    const priorityDistribution = priorities.map(priority => ({
      priority,
      count: state.tickets.filter(t => t.priority === priority).length,
      color: priority === "urgent" ? "#FF6B6B" : 
             priority === "high" ? "#FF9500" :
             priority === "medium" ? "#4C6FFF" : "#00C48C"
    }));

    // Resolution times by type
    const resolutionTimes = ticketsByType.map(type => ({
      type: type.type,
      avgTime: (Math.random() * 8 + 2).toFixed(1),
      target: 6,
      color: type.color
    }));

    // Customer satisfaction trends
    const customerSatisfactionTrends = months.map(month => ({
      month,
      score: (Math.random() * 1.5 + 3.5).toFixed(1),
      responses: Math.floor(Math.random() * 100) + 50
    }));

    // Agent performance radial
    const agentPerformanceRadial = state.agents.map(agent => ({
      name: agent.name,
      performance: Math.floor(Math.random() * 30) + 70,
      color: "#4C6FFF"
    }));

    // Hourly ticket distribution
    const hourlyDistribution = hours.map(hour => ({
      hour: `${hour}:00`,
      tickets: Math.floor(Math.random() * 20) + 5
    }));

    // Simulate data generation
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    const ticketsByDay = days.map(day => ({
      name: day,
      value: Math.floor(Math.random() * 30) + 20,
      resolved: Math.floor(Math.random() * 25) + 15,
      pending: Math.floor(Math.random() * 10) + 5
    }));
    
    const responseTimeByDay = days.map(day => ({
      name: day,
      value: (Math.random() * 3 + 2).toFixed(1),
      target: 3.5
    }));
    
    setTicketData(ticketsByDay);
    setResponseData(responseTimeByDay);
    setAnalyticsData({
      monthlyTrends,
      priorityDistribution,
      resolutionTimes,
      customerSatisfactionTrends,
      agentPerformanceRadial,
      hourlyDistribution
    });
  }, [state.tickets, state.agents]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="animate-scale-in"
          >
            <RefreshCcw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Badge variant="secondary" className="animate-fade-in">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white border border-gray-100 shadow-sm animate-slide-in-right">
          <TabsTrigger value="overview" className="transition-all duration-200">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="transition-all duration-200">
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="transition-all duration-200">
            <Download className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
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
              icon={<MessageSquare className="h-5 w-5" />}
              delay="0ms"
            />
            <StatCard 
              title="Resolved Today" 
              value={state.stats.resolvedToday.toString()} 
              description="Avg resolution: 2.4h"
              trend="up"
              trendValue="+14%"
              accentColor="#00C48C"
              icon={<CheckCircle className="h-5 w-5" />}
              delay="100ms"
            />
            <StatCard 
              title="Customer Satisfaction" 
              value={state.stats.customerSatisfaction} 
              description="Based on 86 reviews"
              trend="up"
              trendValue="+2%"
              accentColor="#7B61FF"
              icon={<Star className="h-5 w-5" />}
              delay="200ms"
            />
            <StatCard 
              title="Response Time" 
              value={state.stats.responseTime} 
              description="Average first response"
              trend="down"
              trendValue="-5%"
              accentColor="#FF6B6B"
              icon={<Clock className="h-5 w-5" />}
              delay="300ms"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <CardHeader className="bg-white border-b border-gray-50 pb-4">
                <CardTitle className="text-lg font-medium text-gray-800 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Tickets This Week
                </CardTitle>
                <CardDescription>Daily ticket volume with resolution tracking</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-sm" />
                      <YAxis axisLine={false} tickLine={false} className="text-sm" />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#fff', 
                          borderRadius: '12px', 
                          border: '1px solid #e5e7eb', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
                        }}
                        formatter={(value, name) => [
                          `${value} tickets`, 
                          name === 'value' ? 'Total' : name === 'resolved' ? 'Resolved' : 'Pending'
                        ]}
                      />
                      <Bar dataKey="value" fill="#4C6FFF" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" fill="#00C48C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <CardHeader className="bg-white border-b border-gray-50 pb-4">
                <CardTitle className="text-lg font-medium text-gray-800 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                  Response Times
                </CardTitle>
                <CardDescription>Average response time vs target (3.5 min)</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={responseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7B61FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-sm" />
                      <YAxis axisLine={false} tickLine={false} className="text-sm" />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#fff', 
                          borderRadius: '12px', 
                          border: '1px solid #e5e7eb', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
                        }}
                        formatter={(value, name) => [`${value} min`, name === 'value' ? 'Actual' : 'Target']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#7B61FF" 
                        fillOpacity={1} 
                        fill="url(#responseGradient)"
                        strokeWidth={3}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#FF6B6B" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket categories and Agent performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <CardHeader className="bg-white border-b border-gray-50 pb-4">
                <CardTitle className="text-lg font-medium text-gray-800 flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-green-500" />
                  Tickets by Type
                </CardTitle>
                <CardDescription>Distribution with visual breakdown</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-4 flex-1">
                    {ticketsByType.map((ticket, index) => (
                      <div key={ticket.id} className="animate-fade-in" style={{ animationDelay: `${700 + index * 100}ms` }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-3" 
                              style={{ backgroundColor: ticket.color }}
                            />
                            <span className="text-sm font-medium text-gray-700">{ticket.type}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-800">{ticket.count}</span>
                            <span className="text-xs text-gray-500 ml-1">({ticket.percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <Progress 
                          value={ticket.percentage} 
                          className="h-2 bg-gray-100 transition-all duration-500"
                          style={{ 
                            '--progress-background': '#f1f1f1',
                            '--progress-foreground': ticket.color
                          } as React.CSSProperties}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="w-24 h-24 ml-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketsByType}
                          cx="50%"
                          cy="50%"
                          innerRadius={15}
                          outerRadius={40}
                          dataKey="count"
                          startAngle={90}
                          endAngle={450}
                        >
                          {ticketsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "700ms" }}>
              <CardHeader className="bg-white border-b border-gray-50 pb-4">
                <CardTitle className="text-lg font-medium text-gray-800 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-500" />
                  Agent Performance
                </CardTitle>
                <CardDescription>Real-time performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-5">
                  {state.agents.map((agent, index) => (
                    <AgentItem 
                      key={agent.id}
                      name={agent.name} 
                      tickets={agent.tickets} 
                      satisfaction={agent.satisfaction} 
                      avatar={agent.avatar}
                      color="#4C6FFF"
                      delay={`${800 + index * 100}ms`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 animate-fade-in">
          {/* Analytics Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Advanced Analytics</h2>
              <p className="text-gray-600 mt-1">Deep insights into your support performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {dateRange === "7d" ? "Last 7 days" : dateRange === "30d" ? "Last 30 days" : "Last 90 days"}
              </Button>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Monthly Trends
                </CardTitle>
                <CardDescription>Ticket volume and resolution trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.monthlyTrends}>
                      <defs>
                        <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4C6FFF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4C6FFF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C48C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00C48C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#fff', 
                          borderRadius: '12px', 
                          border: '1px solid #e5e7eb', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tickets" 
                        stroke="#4C6FFF" 
                        fillOpacity={1} 
                        fill="url(#ticketsGradient)"
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="resolved" 
                        stroke="#00C48C" 
                        fillOpacity={1} 
                        fill="url(#resolvedGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                  Priority Distribution
                </CardTitle>
                <CardDescription>Breakdown of tickets by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.priorityDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="count"
                          startAngle={90}
                          endAngle={450}
                        >
                          {analyticsData.priorityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value} tickets`, name]}
                          contentStyle={{ 
                            background: '#fff', 
                            borderRadius: '8px', 
                            border: '1px solid #e5e7eb' 
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-4">
                    {analyticsData.priorityDistribution.map((item, index) => (
                      <div key={item.priority} className="flex items-center animate-fade-in" style={{ animationDelay: `${300 + index * 100}ms` }}>
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium capitalize">{item.priority}</span>
                            <span className="text-sm text-gray-600">{item.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resolution Times and Customer Satisfaction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2 text-green-500" />
                  Resolution Times by Type
                </CardTitle>
                <CardDescription>Average resolution time vs 6-hour target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.resolutionTimes} layout="horizontal">
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} width={100} />
                      <Tooltip 
                        formatter={(value) => [`${value} hours`, 'Avg Time']}
                        contentStyle={{ 
                          background: '#fff', 
                          borderRadius: '8px', 
                          border: '1px solid #e5e7eb' 
                        }}
                      />
                      <Bar dataKey="avgTime" fill="#4C6FFF" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="target" fill="#E5E7EB" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Customer Satisfaction Trends
                </CardTitle>
                <CardDescription>Monthly satisfaction scores and response count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.customerSatisfactionTrends}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis domain={[3, 5]} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'score' ? `${value}/5.0` : `${value} responses`, 
                          name === 'score' ? 'Score' : 'Responses'
                        ]}
                        contentStyle={{ 
                          background: '#fff', 
                          borderRadius: '8px', 
                          border: '1px solid #e5e7eb' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#FFB800" 
                        strokeWidth={3}
                        dot={{ r: 6, fill: "#FFB800" }}
                        activeDot={{ r: 8, fill: "#FFB800" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Performance Radial and Hourly Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-purple-500" />
                  Agent Performance Score
                </CardTitle>
                <CardDescription>Performance percentage by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={analyticsData.agentPerformanceRadial}>
                      <RadialBar dataKey="performance" cornerRadius={5} fill="#4C6FFF" />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Performance']}
                        contentStyle={{ 
                          background: '#fff', 
                          borderRadius: '8px', 
                          border: '1px solid #e5e7eb' 
                        }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                  24-Hour Activity
                </CardTitle>
                <CardDescription>Ticket creation by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.hourlyDistribution}>
                      <defs>
                        <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#7B61FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="hour" 
                        axisLine={false} 
                        tickLine={false}
                        interval={3}
                      />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => [`${value} tickets`, 'Count']}
                        labelFormatter={(hour) => `${hour}`}
                        contentStyle={{ 
                          background: '#fff', 
                          borderRadius: '8px', 
                          border: '1px solid #e5e7eb' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tickets" 
                        stroke="#7B61FF" 
                        fillOpacity={1} 
                        fill="url(#hourlyGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6 animate-fade-in">
          {/* Reports Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Reports & Export</h2>
              <p className="text-gray-600 mt-1">Generate and download comprehensive reports</p>
            </div>
            <Button className="animate-scale-in">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>

          {/* Quick Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard
              title="Daily Summary"
              description="Comprehensive daily performance report"
              icon={<Calendar className="h-6 w-6" />}
              metrics={["Tickets created", "Tickets resolved", "Response times", "Agent performance"]}
              downloadAction={() => console.log("Download daily report")}
              delay="100ms"
            />
            <ReportCard
              title="Agent Performance"
              description="Individual and team performance metrics"
              icon={<Users className="h-6 w-6" />}
              metrics={["Resolution rates", "Customer satisfaction", "Response times", "Workload distribution"]}
              downloadAction={() => console.log("Download agent report")}
              delay="200ms"
            />
            <ReportCard
              title="Customer Analysis"
              description="Customer behavior and satisfaction insights"
              icon={<Star className="h-6 w-6" />}
              metrics={["Satisfaction scores", "Ticket frequency", "Resolution feedback", "Customer segments"]}
              downloadAction={() => console.log("Download customer report")}
              delay="300ms"
            />
          </div>

          {/* Detailed Reports Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Custom Report Builder
                </CardTitle>
                <CardDescription>Create custom reports with specific metrics and date ranges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Select Metrics</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Ticket Volume",
                        "Response Times", 
                        "Resolution Rates",
                        "Customer Satisfaction",
                        "Agent Performance",
                        "SLA Compliance"
                      ].map((metric) => (
                        <div key={metric} className="flex items-center space-x-2">
                          <input type="checkbox" id={metric} className="rounded" defaultChecked />
                          <label htmlFor={metric} className="text-sm text-gray-600">{metric}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Last 7 days</Button>
                      <Button variant="outline" size="sm">Last 30 days</Button>
                      <Button variant="outline" size="sm">Custom</Button>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Custom Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="h-5 w-5 mr-2 text-green-500" />
                  Scheduled Reports
                </CardTitle>
                <CardDescription>Automatically generated reports sent to your email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "Daily Performance Summary", schedule: "Every day at 9:00 AM", status: "Active" },
                    { name: "Weekly Team Report", schedule: "Every Monday at 8:00 AM", status: "Active" },
                    { name: "Monthly Analytics", schedule: "1st of every month", status: "Paused" }
                  ].map((report, index) => (
                    <div key={report.name} className="p-3 border border-gray-200 rounded-lg animate-fade-in" style={{ animationDelay: `${600 + index * 100}ms` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">{report.name}</h4>
                          <p className="text-sm text-gray-600">{report.schedule}</p>
                        </div>
                        <Badge variant={report.status === "Active" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedules
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Export History */}
          <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: "600ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Download className="h-5 w-5 mr-2 text-purple-500" />
                Recent Exports
              </CardTitle>
              <CardDescription>Your recent report downloads and exports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Daily_Summary_2024-01-15.pdf", size: "2.3 MB", date: "2 hours ago", type: "PDF" },
                  { name: "Agent_Performance_Jan2024.xlsx", size: "1.8 MB", date: "1 day ago", type: "Excel" },
                  { name: "Customer_Analytics_Q1.csv", size: "856 KB", date: "3 days ago", type: "CSV" }
                ].map((file, index) => (
                  <div key={file.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${700 + index * 100}ms` }}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Download className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{file.name}</h4>
                        <p className="text-sm text-gray-600">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{file.type}</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
  icon: React.ReactNode;
  delay: string;
}

const StatCard = ({ title, value, description, trend, trendValue, accentColor, icon, delay }: StatCardProps) => {
  return (
    <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: delay }}>
      <div className="h-1 transition-all duration-300" style={{ backgroundColor: accentColor }}></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800 mb-2">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{description}</p>
          <div className={`flex items-center text-xs font-medium ${
            trend === "up" ? "text-emerald-500" : 
            trend === "down" ? "text-rose-500" : "text-amber-500"
          }`}>
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3 w-3 mr-1" />
            ) : null}
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
  delay: string;
}

const AgentItem = ({ name, tickets, satisfaction, avatar, color, delay }: AgentItemProps) => {
  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 animate-fade-in" style={{ animationDelay: delay }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md" style={{ backgroundColor: color }}>
        {avatar}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{tickets} tickets resolved</p>
      </div>
      <div className="text-right">
        <div className="flex items-center">
          <Star className="h-3 w-3 text-yellow-400 mr-1" />
          <span className="text-sm font-medium text-gray-800">{satisfaction}</span>
        </div>
        <p className="text-xs text-gray-500">satisfaction</p>
      </div>
    </div>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  metrics: string[];
  downloadAction: () => void;
  delay: string;
}

const ReportCard = ({ title, description, icon, metrics, downloadAction, delay }: ReportCardProps) => {
  return (
    <Card className="border border-gray-100 shadow-sm bg-white hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: delay }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {icon}
          </div>
          <Button variant="ghost" size="sm" onClick={downloadAction}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {metrics.map((metric, index) => (
              <li key={metric} className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                {metric}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
