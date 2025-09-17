import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddEmployeeDialog } from "./AddEmployeeDialog";
import { fetchEmployees, updateEmployee, deleteEmployee, type Employee as DatabaseEmployee } from "@/services/employeeService";

export interface Employee {
  empid: number;
  name: string;
  fingerid: string;
  ph_number?: string;
  email_id?: string;
  joining_date?: string;
  is_active: boolean;
}

interface EmployeeManagementProps {
  onAddEmployee: (employee: { name: string; rollno: string; status: "active" }) => void;
  onEditEmployee: (id: string, employee: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
}

export function EmployeeManagement({
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
}: EmployeeManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      const employeeData = await fetchEmployees();
      setEmployees(employeeData);
    };
    
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.fingerid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = async (empid: number) => {
    // Implement edit functionality
    onEditEmployee(empid.toString(), {});
  };

  const handleDelete = async (empid: number) => {
    const result = await deleteEmployee(empid);
    if (result.success) {
      setEmployees(employees.filter(emp => emp.empid !== empid));
    }
    onDeleteEmployee(empid.toString());
  };

  const handleAddEmployee = (employee: { name: string; rollno: string; status: "active" }) => {
    // Reload employees after adding
    const loadEmployees = async () => {
      const employeeData = await fetchEmployees();
      setEmployees(employeeData);
    };
    
    loadEmployees();
    onAddEmployee(employee);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground">Manage employee records and fingerprint enrollment</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="gradient-primary shadow-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <Card className="gradient-card shadow-custom border-0">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees by name or finger ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card className="gradient-card shadow-custom border-0 animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Employees ({filteredEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Finger ID</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Fingerprint</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No employees found matching your search" : "No employees found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.empid} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{employee.fingerid}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          <Fingerprint className="h-3 w-3 mr-1" />
                          Registered
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.is_active ? "default" : "secondary"}
                          className={
                            employee.is_active
                              ? "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {employee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEdit(employee.empid)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(employee.empid)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <AddEmployeeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddEmployee={handleAddEmployee}
      />
    </div>
  );
}