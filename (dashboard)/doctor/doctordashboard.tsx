import React, { useState, useEffect } from 'react';
import { fetchAppointments, fetchNotifications, markNotificationAsRead, rescheduleAppointment, completeAppointment } from '../utils/api';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Calendar } from 'lucide-react'

interface Appointment {
  id: number;
  doctor: string;
  date: string;
  time: string;
  status: string;
}

interface Notification {
  id: number;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [appointmentsData, notificationsData] = await Promise.all([
          fetchAppointments(),
          fetchNotifications()
        ]);
        setAppointments(appointmentsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const handleMarkNotificationAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleRescheduleAppointment = async (appointmentId: number, newDate: string, newTime: string) => {
    try {
      const updatedAppointment = await rescheduleAppointment(appointmentId, newDate, newTime);
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? updatedAppointment : apt
      ));
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const handleCompleteAppointment = async (appointmentId: number) => {
    try {
      await completeAppointment(appointmentId);
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
      ));
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.map((appointment) => (
              <div key={appointment.id} className="mb-4 p-4 border rounded">
                <p><strong>Doctor:</strong> {appointment.doctor}</p>
                <p><strong>Date:</strong> {format(new Date(appointment.date), 'MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
                {appointment.status === 'confirmed' && (
                  <Button onClick={() => handleCompleteAppointment(appointment.id)} className="mt-2">
                    Mark as Completed
                  </Button>
                )}
                {['pending', 'confirmed', 'canceled'].includes(appointment.status) && (
                  <div className="mt-2">
                    <Input type="date" className="mb-2" onChange={(e) => {
                      // Store the new date temporarily
                    }} />
                    <Input type="time" className="mb-2" onChange={(e) => {
                      // Store the new time temporarily
                    }} />
                    <Button onClick={() => {
                      // Use the stored new date and time here
                      handleRescheduleAppointment(appointment.id, '2023-06-01', '14:00:00')
                    }}>
                      Reschedule
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.map((notification) => (
              <div key={notification.id} className={`mb-4 p-4 border rounded ${notification.is_read ? 'bg-gray-100' : 'bg-white'}`}>
                <h3 className="font-bold">{notification.subject}</h3>
                <p>{notification.message}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(notification.created_at), 'MMMM d, yyyy HH:mm')}
                </p>
                {!notification.is_read && (
                  <Button onClick={() => handleMarkNotificationAsRead(notification.id)} className="mt-2">
                    Mark as Read
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

