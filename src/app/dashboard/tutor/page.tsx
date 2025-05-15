"use client";
import { Heading2, Heading3 } from "@/components/Heading";
// import { TextMd } from "@/components/Text";
import DashboardClick from "@/components/tutorDashClick";
import Calendar from 'react-calendar';
import React , {useState} from "react";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Register() {
  const tutorId = "TUT001";

  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] pt-15">
      <div className="w-[15%] flex flex-col items-center">
        <DashboardClick/>
      </div>
      <div className="w-[60%] flex flex-col">
        <div className="w-[100%] h-[95%] bg-white rounded-2xl shadow-lg flex flex-col items-center">
            <div className="w-[90%] h-[12%] flex justify-center items-center">
              <div className="w-[25%] h-[50%] flex flex-col justify-center items-center border-r-2 border-[#B8B8B8]">
                total session
                <div>
                  tes
                </div>
              </div>
              <div className="w-[25%] h-[50%] flex flex-col justify-center items-center border-r-2 border-[#B8B8B8]">
                total eanting
              </div>
              <div className="w-[25%] h-[50%] flex flex-col justify-center items-center border-r-2 border-[#B8B8B8]">
                average rating
              </div>
              <div className="w-[25%] h-[50%] flex flex-col justify-center items-center">
                unique
              </div>
            </div>
            <div className="w-[90%] h-[75%]">
              <Heading2 className="h-auto">
                Analytic Overview
              </Heading2>
              <div className="flex w-[50%] h-[8%] justify-between items-center rounded-lg bg-[#E5E5E5] pl-2 pr-2 mt-3 mb-3">
                <div className="w-[30%] h-[80%] flex justify-center items-center rounded-lg bg-white">
                  Performance
                </div>
                <div className="w-[30%] h-[80%] flex justify-center items-center rounded-lg bg-white">
                  Sessions
                </div>
                <div className="w-[30%] h-[80%] flex justify-center items-center rounded-lg bg-white">
                  Feedback
                </div>
              </div>
              {/* performance part */}
              <div className="h-auto flex items-center">
                <Heading3>
                  Perfomance review
                </Heading3>
              </div>
              <div className="h-[10%] flex justify-between items-center">
                <div className="w-[50%] h-[100%] flex justify-between items-center">
                  <div className="w-[30%] h-[80%] flex justify-center items-center rounded-2xl bg-white shadow-lg border-2 border-[#E5E5E5]">
                    Daily
                  </div>
                  <div className="w-[30%] h-[80%] flex justify-center items-center rounded-2xl bg-white shadow-lg border-2 border-[#E5E5E5]">
                    Weekly
                  </div>
                  <div className="w-[30%] h-[80%] flex justify-center items-center rounded-2xl bg-white shadow-lg border-2 border-[#E5E5E5]">
                    Monthly
                  </div>
                </div>
                <div className=" w-[30%] h-[100%] flex justify-between items-center">
                  <div>
                    pick a date
                  </div>
                  to
                  <div>
                    pick a date
                  </div>
                </div>
              </div>
              <div className="h-[65%] w-[100%] bg-amber-600 mt-3">
                  statistic
              </div>

              {/* session part */}
              <div className="h-[10%] flex justify-between items-center">
                <div className="w-[50%] h-[100%] flex justify-between items-center">
                  <Heading3>
                  Session History
                </Heading3>
                </div>
                <div className=" w-[30%] h-[100%] flex justify-between items-center">
                  <div>
                    pick a date
                  </div>
                  to
                  <div>
                    pick a date
                  </div>
                </div>
              </div>
              <div className="h-[75%] w-[100%] bg-amber-600 mt-3">
                  statistic
              </div>

              {/* rating part */}
              <div className="h-[10%] flex justify-between items-center">
                <div className="w-[50%] h-[100%] flex justify-between items-center">
                  <Heading3>
                    Rating Overview
                </Heading3>
                </div>
              </div>
              <div className="h-[75%] w-[100%] mt-3">
                  <div className="h-[20%]">
                    <div>
                      ../5
                    </div>
                    <div>
                      starss
                    </div>
                    <div>
                      total reviews
                    </div>
                  </div>
                  <div className="h-[35%] w-[100%] flex flex-col justify-between">
                    <div className="w-[100%] h-[20%] flex justify-between items-center">
                      5
                      <div className="w-[95%] h-[50%] border-1 border-black rounded-4xl">

                      </div>
                      <div>
                        (...)
                      </div>
                    </div>
                    <div className="w-[100%] h-[20%] flex justify-between items-center">
                      4
                      <div className="w-[95%] h-[50%] border-1 border-black rounded-4xl">

                      </div>
                      <div>
                        (...)
                      </div>
                    </div>
                    <div className="w-[100%] h-[20%] flex justify-between items-center">
                      3
                      <div className="w-[95%] h-[50%] border-1 border-black rounded-4xl">

                      </div>
                      <div>
                        (...)
                      </div>
                    </div>
                    <div className="w-[100%] h-[20%] flex justify-between items-center">
                      2
                      <div className="w-[95%] h-[50%] border-1 border-black rounded-4xl">

                      </div>
                      <div>
                        (...)
                      </div>
                    </div>
                    <div className="w-[100%] h-[20%] flex justify-between items-center">
                      1
                      <div className="w-[95%] h-[50%] border-1 border-black rounded-4xl">

                      </div>
                      <div>
                        (...)
                      </div>
                    </div>
                  </div>
                  <div className="h-[10%] w-[100%] flex items-end">
                    Recent Feedback
                  </div>
                  <div className="h-[35%] w-[100%]">

                  </div>
              </div>
              
            </div>
        </div>
      </div>
      <div className="w-[25%] flex flex-col items-center">
        <div className="w-[90%] h-[95%] bg-white rounded-2xl shadow-lg flex flex-col items-center justify-evenly">
          <div className="w-[90%] h-auto flex items-center justify-center">
            <Calendar
                onChange={setDate}
                value={date}
                className="w-[90%] border-none"
                prev2Label={null}
                next2Label={null}

                navigationClassName="flex items-center justify-between w-full mb-2"

                navigationLabel={({ label }) => (
                    <div className="flex-grow text-center font-semibold text-lg">
                        {label}
                    </div>
                )}

                prevLabel={
                    <div className="text-gray-600 px-2 min-w-[60px] text-left">
                       Prev
                    </div>
                }
                nextLabel={
                    <div className="text-gray-600 px-2 min-w-[60px] text-right">
                       Next
                    </div>
                }
            />
          </div>
          <div className="w-[90%] h-[50%] bg-amber-400">
            <div className="pb-2">
              Upcoming
            </div>
            <div className="h-[92%] w-[100%] bg-amber-800">
              list of
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
