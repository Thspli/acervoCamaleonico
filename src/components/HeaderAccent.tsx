"use client";

export function HeaderAccent() {
  return (
    <>
      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
      <div style={{
        height: "3px",
        background: "#0d1a14",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "40%",
          background: "linear-gradient(90deg, transparent, #007A51, #00e87a, #007A51, transparent)",
          animation: "slide 3s linear infinite",
        }} />
      </div>
    </>
  );
}