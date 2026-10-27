import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Box, Layers, Shield, Eye, Zap, Globe, Github, Linkedin, Mail, Code2, Palette, Coffee } from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────
   useInView – fires once when an element scrolls into the viewport
   ────────────────────────────────────────────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/* ──────────────────────────────────────────────────────────────────────
   AnimatedBlock – wrapper that fades-and-slides children into view
   ────────────────────────────────────────────────────────────────────── */
function AnimatedBlock({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, isVisible] = useInView();

  const translateMap = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(60px)",
    right: "translateX(-60px)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : translateMap[direction],
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   StaggerText – reveals heading text word-by-word on scroll
   ────────────────────────────────────────────────────────────────────── */
function StaggerText({ text, className = "", tag: Tag = "span" }) {
  const [ref, isVisible] = useInView();
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`,
            marginRight: "0.3em",
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   CountUp – animated number counter
   ────────────────────────────────────────────────────────────────────── */
function CountUp({ end, suffix = "", duration = 2000 }) {
  const [ref, isVisible] = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ──────────────────────────────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────────────────────────────── */
const platformFeatures = [
  {
    icon: Eye,
    title: "Real-Time 3D Previews",
    description:
      "Inspect every asset with live WebGL previews powered by Three.js. Rotate, zoom, and study topologies before you license — no downloads, no guesswork.",
  },
  {
    icon: Shield,
    title: "Transparent Licensing",
    description:
      "Every asset ships with clearly-defined license tiers — from personal hobby use to full commercial studio rights. Know exactly what you're paying for.",
  },
  {
    icon: Layers,
    title: "Multi-Format Delivery",
    description:
      "Assets are delivered in industry-standard formats — .blend, .fbx, .obj — ready to drop into your pipeline whether you work in Blender, Unity, or Unreal.",
  },
  {
    icon: Zap,
    title: "Creator Economy",
    description:
      "Blender artists and 3D modelers earn directly through PolyVault's creator program. Publish assets, set pricing tiers, and track sales from one dashboard.",
  },
  {
    icon: Globe,
    title: "Server-Verified Deliveries",
    description:
      "Purchases are cryptographically linked to your account. Your licensed assets remain accessible in your vault, verified on every access.",
  },
  {
    icon: Code2,
    title: "Modern Stack",
    description:
      "Built with React, Express, and MongoDB Atlas — PolyVault is a full-stack digital commerce platform engineered for performance and scalability.",
  },
];

const techStack = [
  { name: "React 18", category: "Frontend" },
  { name: "Vite", category: "Build" },
  { name: "Three.js", category: "3D Engine" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Express.js", category: "Backend" },
  { name: "MongoDB Atlas", category: "Database" },
  { name: "Mongoose ODM", category: "ORM" },
  { name: "Razorpay", category: "Payments" },
  { name: "JWT", category: "Auth" },
  { name: "Lucide React", category: "Icons" },
];

/* ──────────────────────────────────────────────────────────────────────
   ABOUT PAGE
   ────────────────────────────────────────────────────────────────────── */
export const About = () => {
  const { isDark } = useTheme();

  /* accent palette */
  const accent = "hsl(243, 80%, 62%)";
  const accentLight = isDark ? "hsla(243, 80%, 62%, 0.12)" : "hsl(222, 100%, 95%)";
  const cardBg = isDark ? "#16181D" : "#FFFFFF";
  const cardBorder = isDark ? "#2a2d35" : "#E4E1DB";
  const subtleBg = isDark ? "#111317" : "#FAFAF8";

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          ════════════════════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px 64px",
        }}
      >
        {/* Decorative gradient orb */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "15%",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${isDark ? "hsla(243,80%,62%,0.12)" : "hsla(243,80%,62%,0.08)"} 0%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "10%",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${isDark ? "hsla(190,80%,50%,0.08)" : "hsla(190,80%,50%,0.06)"} 0%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <AnimatedBlock delay={0}>
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: accent,
                fontWeight: 600,
                display: "block",
                marginBottom: "20px",
              }}
            >
              About PolyVault
            </span>
          </AnimatedBlock>

          <AnimatedBlock delay={0.1}>
            <h1
              className="font-serif"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "28px",
              }}
            >
              The Digital Vault for{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400, color: isDark ? "#a0a0b8" : "#686561" }}>
                Production-Grade
              </span>{" "}
              3D Assets
            </h1>
          </AnimatedBlock>

          <AnimatedBlock delay={0.25}>
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                lineHeight: 1.7,
                color: isDark ? "#a0a0a0" : "#686561",
                maxWidth: "640px",
                margin: "0 auto 40px",
              }}
            >
              PolyVault bridges the gap between independent 3D creators and game studios. 
              Browse, preview in real-time, and license digital assets with full transparency 
              — all in one beautifully crafted marketplace.
            </p>
          </AnimatedBlock>

          <AnimatedBlock delay={0.4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "48px",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "3D Formats", value: 3, suffix: "+" },
                { label: "License Tiers", value: 5 },
                { label: "WebGL Preview", value: 100, suffix: "%" },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    className="font-serif"
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: accent,
                      lineHeight: 1,
                    }}
                  >
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: isDark ? "#666" : "#999",
                      marginTop: "6px",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedBlock>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — WHAT IS POLYVAULT
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", backgroundColor: subtleBg, transition: "background-color 0.3s ease" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <AnimatedBlock>
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: accent,
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Platform Features
            </span>
          </AnimatedBlock>

          <StaggerText
            text="Built for Artists. Engineered for Studios."
            className="font-serif"
            tag="h2"
          />
          <div style={{ height: "4px", width: "60px", background: accent, borderRadius: "2px", margin: "20px 0 16px" }} />

          <AnimatedBlock delay={0.1}>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: isDark ? "#a0a0a0" : "#686561",
                maxWidth: "600px",
                marginBottom: "48px",
              }}
            >
              PolyVault is a full-stack 3D digital asset marketplace where creators publish production-ready models 
              and buyers preview them in live WebGL before licensing. Every transaction is transparent, 
              every delivery is verified.
            </p>
          </AnimatedBlock>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {platformFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <AnimatedBlock key={i} delay={i * 0.08} direction={i % 2 === 0 ? "left" : "right"}>
                  <div
                    style={{
                      backgroundColor: cardBg,
                      border: `1px solid ${cardBorder}`,
                      borderRadius: "12px",
                      padding: "28px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
                      cursor: "default",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 12px 40px -8px rgba(0,0,0,0.5)"
                        : "0 12px 40px -8px rgba(0,0,0,0.08)";
                      e.currentTarget.style.borderColor = accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = cardBorder;
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        backgroundColor: accentLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Icon style={{ width: "22px", height: "22px", color: accent }} />
                    </div>
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        marginBottom: "8px",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        lineHeight: 1.65,
                        color: isDark ? "#999" : "#686561",
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </AnimatedBlock>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — TECH STACK RIBBON
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "64px 24px", overflow: "hidden" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <AnimatedBlock>
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: accent,
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              Technology Stack
            </span>
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "40px",
              }}
            >
              Powered by Modern Tools
            </h2>
          </AnimatedBlock>

          <AnimatedBlock delay={0.15}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              {techStack.map((tech, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: accentLight,
                    border: `1px solid ${isDark ? "hsla(243,80%,62%,0.25)" : "hsla(243,80%,62%,0.15)"}`,
                    borderRadius: "999px",
                    padding: "8px 20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: accent,
                    transition: "transform 0.2s ease, background-color 0.3s ease",
                    cursor: "default",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <span style={{ fontSize: "0.65rem", opacity: 0.7, marginRight: "6px", fontWeight: 400 }}>
                    {tech.category}
                  </span>
                  {tech.name}
                </div>
              ))}
            </div>
          </AnimatedBlock>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4 — CREATOR SPOTLIGHT: SAIKAT HAZRA
          ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: "100px 24px",
          backgroundColor: subtleBg,
          transition: "background-color 0.3s ease",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <AnimatedBlock>
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: accent,
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              The Creator
            </span>
          </AnimatedBlock>

          <StaggerText
            text="Meet Saikat Hazra"
            className="font-serif"
            tag="h2"
          />

          <AnimatedBlock delay={0.15}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "48px",
                gap: "40px",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  position: "relative",
                  width: "160px",
                  height: "160px",
                }}
              >
                {/* Animated ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-6px",
                    borderRadius: "50%",
                    background: `conic-gradient(${accent}, transparent, ${accent})`,
                    animation: "spin 6s linear infinite",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "0",
                    borderRadius: "50%",
                    backgroundColor: cardBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: `3px solid ${cardBg}`,
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {/* Monogram fallback */}
                  <span
                    className="font-serif"
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 700,
                      color: accent,
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    SH
                  </span>
                </div>
              </div>

              {/* Bio Card */}
              <div
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "16px",
                  padding: "40px",
                  maxWidth: "600px",
                  width: "100%",
                  textAlign: "center",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                }}
              >
                <h3
                  className="font-serif"
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  Saikat Hazra
                </h3>
                <p
                  className="font-mono"
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: accent,
                    marginBottom: "20px",
                  }}
                >
                  Full-Stack Developer & Creator
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    color: isDark ? "#a0a0a0" : "#686561",
                    marginBottom: "12px",
                  }}
                >
                  Saikat is a passionate full-stack developer who designed and built PolyVault from the ground up 
                  — from the MongoDB data architecture and Express REST API to the React frontend with 
                  real-time Three.js 3D previews. His vision was to create a marketplace that treats 
                  digital 3D assets with the same care and transparency as physical craftsmanship.
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    color: isDark ? "#a0a0a0" : "#686561",
                    marginBottom: "28px",
                  }}
                >
                  With a deep interest in web technologies, 3D graphics, and clean software architecture, 
                  Saikat built PolyVault as a showcase of modern full-stack engineering — integrating 
                  payment processing, JWT authentication, responsive UI design, and a creator economy 
                  into one cohesive platform.
                </p>

                {/* Skills tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "28px",
                  }}
                >
                  {["React", "Node.js", "MongoDB", "Three.js", "Express", "Tailwind CSS", "REST APIs", "UI/UX"].map(
                    (skill, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: "999px",
                          backgroundColor: accentLight,
                          color: accent,
                          border: `1px solid ${isDark ? "hsla(243,80%,62%,0.2)" : "hsla(243,80%,62%,0.12)"}`,
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>

                {/* Social links */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                  }}
                >
                  {[
                    { icon: Github, href: "https://github.com/Saikat-Hazra", label: "GitHub" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/saikat-hazra-7836a3364", label: "LinkedIn" },
                    { icon: Mail, href: "mailto:hazrasaikat48@gmail.com", label: "Email" },
                  ].map((social, i) => {
                    const SocialIcon = social.icon;
                    return (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.label}
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "10px",
                          border: `1px solid ${cardBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isDark ? "#999" : "#686561",
                          backgroundColor: "transparent",
                          transition: "all 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = accent;
                          e.currentTarget.style.color = "#FFFFFF";
                          e.currentTarget.style.borderColor = accent;
                          e.currentTarget.style.transform = "translateY(-3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = isDark ? "#999" : "#686561";
                          e.currentTarget.style.borderColor = cardBorder;
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <SocialIcon style={{ width: "18px", height: "18px" }} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </AnimatedBlock>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 5 — CTA BANNER
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px" }}>
        <AnimatedBlock>
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
              padding: "56px 40px",
              borderRadius: "20px",
              background: isDark
                ? "linear-gradient(135deg, #16181D 0%, #1a1c24 100%)"
                : "linear-gradient(135deg, #FAFAF8 0%, #F0EDE8 100%)",
              border: `1px solid ${cardBorder}`,
              transition: "background 0.3s ease, border-color 0.3s ease",
            }}
          >
            <Palette style={{ width: "40px", height: "40px", color: accent, margin: "0 auto 16px" }} />
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Ready to Explore the Vault?
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: isDark ? "#a0a0a0" : "#686561",
                maxWidth: "480px",
                margin: "0 auto 28px",
              }}
            >
              Browse curated 3D assets, preview in real-time, and start licensing today.
            </p>
            <a
              href="/"
              className="exampleBtn"
              style={{ fontSize: "0.85rem", padding: "12px 32px" }}
            >
              <span>Browse Catalog</span>
            </a>
          </div>
        </AnimatedBlock>
      </section>

      {/* ── keyframe for spinning ring ── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* StaggerText heading sizing */
        h2.font-serif {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }
      `}</style>
    </div>
  );
};

export default About;
