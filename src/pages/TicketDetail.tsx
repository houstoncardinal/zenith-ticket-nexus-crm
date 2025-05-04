
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Tag, User, MessageSquare, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateTicket, getCustomerById } = useAppContext();
  const [loading, setLoading] = useState(true);

  // Find the ticket in our state
  const ticket = state.tickets.find(t => t.id === id);
  const customer = ticket ? getCustomerById(ticket.customerId) : undefined;
  const agent = ticket?.agentId ? state.agents.find(a => a.id === ticket.agentId) : undefined;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (newStatus: string) => {
    if (ticket) {
      updateTicket(ticket.id, { status: newStatus as any });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-blue-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "urgent": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default" className="bg-blue-500">Open</Badge>;
      case "in_progress":
        return <Badge variant="default" className="bg-yellow-500">In Progress</Badge>;
      case "waiting":
        return <Badge variant="default" className="bg-purple-500">Waiting</Badge>;
      case "resolved":
        return <Badge variant="default" className="bg-green-500">Resolved</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold">Ticket not found</h2>
              <p className="text-muted-foreground mt-2">
                The ticket you're looking for doesn't exist or has been deleted.
              </p>
              <Button className="mt-4" onClick={() => navigate('/tickets')}>
                View All Tickets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline">Delete</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">{ticket.id}</div>
              <CardTitle className="text-xl font-bold mt-1">{ticket.title}</CardTitle>
            </div>
            {getStatusBadge(ticket.status)}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Description</h3>
                <p>{ticket.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Customer</h3>
                    {customer ? (
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Customer not found</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Assigned Agent</h3>
                    {agent ? (
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {agent.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">Satisfaction: {agent.satisfaction}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {ticket.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-gray-50">
                          <Tag className="mr-1 h-3 w-3" /> {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Priority</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                      <span className="capitalize">{ticket.priority}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Type</h3>
                    <span className="capitalize">{ticket.type.replace(/_/g, " ")}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Created</h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                      <span>
                        {new Date(ticket.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Last Updated</h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(ticket.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                      <span>
                        {new Date(ticket.updatedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                <div className="border-l-2 border-gray-200 pl-4 ml-2">
                  <div className="text-sm font-medium">Ticket created</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="border-l-2 border-gray-200 pl-4 ml-2">
                  <div className="text-sm font-medium">Ticket assigned to {agent?.name || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(ticket.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">AM</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">Alex Morgan</div>
                      <div className="text-xs text-muted-foreground">
                        1 day ago
                      </div>
                      <div className="mt-2">
                        Called customer to get more information about the issue.
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Add Note
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            <User className="inline h-4 w-4 mr-1" />
            Created by System
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" 
              onClick={() => handleStatusChange("closed")}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
              Close Ticket
            </Button>
            <Button onClick={() => handleStatusChange("resolved")}>
              Resolve Ticket
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TicketDetail;
