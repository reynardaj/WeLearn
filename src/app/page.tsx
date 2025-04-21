"use client";

import React from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-[#f0fafa] min-h-screen w-full text-gray-800">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <img src="/assets/logo.svg" alt="WeLearn_Logo" className="w-6 h-6" />
          <span className="font-semibold text-lg">WeLearn</span>
        </div>
        <div className="space-x-4">
          <a href="#" className="text-sm text-gray-600 hover:underline">Become a tutor</a>
          <a href="#" className="text-sm text-gray-600 hover:underline">Find tutors</a>
          <Button size="sm">Sign In</Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-white rounded-2xl shadow-md">
          <img src="assets/logo.svg" alt="WeLearn Logo" className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-semibold mb-2">Learn from Peers, Teach Your Passion</h1>
        <p className="text-xl text-teal-700 mb-6">
          Join WeLearn – the student-led platform connecting learners and tutors like you.
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="default">Become a Tutor</Button>
          <span className="text-text">or</span>
          <Button variant="outline">Find a Tutor</Button>
        </div>
      </section>

      {/* Why WeLearn Section */}
      <section className="max-w-4xl mx-auto py-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Why WeLearn?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Student Led", desc: "Tutors who get it – because they're students too.", icon: "⭐" },
            { title: "Affordable", desc: "Low-cost sessions tailored for student budgets.", icon: "💳" },
            { title: "Flexible", desc: "Learn or teach on your schedule, anytime.", icon: "📅" },
            { title: "Earn While You Learn", desc: "Turn your skills into cash. Tutor what you're good at and build your resume while helping others.", icon: "💰" },
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <h2 className="text-2xl font-semibold text-center mb-8">Peer-to-Peer Learning, Made Simple</h2>
        <div className="flex justify-center space-x-12 max-w-4xl mx-auto">
          {[
            { title: "Sign Up", desc: "Create your free account as a learner or tutor in seconds.", icon: "👨‍🎓" },
            { title: "Connect", desc: "Browse tutors or offer your skills to help others.", icon: "🤝" },
            { title: "Learn & Grow", desc: "Book sessions, share knowledge, and succeed together.", icon: "🎓" },
          ].map((step, index) => (
            <div key={index} className="text-center max-w-xs">
              <div className="text-blue-600 text-xl font-bold mb-2">{index + 1}</div>
              <div className="text-3xl mb-2">{step.icon}</div>
              <h4 className="font-bold text-lg mb-1">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold text-center mb-10">What Students Are Saying</h2>
        <div className="flex justify-center items-center space-x-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-48 p-4">
              <CardContent className="text-sm text-gray-700">
                <p className="mb-2">
                  I aced my math exam thanks to my WeLearn tutor – they explained it better than my teacher!
                </p>
                <div className="flex space-x-1 text-yellow-500">{"⭐⭐⭐⭐⭐"}</div>
                <div className="mt-2 text-xs text-gray-500">John<br />College Freshman</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <Button variant="outline" size="icon"><ChevronLeft size={16} /></Button>
          <Button variant="outline" size="icon"><ChevronRight size={16} /></Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#0f4c81] text-white py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Start Learning or Teaching?</h2>
        <p className="mb-6">Sign up today and join the WeLearn community.</p>
        <div className="flex justify-center items-center space-x-4">
          <Button className="bg-orange-400 text-white">Become a tutor</Button>
          <span className="text-white">or</span>
          <Button className="bg-orange-400 text-white">Find a tutor</Button>
        </div>
      </section>
    </div>
  );
}
