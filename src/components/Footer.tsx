"use client";

export function Footer() {
  return (
    <footer style={{
      position: "relative", zIndex: 1,
      background: "rgba(5,14,9,0.95)",
      borderTop: "1px solid rgba(0,122,81,0.3)",
      fontFamily: "var(--font-museo), sans-serif",
    }}>
      <style>{`
        @keyframes footerSlide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
          padding: 48px 48px 40px;
          border-bottom: 1px solid rgba(0,122,81,0.15);
          max-width: 1400px;
          margin: 0 auto;
        }
        .footer-bottom {
          padding: 20px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(0,122,81,0.15);
          flex-wrap: wrap;
          gap: 10px;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 36px 24px 32px !important;
          }
          .footer-bottom {
            padding: 16px 24px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* Linha animada */}
      <div style={{ height: "2px", background: "#0d1a14", overflow: "hidden", position: "relative" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%", width: "30%",
          background: "linear-gradient(90deg, transparent, #007A51, #00e87a, #007A51, transparent)",
          animation: "footerSlide 4s linear infinite",
        }} />
      </div>

      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            <img src="/4.png" alt="Logo" style={{ width: 52, height: 52, objectFit: "contain" }} />
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#e8f5e9", letterSpacing: "0.04em" }}>
              Acervo Camaleônico
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#4a7a5a", lineHeight: 1.8, maxWidth: "280px" }}>
            A plataforma definitiva para fichas de RPG de mesa. Crie, edite e compartilhe suas aventuras.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px", fontWeight: 700 }}>
            Plataforma
          </h4>
          {["Fichas Virtuais", "Campanhas", "Sistemas de RPG", "Novidades"].map(item => (
            <a key={item} href="#" style={{ display: "block", fontSize: "13px", color: "#4a7a5a", marginBottom: "10px", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#81c784")}
              onMouseLeave={e => (e.currentTarget.style.color = "#4a7a5a")}
            >{item}</a>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px", fontWeight: 700 }}>
            Suporte
          </h4>
          {["Sobre o Projeto", "Contato", "Termos de Uso", "Privacidade"].map(item => (
            <a key={item} href="#" style={{ display: "block", fontSize: "13px", color: "#4a7a5a", marginBottom: "10px", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#81c784")}
              onMouseLeave={e => (e.currentTarget.style.color = "#4a7a5a")}
            >{item}</a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span style={{ fontSize: "12px", color: "#2d4a35", letterSpacing: "0.04em" }}>
          © 2025 Acervo Camaleônico — Todos os direitos reservados
        </span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#007A51" }} />
          <span style={{ fontSize: "11px", color: "#2d4a35", letterSpacing: "0.06em" }}>Em desenvolvimento</span>
        </div>
      </div>
    </footer>
  );
}