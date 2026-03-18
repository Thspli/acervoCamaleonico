import Header from "../components/Header";
import { Carousel } from "../components/Carousel";
import { HeroButtons } from "../components/HeroButtons";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#c8e6c9",
      fontFamily: "var(--font-museo), sans-serif",
      overflowX: "hidden", position: "relative",
    }}>
      <style>{`
        .home-section {
          position: relative; z-index: 1;
          max-width: 1400px; margin: 0 auto;
          padding: 80px 48px 100px;
          display: flex; align-items: stretch;
          justify-content: center; gap: 80px;
        }
        .home-carousel {
          flex-shrink: 0; align-self: stretch;
          width: 640px;
        }
        .home-text { flex: 1; }
        .home-h1 { font-size: 42px; }
        .home-p { font-size: 20px; }

        @media (max-width: 1100px) {
          .home-carousel { width: 480px !important; }
          .home-section { gap: 48px !important; padding: 60px 32px 80px !important; }
        }
        @media (max-width: 860px) {
          .home-section {
            flex-direction: column !important;
            padding: 40px 24px 60px !important;
            gap: 40px !important;
          }
          .home-carousel {
            width: 100% !important;
            height: 300px !important;
            align-self: auto !important;
          }
          .home-h1 { font-size: 30px !important; }
          .home-p { font-size: 16px !important; }
        }
        @media (max-width: 480px) {
          .home-section { padding: 28px 16px 48px !important; }
          .home-carousel { height: 240px !important; }
          .home-h1 { font-size: 26px !important; }
        }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(0,122,81,0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(0,122,81,0.03) 0%, transparent 50%)`,
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", top: "68px", left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/fundo.jpg')",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.06, pointerEvents: "none", zIndex: 0,
      }} />

      <Header />

      <section className="home-section">
        <div className="home-carousel">
          <Carousel />
        </div>

        <div className="home-text">
          <p style={{
            fontSize: "13px", color: "#007A51", letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: "14px",
          }}>
            — Sejam bem-vindos ao
          </p>
          <h1 className="home-h1" style={{
            fontWeight: 700, color: "#e8f5e9", lineHeight: 1.15,
            marginBottom: "24px", letterSpacing: "-0.02em",
          }}>
            Acervo Camaleônico!
          </h1>
          <p className="home-p" style={{
            lineHeight: 1.85, color: "#a5d6a7",
            marginBottom: "16px",
          }}>
            Somos uma nova plataforma online especializada em otimizar a criação
            de suas fichas em suas futuras aventuras nas campanhas de RPG de mesa!
          </p>
          <p className="home-p" style={{ lineHeight: 1.85, color: "#a5d6a7" }}>
            No nosso acervo, terá acesso à fichas virtuais modificáveis de suas
            campanhas favoritas! Acompanhe de perto o desenvolvimento do projeto
            e desfrute de nossa nova plataforma!
          </p>
          <HeroButtons />
        </div>
      </section>

      <Footer />
    </div>
  );
}