
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define types for our data
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
export type TicketType = "technical" | "billing" | "feature_request" | "general";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  customerId: string;
  agentId: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: "active" | "inactive";
  phone?: string;
  tickets: number;
  spent: string;
  joinDate: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  tickets: string;
  satisfaction: string;
}

export interface AppState {
  tickets: Ticket[];
  customers: Customer[];
  agents: Agent[];
  stats: {
    openTickets: number;
    resolvedToday: number;
    customerSatisfaction: string;
    responseTime: string;
  };
  loading: boolean;
}

export interface AppContextType {
  state: AppState;
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  addCustomer: (customer: Omit<Customer, "id" | "joinDate">) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getTicketsByCustomerId: (id: string) => Ticket[];
  getRecentActivity: () => (Ticket | Customer)[];
}

// Sample data for our application
const sampleTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "Website login not working",
    description: "Customer cannot log in to their account on the website",
    customerId: "CUST-001",
    agentId: "AGENT-001",
    status: "open",
    priority: "high",
    type: "technical",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["login", "website"]
  },
  {
    id: "TKT-002",
    title: "Billing discrepancy in April invoice",
    description: "Customer reports being charged twice for the same service in April",
    customerId: "CUST-002",
    agentId: "AGENT-002",
    status: "in_progress",
    priority: "medium",
    type: "billing",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    tags: ["billing", "invoice"]
  },
  {
    id: "TKT-003",
    title: "Feature request: Dark mode",
    description: "Customer requests dark mode option for the dashboard",
    customerId: "CUST-003",
    agentId: null,
    status: "open",
    priority: "low",
    type: "feature_request",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    tags: ["feature", "ui"]
  },
  {
    id: "TKT-004",
    title: "Cannot export data to CSV",
    description: "Export functionality is failing when trying to download CSV reports",
    customerId: "CUST-005",
    agentId: "AGENT-001",
    status: "waiting",
    priority: "high",
    type: "technical",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ["export", "reports"]
  },
  {
    id: "TKT-005",
    title: "How to integrate with Slack?",
    description: "Customer needs help setting up Slack integration",
    customerId: "CUST-004",
    agentId: "AGENT-003",
    status: "resolved",
    priority: "medium",
    type: "general",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ["integration", "slack"]
  }
];

const sampleCustomers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Inc.",
    status: "active" as const,
    tickets: 3,
    spent: "$2,450",
    joinDate: "Oct 12, 2023"
  },
  {
    id: "CUST-002",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    company: "Globex Corp",
    status: "active" as const,
    tickets: 1,
    spent: "$890",
    joinDate: "Jan 5, 2024"
  },
  {
    id: "CUST-003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    company: "Initech",
    status: "active" as const,
    tickets: 2,
    spent: "$3,200",
    joinDate: "Mar 18, 2023"
  },
  {
    id: "CUST-004",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    company: "Umbrella Corp",
    status: "inactive" as const,
    tickets: 0,
    spent: "$0",
    joinDate: "Feb 22, 2024"
  },
  {
    id: "CUST-005",
    name: "Robert Garcia",
    email: "robert.garcia@example.com",
    company: "Stark Industries",
    status: "active" as const,
    tickets: 5,
    spent: "$5,670",
    joinDate: "Nov 30, 2023"
  },
  {
    id: "CUST-006",
    name: "David Kim",
    email: "david.kim@example.com",
    company: "Wayne Enterprises",
    status: "active" as const,
    tickets: 2,
    spent: "$1,320",
    joinDate: "Dec 15, 2023"
  }
];

const sampleAgents = [
  {
    id: "AGENT-001",
    name: "Alex Morgan",
    avatar: "AM",
    tickets: "32",
    satisfaction: "98%"
  },
  {
    id: "AGENT-002",
    name: "Jamie Wilson",
    avatar: "JW",
    tickets: "29",
    satisfaction: "96%"
  },
  {
    id: "AGENT-003",
    name: "Sam Rodriguez",
    avatar: "SR",
    tickets: "27",
    satisfaction: "94%"
  },
  {
    id: "AGENT-004",
    name: "Taylor Chen",
    avatar: "TC",
    tickets: "24",
    satisfaction: "92%"
  }
];

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    tickets: sampleTickets,
    customers: sampleCustomers,
    agents: sampleAgents,
    stats: {
      openTickets: 127,
      resolvedToday: 42,
      customerSatisfaction: "94%",
      responseTime: "24m"
    },
    loading: false
  });

  // Add a new ticket
  const addTicket = (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      ...ticket,
      id: `TKT-${String(state.tickets.length + 1).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now
    };
    setState(prevState => ({
      ...prevState,
      tickets: [...prevState.tickets, newTicket],
      stats: {
        ...prevState.stats,
        openTickets: prevState.stats.openTickets + 1
      }
    }));

    // Update customer ticket count
    updateCustomerTicketCount(ticket.customerId, 1);
  };

  // Update an existing ticket
  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setState(prevState => ({
      ...prevState,
      tickets: prevState.tickets.map(ticket => 
        ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket
      )
    }));
  };

  // Delete a ticket
  const deleteTicket = (id: string) => {
    const ticket = state.tickets.find(t => t.id === id);
    if (ticket) {
      setState(prevState => ({
        ...prevState,
        tickets: prevState.tickets.filter(t => t.id !== id),
        stats: {
          ...prevState.stats,
          openTickets: prevState.stats.openTickets - (ticket.status === "open" ? 1 : 0)
        }
      }));

      // Update customer ticket count
      updateCustomerTicketCount(ticket.customerId, -1);
    }
  };

  // Add a new customer
  const addCustomer = (customer: Omit<Customer, "id" | "joinDate">) => {
    const newCustomer: Customer = {
      ...customer,
      id: `CUST-${String(state.customers.length + 1).padStart(3, '0')}`,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setState(prevState => ({
      ...prevState,
      customers: [...prevState.customers, newCustomer]
    }));
  };

  // Update an existing customer
  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setState(prevState => ({
      ...prevState,
      customers: prevState.customers.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      )
    }));
  };

  // Delete a customer
  const deleteCustomer = (id: string) => {
    setState(prevState => ({
      ...prevState,
      customers: prevState.customers.filter(c => c.id !== id)
    }));
  };

  // Helper to update customer's ticket count
  const updateCustomerTicketCount = (customerId: string, change: number) => {
    setState(prevState => ({
      ...prevState,
      customers: prevState.customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, tickets: customer.tickets + change } 
          : customer
      )
    }));
  };

  // Get a customer by ID
  const getCustomerById = (id: string) => {
    return state.customers.find(c => c.id === id);
  };

  // Get all tickets for a specific customer
  const getTicketsByCustomerId = (id: string) => {
    return state.tickets.filter(ticket => ticket.customerId === id);
  };

  // Get recent activity (combined tickets and customers, sorted by date)
  const getRecentActivity = () => {
    // In a real app, you'd have created/updated timestamps for customers too
    return [...state.tickets].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      addTicket, 
      updateTicket, 
      deleteTicket,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      getCustomerById,
      getTicketsByCustomerId,
      getRecentActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
