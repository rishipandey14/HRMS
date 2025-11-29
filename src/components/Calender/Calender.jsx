// import React, { useRef, useState , useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';


// const Calender = ({isSidebarOpen}) => {

//   const calendarRef = useRef();


//   const [events, setEvents] = useState([
//     { id: '1', title: 'Team Meeting', date: '2025-07-18' },
//     { id: '2', title: 'Project Deadline', date: '2025-07-20' },
//     { id: '3', title: 'Hackathon', date: '2025-07-25' }
//   ]);

//   // For Modal
//   const [showModal, setShowModal] = useState(false);
//   const [newEventDate, setNewEventDate] = useState('');
//   const [newEventTitle, setNewEventTitle] = useState('');

//   const handleDateClick = (arg) => {
//     setNewEventDate(arg.dateStr);
//     setShowModal(true);
//   };

//   const handleEventDrop = (info) => {
//     const updatedEvents = events.map((event) =>
//       event.id === info.event.id
//         ? { ...event, date: info.event.startStr }
//         : event
//     );
//     setEvents(updatedEvents);
//   };

//   const getRandomColor = () => {
//   const colors = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA']; // Tailwind-like palette
//   return colors[Math.floor(Math.random() * colors.length)];
// };


//   const handleAddEvent = () => {
//     if (!newEventTitle.trim()) return;
//     const newEvent = {
//       id: String(Date.now()),
//       title: newEventTitle,
//       date: newEventDate,
//       color : getRandomColor()
//     };
//     setEvents([...events, newEvent]);
//     setShowModal(false);
//     setNewEventTitle('');
//   };


//    useEffect(() => {
//     if (calendarRef.current) {
//       const calendarApi = calendarRef.current.getApi();
//       calendarApi.updateSize();
//     }
//   }, [isSidebarOpen]);



//   const renderEventContent = (eventInfo) => {
//     return (
//       <>
//         {eventInfo.timeText && <b>{eventInfo.timeText}</b>}
//         {eventInfo.timeText && ' – '}
//         <i>{eventInfo.event.title}</i>
//       </>
//     );
//   };



//   return (
//     <div className="p-4 bg-gray-600 rounded-2xl w-full max-w-full">
//       <div className="bg-white rounded-2xl p-4 border  relative     ">
//         <FullCalendar
//           ref={calendarRef}
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           editable={true}
//           dateClick={handleDateClick}
//           eventDrop={handleEventDrop}
//           eventContent={renderEventContent}
//           events={events}
//            windowResize={true} 
//            className='max-w-4xl'
//         />

//         {/* MODAL */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black  flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-lg p-6 w-80">
//               <h2 className="text-lg font-bold mb-4">Add Event</h2>
//               <p className="text-sm text-gray-600 mb-2">Date: {newEventDate}</p>
//               <input
//                 type="text"
//                 placeholder="Enter event title"
//                 value={newEventTitle}
//                 onChange={(e) => setNewEventTitle(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none"
//               />
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   onClick={handleAddEvent}
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Calender;


 import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calender = () => {
  const calendarRef = useRef();
  const [events, setEvents] = useState([
    { id: '1', title: 'Team Meeting', date: '2025-07-18' },
    { id: '2', title: 'Project Deadline', date: '2025-07-20' },
    { id: '3', title: 'Hackathon', date: '2025-07-25' }
  ]);

  console.log("events 😍😍😍" , events);
  

  // For Modal
  const [showModal, setShowModal] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');

  // Force calendar to resize when layout changes
  useEffect(() => {
    const handleResize = () => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    // Check for layout changes more frequently
    const interval = setInterval(handleResize, 500);
    const timeoutId = setTimeout(handleResize, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleDateClick = (arg) => {
    setNewEventDate(arg.dateStr);
    setShowModal(true);
  };

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? { ...event, date: info.event.startStr }
        : event
    );
    setEvents(updatedEvents);
  };

  const getRandomColor = () => {
    const colors = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEvent = {
      id: String(Date.now()),
      title: newEventTitle,
      date: newEventDate,
      color: getRandomColor()
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
    setNewEventTitle('');
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        {eventInfo.timeText && <b>{eventInfo.timeText}</b>}
        {eventInfo.timeText && ' – '}
        <i>{eventInfo.event.title}</i>
      </>
    );
  };

  return (
    <>
      <style>
        {`
          .calendar-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
          .fc {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .fc-view-harness {
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .fc-daygrid-body {
            margin: 0 !important;
            width: 100% !important;
          }
          .fc-scrollgrid {
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            table-layout: fixed !important;
          }
          .fc-scrollgrid-sync-table {
            width: 100% !important;
            max-width: 100% !important;
            table-layout: fixed !important;
          }
          .fc-col-header-row {
            margin: 0 !important;
          }
          .fc-daygrid-day {
            padding: 2px !important;
            width: 14.28% !important;
            max-width: 14.28% !important;
            min-width: 0 !important;
          }
          .fc-daygrid {
            width: 100% !important;
          }
          .fc-view {
            width: 100% !important;
          }
          .fc-col-header-cell {
            width: 14.28% !important;
            max-width: 14.28% !important;
            min-width: 0 !important;
          }
          .fc-day {
            width: 14.28% !important;
            max-width: 14.28% !important;
          }
          .fc-daygrid-day-frame {
            width: 100% !important;
            max-width: 100% !important;
          }
        `}
      </style>

      {/* RESPONSIVE CONTAINER - automatically shrinks with available space */}
      <div className="p-4 bg-gray-100 rounded-2xl w-full h-[100vh] calendar-container">
        <div className="bg-white rounded-2xl p-4 relative w-full h-[96vh] overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            dateClick={handleDateClick}
            eventDrop={handleEventDrop}
            eventContent={renderEventContent}
            events={events}
            height="90vh"
            handleWindowResize={true}
            dayMaxEvents={false}
            aspectRatio={1.35}
            contentHeight="auto"
          />

          {/* MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-[#0303034f] flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                <h2 className="text-lg font-bold mb-4">Add Event</h2>
                <p className="text-sm text-gray-600 mb-2">Date: {newEventDate}</p>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleAddEvent}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Calender;


//   import React, { useRef, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

// const Calendar = ({ sidebarOpen }) => {
//   const calendarRef = useRef();

//   useEffect(() => {
//     const calendarApi = calendarRef.current?.getApi();
//     if (calendarApi) {
//       setTimeout(() => {
//         calendarApi.updateSize();
//       }, 300); // let sidebar animation complete
//     }
//   }, [sidebarOpen]);

//   return (
//     <div className="w-full h-[100vh] bg-black">
//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         height="auto"
//         expandRows={true}
//       />
//     </div>
//   );
// };

// export default Calendar;
