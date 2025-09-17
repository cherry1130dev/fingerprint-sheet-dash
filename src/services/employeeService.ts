import { apiCall } from '../lib/database';

// Updated Employee interface to match MySQL schema
export interface Employee {
  empid: number;
  name: string;
  fingerid: string;
  ph_number: string;
  email_id: string;
  joining_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const addEmployeeToDatabase = async (employee: Omit<Employee, 'empid' | 'created_at' | 'updated_at'>) => {
  try {
    const result = await apiCall('/employees', {
      method: 'POST',
      body: JSON.stringify({
        name: employee.name,
        fingerid: employee.fingerid,
        ph_number: employee.ph_number,
        email_id: employee.email_id,
        joining_date: employee.joining_date,
        is_active: employee.is_active
      }),
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding employee to database:", error);
    return { success: false, error: error };
  }
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const employees = await apiCall('/employees');
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

export const updateEmployee = async (empid: number, updates: Partial<Employee>) => {
  try {
    const result = await apiCall(`/employees/${empid}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { success: false, error: error };
  }
};

export const deleteEmployee = async (empid: number) => {
  try {
    await apiCall(`/employees/${empid}`, {
      method: 'DELETE',
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false, error: error };
  }
};