import { apiCall } from '../lib/database';

// Updated AttendanceRecord interface to match MySQL schema
export interface AttendanceRecord {
  sno: number;
  name: string;
  fingerid: string;
  intime?: string;
  outtime?: string;
  status: "present" | "late" | "absent";
  attendance_date: string;
  created_at: string;
}

export const fetchAttendanceData = async (): Promise<AttendanceRecord[]> => {
  try {
    const attendanceRecords = await apiCall('/attendance');
    return attendanceRecords;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return [];
  }
};

export const fetchAttendanceByDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    const attendanceRecords = await apiCall(`/attendance?date=${date}`);
    return attendanceRecords;
  } catch (error) {
    console.error("Error fetching attendance data by date:", error);
    return [];
  }
};

export const getTodayAttendance = (records: AttendanceRecord[]) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  return records.filter(record => {
    const recordDate = new Date(record.attendance_date);
    return (
      recordDate.getDate() === today.getDate() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear()
    );
  });
};

export const addAttendanceRecord = async (attendance: Omit<AttendanceRecord, 'sno' | 'created_at'>) => {
  try {
    const result = await apiCall('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendance),
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding attendance record:", error);
    return { success: false, error: error };
  }
};

export const updateAttendanceRecord = async (sno: number, updates: Partial<AttendanceRecord>) => {
  try {
    const result = await apiCall(`/attendance/${sno}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating attendance record:", error);
    return { success: false, error: error };
  }
};