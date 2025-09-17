import { useState } from "react";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addEmployeeToDatabase } from "@/services/employeeService";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (employee: { name: string; rollno: string; status: "active" }) => void;
}

export function AddEmployeeDialog({ open, onOpenChange, onAddEmployee }: AddEmployeeDialogProps) {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const { toast } = useToast();

  const handleAddEmployee = async () => {
    if (!name.trim() || !rollNo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and roll number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addEmployeeToDatabase({
        name: name.trim(),
        fingerid: rollNo.trim(),
        ph_number: "",
        email_id: "",
        joining_date: new Date().toISOString().split('T')[0],
        is_active: true
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Employee added successfully!",
        });
        onAddEmployee({ name: name.trim(), rollno: rollNo.trim(), status: "active" });
        setName("");
        setRollNo("");
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to add employee. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Add New Employee</span>
          </DialogTitle>
          <DialogDescription>
            Enter employee name and roll number to add a new employee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Charan Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNo">Roll Number *</Label>
            <Input
              id="rollNo"
              placeholder="EMP001"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee} className="gradient-primary">
              Add Employee
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}