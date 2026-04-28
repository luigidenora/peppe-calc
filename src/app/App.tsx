import { useState, useEffect } from "react";
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

const NOTE_IMGS: Record<number, string> = { 50: img50, 20: img20, 10: img10, 5: img5 };
const COIN_IMGS: Record<number, string> = {
  2: img2, 1: img1, 0.5: img050, 0.2: img020,
  0.1: img010, 0.05: img005, 0.02: img002, 0.01: img001,
};
const NOTES = [5, 10, 20, 50];
const COINS = [0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1, 2];

function breakdown(amount: number): number[] {
  const denoms = [50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];
  const out: number[] = [];
  let rem = Math.round(amount * 100);
  for (const d of denoms) {
    const dc = Math.round(d * 100);
    while (rem >= dc) { out.push(d); rem -= dc; }
  }
  return out;
}

// ─── atoms ───────────────────────────────────────────────────────────────────

const Screw = ({ s = 14, x, y }: { s?: number; x: number | string; y: number | string }) => (
  <div style={{
    position: "absolute", top: y, left: x,
    width: s, height: s, borderRadius: "50%",
    background: "radial-gradient(circle at 32% 28%, #ede3c8 0%, #c4aa78 25%, #7a6440 55%, #2a1f10 100%)",
    boxShadow: `
      inset 0 1px 2px rgba(255,255,255,0.55),
      inset 0 -1px 2px rgba(0,0,0,0.7),
      0 2px 3px rgba(0,0,0,0.7),
      0 0 0 1px #100b04
    `,
    zIndex: 10,
  }}>
    <div style={{
      position: "absolute", top: "50%", left: "12%", right: "12%", height: 1.5,
      background: "linear-gradient(90deg, #050302 0%, #1a1008 50%, #050302 100%)",
      transform: "translateY(-50%) rotate(35deg)",
      borderRadius: 1, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    }} />
  </div>
);

const HazardStripe = ({ h = 12, w = "100%" }: { h?: number; w?: string | number }) => (
  <div style={{
    width: w, height: h, flexShrink: 0,
    background: "repeating-linear-gradient(135deg, #f4c020 0 14px, #1a1a1a 14px 28px)",
    borderTop: "2px solid #0d0d0d",
    borderBottom: "2px solid #0d0d0d",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.4)",
  }} />
);

// Brushed-metal ventilation grille
const Vent = ({ rows = 5, w = 80 }: { rows?: number; w?: number }) => (
  <div style={{
    width: w, flexShrink: 0,
    background: `
      repeating-linear-gradient(90deg,
        rgba(255,210,100,0.04) 0 1px, transparent 1px 3px
      ),
      linear-gradient(175deg, #4a3820 0%, #1a1005 45%, #2a1e0a 100%)
    `,
    border: "1px solid #0a0804",
    borderRadius: 4,
    padding: "5px 7px",
    display: "flex", flexDirection: "column", gap: 3,
    boxShadow: `
      inset 0 2px 4px rgba(0,0,0,0.65),
      inset 0 -1px 0 rgba(255,200,80,0.05),
      0 1px 0 rgba(255,255,255,0.07)
    `,
  }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{
        height: 3,
        background: "linear-gradient(180deg, #050302 0%, #0d0804 40%, #181005 100%)",
        borderRadius: 1,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 1px 0 rgba(255,180,60,0.05)",
      }} />
    ))}
  </div>
);

const ChunkyBtn = ({ children, w, h = 56, color = "#e8dec0", textColor = "#1a1a1a", onClick }: {
  children: React.ReactNode; w?: number | string; h?: number;
  color?: string; textColor?: string; onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      width: w, background: "none", border: "none", padding: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", touchAction: "manipulation", flexShrink: 0,
    } as CSSProperties}
  >
    <div style={{
      width: "100%", height: h, borderRadius: 8,
      background: `linear-gradient(180deg, ${color} 0%, ${color} 52%, #b9ac8a 100%)`,
      border: "1.5px solid #4a3a20",
      boxShadow: `
        inset 0 2px 0 rgba(255,255,255,0.5),
        inset 0 -3px 0 rgba(0,0,0,0.3),
        inset 0 0 0 1px rgba(255,255,255,0.15),
        0 4px 0 #5a4828,
        0 5px 6px rgba(0,0,0,0.4)
      `,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: '"Share Tech Mono", monospace',
      fontWeight: 700, fontSize: 22, color: textColor, letterSpacing: 1,
    }}>{children}</div>
  </button>
);

