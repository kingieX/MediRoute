"use client";

import { Search, Zap, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Assess & Plan",
    description:
      "Our system analyzes your hospital's unique operational challenges and setting clear goals for optimization.",
  },
  {
    number: "2",
    icon: Zap,
    title: "Integrate & Deploy",
    description:
      "Seamlessly integrate MediRoute with your existing workflows, followed by rapid and efficient deployment.",
  },
  {
    number: "3",
    icon: TrendingUp,
    title: "Optimize & Grow",
    description:
      "Continuously monitor workflows, and unlock new efficiencies, ensuring sustained growth and better outcomes.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How MediRoute Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with our simple three-step process to transform your
            hospital operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="text-center"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <div className="relative mb-8">
                <div className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-0.5 bg-blue-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
