import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Tag,
} from "lucide-react";

const TicketsPage = () => {
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Filter tickets based on search query and status
  const filteredTickets = state.tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get customer by ID - this would access the customers data from context in a real app
  const getCustomerName = (customerId: string) => {
    const customer = state.customers.find(c => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };
  
  // Get agent by ID
  const getAgentName = (agentId: string | null) => {
    if (!agentId) return "Unassigned";
    const agent = state.agents.find(a => a.id === agentId);
    return agent ? agent.name : "Unknown Agent";
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  
  // Get the appropriate badge for a ticket status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case "waiting":
        return <Badge className="bg-purple-500">Waiting</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get the appropriate color for a ticket priority
  const getPriorityElement = (priority: string) => {
    let bgColor;
    switch (priority) {
      case "low":
        bgColor = "bg-blue-500";
        break;
      case "medium":
        bgColor = "bg-yellow-500";
        break;
      case "high":
        bgColor = "bg-orange-500";
        break;
      case "urgent":
        bgColor = "bg-red-500";
        break;
      default:
        bgColor = "bg-gray-500";
    }
    
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full ${bgColor} mr-2`}></div>
        <span className="capitalize">{priority}</span>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Tickets</h1>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Ticket
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              All Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.tickets.length}</div>
            <p className="text-xs text-muted-foreground">
              {state.tickets.filter(t => t.status === "open").length} open
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned to Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 require action</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 high priority</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m</div>
            <p className="text-xs text-muted-foreground">5% faster than last week</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        defaultValue="all" 
        className="space-y-4"
        onValueChange={value => setSelectedStatus(value)}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort By</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Newest first</DropdownMenuItem>
                <DropdownMenuItem>Oldest first</DropdownMenuItem>
                <DropdownMenuItem>Priority: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Priority: Low to High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">No tickets found</div>
                      <Button variant="outline" className="mt-2">
                        <Plus className="mr-2 h-4 w-4" /> Create Ticket
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="group">
                      <TableCell>
                        <Link to={`/tickets/${ticket.id}`} className="hover:underline group-hover:text-blue-600">
                          <div className="font-medium">{ticket.title}</div>
                          <div className="text-xs text-muted-foreground">{ticket.id}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getCustomerName(ticket.customerId)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getPriorityElement(ticket.priority)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell capitalize">
                        {ticket.type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getAgentName(ticket.agentId)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Ticket</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Mark Resolved</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Close Ticket</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="open">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets
                  .filter(ticket => ticket.status === "open")
                  .map((ticket) => (
                    <TableRow key={ticket.id} className="group">
                      <TableCell>
                        <Link to={`/tickets/${ticket.id}`} className="hover:underline group-hover:text-blue-600">
                          <div className="font-medium">{ticket.title}</div>
                          <div className="text-xs text-muted-foreground">{ticket.id}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getCustomerName(ticket.customerId)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getPriorityElement(ticket.priority)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell capitalize">
                        {ticket.type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getAgentName(ticket.agentId)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Ticket</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Mark Resolved</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Close Ticket</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="in_progress">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets
                  .filter(ticket => ticket.status === "in_progress")
                  .map((ticket) => (
                    <TableRow key={ticket.id} className="group">
                      <TableCell>
                        <Link to={`/tickets/${ticket.id}`} className="hover:underline group-hover:text-blue-600">
                          <div className="font-medium">{ticket.title}</div>
                          <div className="text-xs text-muted-foreground">{ticket.id}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getCustomerName(ticket.customerId)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getPriorityElement(ticket.priority)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell capitalize">
                        {ticket.type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getAgentName(ticket.agentId)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Ticket</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Mark Resolved</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Close Ticket</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="resolved">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets
                  .filter(ticket => ticket.status === "resolved")
                  .map((ticket) => (
                    <TableRow key={ticket.id} className="group">
                      <TableCell>
                        <Link to={`/tickets/${ticket.id}`} className="hover:underline group-hover:text-blue-600">
                          <div className="font-medium">{ticket.title}</div>
                          <div className="text-xs text-muted-foreground">{ticket.id}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getCustomerName(ticket.customerId)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getPriorityElement(ticket.priority)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell capitalize">
                        {ticket.type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getAgentName(ticket.agentId)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Ticket</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Reopen Ticket</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Close Ticket</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketsPage;
