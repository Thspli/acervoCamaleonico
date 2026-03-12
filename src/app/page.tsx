import Header from "../components/Header";
import { HeroButtons } from "../components/HeroButtons";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#c8e6c9",
        fontFamily: "var(--font-museo), sans-serif",
        overflowX: "hidden",
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

      <Header />

      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 48px 100px",
          display: "flex",
          alignItems: "center",
          gap: "64px",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: "380px",
            height: "280px",
            borderRadius: "4px",
            overflow: "hidden",
            border: "2px solid rgba(0,122,81,0.5)",
            boxShadow: "0 0 40px rgba(0,122,81,0.25), 0 20px 60px rgba(0,0,0,0.5)",
            position: "relative",
            background: "#080808",
          }}
        >
          {/* Troque pelo <Image> quando tiver a foto: */}
          {/* <Image src="/chameleon.png" alt="Camaleão" fill style={{ objectFit: "cover" }} /> */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #0a2010 0%, #1a4a28 40%, #0f2d18 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "80px",
            }}
          >
            🦎
          </div>
          <div style={{ position: "absolute", top: 8, left: 8, width: 20, height: 20, borderTop: "2px solid #007A51", borderLeft: "2px solid #007A51" }} />
          <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderTop: "2px solid #007A51", borderRight: "2px solid #007A51" }} />
          <div style={{ position: "absolute", bottom: 8, left: 8, width: 20, height: 20, borderBottom: "2px solid #007A51", borderLeft: "2px solid #007A51" }} />
          <div style={{ position: "absolute", bottom: 8, right: 8, width: 20, height: 20, borderBottom: "2px solid #007A51", borderRight: "2px solid #007A51" }} />
        </div>

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
              fontSize: "17px",
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
              fontSize: "17px",
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



      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(0,122,81,0.25)",
          padding: "24px 48px",
          display: "flex",
          justifyContent: "center",
          color: "#4a7a5a",
          fontSize: "13px",
          fontFamily: "var(--font-museo), sans-serif",
          letterSpacing: "0.04em",
        }}
      >
        © 2025 Acervo Camaleônico — Todos os direitos reservados
      </footer>
    </div>
  );
}