import React from "react";

const Home: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-pink-600 md:text-3xl">
        Welcome Home
      </h1>
      <p className="text-gray-600 leading-relaxed">
        Welcome to our bright and cheerful space! This is a mobile-first design
        with a fresh pink color scheme.
      </p>
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
        <p className="text-pink-700 text-sm">
          Explore our website and discover more about what we offer.
        </p>
      </div>
    </div>
  );
};

export default Home;
