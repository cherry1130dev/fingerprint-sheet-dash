import { EmployeeManagement } from "@/components/employees/EmployeeManagement";
import { addEmployeeToDatabase } from "@/services/employeeService";
import { useToast } from "@/hooks/use-toast";

export default function Employees() {
  const { toast } = useToast();

  const handleAddEmployee = async (newEmployee: { name: string; rollno: string }) => {
    try {
      // Convert to the expected Employee format for Firebase
      const employeeData = {
        name: newEmployee.name,
        rollNo: newEmployee.rollno,
        department: "General",
        position: "Employee", 
        email: "",
        phone: "",
        joinDate: new Date().toISOString(),
        status: "active" as const
      };
      
      const result = await addEmployeeToDatabase({
        name: employeeData.name,
        fingerid: employeeData.rollNo, // Using rollNo as fingerid for compatibility
        ph_number: "",
        email_id: "",
        joining_date: new Date().toISOString().split('T')[0],
        is_active: true
      });
      if (result.success) {
        toast({
          title: "Success",
          description: "Employee added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add employee",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = (id: string, updates: Partial<any>) => {
    // Handle edit functionality here
    console.log('Edit employee', id, updates);
  };

  const handleDeleteEmployee = (id: string) => {
    // Handle delete functionality here 
    console.log('Delete employee', id);
  };

  return (
    <EmployeeManagement
      onAddEmployee={handleAddEmployee}
      onEditEmployee={handleEditEmployee}
      onDeleteEmployee={handleDeleteEmployee}
    />
  );
}