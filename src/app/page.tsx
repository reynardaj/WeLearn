"use client";

import React from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { TextMd, TextLg, TextSm } from "../components/Text";
import {
  Title,
  Subtitle,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
} from "../components/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

export default function LandingPage() {
  return (
    <div className="bg-[#F0FAF9] min-h-screen w-full">
      {/* <div className="w-full mx-auto"> */}
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full flex flex-col sm:flex-row text-center justify-between px-4 sm:px-6 py-3 border-b bg-white shadow-sm h-auto sm:h-18 z-50">
        <div className="flex items-center space-x-2">
          <img
            src="/assets/logo.svg"
            alt="WeLearn_Logo"
            className="w-14 h-14 md:w-18 md:h-18"
          />
          <Heading4>WeLearn</Heading4>
        </div>
        <div className="hidden md:flex space-x-2 items-center">
          <Button variant="ghost" onClick={() => (window.location.href = "/sign-in")}>Sign In</Button>
          <Button
            variant="primary"
            className="rounded-md"
            onClick={() => (window.location.href = "/sign-up")}
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto w-full pt-40 pb-20 px-4">
        <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-2xl shadow-md flex items-center justify-center">
          <img src="assets/logo.svg" alt="WeLearn Logo" className="w-16 h-16" />
        </div>
        <Title className="text-center">
          Learn from Peers, Teach Your Passion
        </Title>
        <Subtitle className="text-center text-secondary max-w-2xl mx-auto mt-4 mb-8">
          Join WeLearn – the student-led platform connecting learners and tutors
          like you.
        </Subtitle>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button variant="primary">Become a Tutor</Button>
          <TextMd className="text-text">or</TextMd>
          <Button variant="primary">Find a Tutor</Button>
        </div>
      </section>

      {/* Why WeLearn Section */}
      <section className="mx-auto w-full py-30 px-4">
        <Heading1 className="text-center mb-8">Why WeLearn?</Heading1>
        <div className="flex flex-col gap-6 items-center justify-center">
          {[
            {
              title: "Student Led",
              desc: "Tutors who get it - because they're students too.",
              icon: (
                <div className="w-15 h-15 mx-auto mb-4 p-4 flex items-center justify-center bg-white rounded-2xl shadow-md">
                  <img
                    src="assets/WhyWeLearn/star.svg"
                    alt="Star Logo"
                    className="w-12 h-12"
                  />
                </div>
              ),
            },
            {
              title: "Affordable",
              desc: "Low-cost sessions tailored for student budgets.",
              icon: (
                <div className="w-15 h-15 mx-auto mb-4 p-5.5 flex items-center justify-center bg-white rounded-2xl shadow-md">
                  <img
                    src="assets/WhyWeLearn/dollar.svg"
                    alt="Dollar Logo"
                    className="w-12 h-12"
                  />
                </div>
              ),
            },
            {
              title: "Flexible",
              desc: "Learn or teach on your schedule, anytime.",
              icon: (
                <div className="w-15 h-15 mx-auto mb-4 p-4 flex items-center justify-center bg-white rounded-2xl shadow-md">
                  <img
                    src="assets/WhyWeLearn/calendar.svg"
                    alt="Calendar Logo"
                    className="w-12 h-12"
                  />
                </div>
              ),
            },
            {
              title: "Earn While You Learn",
              desc: "Turn your skills into cash. Tutor what you're good at and build your resume while helping others.",
              icon: (
                <div className="w-15 h-15 mx-auto mb-4 p-4 flex items-center justify-center bg-white rounded-2xl shadow-md">
                  <img
                    src="assets/WhyWeLearn/bag.svg"
                    alt="Bag Logo"
                    className="w-12 h-12"
                  />
                </div>
              ),
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <Heading3 className="">{item.title}</Heading3>
                <TextMd className="whitespace-normal break-words w-95">
                  {item.desc}
                </TextMd>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto w-full py-30 px-4">
        <Heading1 className="text-center mb-15">
          Peer-to-Peer Learning, Made Simple
        </Heading1>
        <div className="grid gap-12 md:grid-cols-3 max-w-4xl mx-auto justify-items-center items-center">
          {[
            {
              title: "Sign Up",
              desc: "Create your free account as a learner or tutor in seconds.",
              icon: <img src="assets/Steps/user.svg" />,
            },
            {
              title: "Connect",
              desc: "Browse tutors or offer your skills to help others.",
              icon: <img src="assets/Steps/handshake.svg" />,
            },
            {
              title: "Learn & Grow",
              desc: "Book sessions, share knowledge, and succeed together.",
              icon: <img src="assets/Steps/graduation-cap.svg" />,
            },
          ].map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center max-w-xs mx-auto"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#F0FAF9] bg-[#1F65A6] text-md mb-8">
                {index + 1}
              </div>
              <div className="mb-2">{step.icon}</div>
              <Heading3>{step.title}</Heading3>
              <TextMd className="whitespace-normal break-words w-40">
                {step.desc}
              </TextMd>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-30 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Heading1 className="text-center mb-10">
            What Students Are Saying
          </Heading1>
          <Swiper
            style={{ height: "auto" }}
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 4000 }}
            loop={true}
            spaceBetween={24}
            breakpoints={{
              320: { slidesPerView: 1 },
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4, spaceBetween: 32 },
            }}
            className="px-4"
          >
            {[...Array(8)].map((_, i) => (
              <SwiperSlide key={i}>
                <Card className="w-full p-4 md:p-6 mb-5">
                  <CardContent>
                    <p className="mb-4">
                      "I aced my math exam thanks to my WeLearn tutor. They
                      explained it better than my teacher."
                    </p>
                    <div className="flex space-x-1">{"⭐⭐⭐⭐⭐"}</div>
                    <div className="mt-2 text-xs text-gray-500">
                      <Heading4>John</Heading4>
                      <TextSm>College Freshman</TextSm>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-[#1F65A6] py-10 text-center px-4">
        <Heading2 className="text-white mb-4">
          Ready to Start Learning or Teaching?
        </Heading2>
        <TextLg className="text-white mb-6">
          Sign up today and join the WeLearn community.
        </TextLg>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Button variant="secondary">Become a tutor</Button>
          <span className="text-white">or</span>
          <Button variant="secondary">Find a tutor</Button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full py-6 border-t px-4 ">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <img
                src="/assets/logo.svg"
                alt="WeLearn Logo"
                className="w-16 h-16"
              />
              <Heading4>WeLearn</Heading4>
            </div>
            <TextMd className="text-center md:text-left">
              WeLearn © 2025 - Empowering Students, By Students.
            </TextMd>
          </div>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <img
                src="/assets/footer/Instagram.svg"
                alt="Instagram"
                className="w-6 h-6"
              />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <img
                src="/assets/footer/Linkedin.svg"
                alt="LinkedIn"
                className="w-6 h-6"
              />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <img
                src="/assets/footer/Twitter.svg"
                alt="Twitter"
                className="w-6 h-6"
              />
            </a>
          </div>
        </div>
      </footer>
      {/* </div> */}
    </div>
  );
}
