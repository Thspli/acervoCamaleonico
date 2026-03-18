"use client";

import { useState, useEffect } from "react";

const SLIDES = [
  { src: "", alt: "Imagem 1" },
  { src: "", alt: "Imagem 2" },
  { src: "", alt: "Imagem 3" },
];

export function Carousel() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent(i => i === 0 ? SLIDES.length - 1 : i - 1);
  const next = () => setCurrent(i => i === SLIDES.length - 1 ? 0 : i + 1);

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => i === SLIDES.length - 1 ? 0 : i + 1), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%", minHeight: "240px",
      borderRadius: "4px", overflow: "hidden",
      border: "2px solid rgba(0,122,81,0.5)",
      boxShadow: "0 0 40px rgba(0,122,81,0.25), 0 20px 60px rgba(0,0,0,0.5)",
      position: "relative", background: "#080808",
      display: "flex", flexDirection: "column",
    }}>
      {/* Slides */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {SLIDES.map((slide, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.5s ease",
            background: "linear-gradient(135deg, #0a2010 0%, #1a4a28 40%, #0f2d18 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {slide.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.src} alt={slide.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "64px" }}>🦎</span>
                <span style={{ fontSize: "11px", color: "#2d6a42", letterSpacing: "0.1em", textTransform: "uppercase" }}>{slide.alt}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles */}
      {[{ side: "left", fn: prev, icon: "‹" }, { side: "right", fn: next, icon: "›" }].map(({ side, fn, icon }) => (
        <button key={side} onClick={fn} style={{
          position: "absolute", [side]: "10px", top: "50%", transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,122,81,0.5)",
          color: "#81c784", width: "32px", height: "32px",
          borderRadius: "3px", cursor: "pointer", fontSize: "18px",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,122,81,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
        >{icon}</button>
      ))}

      {/* Dots */}
      <div style={{
        position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: "8px", zIndex: 2,
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? "18px" : "7px", height: "7px",
            borderRadius: "4px",
            background: i === current ? "#007A51" : "rgba(0,122,81,0.35)",
            border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Cantos */}
      {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
        <div key={`${v}${h}`} style={{
          position: "absolute", [v]: 8, [h]: 8, width: 16, height: 16,
          borderTop:    v === "top"    ? "2px solid #007A51" : "none",
          borderBottom: v === "bottom" ? "2px solid #007A51" : "none",
          borderLeft:   h === "left"   ? "2px solid #007A51" : "none",
          borderRight:  h === "right"  ? "2px solid #007A51" : "none",
          zIndex: 2,
        }} />
      ))}
    </div>
  );
}