const LCD = ({ children, h = 110, glow = "#ffb733", bg = "#3a2a08", onClick }: {
  children: React.ReactNode; h?: number; glow?: string; bg?: string; onClick?: () => void;
}) => (
  <div onClick={onClick} style={{
    height: h, position: "relative",
    background: `linear-gradient(180deg, ${bg} 0%, #1a1305 100%)`,
    border: "4px solid #1a1408", borderRadius: 6, padding: "8px 14px",
    boxShadow: `
      inset 0 0 30px rgba(0,0,0,0.7),
      inset 0 2px 4px rgba(0,0,0,0.8),
      0 0 0 2px #6c5a3a,
      0 0 0 3px #2a1f10
    `,
    overflow: "hidden", color: glow,
    fontFamily: '"VT323", "Share Tech Mono", monospace',
    textShadow: `0 0 4px ${glow}, 0 0 12px ${glow}`,
    display: "flex", alignItems: "center",
    cursor: onClick ? "pointer" : undefined,
  }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.18) 2px 3px)",
      pointerEvents: "none",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      background: "repeating-linear-gradient(90deg, transparent 0 3px, rgba(0,0,0,0.08) 3px 4px)",
      pointerEvents: "none",
    }} />
    {children}
  </div>
);

const LED = ({ on = true, color = "#ff2030", label }: { on?: boolean; color?: string; label?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{
      width: 10, height: 10, borderRadius: "50%",
      background: on
        ? `radial-gradient(circle at 35% 35%, #fff 0%, ${color} 50%, #5a0810 100%)`
        : "#3a2a1a",
      boxShadow: on ? `0 0 6px ${color}, 0 0 2px ${color}` : "inset 0 1px 1px rgba(0,0,0,0.6)",
      border: "1px solid #1a1408",
    }} />
    {label && (
      <div style={{
        fontFamily: '"Special Elite", monospace', fontSize: 9,
        letterSpacing: 1.5, color: "#3a2a10", textTransform: "uppercase",
      }}>{label}</div>
    )}
  </div>
);

const SpeakerIcon = ({ size = 16, color = "#ffb733" }: { size?: number; color?: string }) => (
  <svg
    width={size} height={size} viewBox="0 0 16 16"
    style={{ position: "absolute", bottom: 6, left: 8, flexShrink: 0,
      filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 10px ${color})` }}
    aria-hidden="true"
  >
    <polygon points="1,5 5,5 9,1 9,15 5,11 1,11" fill={color} />
    <path d="M11 5.5 Q13.5 8 11 10.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M12.5 3.5 Q16 8 12.5 12.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

// Aged plastic surface overlays
const PlasticOverlay = ({ borderRadius = 18 }: { borderRadius?: number }) => (
  <div style={{
    position: "absolute", inset: 0, borderRadius,
    pointerEvents: "none", zIndex: 4, overflow: "hidden",
  }}>
    <svg width="100%" height="100%"
      style={{ position: "absolute", inset: 0, opacity: 0.13 } as CSSProperties}
      aria-hidden="true">
      <defs>
        <filter id="jp-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="9" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#jp-grain)"/>
    </svg>

    <div style={{
      position: "absolute", inset: 0,
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
          transparent 162.5px,    transparent 220px,
          rgba(0,0,0,0.04)        220px, rgba(0,0,0,0.04)        220.3px,
          transparent 220.3px,    transparent 275px,
          rgba(255,255,255,0.05)  275px, rgba(255,255,255,0.05)  275.4px
        )
      `,
    }} />

    <div style={{
      position: "absolute", inset: 0,
      background: `repeating-linear-gradient(163deg,
        transparent 0px, transparent 190px,
        rgba(255,255,255,0.05) 190px, rgba(255,255,255,0.05) 190.5px,
        transparent 190.5px, transparent 370px,
        rgba(0,0,0,0.04) 370px, rgba(0,0,0,0.04) 370.4px
      )`,
    }} />

    <div style={{
      position: "absolute", inset: 0, borderRadius,
      background: `
        radial-gradient(ellipse at 14% 7%,  rgba(255,230,140,0.14) 0%, transparent 44%),
        radial-gradient(ellipse at 88% 95%, rgba(20,10,0,0.20)     0%, transparent 40%),
        radial-gradient(ellipse at center,  transparent 42%, rgba(0,0,0,0.22) 100%)
      `,
    }} />

    <div style={{
      position: "absolute", top: "27%", left: "20%",
      width: 96, height: 46, borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(50,33,8,0.08) 0%, transparent 70%)",
      transform: "rotate(-14deg)",
    }} />
    <div style={{
      position: "absolute", top: "61%", right: "13%",
      width: 62, height: 30, borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(50,33,8,0.06) 0%, transparent 70%)",
      transform: "rotate(9deg)",
    }} />
  </div>
);

