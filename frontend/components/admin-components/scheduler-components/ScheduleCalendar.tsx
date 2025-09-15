// src/components/admin-components/ScheduleCalendar.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Shift {
  id: number;
  staffName: string;
  staffRole: string;
  department: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
}

interface ScheduleCalendarProps {
  currentWeek: Date;
  shifts: Shift[];
  navigateWeek: (direction: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, date: Date, timeSlot: string) => void;
}

export const ScheduleCalendar = ({
  currentWeek,
  shifts,
  navigateWeek,
  handleDragOver,
  handleDrop,
}: ScheduleCalendarProps) => {
  const timeSlots = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const getShiftsForDateAndTime = (date: Date, timeSlot: string) => {
    return shifts.filter(
      (shift) => shift.date === formatDate(date) && shift.startTime === timeSlot
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Weekly Schedule
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              Week of {getWeekDates(currentWeek)[0].toLocaleDateString()}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="p-2 text-sm font-medium text-gray-500">Time</div>
              {getWeekDates(currentWeek).map((date, index) => (
                <div key={index} className="p-2 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {weekDays[index]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {date.getDate()}/{date.getMonth() + 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-8 gap-1">
                  <div className="p-2 text-xs text-gray-500 font-medium">
                    {timeSlot}
                  </div>
                  {getWeekDates(currentWeek).map((date, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="min-h-[60px] border border-gray-200 rounded p-1 hover:bg-gray-50 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, date, timeSlot)}
                    >
                      {getShiftsForDateAndTime(date, timeSlot).map((shift) => (
                        <div
                          key={shift.id}
                          className={`${shift.color} text-white text-xs p-1 rounded mb-1 cursor-move`}
                          draggable
                        >
                          <div className="font-medium truncate">
                            {shift.staffName}
                          </div>
                          <div className="truncate">{shift.department}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
