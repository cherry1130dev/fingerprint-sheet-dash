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
import firebase from "firebase/compat/app";
import "firebase/compat/database";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (employee: { name: string; rollno: string; status: "active" }) => void;
}

export function AddEmployeeDialog({ open, onOpenChange, onAddEmployee }: AddEmployeeDialogProps) {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const { toast } = useToast();

  // Initialize Firebase app if not already initialized
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyAjvIZxDNfrfN6dPLxgLR7fbKlrUA0SmV",
      authDomain: "fingerprint-attendance-97741.firebaseapp.com",
      databaseURL: "https://fingerprint-attendance-97741-default-rtdb.firebaseio.com",
      projectId: "fingerprint-attendance-97741",
      storageBucket: "fingerprint-attendance-97741.appspot.com",
      messagingSenderId: "443013809983",
      appId: "1:443013809983:web:9e8eba3280dd9ed3a2f58a"
    });
  }
  const database = firebase.database();

  const handleAddEmployee = () => {
    if (!name.trim() || !rollNo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and roll number.",
        variant: "destructive",
      });
      return;
    }

    const newEmployeeRef = database.ref("employees").push();
    newEmployeeRef.set(
      {
        Name: name,
        RollNo: rollNo,
      },
      (error) => {
        if (error) {
          toast({
            title: "Error",
            description: "Failed to add employee. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Employee added successfully.",
          });
          onAddEmployee({ name, rollno: rollNo, status: "active" });
          setName("");
          setRollNo("");
          onOpenChange(false);
        }
      }
    );
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
