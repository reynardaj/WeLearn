"use client";
import DashboardClick from "@/components/tutor-dashboard/DashboardSidebar";
import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "../../../../AvailabilityCalendar.css";

// --- Types and Interfaces ---
interface TimeSlot {
  id: number;
  starttime: string;
  endtime: string;
}

interface DayAvailability {
  day: number; // 1 = Mon, 7 = Sun
  name: string;
  isActive: boolean;
  slots: TimeSlot[];
}

interface DisplayAvailability {
  date: string; // Formatted date string, e.g., "09 Jun 2025"
  slots: string[];
}

// --- Main Component ---
export default function AvailabilityPage() {
  const tutorId = "998083f8-869a-44e8-b2eb-798aa9900274";

  // --- State Management ---
  const [availability, setAvailability] = useState<DayAvailability[]>([
    {
      day: 1,
      name: "Monday",
      isActive: false,
      slots: [{ id: 1, starttime: "", endtime: "" }],
    },
    {
      day: 2,
      name: "Tuesday",
      isActive: false,
      slots: [{ id: 1, starttime: "", endtime: "" }],
    },
    {
      day: 3,
      name: "Wednesday",
      isActive: false,
      slots: [{ id: 1, starttime: "", endtime: "" }],
    },
    {
      day: 4,
      name: "Thursday",
      isActive: false,
      slots: [{ id: 1, starttime: "", endtime: "" }],
    },
    {
      day: 5,
      name: "Friday",
      isActive: false,
      slots: [{ id: 1, starttime: "", endtime: "" }],
    },
    {
      day: 6,
      name: "Saturday",
      isActive: false,
      slots: [{ id: 1, starttime: "", endtime: "" }],
    },
    {
      day: 7,
      name: "Sunday",
      isActive: false,
      slots: [{ id: 1, starttime: "", endtime: "" }],
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [activeCalendarDate, setActiveCalendarDate] = useState(new Date());

  const timeOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      options.push(`${hour}:00`);
      options.push(`${hour}:30`);
    }
    return options;
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/tutor-dashboard/availability?tutorId=${tutorId}`
        );
        if (!response.ok) throw new Error("Failed to fetch availability.");
        const data = await response.json();

        if (data.length > 0) {
          const newAvailabilityState = availability.map((day) => ({
            ...day,
            isActive: false,
            slots: [
              { id: Date.now() * Math.random(), starttime: "", endtime: "" },
            ],
          }));
          data.forEach(
            (slot: { day: number; starttime: string; endtime: string }) => {
              const dayIndex = newAvailabilityState.findIndex(
                (d) => d.day === slot.day
              );
              if (dayIndex > -1) {
                newAvailabilityState[dayIndex].isActive = true;
                const firstSlot = newAvailabilityState[dayIndex].slots[0];
                if (firstSlot.starttime === "" && firstSlot.endtime === "") {
                  firstSlot.id = Date.now() * Math.random();
                  firstSlot.starttime = slot.starttime;
                  firstSlot.endtime = slot.endtime;
                } else {
                  newAvailabilityState[dayIndex].slots.push({
                    id: Date.now() * Math.random(),
                    starttime: slot.starttime,
                    endtime: slot.endtime,
                  });
                }
              }
            }
          );
          setAvailability(newAvailabilityState);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, [tutorId]);

  const handleDayToggle = (dayNumber: number) =>
    setAvailability((p) =>
      p.map((d) => (d.day === dayNumber ? { ...d, isActive: !d.isActive } : d))
    );
  const handleTimeChange = (
    dayNumber: number,
    slotId: number,
    field: "starttime" | "endtime",
    value: string
  ) =>
    setAvailability((p) =>
      p.map((d) =>
        d.day === dayNumber
          ? {
              ...d,
              slots: d.slots.map((s) =>
                s.id === slotId ? { ...s, [field]: value } : s
              ),
            }
          : d
      )
    );
  const addSlot = (dayNumber: number) =>
    setAvailability((p) =>
      p.map((d) =>
        d.day === dayNumber
          ? {
              ...d,
              slots: [
                ...d.slots,
                { id: Math.random(), starttime: "", endtime: "" },
              ],
            }
          : d
      )
    );

  const removeSlot = (dayNumber: number, slotId: number) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.day === dayNumber) {
          const updatedSlots = day.slots.filter((slot) => slot.id !== slotId);
          if (updatedSlots.length === 0) {
            return {
              ...day,
              isActive: false,
              slots: [{ id: Math.random(), starttime: "", endtime: "" }],
            };
          }
          return { ...day, slots: updatedSlots };
        }
        return day;
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    const payload = {
      tutorId,
      availability: availability.flatMap((d) =>
        d.isActive ? d.slots.map((s) => ({ ...s, day: d.day })) : []
      ),
    };
    try {
      const response = await fetch("/api/tutor-dashboard/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save availability.");
      }
      alert("Availability saved successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const weeklyAvailabilityMap = useMemo(() => {
    const map = new Map<number, string[]>();
    availability.forEach((day) => {
      if (day.isActive) {
        const validSlots = day.slots
          .filter((slot) => slot.starttime && slot.endtime)
          .map((slot) => `${slot.starttime}-${slot.endtime}`);
        if (validSlots.length > 0) map.set(day.day, validSlots);
      }
    });
    return map;
  }, [availability]);

  const displayedListAvailability = useMemo((): DisplayAvailability[] => {
    const today = new Date();
    const results: DisplayAvailability[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + i);
      const dayOfWeek = nextDay.getDay();
      const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;
      if (weeklyAvailabilityMap.has(isoDay)) {
        results.push({
          date: nextDay.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          slots: weeklyAvailabilityMap.get(isoDay) || [],
        });
      }
    }
    return results;
  }, [weeklyAvailabilityMap]);

  if (isLoading)
    return (
      <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
        <div className="w-[15%] h-[85%] flex flex-col items-center">
          <DashboardClick />
        </div>
        <div className="w-[85%] h-[85%] flex flex-col">
          <div className="w-[90%] h-[100%] justify-center bg-white rounded-2xl shadow-lg flex flex-col items-center"></div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  const ViewToggle = () => (
    <div className="flex bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setViewMode("list")}
        className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white text-gray-800 shadow"
            : "bg-transparent text-gray-500"
        }`}
      >
        List
      </button>
      <button
        onClick={() => setViewMode("calendar")}
        className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${
          viewMode === "calendar"
            ? "bg-white text-gray-800 shadow"
            : "bg-transparent text-gray-500"
        }`}
      >
        Calendar
      </button>
    </div>
  );

  const CalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-blue-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick />
      </div>
      <div className="w-[85%] h-[85%] flex flex-col">
        <div className="w-[95%] h-full bg-white rounded-2xl shadow-lg flex p-6 gap-8">
          {viewMode === "list" && (
            <div className="w-1/2 h-full flex flex-col transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Weekly Hours
                </h2>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
              <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                {availability.map((day) => (
                  <div key={day.day}>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`day-${day.day}`}
                        checked={day.isActive}
                        onChange={() => handleDayToggle(day.day)}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`day-${day.day}`}
                        className="ml-3 text-lg font-medium text-gray-700"
                      >
                        {day.name}
                      </label>
                    </div>
                    {day.isActive && (
                      <div className="pl-8 space-y-2">
                        {day.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center gap-2"
                          >
                            <select
                              value={slot.starttime}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.day,
                                  slot.id,
                                  "starttime",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                            >
                              <option value="">Start</option>
                              {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <span className="text-gray-500">-</span>
                            <select
                              value={slot.endtime}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.day,
                                  slot.id,
                                  "endtime",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                            >
                              <option value="">End</option>
                              {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => removeSlot(day.day, slot.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addSlot(day.day)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold mt-2"
                        >
                          + Add more
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Side: Date Specific Hours */}
          <div
            className={`${
              viewMode === "list" ? "w-1/2 border-l pl-8" : "w-full"
            } h-full flex flex-col transition-all duration-300`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold text-gray-800 transition-opacity ${
                  viewMode === "calendar" ? "opacity-0" : "opacity-100"
                }`}
              >
                Date Specific Hours
              </h2>
              <ViewToggle />
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
              {viewMode === "list" && (
                <div className="space-y-3">
                  {displayedListAvailability.length > 0 ? (
                    displayedListAvailability.map((item) => (
                      <div
                        key={item.date}
                        className="flex justify-between pb-3 border-b border-gray-200 last:border-b-0"
                      >
                        <p className="font-semibold text-gray-700">
                          {item.date}
                        </p>
                        <div className="flex flex-col flex-wrap gap-2 mt-1">
                          {item.slots.map((slot) => (
                            <span
                              key={slot}
                              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 mt-10">
                      <p>No availability set for the next 7 days.</p>
                      <p className="text-sm">
                        Check the boxes on the left to add your weekly hours.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {viewMode === "calendar" && (
                <Calendar
                  activeStartDate={activeCalendarDate}
                  onActiveStartDateChange={({ activeStartDate }) =>
                    setActiveCalendarDate(activeStartDate || new Date())
                  }
                  className="availability-calendar"
                  tileContent={({ date, view }) => {
                    if (view === "month") {
                      const formattedDate = date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                      const dayData = displayedListAvailability.find(
                        (d) => d.date === formattedDate
                      );

                      if (dayData && dayData.slots.length > 0) {
                        return (
                          <div className="calendar-tile-content">
                            <div className="flex items-center justify-center gap-1">
                              <CalendarIcon />
                            </div>
                            <div className="time-slots">
                              {dayData.slots.slice(0, 2).map((slot) => (
                                <div key={slot}>{slot}</div>
                              ))}
                              {dayData.slots.length > 2 && (
                                <div className="text-xs">...more</div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    }
                    return null;
                  }}
                  formatShortWeekday={(locale, date) =>
                    date.toLocaleDateString("en-US", { weekday: "short" })
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
