import { useState, useEffect } from "react";
import { Calendar, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AttendanceTable, AttendanceRecord } from "@/components/dashboard/AttendanceTable";
import { Badge } from "@/components/ui/badge";
import { fetchAttendanceData, getTodayAttendance } from "@/services/attendanceService";
import * as XLSX from 'xlsx';

export default function Reports() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [reportData, setReportData] = useState<AttendanceRecord[]>([]);
  const [downloadType, setDownloadType] = useState<'today' | 'yesterday' | 'custom'>('today');

  useEffect(() => {
    async function loadData() {
      const allData = await fetchAttendanceData();
      let filteredData: AttendanceRecord[] = [];

      if (selectedDate === new Date().toISOString().split("T")[0]) {
        filteredData = getTodayAttendance(allData);
      } else {
        // Filter by selectedDate (format yyyy-mm-dd)
        filteredData = allData.filter(record => {
          const recordDate = new Date(record.attendance_date);
          return recordDate.toISOString().split("T")[0] === selectedDate;
        });
      }

      setReportData(filteredData);
    }
    loadData();
  }, [selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const filteredData = reportData.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.fingerid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportToExcel = (type: 'today' | 'yesterday' | 'custom' = downloadType) => {
    let dateToExport = selectedDate;
    let filename = `attendance_${selectedDate}`;

    if (type === 'today') {
      dateToExport = new Date().toISOString().split("T")[0];
      filename = `attendance_today_${dateToExport}`;
    } else if (type === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dateToExport = yesterday.toISOString().split("T")[0];
      filename = `attendance_yesterday_${dateToExport}`;
    }

    const dataToExport = reportData;
    
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    
    // Convert data to format suitable for Excel
    const excelData = dataToExport.map(record => ({
      'Serial No': record.sno,
      'Name': record.name,
      'Finger ID': record.fingerid,
      'In Time': record.intime || 'N/A',
      'Out Time': record.outtime || 'N/A',
      'Status': record.status,
      'Date': record.attendance_date
    }));
    
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');
    
    // Export to Excel file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground">Reports & Records</h1>
        <p className="text-muted-foreground">
          View and export historical attendance data with flexible download options
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Date Selection */}
        <Card className="gradient-card shadow-custom border-0 animate-scale-in hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full transition-all duration-200 focus:scale-105"
            />
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="gradient-card shadow-custom border-0 animate-scale-in hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Search className="h-4 w-4 mr-2 text-primary" />
              Search Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full transition-all duration-200 focus:scale-105"
            />
          </CardContent>
        </Card>

        {/* Quick Export Options */}
        <Card className="gradient-card shadow-custom border-0 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Quick Downloads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => handleExportToExcel('today')}
              className="w-full gradient-primary hover:scale-105 transition-all duration-200"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button
              onClick={() => handleExportToExcel('yesterday')}
              className="w-full gradient-success hover:scale-105 transition-all duration-200"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Yesterday
            </Button>
            <Button
              onClick={() => handleExportToExcel('custom')}
              className="w-full gradient-warning hover:scale-105 transition-all duration-200"
              disabled={filteredData.length === 0}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Selected Date
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      {reportData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
          <Card className="gradient-card border-0 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground animate-bounce-gentle">
                {reportData.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success animate-bounce-gentle">
                {reportData.filter(r => r.status === "present").length}
              </div>
              <div className="text-sm text-muted-foreground">Present</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning animate-bounce-gentle">
                {reportData.filter(r => r.status === "late").length}
              </div>
              <div className="text-sm text-muted-foreground">Late</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive animate-bounce-gentle">
                {reportData.filter(r => r.status === "absent").length}
              </div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Table */}
      <AttendanceTable
        records={filteredData}
        title={`Attendance Records - ${new Date(selectedDate).toLocaleDateString()}`}
      />
    </div>
  );
}