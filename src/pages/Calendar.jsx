import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = () => {
  const calendarRef = useRef();

  const [events, setEvents] = useState([
    { id: '1', title: 'Meeting', date: '2025-07-18' }
  ]);

  const [checkedDays, setCheckedDays] = useState({});

  // Resize Fix
  useEffect(() => {
    const handleResize = () => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Checkbox toggle
  const handleCheck = (dateStr) => {
    setCheckedDays((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  // Custom Day Cell UI
  const renderDayCell = (arg) => {
    const dateStr = arg.date.toISOString().split('T')[0];

    return (
      <div className="relative w-full h-full">

        {/* DATE (soft, top-left) */}
        <div className="absolute top-1 left-2 text-sm text-gray-400 font-medium">
          {arg.dayNumberText}
        </div>

        {/* CHECKBOX (top-right, grey) */}
        <input
          type="checkbox"
          checked={!!checkedDays[dateStr]}
          onChange={() => handleCheck(dateStr)}
          className="absolute top-1 right-1 w-4 h-4 accent-gray-400 cursor-pointer"
        />

      </div>
    );
  };

  return (
    <>
      <style>
        {`
          /* ===== PERFECT SQUARE GRID FIX ===== */

          .fc-scrollgrid-sync-table {
            width: 100% !important;
            table-layout: fixed !important;
          }

          .fc-daygrid-day {
            width: 14.28% !important;
            height: 0 !important;
            padding-bottom: 14.28% !important; /* 🔥 makes square */
            position: relative;
          }

          .fc-daygrid-day-frame {
            position: absolute !important;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }

          /* remove event overflow (clean UI like your screenshot) */
          .fc-daygrid-day-events {
            display: none;
          }

          /* borders */
          .fc-theme-standard td, 
          .fc-theme-standard th {
            border: 1px solid #e5e7eb;
          }
        `}
      </style>

      <div className="h-screen w-full bg-gray-100 p-3">

        <div className="flex flex-col lg:flex-row gap-4 h-full">

          {/* LEFT 70% */}
          <div className="lg:w-[70%] w-full flex flex-col gap-4">

            {/* CALENDAR */}
            <div className="bg-white rounded-2xl shadow p-3 h-[60%]">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dayCellContent={renderDayCell}
                height="100%"
              />
            </div>

            {/* LEGENDS */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">

              <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-700">Legends</h3>
                <span className="text-gray-400 cursor-pointer">⌃</span>
              </div>

              <div className="p-4 text-sm text-gray-600 space-y-4">

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div><span className="font-bold text-green-600">P</span> Present</div>
                  <div><span className="font-bold text-red-500">A</span> Absent</div>
                  <div><span className="font-bold text-gray-600">O</span> Off Day</div>
                  <div><span className="font-bold text-gray-600">R</span> Rest Day</div>
                  <div><span className="font-bold text-purple-500">L</span> Leave</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div><span className="font-bold">OD</span> On Duty</div>
                  <div><span className="font-bold text-blue-500">H</span> Holiday</div>
                  <div><span className="inline-block w-4 h-4 bg-yellow-200 mr-1"></span> Alert for Deduction</div>
                  <div><span className="inline-block w-4 h-4 bg-red-200 mr-1"></span> Deduction</div>
                  <div><span className="text-red-500 font-bold">?</span> Status Unknown</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>⏱ Overtime</div>
                  <div>✏ Override</div>
                  <div>🔺 Permission</div>
                  <div>◼ Ignored</div>
                  <div>🔷 Grace</div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2 text-gray-700">Day Type</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>☕ Rest Day</div>
                    <div>📺 Off Day</div>
                    <div>☂ Holiday</div>
                    <div>🌓 Half Day</div>
                    <div>✳ Plant Shutdown</div>
                  </div>
                </div>

              </div>
            </div>

            {/* SWIPES */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="font-semibold mb-3">Swipes</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span>09:34:56 AM</span>
                  <span className="text-gray-500">CQZ7224460641</span>
                </div>

                <div className="flex justify-between">
                  <span>17:39:44 PM</span>
                  <span className="text-gray-500">CQZ7224460641</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 30% */}
          <div className="lg:w-[30%] w-full bg-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Right Panel</h3>
            <p className="text-sm text-gray-500">
              Add filters, employee details, or analytics here.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Calendar;