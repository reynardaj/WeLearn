"use client"

import { useState } from "react"
import Image from "next/image"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  availabilityId?: string
}

interface DateSpecificSlot {
  date: string
  dayName: string
  timeSlots: TimeSlot[]
}

interface CalendarViewProps {
  dateSpecificHours: DateSpecificSlot[]
}

export default function CalendarView({ dateSpecificHours }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day)
      const dateString = currentDay.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })

      // Check if this date has availability
      const hasAvailability = dateSpecificHours.some((slot) => slot.date === dateString && slot.timeSlots.length > 0)

      days.push({
        day,
        date: currentDay,
        dateString,
        hasAvailability,
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const days = getDaysInMonth(currentDate)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="w-full h-full">
      <div className="h-full flex flex-col bg-white">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">Calendar View</span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => navigateMonth("prev")}
              >
                ←
              </button>
              <span className="text-lg font-medium min-w-[150px] text-center">{monthYear}</span>
              <button
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => navigateMonth("next")}
              >
                →
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => (
              <div
                key={index}
                className={`
              relative h-16 rounded-lg flex flex-col items-center justify-center
              ${day ? "hover:bg-gray-50" : ""}
              ${day?.hasAvailability ? "bg-teal-50" : ""}
            `}
              >
                {day && (
                  <>
                    <span className={`text-sm ${day.hasAvailability ? "font-medium text-teal-700" : "text-gray-700"}`}>
                      {day.day}
                    </span>
                    {day.hasAvailability && (
                      <div className="absolute top-1 right-1">
                        <Image
                          src="/assets/messaging.png"
                          alt="Available"
                          width={12}
                          height={12}
                          className="opacity-70"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-50 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/assets/messaging.png" alt="Calendar icon" width={12} height={12} className="opacity-70" />
              <span>Has time slots</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
