import React from "react";

const Background: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Top gradient blob */}
      <div
        className="absolute w-full h-[40%] top-0 left-0 opacity-50 blur-3xl"
        style={{
          background: "linear-gradient(to bottom, #FF97BD, #FFDFEB)",
        }}
      />

      {/* Bottom gradient blob */}
      <div
        className="absolute w-full h-[40%] bottom-0 left-0 opacity-45 blur-3xl"
        style={{
          background: "linear-gradient(to bottom, #FF97BD, #FFDFEB)",
        }}
      />

      {/* Main background gradient */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background: "linear-gradient(to bottom, #FFF2F7, #FFD4E4)",
        }}
      />
    </div>
  );
};

export default Background;
