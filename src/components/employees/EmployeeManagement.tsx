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
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export interface Employee {
  id: string;
  name: string;
  rollno: string;
  fingerprintId?: string;
  status: "active" | "inactive";
}

interface EmployeeManagementProps {
  onAddEmployee: (employee: Omit<Employee, "id">) => void;
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

  // Initialize Firebase app if not already initialized
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const database = firebase.database();
    const employeesRef = database.ref("students");

    const handleData = (snapshot: firebase.database.DataSnapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedEmployees: Employee[] = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          name: value.name,
          rollno: value.rollno,
          fingerprintId: value.fingerprintId || undefined,
          status: "active",
        }));
        setEmployees(loadedEmployees);
      } else {
        setEmployees([]);
      }
    };

    employeesRef.on("value", handleData);

    return () => {
      employeesRef.off("value", handleData);
    };
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.rollno.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Search employees by name or roll number..."
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
                  <TableHead className="font-semibold">Roll Number</TableHead>
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
                    <TableRow key={employee.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{employee.rollno}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.fingerprintId ? (
                          <Badge variant="outline" className="bg-success-light text-success">
                            <Fingerprint className="h-3 w-3 mr-1" />
                            Enrolled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-success-light text-success">
                            Enrolled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.status === "active" ? "default" : "secondary"}
                          className={
                            employee.status === "active"
                              ? "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onDeleteEmployee(employee.id)}
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
        onAddEmployee={onAddEmployee}
      />
    </div>
  );
}
