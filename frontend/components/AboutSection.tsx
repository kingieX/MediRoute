/* eslint-disable @next/next/no-img-element */
"use client";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8" data-aos="fade-right">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Mission: Revolutionizing Healthcare Operations
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At MediRoute, our mission is to empower healthcare providers
                with the tools to achieve unparalleled operational efficiency,
                automate complex tasks, and ultimately deliver superior patient
                care. We believe a well-managed hospital environment directly
                translates to better health outcomes.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform combines cutting-edge AI technology with intuitive
                design to create a comprehensive solution that addresses the
                unique challenges of modern healthcare facilities.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  500+
                </div>
                <div className="text-gray-700 font-medium">
                  Hospitals Served
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  35%
                </div>
                <div className="text-gray-700 font-medium">
                  Efficiency Increase
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative" data-aos="fade-left">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Healthcare Team Collaboration"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-blue-600/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
