import { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { useSpeech } from "./components/useSpeech";

import img50 from "../imports/Banconota_Italia_50_euro_a.jpg";
import img20 from "../imports/Banconota_Italia_20_euro_a.jpg";
import img10 from "../imports/Banconota_Italia_10_euro_a.jpg";
import img5 from "../imports/Banconota_Italia_5_euro_a.jpg";
import img2 from "../imports/2euro_comune.png";
import img1 from "../imports/1euro_comune.png";
import img050 from "../imports/50cent_comune.png";
import img020 from "../imports/20cent_comune.png";
import img010 from "../imports/10cent_comune.png";
import img005 from "../imports/5cent_comune.png";
import img002 from "../imports/2cent_comune.png";
import img001 from "../imports/1cent_comune.png";

const NOTE_IMGS: Record<number, string> = {
  50: img50,
  20: img20,
  10: img10,
  5: img5,
};
const COIN_IMGS: Record<number, string> = {
  2: img2,
  1: img1,
  0.5: img050,
  0.2: img020,
  0.1: img010,
  0.05: img005,
  0.02: img002,
  0.01: img001,
};

const NOTES = [5, 10, 20, 50];
const COINS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2];

function breakdown(amount: number): number[] {
  const denoms = [50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];
  const out: number[] = [];
  let rem = Math.round(amount * 100);
  for (const d of denoms) {
    const dc = Math.round(d * 100);
    while (rem >= dc) {
      out.push(d);
      rem -= dc;
    }
  }
  return out;
}

function formatEuro(n: number): string {
  return n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CLICKABLE: CSSProperties = { cursor: "pointer", touchAction: "manipulation" };

// ─── atoms ───────────────────────────────────────────────────────────────────

const Screw = ({ s = 14, x, y }: { s?: number; x: number | string; y: number | string }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: x,
      width: s,
      height: s,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #d8cfb6 0%, #6c5a3a 60%, #2a1f10 100%)",
      boxShadow:
        "inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.5)",
      zIndex: 10,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "15%",
        right: "15%",
        height: 1.5,
        background: "#1a120a",
        transform: "translateY(-50%) rotate(35deg)",
        borderRadius: 1,
      }}
    />
  </div>
);

const HazardStripe = ({ h = 12, w = "100%" }: { h?: number; w?: string | number }) => (
  <div
    style={{
      width: w,
      height: h,
      flexShrink: 0,
      background: "repeating-linear-gradient(135deg, #f4c020 0 14px, #1a1a1a 14px 28px)",
      borderTop: "2px solid #1a1a1a",
      borderBottom: "2px solid #1a1a1a",
    }}
  />
);

const Vent = ({ rows = 5, w = 80 }: { rows?: number; w?: number }) => (
  <div
    style={{
      width: w,
      background: "#2a2317",
      border: "1px solid #1a1408",
      borderRadius: 3,
      padding: "4px 6px",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      flexShrink: 0,
    }}
  >
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 2,
          background: "#0a0805",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      />
    ))}
  </div>
);

const Dymo = ({
  children,
  color = "#a8112a",
  w,
}: {
  children: React.ReactNode;
  color?: string;
  w?: number | string;
}) => (
  <div
    style={{
      width: w,
      background: color,
      color: "#f4eedd",
      fontFamily: '"Special Elite", "Courier New", monospace',
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: 1.5,
      padding: "3px 10px",
      border: "1px solid rgba(0,0,0,0.4)",
      borderRadius: 2,
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.35)",
      textShadow: "0 1px 0 rgba(0,0,0,0.4)",
      textAlign: "center" as const,
      textTransform: "uppercase" as const,
      flexShrink: 0,
      boxSizing: "border-box" as const,
    }}
  >
    {children}
  </div>
);

