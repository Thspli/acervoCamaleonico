import Header from "../components/Header";
import { Carousel } from "../components/Carousel";
import { HeroButtons } from "../components/HeroButtons";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#c8e6c9",
        fontFamily: "var(--font-museo), sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(0,122,81,0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(0,122,81,0.03) 0%, transparent 50%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Imagem de fundo apenas na seção principal */}
      <div
        style={{
          position: "absolute",
          top: "68px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/fundo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Header />

      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "80px 48px 100px 48px",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          gap: "80px",
        }}
      >
        <Carousel />

        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "15px",
              color: "#007A51",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
              fontFamily: "var(--font-museo), sans-serif",
            }}
          >
            — Sejam bem-vindos ao
          </p>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#e8f5e9",
              lineHeight: 1.15,
              marginBottom: "28px",
              letterSpacing: "-0.02em",
            }}
          >
            Acervo Camaleônico!
          </h1>
          <p
            style={{
              fontSize: "20px",
              lineHeight: 1.85,
              color: "#a5d6a7",
              marginBottom: "20px",
              fontFamily: "var(--font-museo), sans-serif",
            }}
          >
            Somos uma nova plataforma online especializada em otimizar a criação
            de suas fichas em suas futuras aventuras nas campanhas de RPG de mesa!
          </p>
          <p
            style={{
              fontSize: "20px",
              lineHeight: 1.85,
              color: "#a5d6a7",
              fontFamily: "var(--font-museo), sans-serif",
            }}
          >
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