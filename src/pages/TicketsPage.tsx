
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, Filter, Plus, Search, Tag } from "lucide-react";

// Sample data
const tickets = [
  {
    id: "TKT-1234",
    subject: "Unable to access admin dashboard",
    customer: "John Doe",
    status: "open",
    priority: "high",
    category: "Technical",
    assignee: "Alex Morgan",
    created: "2 hours ago",
    updated: "45 minutes ago",
    responses: 3,
  },
  {
    id: "TKT-1233",
    subject: "Billing discrepancy on last invoice",
    customer: "Emma Wilson",
    status: "open",
    priority: "medium",
    category: "Billing",
    assignee: "Taylor Chen",
    created: "4 hours ago",
    updated: "1 hour ago",
    responses: 2,
  },
  {
    id: "TKT-1232",
    subject: "Feature request: Dark mode option",
    customer: "Michael Brown",
    status: "in_progress",
    priority: "low",
    category: "Feature Request",
    assignee: "Jamie Wilson",
    created: "1 day ago",
    updated: "6 hours ago",
    responses: 4,
  },
  {
    id: "TKT-1231",
    subject: "Password reset not working",
    customer: "Sarah Johnson",
    status: "in_progress",
    priority: "high",
    category: "Technical",
    assignee: "Sam Rodriguez",
    created: "1 day ago",
    updated: "3 hours ago",
    responses: 5,
  },
  {
    id: "TKT-1230",
    subject: "Question about service packages",
    customer: "Robert Garcia",
    status: "pending",
    priority: "medium",
    category: "General Inquiry",
    assignee: "Unassigned",
    created: "2 days ago",
    updated: "1 day ago",
    responses: 1,
  },
  {
    id: "TKT-1229",
    subject: "Mobile app crash on startup",
    customer: "David Kim",
    status: "resolved",
    priority: "high",
    category: "Technical",
    assignee: "Alex Morgan",
    created: "3 days ago",
    updated: "1 day ago",
    responses: 6,
  },
];

const TicketsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Tickets</h1>
        <Button className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> Create Ticket
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
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
            <Select defaultValue="newest">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="updated">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Assignee</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div>{ticket.subject}</div>
                      <div className="md:hidden text-xs text-muted-foreground mt-1">{ticket.customer}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{ticket.customer}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <CategoryBadge category={ticket.category} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{ticket.assignee}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        {ticket.created}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="open">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Assignee</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets
                  .filter((ticket) => ticket.status === "open")
                  .map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>{ticket.subject}</div>
                        <div className="md:hidden text-xs text-muted-foreground mt-1">{ticket.customer}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.customer}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <CategoryBadge category={ticket.category} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{ticket.assignee}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          {ticket.created}
                        </div>
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
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Assignee</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets
                  .filter((ticket) => ticket.status === "in_progress")
                  .map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>{ticket.subject}</div>
                        <div className="md:hidden text-xs text-muted-foreground mt-1">{ticket.customer}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.customer}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <CategoryBadge category={ticket.category} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{ticket.assignee}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          {ticket.created}
                        </div>
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
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Assignee</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets
                  .filter((ticket) => ticket.status === "resolved")
                  .map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>{ticket.subject}</div>
                        <div className="md:hidden text-xs text-muted-foreground mt-1">{ticket.customer}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.customer}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <CategoryBadge category={ticket.category} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{ticket.assignee}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          {ticket.created}
                        </div>
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

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let variant: "default" | "secondary" | "outline" | "destructive" = "default";
  let label = "Unknown";
  let icon = null;

  switch (status) {
    case "open":
      variant = "default";
      label = "Open";
      break;
    case "in_progress":
      variant = "secondary";
      label = "In Progress";
      break;
    case "pending":
      variant = "outline";
      label = "Pending";
      break;
    case "resolved":
      variant = "outline";
      label = "Resolved";
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    default:
      break;
  }

  return (
    <Badge variant={variant} className="flex w-fit items-center">
      {icon}
      {label}
    </Badge>
  );
};

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  let className = "";
  let label = priority.charAt(0).toUpperCase() + priority.slice(1);

  switch (priority) {
    case "high":
      className = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      break;
    case "medium":
      className = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      break;
    case "low":
      className = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      break;
    default:
      break;
  }

  return (
    <span 
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return (
    <div className="flex items-center">
      <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
      <span className="text-sm">{category}</span>
    </div>
  );
};

export default TicketsPage;