const ChunkyBtn = ({
  children,
  w,
  h = 56,
  color = "#e8dec0",
  textColor = "#1a1a1a",
  dymoLabel,
  dymoColor,
  onClick,
}: {
  children: React.ReactNode;
  w?: number | string;
  h?: number;
  color?: string;
  textColor?: string;
  dymoLabel?: string;
  dymoColor?: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    style={
      {
        width: w,
        position: "relative",
        background: "none",
        border: "none",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        cursor: "pointer",
        touchAction: "manipulation",
        flexShrink: 0,
      } as CSSProperties
    }
  >
    <div
      style={{
        width: "100%",
        height: h,
        borderRadius: 8,
        background: `linear-gradient(180deg, ${color} 0%, ${color} 50%, #b9ac8a 100%)`,
        border: "1.5px solid #4a3a20",
        boxShadow: `
        inset 0 2px 0 rgba(255,255,255,0.5),
        inset 0 -3px 0 rgba(0,0,0,0.3),
        inset 0 0 0 1px rgba(255,255,255,0.15),
        0 4px 0 #5a4828,
        0 5px 6px rgba(0,0,0,0.4)
      `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Share Tech Mono", monospace',
        fontWeight: 700,
        fontSize: 18,
        color: textColor,
        letterSpacing: 1,
      }}
    >
      {children}
    </div>
    {dymoLabel && <Dymo color={dymoColor || "#1a1a1a"}>{dymoLabel}</Dymo>}
  </button>
);

const LCD = ({
  children,
  h = 110,
  glow = "#ffb733",
  bg = "#3a2a08",
  onClick,
}: {
  children: React.ReactNode;
  h?: number;
  glow?: string;
  bg?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    style={{
      height: h,
      position: "relative",
      background: `linear-gradient(180deg, ${bg} 0%, #1a1305 100%)`,
      border: "4px solid #1a1408",
      borderRadius: 6,
      padding: "8px 14px",
      boxShadow: `
      inset 0 0 30px rgba(0,0,0,0.7),
      inset 0 2px 4px rgba(0,0,0,0.8),
      0 0 0 2px #6c5a3a,
      0 0 0 3px #2a1f10
    `,
      overflow: "hidden",
      color: glow,
      fontFamily: '"VT323", "Share Tech Mono", monospace',
      textShadow: `0 0 4px ${glow}, 0 0 12px ${glow}`,
      display: "flex",
      alignItems: "center",
      cursor: onClick ? "pointer" : undefined,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.18) 2px 3px)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(90deg, transparent 0 3px, rgba(0,0,0,0.08) 3px 4px)",
        pointerEvents: "none",
      }}
    />
    {children}
  </div>
);

