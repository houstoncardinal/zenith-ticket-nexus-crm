
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext, Customer } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface CustomerActionsProps {
  customer: Customer;
}

export function CustomerActions({ customer }: CustomerActionsProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const { deleteCustomer, updateCustomer } = useAppContext();
  const navigate = useNavigate();

  const handleDelete = () => {
    deleteCustomer(customer.id);
    toast({
      description: `${customer.name} has been removed.`,
    });
  };

  const handleReactivate = () => {
    updateCustomer(customer.id, { status: "active" });
    toast({
      description: `${customer.name} has been reactivated.`,
    });
  };

  const handleCreateTicket = () => {
    // Navigate to new ticket page with pre-filled customer
    navigate(`/tickets/new?customerId=${customer.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate(`/customers/${customer.id}`)}>
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCreateTicket}>Create Ticket</DropdownMenuItem>
          {customer.status === "active" ? (
            <DropdownMenuItem onClick={() => setAlertOpen(true)}>
              Delete Customer
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleReactivate}>Reactivate</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the customer account for {customer.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
