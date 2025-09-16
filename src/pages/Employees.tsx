import { useState } from "react";
import { EmployeeManagement, Employee } from "@/components/employees/EmployeeManagement";

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Charan Kumar",
    email: "charan@company.com",
    phone: "+91 9876543210",
    department: "Engineering",
    position: "Software Developer",
    fingerprintId: "FP_001",
    status: "active",
    joinDate: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Priya Sharma",
    email: "priya@company.com",
    phone: "+91 9876543211",
    department: "Marketing",
    position: "Marketing Manager",
    fingerprintId: "FP_002",
    status: "active",
    joinDate: "2023-02-01T00:00:00Z",
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Raj Patel",
    email: "raj@company.com",
    phone: "+91 9876543212",
    department: "Engineering",
    position: "Senior Developer",
    status: "active",
    joinDate: "2022-11-10T00:00:00Z",
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Anita Singh",
    email: "anita@company.com",
    phone: "+91 9876543213",
    department: "HR",
    position: "HR Manager",
    fingerprintId: "FP_004",
    status: "active",
    joinDate: "2023-03-20T00:00:00Z",
  },
  {
    id: "5",
    employeeId: "EMP005",
    name: "Vikram Gupta",
    email: "vikram@company.com",
    phone: "+91 9876543214",
    department: "Finance",
    position: "Accountant",
    status: "inactive",
    joinDate: "2022-08-15T00:00:00Z",
  },
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const handleAddEmployee = (newEmployee: Omit<Employee, "id">) => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
    };
    setEmployees(prev => [...prev, employee]);
  };

  const handleEditEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, ...updates } : emp))
    );
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  return (
    <EmployeeManagement
      employees={employees}
      onAddEmployee={handleAddEmployee}
      onEditEmployee={handleEditEmployee}
      onDeleteEmployee={handleDeleteEmployee}
    />
  );
}