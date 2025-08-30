"use client";

import { Calendar, Users, Map, Bell, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Staff Scheduler",
    description:
      "Automate staff scheduling, manage shifts, and optimize resource allocation to ensure optimal staffing levels around the clock.",
  },
  {
    icon: Users,
    title: "Patient Flow Manager",
    description:
      "Track patient journeys in real-time, reduce wait times, and improve patient throughput across all hospital departments.",
  },
  {
    icon: Map,
    title: "Real-Time Map",
    description:
      "Visualize hospital layouts and resource locations in real-time for immediate response and efficient navigation.",
  },
  {
    icon: Bell,
    title: "Automated Alerts",
    description:
      "Receive instant notifications for critical events, urgent needs, or operational bottlenecks, enabling proactive intervention.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Gain actionable insights into hospital performance, identify trends, and make data-driven decisions for continuous improvement.",
  },
  {
    icon: Shield,
    title: "Compliance Tracker",
    description:
      "Ensure regulatory adherence and maintain high standards with automated tracking and reporting of compliance metrics.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Key Features to Transform Your Hospital
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed to streamline operations, improve
            efficiency, and enhance patient care delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
