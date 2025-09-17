import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export interface AttendanceRecord {
  sno: number;
  name: string;
  fingerid: string;
  intime?: string;
  outtime?: string;
  status: "present" | "absent" | "late" | "early_departure";
  attendance_date: string;
  created_at: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  title?: string;
}

function getStatusBadge(status: AttendanceRecord["status"]) {
  const variants = {
    present: { variant: "default" as const, className: "bg-success text-success-foreground" },
    late: { variant: "secondary" as const, className: "bg-warning text-warning-foreground" },
    absent: { variant: "destructive" as const, className: "" },
    early_departure: { variant: "secondary" as const, className: "bg-warning text-warning-foreground" },
  };

  const config = variants[status];
  const labels = {
    present: "Present",
    late: "Late",
    absent: "Absent",
    early_departure: "Early Out",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {labels[status]}
    </Badge>
  );
}

function formatTime(timeString?: string) {
  if (!timeString) return "-";
  try {
    return format(new Date(timeString), "hh:mm a");
  } catch {
    return timeString;
  }
}

export function AttendanceTable({ records, title = "Today's Attendance" }: AttendanceTableProps) {
  return (
    <Card className="gradient-card shadow-custom border-0 animate-slide-up">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Login Time</TableHead>
                <TableHead className="font-semibold">Logout Time</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No attendance records found for today
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.sno} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell className="text-muted-foreground">{record.fingerid}</TableCell>
                    <TableCell>{formatTime(record.intime)}</TableCell>
                    <TableCell>{formatTime(record.outtime)}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        fingerprint
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}