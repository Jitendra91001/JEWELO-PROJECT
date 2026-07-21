import React from 'react';
import FullCalendar from '@fullcalendar/react';

import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarIcon } from '../Icons/icon';

const resources = [
  { id: 'OT1', title: 'OT1' },
  { id: 'OT2', title: 'OT2' },
  { id: 'Cath1', title: 'Cath1' },
  { id: 'Cath2', title: 'Cath2' },
];

const events = [
  {
    id: '1',
    resourceId: 'OT1',
    title: 'Ravi Kumar - 7754',
    start: '2024-06-18T09:30:00',
    end: '2024-06-18T11:30:00',
    backgroundColor: '#6B7280',
    borderColor: '#4B5563',
    textColor: '#ffffff',
    classNames: ['pre-operative']
  },
  {
    id: '2',
    resourceId: 'OT1',
    title: 'Radha Banerjee - 8544',
    start: '2024-06-18T17:00:00',
    end: '2024-06-18T20:00:00',
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
    textColor: '#ffffff',
    classNames: ['post-operative']
  },
  {
    id: '3',
    resourceId: 'OT2',
    title: 'Ram Singh - 6065',
    start: '2024-06-18T12:00:00',
    end: '2024-06-18T15:00:00',
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
    textColor: '#ffffff',
    classNames: ['intra-operative']
  },
  {
    id: '4',
    resourceId: 'Cath1',
    title: 'Pradeep Kushwaha - 7755',
    start: '2024-06-18T15:00:00',
    end: '2024-06-18T18:00:00',
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
    textColor: '#ffffff',
    classNames: ['intra-operative']
  }
];

const EventViewCalender: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">
              {/* {formatDate(new Date('2024-06-18'), 'EEE, dd-MMM-yy').toUpperCase()} */}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Pre Operative</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm">Intra Operative</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm">Post Operative</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-teal-600 hover:text-teal-700 font-medium">
              Today
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-700">
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="fc-custom-view">
          <FullCalendar
            plugins={[resourceTimelinePlugin, interactionPlugin]}
            initialView="resourceTimelineDay"
            initialDate="2024-06-18"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}

            events={events}
            slotDuration="00:30:00"
            slotMinTime="09:00:00"
            slotMaxTime="21:00:00"
            headerToolbar={false}

            height="auto"

          />
        </div>
      </div>
    </div>
  );
};

export default EventViewCalender;