// Wallet breakdown viewer
const WalletWindow = ({ amount, noteW }: { amount: number; noteW: number }) => {
  const items = breakdown(amount);
  const notes = items.filter(v => v >= 5);
  const coins = items.filter(v => v < 5);
  return (
    <div style={{
      flex: 1, minHeight: 0,
      background: "linear-gradient(180deg, #1a1305 0%, #2a1f08 100%)",
      border: "4px solid #1a1408", borderRadius: 6, padding: "10px 12px",
      boxShadow: `
        inset 0 0 30px rgba(0,0,0,0.7),
        inset 0 2px 4px rgba(0,0,0,0.8),
        0 0 0 2px #6c5a3a, 0 0 0 3px #2a1f10
      `,
      position: "relative", overflow: "auto",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.18) 2px 3px)",
        pointerEvents: "none", zIndex: 1,
      }} />
      <div style={{ position: "relative", zIndex: 0 }}>
        {items.length === 0 ? (
          <div style={{
            fontFamily: '"VT323", monospace', fontSize: 22,
            color: "#ffb733", textShadow: "0 0 6px #ffb733",
          }}>--- EMPTY ---</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5, filter: "saturate(0.85) contrast(0.95)" }}>
            {notes.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {notes.map((v, i) => (
                  <div key={i} style={{
                    width: noteW, aspectRatio: "16/9",
                    backgroundImage: `url(${NOTE_IMGS[v]})`,
                    backgroundSize: "cover", borderRadius: 3,
                    border: "1.5px solid rgba(0,0,0,0.5)",
                    boxShadow: "0 1px 0 rgba(0,0,0,0.3)",
                  }} />
                ))}
              </div>
            )}
            {coins.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {coins.map((v, i) => (
                  <div key={i} style={{
                    width: noteW * 0.5, height: noteW * 0.5,
                    backgroundImage: `url(${COIN_IMGS[v]})`,
                    backgroundSize: "contain", backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Metal outer frame ────────────────────────────────────────────────────────

const MetalFrame = ({ children, borderRadius = 24, padPx = 10 }: {
  children: React.ReactNode; borderRadius?: number; padPx?: number;
}) => (
  <div style={{
    padding: padPx,
    borderRadius: borderRadius + padPx,
    background: `
      repeating-linear-gradient(88deg,
        rgba(255,210,80,0.03) 0 1px, transparent 1px 4px
      ),
      linear-gradient(150deg, #5c4a28 0%, #1e1408 40%, #3a2810 75%, #4a3a1e 100%)
    `,
    boxShadow: `
      inset 0 2px 0 rgba(255,220,100,0.18),
      inset 0 -3px 0 rgba(0,0,0,0.6),
      inset 2px 0 0 rgba(255,220,100,0.06),
      inset -2px 0 0 rgba(0,0,0,0.3),
      0 6px 20px rgba(0,0,0,0.8),
      0 2px 4px rgba(0,0,0,0.6),
      0 0 0 1px #0a0603
    `,
    position: "relative",
  }}>
    {/* Frame rivet marks at corners */}
    {[
      { top: 5, left: 5 }, { top: 5, right: 5 },
      { bottom: 5, left: 5 }, { bottom: 5, right: 5 },
    ].map((pos, i) => (
      <div key={i} style={{
        position: "absolute", ...pos,
        width: 6, height: 6, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #8a7050 0%, #2a1a08 100%)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 1px 1px rgba(0,0,0,0.5)",
      }} />
    ))}
    {children}
  </div>
);

// ─── layouts ─────────────────────────────────────────────────────────────────

interface JPProps {
  total: number;
  onAdd: (value: number) => void;
  onUndo: () => void;
  onReset: () => void;
  onListen: () => void;
}

const HANDHELD_W = 440;
const CONSOLE_W = 1100;
const CONSOLE_H = 720;

function JP_Handheld({ total, onAdd, onUndo, onReset, onListen }: JPProps) {
  const fmt = total.toFixed(2).replace(".", ",");
  return (
    <MetalFrame borderRadius={22} padPx={10}>
      <div style={{
        width: HANDHELD_W,
        borderRadius: 22,
        background: "linear-gradient(135deg, #c9b896 0%, #b3a37e 50%, #9c8a6a 100%)",
        border: "2px solid #2a1f10",
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.4),
          inset 0 -4px 0 rgba(0,0,0,0.25),
          inset 0 0 60px rgba(0,0,0,0.15)
        `,
        padding: 18, position: "relative",
        display: "flex", flexDirection: "column", gap: 12,
        fontFamily: '"Share Tech Mono", monospace',
        boxSizing: "border-box",
      }}>
        <Screw x={10} y={10} />
        <Screw x={414} y={10} />
        <Screw x={10} y="calc(100% - 24px)" />
        <Screw x={414} y="calc(100% - 24px)" />

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <LED on color="#1fe35c" label="PWR" />
            <LED on color="#ffb733" label="REC" />
            <LED on={false} color="#ff2030" label="ERR" />
          </div>
          <div style={{ fontFamily: '"Black Ops One", monospace', fontSize: 10, letterSpacing: 2, color: "#3a2a10" }}>
            CASH·COUNT 3000
          </div>
          <Vent rows={3} w={38} />
        </div>

        {/* LCD total — tap to hear */}
        <LCD h={88} onClick={onListen}>
          <SpeakerIcon size={13} />
          <div style={{
            fontFamily: '"VT323", monospace',
            fontSize: 72, lineHeight: 1, letterSpacing: 4,
            width: "100%", textAlign: "right",
          }}>{fmt}</div>
        </LCD>

        {/* Wallet window */}
        <div style={{ height: 110 }}>
          <WalletWindow amount={total} noteW={50} />
        </div>

        <HazardStripe h={8} />

        {/* Notes */}
        <div style={{
          background: "#9c8a6a", border: "2px solid #4a3a20", borderRadius: 6, padding: 6,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5,
        }}>
          {NOTES.map(v => (
            <button key={v} onClick={() => onAdd(v)} style={{
              aspectRatio: "16/10", borderRadius: 4, border: "1.5px solid #4a3a20", padding: 0,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.4), 0 3px 0 #5a4828",
              backgroundImage: `url(${NOTE_IMGS[v]})`,
              backgroundSize: "cover", backgroundPosition: "center",
              cursor: "pointer", touchAction: "manipulation",
            }} />
          ))}
        </div>

        {/* Coins */}
        <div style={{
          background: "#9c8a6a", border: "2px solid #4a3a20", borderRadius: 6, padding: 5,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
          display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 3,
          justifyItems: "center", alignItems: "center",
        }}>
          {COINS.map(v => (
            <button key={v} onClick={() => onAdd(v)} style={{
              width: 38, height: 38, borderRadius: "50%", border: "none", padding: 0,
              backgroundImage: `url(${COIN_IMGS[v]})`,
              backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
              boxShadow: "inset 0 0 0 1.5px #4a3a20, 0 3px 0 #5a4828",
              cursor: "pointer", touchAction: "manipulation",
            }} />
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <ChunkyBtn w="50%" h={50} onClick={onUndo}>↶</ChunkyBtn>
          <ChunkyBtn w="50%" h={50} color="#d8806a" textColor="#3a1008" onClick={onReset}>✕</ChunkyBtn>
        </div>

        <PlasticOverlay borderRadius={22} />
      </div>
    </MetalFrame>
  );
}

function JP_Console({ total, onAdd, onUndo, onReset, onListen }: JPProps) {
  const fmt = total.toFixed(2).replace(".", ",");
  return (
    <MetalFrame borderRadius={18} padPx={12}>
      <div style={{
        width: CONSOLE_W, height: CONSOLE_H,
        borderRadius: 18,
        background: "linear-gradient(135deg, #c9b896 0%, #b3a37e 50%, #9c8a6a 100%)",
        border: "2px solid #2a1f10",
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.4),
          inset 0 -4px 0 rgba(0,0,0,0.25),
          inset 0 0 80px rgba(0,0,0,0.15)
        `,
        padding: 22, position: "relative",
        display: "flex", gap: 18,
        fontFamily: '"Share Tech Mono", monospace',
        boxSizing: "border-box",
      }}>
        <Screw x={12} y={12} s={16} />
        <Screw x={1072} y={12} s={16} />
        <Screw x={12} y={692} s={16} />
        <Screw x={1072} y={692} s={16} />
        <Screw x={540} y={12} s={12} />
        <Screw x={540} y={696} s={12} />

        {/* Left panel */}
        <div style={{ flex: "0 0 480px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px" }}>
            <div style={{ display: "flex", gap: 16 }}>
              <LED on color="#1fe35c" label="PWR" />
              <LED on color="#ffb733" label="REC" />
              <LED on={false} color="#ff2030" label="ERR" />
            </div>
            <div style={{ fontFamily: '"Black Ops One", monospace', fontSize: 13, letterSpacing: 3, color: "#3a2a10" }}>
              CASH·COUNT 3000
            </div>
          </div>

          {/* LCD total — tap to hear */}
          <LCD h={130} onClick={onListen}>
            <SpeakerIcon size={18} />
            <div style={{
              fontFamily: '"VT323", monospace',
              fontSize: 110, lineHeight: 1, letterSpacing: 6,
              width: "100%", textAlign: "right",
            }}>{fmt}</div>
          </LCD>

          {/* Wallet window — fills remaining space */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <WalletWindow amount={total} noteW={84} />
          </div>

          <HazardStripe h={10} />

          <div style={{ display: "flex", gap: 10 }}>
            <ChunkyBtn w="50%" h={64} onClick={onUndo}>↶</ChunkyBtn>
            <ChunkyBtn w="50%" h={64} color="#d8806a" textColor="#3a1008" onClick={onReset}>✕</ChunkyBtn>
          </div>
        </div>

        {/* Metal divider */}
        <div style={{
          width: 6, alignSelf: "stretch", flexShrink: 0,
          background: `
            repeating-linear-gradient(180deg,
              rgba(255,210,80,0.06) 0 1px, transparent 1px 4px
            ),
            linear-gradient(90deg, #1a1005, #3a2810, #1a1005)
          `,
          borderRadius: 3,
          boxShadow: "inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.3)",
        }} />

        {/* Right panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          {/* Notes grid — 2×2 */}
          <div style={{
            background: "#9c8a6a", border: "2px solid #4a3a20", borderRadius: 8, padding: 12,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12,
          }}>
            {NOTES.map(v => (
              <button key={v} onClick={() => onAdd(v)} style={{
                aspectRatio: "16/9", borderRadius: 6, border: "2px solid #4a3a20", padding: 0,
                boxShadow: `
                  inset 0 2px 0 rgba(255,255,255,0.3),
                  inset 0 -3px 0 rgba(0,0,0,0.4),
                  0 4px 0 #5a4828,
                  0 5px 6px rgba(0,0,0,0.4)
                `,
                backgroundImage: `url(${NOTE_IMGS[v]})`,
                backgroundSize: "cover", backgroundPosition: "center",
                cursor: "pointer", touchAction: "manipulation", position: "relative",
              }}>
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 4,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.18) 100%)",
                  pointerEvents: "none",
                }} />
              </button>
            ))}
          </div>

          {/* Coins grid — 4×2 */}
          <div style={{
            background: "#9c8a6a", border: "2px solid #4a3a20", borderRadius: 8, padding: 12,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10,
            flex: 1, alignContent: "center",
          }}>
            {COINS.map(v => (
              <div key={v} style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={() => onAdd(v)} style={{
                  width: 70, height: 70, borderRadius: "50%", border: "none", padding: 0,
                  backgroundImage: `url(${COIN_IMGS[v]})`,
                  backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                  boxShadow: "inset 0 0 0 2px #4a3a20, 0 4px 0 #5a4828, 0 5px 6px rgba(0,0,0,0.4)",
                  cursor: "pointer", touchAction: "manipulation",
                }} />
              </div>
            ))}
          </div>

          {/* Bottom strip — vents + serial */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px" }}>
            <Vent rows={3} w={70} />
            <div style={{
              fontFamily: '"Special Elite", monospace',
              fontSize: 9, color: "#3a2a10", letterSpacing: 2,
              flex: 1, textAlign: "center",
            }}>S/N · CC3K-1993-0451 · ⚠ DO NOT REMOVE COVER ⚠</div>
            <Vent rows={3} w={70} />
          </div>
        </div>

        <PlasticOverlay borderRadius={18} />
      </div>
    </MetalFrame>
  );
}

// ─── root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [history, setHistory] = useState<number[]>([]);
  const { speak } = useSpeech();

  const totalCents = history.reduce((sum, v) => sum + Math.round(v * 100), 0);
  const total = totalCents / 100;

  // Viewport tracking for responsive zoom
  const [vw, setVw] = useState(() => window.innerWidth);
  const [vh, setVh] = useState(() => window.innerHeight);
  useEffect(() => {
    const handler = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isDesktop = vw >= 900;

  // Scale to fill viewport — includes outer MetalFrame padding
  const FRAME_PAD = isDesktop ? 12 : 10;
  const totalDeviceW = isDesktop ? CONSOLE_W + FRAME_PAD * 2 : HANDHELD_W + FRAME_PAD * 2;
  const totalDeviceH = isDesktop ? CONSOLE_H + FRAME_PAD * 2 : 530 + FRAME_PAD * 2; // 530 = handheld content estimate
  const margin = 8;
  const scale = Math.max(
    0.25,
    Math.min(
      (vw - margin * 2) / totalDeviceW,
      (vh - margin * 2) / totalDeviceH,
    ),
  );

  const handleAdd = (value: number) => {
    setHistory(prev => [...prev, value]);
    const text = value >= 1 ? `${value} euro` : `${Math.round(value * 100)} centesimi`;
    speak(text);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setHistory(prev => prev.slice(0, -1));
    speak("Annullato");
  };

  const handleReset = () => {
    setHistory([]);
    speak("Azzerato");
  };

  const handleListen = () => {
    if (total === 0) { speak("Zero euro"); return; }
    const euros = Math.floor(total);
    const cents = Math.round((total - euros) * 100);
    speak(cents === 0 ? `${euros} euro` : `${euros} euro e ${cents} centesimi`);
  };

  const props: JPProps = { total, onAdd: handleAdd, onUndo: handleUndo, onReset: handleReset, onListen: handleListen };

  return (
    <div style={{
      width: "100dvw", height: "100dvh",
      background: "#1a1408",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      <div style={{ zoom: scale, transformOrigin: "center center" }}>
        {isDesktop ? <JP_Console {...props} /> : <JP_Handheld {...props} />}
      </div>
    </div>
  );
}