const LED = ({
  on = true,
  color = "#ff2030",
  label,
}: {
  on?: boolean;
  color?: string;
  label?: string;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: on
          ? `radial-gradient(circle at 35% 35%, #fff 0%, ${color} 50%, #5a0810 100%)`
          : "#3a2a1a",
        boxShadow: on ? `0 0 6px ${color}, 0 0 2px ${color}` : "inset 0 1px 1px rgba(0,0,0,0.6)",
        border: "1px solid #1a1408",
      }}
    />
    {label && (
      <div
        style={{
          fontFamily: '"Special Elite", monospace',
          fontSize: 9,
          letterSpacing: 1.5,
          color: "#3a2a10",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    )}
  </div>
);

const SpeakerIcon = ({ size = 16, color = "#ffb733" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    style={{
      position: "absolute",
      bottom: 6,
      left: 8,
      flexShrink: 0,
      filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 10px ${color})`,
    }}
    aria-hidden="true"
  >
    <polygon points="1,5 5,5 9,1 9,15 5,11 1,11" fill={color} />
    <path
      d="M11 5.5 Q13.5 8 11 10.5"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M12.5 3.5 Q16 8 12.5 12.5"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const PlasticOverlay = ({ borderRadius = 18 }: { borderRadius?: number }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius,
      pointerEvents: "none",
      zIndex: 4,
      overflow: "hidden",
    }}
  >
    {/* Surface grain — SVG feTurbulence at low opacity */}
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, opacity: 0.13 } as CSSProperties}
      aria-hidden="true"
    >
      <defs>
        <filter id="jp-plastic-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            seed="9"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#jp-plastic-grain)" />
    </svg>

    {/* Horizontal scratch lines */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
        repeating-linear-gradient(180deg,
          transparent 0px,        transparent 41px,
          rgba(255,255,255,0.06)  41px,  rgba(255,255,255,0.06)  41.4px,
          transparent 41.4px,     transparent 78px,
          rgba(255,255,255,0.04)  78px,  rgba(255,255,255,0.04)  78.3px,
          transparent 78.3px,     transparent 119px,
          rgba(0,0,0,0.05)        119px, rgba(0,0,0,0.05)        119.3px,
          transparent 119.3px,    transparent 162px,
          rgba(255,255,255,0.07)  162px, rgba(255,255,255,0.07)  162.5px,
          transparent 162.5px,    transparent 210px,
          rgba(0,0,0,0.04)        210px, rgba(0,0,0,0.04)        210.3px,
          transparent 210.3px,    transparent 255px,
          rgba(255,255,255,0.05)  255px, rgba(255,255,255,0.05)  255.4px,
          transparent 255.4px,    transparent 308px,
          rgba(255,255,255,0.04)  308px, rgba(255,255,255,0.04)  308.3px,
          transparent 308.3px,    transparent 360px,
          rgba(0,0,0,0.03)        360px, rgba(0,0,0,0.03)        360.3px
        )
      `,
      }}
    />

    {/* Diagonal scratch */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
        repeating-linear-gradient(163deg,
          transparent 0px,       transparent 190px,
          rgba(255,255,255,0.05) 190px, rgba(255,255,255,0.05) 190.5px,
          transparent 190.5px,   transparent 370px,
          rgba(0,0,0,0.04)       370px, rgba(0,0,0,0.04)       370.4px
        )
      `,
      }}
    />

    {/* Edge vignette + warm highlight top-left (aged plastic yellows unevenly) */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius,
        background: `
        radial-gradient(ellipse at 14% 7%,  rgba(255,230,140,0.14) 0%, transparent 44%),
        radial-gradient(ellipse at 88% 95%, rgba(20,10,0,0.20)     0%, transparent 40%),
        radial-gradient(ellipse at center,  transparent 42%, rgba(0,0,0,0.22) 100%)
      `,
      }}
    />

    {/* Fingerprint smudges */}
    <div
      style={{
        position: "absolute",
        top: "27%",
        left: "20%",
        width: 96,
        height: 46,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(50,33,8,0.08) 0%, transparent 70%)",
        transform: "rotate(-14deg)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "61%",
        right: "13%",
        width: 62,
        height: 30,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(50,33,8,0.06) 0%, transparent 70%)",
        transform: "rotate(9deg)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "44%",
        left: "52%",
        width: 44,
        height: 20,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(50,33,8,0.05) 0%, transparent 70%)",
        transform: "rotate(-5deg)",
      }}
    />
  </div>
);

const WalletWindow = ({ amount, noteW }: { amount: number; noteW: number }) => {
  const items = breakdown(amount);
  const notes = items.filter((v) => v >= 5);
  const coins = items.filter((v) => v < 5);

  return (
    <div
      style={{
        height: "100%",
        background: "linear-gradient(180deg, #1a1305 0%, #2a1f08 100%)",
        border: "4px solid #1a1408",
        borderRadius: 6,
        padding: "10px 12px",
        boxShadow: `
        inset 0 0 30px rgba(0,0,0,0.7),
        inset 0 2px 4px rgba(0,0,0,0.8),
        0 0 0 2px #6c5a3a,
        0 0 0 3px #2a1f10
      `,
        position: "relative",
        overflow: "auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.18) 2px 3px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 0 }}>
        {items.length === 0 ? (
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: 22,
              color: "#ffb733",
              textShadow: "0 0 6px #ffb733",
            }}
          >
            --- EMPTY ---
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              filter: "saturate(0.85) contrast(0.95)",
            }}
          >
            {notes.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {notes.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      width: noteW,
                      aspectRatio: "16/9",
                      backgroundImage: `url(${NOTE_IMGS[v]})`,
                      backgroundSize: "cover",
                      borderRadius: 3,
                      border: "1.5px solid rgba(0,0,0,0.5)",
                      boxShadow: "0 1px 0 rgba(0,0,0,0.3)",
                    }}
                  />
                ))}
              </div>
            )}
            {coins.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {coins.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      width: noteW * 0.5,
                      height: noteW * 0.5,
                      backgroundImage: `url(${COIN_IMGS[v]})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── layouts ─────────────────────────────────────────────────────────────────

interface JPProps {
  total: number;
  onAdd: (value: number) => void;
  onUndo: () => void;
  onReset: () => void;
  onListen: () => void;
}

function JP_Handheld({ total, onAdd, onUndo, onReset, onListen }: JPProps) {
  return (
    <div
      style={{
        width: 440,
        borderRadius: 22,
        background: "linear-gradient(135deg, #c9b896 0%, #b3a37e 50%, #9c8a6a 100%)",
        border: "2px solid #2a1f10",
        boxShadow: `
        inset 0 2px 0 rgba(255,255,255,0.4),
        inset 0 -4px 0 rgba(0,0,0,0.25),
        inset 0 0 60px rgba(0,0,0,0.15),
        0 8px 0 #5a4828,
        12px 14px 0 rgba(0,0,0,0.5),
        12px 14px 30px rgba(0,0,0,0.4)
      `,
        padding: 18,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: '"Share Tech Mono", monospace',
        boxSizing: "border-box",
      }}
    >
      <Screw x={10} y={10} />
      <Screw x={414} y={10} />
      <Screw x={10} y="calc(100% - 24px)" />
      <Screw x={414} y="calc(100% - 24px)" />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2px 4px",
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          <LED on color="#1fe35c" label="PWR" />
          <LED on color="#ffb733" label="REC" />
          <LED on={false} color="#ff2030" label="ALERT" />
        </div>
        <div
          style={{
            fontFamily: '"Black Ops One", monospace',
            fontSize: 11,
            letterSpacing: 2,
            color: "#3a2a10",
          }}
        >
          CASH-COUNT 3000
        </div>
        <Vent rows={3} w={40} />
      </div>

      <div>
        <Dymo color="#1a1a1a" w={120}>
          TOTAL · EUR
        </Dymo>
        <div style={{ height: 8 }} />
        <LCD h={88} onClick={onListen}>
          <SpeakerIcon size={14} />
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: 72,
              lineHeight: 1,
              letterSpacing: 4,
              width: "100%",
              textAlign: "right",
            }}
          >
            {formatEuro(total)}
          </div>
        </LCD>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Dymo color="#1a4a1a" w={160}>
          WALLET · CONTENT
        </Dymo>
        <div style={{ height: 6 }} />
        <div style={{ height: 110 }}>
          <WalletWindow amount={total} noteW={50} />
        </div>
      </div>

      <HazardStripe h={8} />

      <div>
        <Dymo color="#1a1a1a" w={130}>
          INPUT · NOTES
        </Dymo>
        <div style={{ height: 4 }} />
        <div
          style={{
            background: "#9c8a6a",
            border: "2px solid #4a3a20",
            borderRadius: 6,
            padding: 6,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 5,
          }}
        >
          {NOTES.map((v) => (
            <button
              key={v}
              onClick={() => onAdd(v)}
              style={{
                ...CLICKABLE,
                aspectRatio: "16/10",
                borderRadius: 4,
                border: "1.5px solid #4a3a20",
                padding: 0,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.4), 0 3px 0 #5a4828`,
                backgroundImage: `url(${NOTE_IMGS[v]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <Dymo color="#1a1a1a" w={130}>
          INPUT · COINS
        </Dymo>
        <div style={{ height: 4 }} />
        <div
          style={{
            background: "#9c8a6a",
            border: "2px solid #4a3a20",
            borderRadius: 6,
            padding: 5,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            display: "grid",
            gridTemplateColumns: "repeat(8,1fr)",
            gap: 3,
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          {COINS.map((v) => (
            <button
              key={v}
              onClick={() => onAdd(v)}
              style={{
                ...CLICKABLE,
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "none",
                padding: 0,
                backgroundImage: `url(${COIN_IMGS[v]})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                boxShadow: `inset 0 0 0 1.5px #4a3a20, 0 3px 0 #5a4828`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
        <ChunkyBtn w={196} h={48} dymoLabel="UNDO LAST" dymoColor="#1a1a1a" onClick={onUndo}>
          ↶
        </ChunkyBtn>
        <ChunkyBtn
          w={196}
          h={48}
          color="#d8806a"
          dymoLabel="CLEAR ALL"
          dymoColor="#a8112a"
          onClick={onReset}
        >
          RST
        </ChunkyBtn>
      </div>

      <PlasticOverlay borderRadius={22} />
    </div>
  );
}

function JP_Console({ total, onAdd, onUndo, onReset, onListen }: JPProps) {
  return (
    <div
      style={{
        width: 1100,
        height: 720,
        borderRadius: 18,
        background: "linear-gradient(135deg, #c9b896 0%, #b3a37e 50%, #9c8a6a 100%)",
        border: "2px solid #2a1f10",
        boxShadow: `
        inset 0 2px 0 rgba(255,255,255,0.4),
        inset 0 -4px 0 rgba(0,0,0,0.25),
        inset 0 0 80px rgba(0,0,0,0.15),
        0 8px 0 #5a4828,
        14px 16px 0 rgba(0,0,0,0.5)
      `,
        padding: 22,
        position: "relative",
        display: "flex",
        gap: 18,
        fontFamily: '"Share Tech Mono", monospace',
        boxSizing: "border-box",
      }}
    >
      <Screw x={12} y={12} s={16} />
      <Screw x={1072} y={12} s={16} />
      <Screw x={12} y={692} s={16} />
      <Screw x={1072} y={692} s={16} />
      <Screw x={540} y={12} s={12} />
      <Screw x={540} y={696} s={12} />

      {/* Left panel */}
      <div style={{ flex: "0 0 480px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2px 4px",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <LED on color="#1fe35c" label="PWR" />
            <LED on color="#ffb733" label="REC" />
            <LED on={false} color="#ff2030" label="ALERT" />
          </div>
          <div
            style={{
              fontFamily: '"Black Ops One", monospace',
              fontSize: 14,
              letterSpacing: 3,
              color: "#3a2a10",
            }}
          >
            CASH-COUNT 3000
          </div>
        </div>

        <div>
          <Dymo color="#1a1a1a" w={150}>
            TOTAL · EUR
          </Dymo>
          <div style={{ height: 6 }} />
          <LCD h={130} onClick={onListen}>
            <SpeakerIcon size={18} />
            <div
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: 110,
                lineHeight: 1,
                letterSpacing: 6,
                width: "100%",
                textAlign: "right",
              }}
            >
              {formatEuro(total)}
            </div>
          </LCD>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Dymo color="#1a4a1a" w={180}>
            WALLET · CONTENT
          </Dymo>
          <div style={{ height: 6 }} />
          <div style={{ flex: 1, minHeight: 0 }}>
            <WalletWindow amount={total} noteW={84} />
          </div>
        </div>

        <HazardStripe h={10} />

        <div style={{ display: "flex", gap: 10 }}>
          <ChunkyBtn w="50%" h={60} dymoLabel="UNDO LAST" dymoColor="#1a1a1a" onClick={onUndo}>
            ↶
          </ChunkyBtn>
          <ChunkyBtn
            w="50%"
            h={60}
            color="#d8806a"
            dymoLabel="CLEAR ALL"
            dymoColor="#a8112a"
            onClick={onReset}
          >
            RST
          </ChunkyBtn>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 4,
          alignSelf: "stretch",
          background: "linear-gradient(180deg, transparent, #2a1f10, transparent)",
          flexShrink: 0,
        }}
      />

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
        <Dymo color="#1a1a1a" w={170}>
          INPUT · NOTES
        </Dymo>
        <div
          style={{
            background: "#9c8a6a",
            border: "2px solid #4a3a20",
            borderRadius: 8,
            padding: 12,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 12,
          }}
        >
          {NOTES.map((v) => (
            <div key={v} style={{ position: "relative" }}>
              <button
                onClick={() => onAdd(v)}
                style={{
                  ...CLICKABLE,
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 6,
                  border: "2px solid #4a3a20",
                  padding: 0,
                  boxShadow: `
                    inset 0 2px 0 rgba(255,255,255,0.3),
                    inset 0 -3px 0 rgba(0,0,0,0.4),
                    0 4px 0 #5a4828,
                    0 5px 6px rgba(0,0,0,0.4)
                  `,
                  backgroundImage: `url(${NOTE_IMGS[v]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 4,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </button>
              <div
                style={{
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Dymo color="#1a1a1a">{`+${v} EUR`}</Dymo>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 8 }} />

        <Dymo color="#1a1a1a" w={170}>
          INPUT · COINS
        </Dymo>
        <div
          style={{
            background: "#9c8a6a",
            border: "2px solid #4a3a20",
            borderRadius: 8,
            padding: 12,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
            flex: 1,
            alignContent: "center",
          }}
        >
          {COINS.map((v) => (
            <button
              key={v}
              onClick={() => onAdd(v)}
              style={{
                ...CLICKABLE,
                width: 70,
                height: 70,
                borderRadius: "50%",
                border: "none",
                padding: 0,
                backgroundImage: `url(${COIN_IMGS[v]})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                boxShadow: `inset 0 0 0 2px #4a3a20, 0 4px 0 #5a4828, 0 5px 6px rgba(0,0,0,0.4)`,
              }}
            />
          ))}
        </div>

        {/* Bottom strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px" }}>
          <Vent rows={3} w={70} />
          <div
            style={{
              fontFamily: '"Special Elite", monospace',
              fontSize: 9,
              color: "#3a2a10",
              letterSpacing: 2,
              flex: 1,
              textAlign: "center",
            }}
          >
            S/N · CC3K-1993-0451 · ⚠ DO NOT REMOVE COVER ⚠
          </div>
          <Vent rows={3} w={70} />
        </div>
      </div>

      <PlasticOverlay borderRadius={18} />
    </div>
  );
}

// ─── root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [history, setHistory] = useState<number[]>([]);
  const { speak } = useSpeech();

  const totalCents = useMemo(
    () => history.reduce((sum, v) => sum + Math.round(v * 100), 0),
    [history],
  );
  const total = totalCents / 100;

  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 900);
  useEffect(() => {
    const handler = () =>
      setIsDesktop((prev) => {
        const next = window.innerWidth >= 900;
        return prev === next ? prev : next;
      });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleAdd = (value: number) => {
    setHistory((prev) => [...prev, value]);
    const text = value >= 1 ? `${value} euro` : `${Math.round(value * 100)} centesimi`;
    speak(text);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setHistory((prev) => prev.slice(0, -1));
    speak("Annullato");
  };

  const handleReset = () => {
    setHistory([]);
    speak("Azzerato");
  };

  const handleListen = () => {
    if (total === 0) {
      speak("Zero euro");
      return;
    }
    const euros = Math.floor(total);
    const cents = Math.round((total - euros) * 100);
    if (cents === 0) {
      speak(`${euros} euro`);
    } else {
      speak(`${euros} euro e ${cents} centesimi`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1408",
        display: "flex",
        alignItems: isDesktop ? "center" : "flex-start",
        justifyContent: "center",
        padding: isDesktop ? "20px" : "20px 20px 40px",
        overflowX: "auto",
      }}
    >
      {isDesktop ? (
        <JP_Console
          total={total}
          onAdd={handleAdd}
          onUndo={handleUndo}
          onReset={handleReset}
          onListen={handleListen}
        />
      ) : (
        <JP_Handheld
          total={total}
          onAdd={handleAdd}
          onUndo={handleUndo}
          onReset={handleReset}
          onListen={handleListen}
        />
      )}
    </div>
  );
}
