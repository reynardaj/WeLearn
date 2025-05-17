"use client";

import React from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {TextMd, TextLg, TextSm} from "../components/Text"
import { Title, Subtitle, Heading1, Heading2, Heading3, Heading4 } from "../components/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";


export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F0FAF9] pt-18">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 border-b bg-white shadow-sm h-18 z-50">
        <div className="flex items-center space-x-2">
          <img src="/assets/logo.svg" alt="WeLearn_Logo" className="w-18 h-18" />
          <Heading4 className="">WeLearn</Heading4>
        </div>
        <div className="space-x-0 flex items-center">
          <Button variant="ghost">Become a tutor</Button>
          <div className="border-l border-gray-300 h-6"></div>
          <Button variant="ghost">Find tutors</Button>
          <Button variant="primary" className="rounded-md">Sign In</Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center pt-30 pb-20 mb-20">
        <div className="w-30 h-30 mx-auto mb-4 flex items-center justify-center bg-white rounded-2xl shadow-md">
          <img src="assets/logo.svg" alt="WeLearn Logo" className="w-25 h-25" />
        </div>
        <Title className="">Learn from Peers, Teach Your Passion</Title>
        <Subtitle className="text-secondary w-200 mx-auto mt-4 mb-8">
        Join WeLearn – the student-led platform connecting learners and tutors like you.
        </Subtitle>
        <div className="flex justify-center items-center space-x-4">
          <Button variant="primary">Become a Tutor</Button>
          <TextMd className="text-text">or</TextMd>
          <Button variant="primary">Find a Tutor</Button>
        </div>
      </section>

      {/* Why WeLearn Section */}
      <section className="mx-auto py-20 my-20">
        <Heading1 className="text-center mb-8">Why WeLearn?</Heading1>
        <div className="flex flex-col items-center gap-6">
          {[
            { title: "Student Led", desc: "Tutors who get it - because they're students too.", icon: <div className="w-15 h-15 mx-auto mb-4 p-4 flex items-center justify-center bg-white rounded-2xl shadow-md"><img src="assets/WhyWeLearn/star.svg" alt="Star Logo" className="w-12 h-12" /></div> },
            { title: "Affordable", desc: "Low-cost sessions tailored for student budgets.", icon: <div className="w-15 h-15 mx-auto mb-4 p-5.5 flex items-center justify-center bg-white rounded-2xl shadow-md"><img src="assets/WhyWeLearn/dollar.svg" alt="Dollar Logo" className="w-12 h-12" /></div> },
            { title: "Flexible", desc: "Learn or teach on your schedule, anytime.", icon: <div className="w-15 h-15 mx-auto mb-4 p-4 flex items-center justify-center bg-white rounded-2xl shadow-md"><img src="assets/WhyWeLearn/calendar.svg" alt="Calendar Logo" className="w-12 h-12" /></div> },
            { title: "Earn While You Learn", desc: "Turn your skills into cash. Tutor what you're good at and build your resume while helping others.", icon: <div className="w-15 h-15 mx-auto mb-4 p-4 flex items-center justify-center bg-white rounded-2xl shadow-md"><img src="assets/WhyWeLearn/bag.svg" alt="Bag Logo" className="w-12 h-12" /></div> },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <Heading3 className="">{item.title}</Heading3>
                <TextMd className="whitespace-normal break-words w-95">{item.desc}</TextMd>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 my-20">
        <Heading1 className="text-center mb-15">Peer-to-Peer Learning, Made Simple</Heading1>
        <div className="flex justify-center space-x-12 max-w-4xl mx-auto">
          {[
            { title: "Sign Up", desc: "Create your free account as a learner or tutor in seconds.", icon: <img src="assets/Steps/user.svg" /> },
            { title: "Connect", desc: "Browse tutors or offer your skills to help others.", icon: <img src="assets/Steps/handshake.svg" /> },
            { title: "Learn & Grow", desc: "Book sessions, share knowledge, and succeed together.", icon: <img src="assets/Steps/graduation-cap.svg" /> },
          ].map((step, index) => (
            <div key={index} className="text-center max-w-xs flex flex-col items-center">
              <div className="text-blue-600 text-xl font-bold mb-4">{index + 1}</div>
              <div className="mb-2">{step.icon}</div>
              <Heading3 className="">{step.title}</Heading3>
              <TextMd className="whitespace-normal break-words w-40">{step.desc}</TextMd>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 my-20">
        <Heading1 className="text-center mb-10">What Students Are Saying</Heading1>
        <div className="flex justify-center items-center space-x-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-48 p-4">
              <CardContent className="text-sm text-gray-700">
                <p className="mb-2">
                  I aced my math exam thanks to my WeLearn tutor – they explained it better than my teacher!
                </p>
                <div className="flex space-x-1 text-yellow-500">{"⭐⭐⭐⭐⭐"}</div>
                <div className="mt-2 text-xs text-gray-500">
                  <Heading4>John</Heading4><br />
                  <TextSm>College Freshman</TextSm>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center space-x-70 mt-6">
          <Button variant="ghost" size="icon"><ChevronLeft size={25} /></Button>
          <Button variant="ghost" size="icon"><ChevronRight size={25} /></Button>
        </div>
      </section> */}
      <section className="py-20 my-20 mx-5">
        <Heading1 className="text-center mb-10">What Students Are Saying</Heading1>
        {/* <div className="flex flex-col items-center"> */}
          <Swiper
            style={{ height: "auto" }}
            modules={[Navigation, Autoplay]}
            // navigation={{
            //   nextEl: ".swiper-button-next",
            //   prevEl: ".swiper-button-prev",
            // }}
            navigation
            autoplay={{ delay: 3000 }}
            loop={true}
            spaceBetween={10}
            slidesPerView={6}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
            className="w-full"
          >
            {[...Array(8)].map((_, i) => (
              <SwiperSlide key={i} className="">
                <Card className="w-55 p-6 mb-5">
                  <CardContent className="">
                    <p className="mb-4">
                      "I aced my math exam thanks to my WeLearn tutor – they explained it better than my teacher!"
                    </p>
                    <div className="flex space-x-1">{"⭐⭐⭐⭐⭐"}</div>
                    <div className="mt-2 text-xs text-gray-500">
                      <Heading4>John</Heading4><br />
                      <TextSm>College Freshman</TextSm>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* <div className="flex justify-center space-x-70">
            <Button variant="ghost" className="swiper-button-prev relative">
              <ChevronLeft size={45} strokeWidth={0.5}/>
            </Button>
            <Button variant="ghost" className="swiper-button-next relative">
              <ChevronRight size={45} strokeWidth={0.5}/>
            </Button>
          </div> */}
        {/* </div> */}
      </section>


      {/* Call to Action */}
      <section className="bg-[#1F65A6] text-white py-12 text-center">
        <Heading2 className="text-white mb-4">Ready to Start Learning or Teaching?</Heading2>
        <TextLg className="text-white mb-6">Sign up today and join the WeLearn community.</TextLg>
        <div className="flex justify-center items-center space-x-4">
          <Button variant="secondary"><TextMd className="text-black">Become a tutor</TextMd></Button>
          <span className="text-white">or</span>
          <Button variant="secondary"><TextMd className="text-black">Find a tutor</TextMd></Button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white py-4 border-t">
        <div className="mx-8 flex justify-between items-center">
          {/* Left Section: Logo and Name */}
          <div className="items-center space-x-2">
            <div className="flex items-center space-x-0">
              <img src="/assets/logo.svg" alt="WeLearn Logo" className="w-20 h-20" />
              <Heading4 className="">WeLearn</Heading4>
            </div>
            <div className="text-center">
              <TextMd className="">
                WeLearn © 2025 – Empowering Students, By Students.
              </TextMd>
            </div>
          </div>
          {/* Right Section: Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <img src="/assets/footer/Instagram.svg" alt="Instagram" className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <img src="/assets/footer/Linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <img src="/assets/footer/Twitter.svg" alt="Twitter" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
