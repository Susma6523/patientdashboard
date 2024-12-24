"use client"

import { useEffect, useState } from "react"
import { Header } from "./components/Header"
import { StatsCards } from "./components/stats-cards"
import { AppointmentsList } from "./components/appointments-list"
import { NotificationsList } from "./components/notifications-list"
import { fetchAppointments, fetchNotifications, markNotificationAsRead } from "./utils/api"
import { toast } from "@/components/ui/use-toast"

interface DashboardStats {
  upcomingAppointments: number
  pendingReports: number
  unreadMessages: number
  activePrescriptions: number
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    upcomingAppointments: 0,
    pendingReports: 0,
    unreadMessages: 0,
    activePrescriptions: 0,
  })
  const [appointments, setAppointments] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        const [appointmentsData, notificationsData] = await Promise.all([
          fetchAppointments(),
          fetchNotifications(),
        ])

        setAppointments(appointmentsData)
        setNotifications(notificationsData)
        setStats({
          upcomingAppointments: appointmentsData.length,
          pendingReports: 2, // This would come from your API
          unreadMessages: notificationsData.filter((n: any) => !n.is_read).length,
          activePrescriptions: 3, // This would come from your API
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(
        notifications.map((notification: any) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      )
      toast({
        title: "Success",
        description: "Notification marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <StatsCards isLoading={isLoading} stats={stats} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <AppointmentsList isLoading={isLoading} appointments={appointments} />
          </div>
          <div className="lg:col-span-3">
            <NotificationsList
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

