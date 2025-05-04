
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewTicketForm from "@/components/tickets/NewTicketForm";

const TicketsPage = () => {
  const { state, updateTicket, deleteTicket } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortMethod, setSortMethod] = useState("newest");
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter tickets based on search query and status
  const filterTickets = () => {
    let filtered = state.tickets.filter(ticket => {
      const matchesSearch = 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    // Sort tickets based on selected sort method
    switch (sortMethod) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "priority-high":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]);
        break;
      case "priority-low":
        const priorityOrderReversed = { urgent: 1, high: 2, medium: 3, low: 4 };
        filtered.sort((a, b) => priorityOrderReversed[b.priority as keyof typeof priorityOrderReversed] - priorityOrderReversed[a.priority as keyof typeof priorityOrderReversed]);
        break;
    }
    
    return filtered;
  };
  
  const filteredTickets = filterTickets();
  
  // Get customer by ID
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

  // Handle ticket action menu options
  const handleTicketAction = (actionType: string, ticket: any) => {
    switch (actionType) {
      case "view":
        navigate(`/tickets/${ticket.id}`);
        break;
      case "assign":
        // In a real app, you'd open a dialog to select an agent
        const randomAgentId = state.agents[Math.floor(Math.random() * state.agents.length)].id;
        updateTicket(ticket.id, { agentId: randomAgentId });
        toast({
          title: "Ticket Assigned",
          description: `Ticket ${ticket.id} assigned to agent.`,
          duration: 3000
        });
        break;
      case "resolve":
        updateTicket(ticket.id, { status: "resolved" });
        toast({
          title: "Ticket Resolved",
          description: `Ticket ${ticket.id} marked as resolved.`,
          duration: 3000
        });
        break;
      case "close":
        updateTicket(ticket.id, { status: "closed" });
        toast({
          title: "Ticket Closed",
          description: `Ticket ${ticket.id} has been closed.`,
          duration: 3000
        });
        break;
      case "delete":
        deleteTicket(ticket.id);
        toast({
          title: "Ticket Deleted",
          description: `Ticket ${ticket.id} has been deleted.`,
          duration: 3000
        });
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Tickets</h1>
        
        <Button onClick={() => setIsNewTicketDialogOpen(true)}>
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
            <div className="text-2xl font-bold">
              {state.tickets.filter(t => t.agentId === "AGENT-001").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {state.tickets.filter(t => t.agentId === "AGENT-001" && 
                (t.status === "open" || t.status === "in_progress")).length} require action
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.tickets.filter(t => t.dueDate && 
                new Date(t.dueDate).toDateString() === new Date().toDateString()).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {state.tickets.filter(t => t.dueDate && 
                new Date(t.dueDate).toDateString() === new Date().toDateString() && 
                t.priority === "high").length || 0} high priority
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.stats.responseTime}</div>
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
                <DropdownMenuItem onClick={() => setSortMethod("newest")}>
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMethod("oldest")}>
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMethod("priority-high")}>
                  Priority: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMethod("priority-low")}>
                  Priority: Low to High
                </DropdownMenuItem>
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
                      <Button 
                        variant="outline" 
                        className="mt-2" 
                        onClick={() => setIsNewTicketDialogOpen(true)}
                      >
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
                            <DropdownMenuItem onClick={() => handleTicketAction("view", ticket)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTicketAction("assign", ticket)}>
                              Assign Ticket
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleTicketAction("resolve", ticket)}>
                              Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleTicketAction("close", ticket)}
                              className="text-red-600"
                            >
                              Close Ticket
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleTicketAction("delete", ticket)}
                              className="text-red-600"
                            >
                              Delete Ticket
                            </DropdownMenuItem>
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
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">No open tickets found</div>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setIsNewTicketDialogOpen(true)}
                      >
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
                            <DropdownMenuItem onClick={() => handleTicketAction("view", ticket)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTicketAction("assign", ticket)}>
                              Assign Ticket
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleTicketAction("resolve", ticket)}>
                              Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleTicketAction("close", ticket)}
                              className="text-red-600"
                            >
                              Close Ticket
                            </DropdownMenuItem>
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
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">No tickets in progress</div>
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
                            <DropdownMenuItem onClick={() => handleTicketAction("view", ticket)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTicketAction("assign", ticket)}>
                              Assign Ticket
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleTicketAction("resolve", ticket)}>
                              Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleTicketAction("close", ticket)}
                              className="text-red-600"
                            >
                              Close Ticket
                            </DropdownMenuItem>
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
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">No resolved tickets</div>
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
                            <DropdownMenuItem onClick={() => handleTicketAction("view", ticket)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTicketAction("assign", ticket)}>
                              Assign Ticket
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateTicket(ticket.id, { status: "open" })}>
                              Reopen Ticket
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleTicketAction("close", ticket)}
                              className="text-red-600"
                            >
                              Close Ticket
                            </DropdownMenuItem>
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
      </Tabs>

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new support ticket.
            </DialogDescription>
          </DialogHeader>
          <NewTicketForm onClose={() => setIsNewTicketDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsPage;
