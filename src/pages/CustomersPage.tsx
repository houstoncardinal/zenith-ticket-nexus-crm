
import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Ticket,
  User,
} from "lucide-react";

// Sample data
const customers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Inc.",
    status: "active",
    tickets: 3,
    spent: "$2,450",
    joinDate: "Oct 12, 2023",
  },
  {
    id: "CUST-002",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    company: "Globex Corp",
    status: "active",
    tickets: 1,
    spent: "$890",
    joinDate: "Jan 5, 2024",
  },
  {
    id: "CUST-003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    company: "Initech",
    status: "active",
    tickets: 2,
    spent: "$3,200",
    joinDate: "Mar 18, 2023",
  },
  {
    id: "CUST-004",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    company: "Umbrella Corp",
    status: "inactive",
    tickets: 0,
    spent: "$0",
    joinDate: "Feb 22, 2024",
  },
  {
    id: "CUST-005",
    name: "Robert Garcia",
    email: "robert.garcia@example.com",
    company: "Stark Industries",
    status: "active",
    tickets: 5,
    spent: "$5,670",
    joinDate: "Nov 30, 2023",
  },
  {
    id: "CUST-006",
    name: "David Kim",
    email: "david.kim@example.com",
    company: "Wayne Enterprises",
    status: "active",
    tickets: 2,
    spent: "$1,320",
    joinDate: "Dec 15, 2023",
  },
];

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        
        <Button className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256</div>
            <p className="text-xs text-muted-foreground">14 new this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">3% increase from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,280</div>
            <p className="text-xs text-muted-foreground">8% increase from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="all">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Company</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Tickets</TableHead>
                  <TableHead className="hidden lg:table-cell">Total Spent</TableHead>
                  <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
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
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{customer.company}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={customer.status === "active" ? "default" : "outline"}>
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Ticket className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                        {customer.tickets}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{customer.spent}</TableCell>
                    <TableCell className="hidden lg:table-cell">{customer.joinDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Create Ticket</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="active">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Company</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Tickets</TableHead>
                  <TableHead className="hidden lg:table-cell">Total Spent</TableHead>
                  <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers
                  .filter((customer) => customer.status === "active")
                  .map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
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
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{customer.company}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Ticket className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                          {customer.tickets}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{customer.spent}</TableCell>
                      <TableCell className="hidden lg:table-cell">{customer.joinDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Create Ticket</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="inactive">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Company</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Tickets</TableHead>
                  <TableHead className="hidden lg:table-cell">Total Spent</TableHead>
                  <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers
                  .filter((customer) => customer.status === "inactive")
                  .map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{customer.company}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">Inactive</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Ticket className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                          {customer.tickets}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{customer.spent}</TableCell>
                      <TableCell className="hidden lg:table-cell">{customer.joinDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Reactivate</DropdownMenuItem>
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

export default CustomersPage;
