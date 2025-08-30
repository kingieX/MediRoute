"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="home"
      className="pt-16 px-6 min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8" data-aos="fade-right">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Optimize Hospital
                <span className="text-primary block">Operations in</span>
                <span className="text-primary">Real-Time</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                MediRoute helps hospitals reduce patient wait times, automate
                staff scheduling, and monitor resources with AI-powered
                dashboards for superior patient care.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/signup" className="flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl w-full p-0 bg-black">
                  <div className="relative aspect-video">
                    <video
                      className="w-full h-full rounded-lg"
                      controls
                      autoPlay
                      muted
                      //   poster="https://images.pexels.com/photos/668298/pexels-photo-668298.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    >
                      <source
                        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-lg"></div>
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      MediRoute Platform Demo
                    </h3>
                    <p className="text-gray-600">
                      See how MediRoute transforms hospital operations with
                      real-time staff scheduling, patient flow optimization, and
                      intelligent resource management.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Real-Time Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative" data-aos="fade-left">
            <div className="relative bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 shadow-2xl">
              {/* <img
                src="https://images.pexels.com/photos/668298/pexels-photo-668298.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Modern Hospital Interior"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              /> */}
              <Image
                src="/images/hero.png"
                width={1000}
                height={1000}
                alt="Hero image"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-blue-600/10 rounded-xl"></div>

              {/* Floating Cards */}
              <div
                className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="text-sm font-semibold text-gray-900">
                  Staff Efficiency
                </div>
                <div className="text-2xl font-bold text-green-600">+35%</div>
              </div>

              <div
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="text-sm font-semibold text-gray-900">
                  Wait Time Reduction
                </div>
                <div className="text-2xl font-bold text-blue-600">-42%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
