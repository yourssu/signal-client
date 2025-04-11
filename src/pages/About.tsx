import React from "react";

const About: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-pink-600 md:text-3xl">About Us</h1>
      <p className="text-gray-600 leading-relaxed">
        We're passionate about creating beautiful and responsive web experiences
        that work seamlessly across all devices.
      </p>
      <div className="grid gap-4 mt-6">
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
          <h2 className="text-lg font-semibold text-pink-600 mb-2">
            Our Mission
          </h2>
          <p className="text-pink-700 text-sm">
            To deliver exceptional user experiences through thoughtful design
            and modern technology.
          </p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
          <h2 className="text-lg font-semibold text-pink-600 mb-2">
            Our Vision
          </h2>
          <p className="text-pink-700 text-sm">
            Creating digital solutions that make a positive impact in people's
            lives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
