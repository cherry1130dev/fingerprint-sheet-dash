export interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  rollNo: string;
  loginTime?: string;
  logoutTime?: string;
  status: "present" | "late" | "absent";
  method: "fingerprint" | "manual";
  date: string;
}

const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTsR3ZNxMoivIatuGkCPx48jgaSiw3xJyB0-wBKAHU8qFzQ7_CiUgO1D2TNV-oFH2wjnGn2K269_fr1/pub?output=csv";

export const fetchAttendanceData = async (): Promise<AttendanceRecord[]> => {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL + "&nocache=" + new Date().getTime());
    const csvText = await response.text();

    console.log("Fetched CSV Text:", csvText);

    const rows = csvText.trim().split("\n").map(r => r.split(","));
    const headers = rows[0].map(h => h.trim());
    console.log("CSV Headers:", headers);

    const data: AttendanceRecord[] = [];

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-GB").replace(/\//g, "-"); // dd-mm-yyyy

    for (let i = 1; i < rows.length; i++) {
      const rowObj: any = {};
      rows[i].forEach((cell, idx) => {
        rowObj[headers[idx]] = cell.trim();
      });

      console.log("Row " + i + " data:", rowObj);

      let status: "present" | "late" | "absent" = "absent";

      if (rowObj["Date"] === todayStr && rowObj["Time"]) {
        const [hh, mm] = rowObj["Time"].split(":").map(Number);
        const checkMinutes = hh * 60 + mm;

        if (checkMinutes >= (9 * 60 + 20) && checkMinutes <= (9 * 60 + 45)) {
          status = "present";
        } else if (checkMinutes > (9 * 60 + 45)) {
          status = "late";
        }
      }

      data.push({
        id: rowObj["ID"] || "" + i,
        employeeId: rowObj["ID"] || "" + i,
        name: rowObj["Name"] || "",
        rollNo: rowObj["Roll No"] || "",
        loginTime: rowObj["Time"] || "",
        logoutTime: "",
        status,
        method: "fingerprint" as const,
        date: rowObj["Date"] || ""
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return [];
  }
};

export const getTodayAttendance = (records: AttendanceRecord[]) => {
  const today = new Date();
  return records.filter(record => {
    // Parse record.date which is in "dd-mm-yyyy" or "dd/mm/yyyy" format
    const dateStr = record.date.replace(/\//g, "-");
    const [day, month, year] = dateStr.split("-").map(Number);
    const recordDate = new Date(year, month - 1, day);
    return (
      recordDate.getDate() === today.getDate() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear()
    );
  });
};
