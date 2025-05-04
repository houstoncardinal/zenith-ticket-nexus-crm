
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext, Customer } from "@/contexts/AppContext";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Plus, Search, Ticket } from "lucide-react";
import { AddCustomerForm } from "@/components/customers/AddCustomerForm";
import { CustomerActions } from "@/components/customers/CustomerActions";

const CustomersPage = () => {
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter customers based on search query and active tab
  const filteredCustomers = state.customers.filter((customer) => {
    // Search filter
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tab filter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && customer.status === "active") ||
      (activeTab === "inactive" && customer.status === "inactive");
    
    return matchesSearch && matchesTab;
  });

  // Calculate stats
  const totalCustomers = state.customers.length;
  const newThisMonth = state.customers.filter(c => {
    const joinDate = new Date(c.joinDate);
    const now = new Date();
    return (
      joinDate.getMonth() === now.getMonth() && 
      joinDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const activeCustomers = state.customers.filter(c => c.status === "active").length;
  const customerRetention = Math.round((activeCustomers / totalCustomers) * 100) || 0;

  const totalSpent = state.customers.reduce((acc, c) => {
    const spent = parseFloat(c.spent.replace(/[^0-9.-]+/g, "")) || 0;
    return acc + spent;
  }, 0);
  
  const averageSpent = totalCustomers ? Math.round(totalSpent / totalCustomers) : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        
        <AddCustomerForm />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">{newThisMonth} new this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerRetention}%</div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} active customers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSpent}</div>
            <p className="text-xs text-muted-foreground">Based on customer spending</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        defaultValue="all" 
        className="space-y-4"
        value={activeTab}
        onValueChange={setActiveTab}
      >
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
        
        <TabsContent value="all" className="m-0">
          <CustomersTable customers={filteredCustomers} />
        </TabsContent>
        
        <TabsContent value="active" className="m-0">
          <CustomersTable 
            customers={filteredCustomers.filter(c => c.status === "active")} 
          />
        </TabsContent>
        
        <TabsContent value="inactive" className="m-0">
          <CustomersTable 
            customers={filteredCustomers.filter(c => c.status === "inactive")} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CustomersTableProps {
  customers: Customer[];
}

const CustomersTable = ({ customers }: CustomersTableProps) => {
  return (
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
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback 
                        className={
                          customer.status === "active" 
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={`/customers/${customer.id}`} className="font-medium hover:underline">
                        {customer.name}
                      </Link>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {customer.company || "—"}
                </TableCell>
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
                  <CustomerActions customer={customer} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomersPage;
