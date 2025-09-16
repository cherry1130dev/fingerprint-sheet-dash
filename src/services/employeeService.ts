import { ref, push, set } from 'firebase/database';
import { database } from '../lib/firebase';

export interface Employee {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive";
}

export const addEmployeeToFirebase = async (employee: Omit<Employee, 'id'>) => {
  try {
    const newEmployeeRef = push(ref(database, 'employees'));
    await set(newEmployeeRef, {
      Name: employee.name,
      RollNo: employee.rollNo,
      ID: "",
      Department: employee.department,
      Position: employee.position,
      Email: employee.email,
      Phone: employee.phone,
      JoinDate: employee.joinDate,
      Status: employee.status
    });
    return { success: true, id: newEmployeeRef.key };
  } catch (error) {
    console.error("Error adding employee to Firebase:", error);
    return { success: false, error: error };
  }
};