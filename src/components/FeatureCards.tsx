const cards = [
  {
    icon: "📜",
    title: "Fichas Virtuais",
    desc: "Crie e edite suas fichas de personagem com praticidade, tudo salvo na nuvem.",
  },
  {
    icon: "⚔️",
    title: "Campanhas",
    desc: "Organize suas campanhas favoritas e acompanhe o progresso de cada aventura.",
  },
  {
    icon: "🎲",
    title: "Sistemas de RPG",
    desc: "Suporte a múltiplos sistemas de RPG de mesa, do D&D ao Tormenta e além.",
  },
];

export function FeatureCards() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 48px 80px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "24px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            padding: "28px",
            background: "rgba(0,20,10,0.6)",
            border: "1px solid rgba(0,122,81,0.3)",
            borderRadius: "4px",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>{card.icon}</div>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#c8e6c9",
              marginBottom: "10px",
              letterSpacing: "0.02em",
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#81c784",
              lineHeight: 1.7,
            }}
          >
            {card.desc}
          </p>
        </div>
      ))}
    </section>
  );
}