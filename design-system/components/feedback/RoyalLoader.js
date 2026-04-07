import { BaseComponent } from '../../utils/base-component.js';

const STYLE_ID = 'webropol-royal-loader-styles';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .wrld-root {
      --wrld-scale: 1;
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .wrld-art {
      transform: scale(var(--wrld-scale));
      transform-origin: center center;
    }
    .wrld-quadrant {
      animation: wrld-quad-rotate 1s infinite;
      height: 50px;
      width: 50px;
    }
    .wrld-quadrant::before,
    .wrld-quadrant::after {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    .wrld-quadrant::before {
      animation: wrld-quad-ball1 1s infinite;
      background-color: #823bdd;
      box-shadow: 30px 0 0 #6366f1;
      margin-bottom: 10px;
    }
    .wrld-quadrant::after {
      animation: wrld-quad-ball2 1s infinite;
      background-color: #06b6d4;
      box-shadow: 30px 0 0 #9e67e5;
    }
    @keyframes wrld-quad-rotate {
      0% { transform: rotate(0deg) scale(0.8); }
      50% { transform: rotate(360deg) scale(1.2); }
      100% { transform: rotate(720deg) scale(0.8); }
    }
    @keyframes wrld-quad-ball1 {
      0% { box-shadow: 30px 0 0 #6366f1; }
      50% { box-shadow: 0 0 0 #6366f1; margin-bottom: 0; transform: translate(15px, 15px); }
      100% { box-shadow: 30px 0 0 #6366f1; margin-bottom: 10px; }
    }
    @keyframes wrld-quad-ball2 {
      0% { box-shadow: 30px 0 0 #9e67e5; }
      50% { box-shadow: 0 0 0 #9e67e5; margin-top: -20px; transform: translate(15px, 15px); }
      100% { box-shadow: 30px 0 0 #9e67e5; margin-top: 0; }
    }
    .wrld-rings {
      width: 8em;
      height: 8em;
    }
    .wrld-rings .wrld-ring {
      animation: wrld-ring-a 2s linear infinite;
      fill: none;
      stroke-linecap: round;
    }
    .wrld-rings .wrld-ring--a { stroke: #823bdd; }
    .wrld-rings .wrld-ring--b { stroke: #6366f1; animation-name: wrld-ring-b; }
    .wrld-rings .wrld-ring--c { stroke: #06b6d4; animation-name: wrld-ring-c; }
    .wrld-rings .wrld-ring--d { stroke: #6922c4; animation-name: wrld-ring-d; }
    @keyframes wrld-ring-a {
      from, 4% { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -330; }
      12% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -335; }
      32% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -595; }
      40%, 54% { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -660; }
      62% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -665; }
      82% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -925; }
      90%, to { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -990; }
    }
    @keyframes wrld-ring-b {
      from, 12% { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -110; }
      20% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -115; }
      40% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -195; }
      48%, 62% { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -220; }
      70% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -225; }
      90% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -305; }
      98%, to { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -330; }
    }
    @keyframes wrld-ring-c {
      from { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: 0; }
      8% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -5; }
      28% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -175; }
      36%, 58% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -220; }
      66% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -225; }
      86% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -395; }
      94%, to { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -440; }
    }
    @keyframes wrld-ring-d {
      from, 8% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: 0; }
      16% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -5; }
      36% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -175; }
      44%, 50% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -220; }
      58% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -225; }
      78% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -395; }
      86%, to { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -440; }
    }
    .wrld-server {
      width: 152px;
      height: 168px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wrld-server .wrld-svg-global {
      display: block;
      width: 152px;
      height: 168px;
      overflow: visible;
    }
    .wrld-server .wrld-particle { animation: wrld-float-up linear infinite; }
    .wrld-server .wrld-p1 { animation-duration: 2.2s; animation-delay: 0s; }
    .wrld-server .wrld-p2 { animation-duration: 2.5s; animation-delay: 0.3s; }
    .wrld-server .wrld-p3 { animation-duration: 2s; animation-delay: 0.6s; }
    .wrld-server .wrld-p4 { animation-duration: 2.8s; animation-delay: 0.2s; }
    .wrld-server .wrld-p5 { animation-duration: 2.3s; animation-delay: 0.4s; }
    .wrld-server .wrld-p6 { animation-duration: 3s; animation-delay: 0.1s; }
    .wrld-server .wrld-p7 { animation-duration: 2.1s; animation-delay: 0.5s; }
    .wrld-server .wrld-p8 { animation-duration: 2.6s; animation-delay: 0.2s; }
    .wrld-server .wrld-p9 { animation-duration: 2.4s; animation-delay: 0.3s; }
    .wrld-server .wrld-bounce {
      animation: wrld-bounce-lines 3s ease-in-out infinite alternate;
    }
    .wrld-server .wrld-bounce--delay-a { animation-delay: 0.2s; }
    .wrld-server .wrld-bounce--delay-b { animation-delay: 0.4s; }
    @keyframes wrld-float-up {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: 1; }
      100% { transform: translateY(-40px); opacity: 0; }
    }
    @keyframes wrld-bounce-lines {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    .wrld-shape-shell {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 172px;
      height: 140px;
      border-radius: 24px;
      background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,244,255,0.96));
      border: 1px solid rgba(199,210,254,0.85);
      box-shadow: 0 18px 36px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
      overflow: hidden;
    }
    .wrld-shape-shell::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
      background-size: 24px 24px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.7), transparent 100%);
    }
    .wrld-shape-shell::after {
      content: '';
      position: absolute;
      width: 112px;
      height: 112px;
      right: -18px;
      top: -24px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(130,59,221,0.14), rgba(130,59,221,0));
    }
    .wrld-shape {
      position: relative;
      width: 100px;
      height: 92px;
      filter: drop-shadow(0 8px 18px rgba(130,59,221,0.12));
      animation: wrld-shape-float 3.9s ease-in-out infinite;
      z-index: 1;
    }
    .wrld-shape-box {
      box-sizing: border-box;
      position: absolute;
      border-style: solid;
      border-width: 5px;
    }
    .wrld-shape-box:nth-child(1) { animation: wrld-shape-eye-left 3.9s cubic-bezier(0.65,0,0.35,1) infinite; }
    .wrld-shape-box:nth-child(2) { animation: wrld-shape-eye-right 3.9s cubic-bezier(0.65,0,0.35,1) infinite; }
    .wrld-shape-box:nth-child(3) { animation: wrld-shape-mouth 3.9s cubic-bezier(0.65,0,0.35,1) infinite; }
    @keyframes wrld-shape-float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-2px) scale(1.015); }
    }
    @keyframes wrld-shape-eye-left {
      0%, 18% { width: 22px; height: 22px; border-radius: 11px; top: 8px; left: 8px; border-color: #823bdd; }
      24%, 42% { width: 28px; height: 28px; border-radius: 14px; top: 4px; left: 4px; border-color: #823bdd; }
      48%, 66% { width: 26px; height: 6px; border-radius: 4px; top: 18px; left: 6px; border-top-color: #823bdd; border-bottom-color: transparent; border-left-color: #823bdd; border-right-color: #823bdd; }
      74%, 100% { width: 22px; height: 22px; border-radius: 11px; top: 8px; left: 8px; border-color: #823bdd; }
    }
    @keyframes wrld-shape-eye-right {
      0%, 18% { width: 22px; height: 22px; border-radius: 11px; top: 8px; left: 68px; border-color: #6366f1; }
      24%, 42% { width: 28px; height: 28px; border-radius: 14px; top: 4px; left: 64px; border-color: #6366f1; }
      48%, 66% { width: 22px; height: 22px; border-radius: 11px; top: 8px; left: 68px; border-color: #6366f1; }
      74%, 100% { width: 22px; height: 22px; border-radius: 11px; top: 8px; left: 68px; border-color: #6366f1; }
    }
    @keyframes wrld-shape-mouth {
      0%, 12% { width: 34px; height: 6px; border-radius: 4px; left: 33px; top: 61px; border-top-color: #06b6d4; border-bottom-color: transparent; border-left-color: #06b6d4; border-right-color: #06b6d4; }
      18%, 34% { width: 52px; height: 22px; border-radius: 0 0 26px 26px; left: 24px; top: 54px; border-top-color: transparent; border-bottom-color: #06b6d4; border-left-color: #06b6d4; border-right-color: #06b6d4; }
      40%, 56% { width: 20px; height: 20px; border-radius: 50%; left: 40px; top: 54px; border-color: #06b6d4; }
      62%, 80% { width: 46px; height: 18px; border-radius: 0 0 24px 24px; left: 27px; top: 58px; border-top-color: transparent; border-bottom-color: #06b6d4; border-left-color: #06b6d4; border-right-color: #06b6d4; }
      88%, 100% { width: 34px; height: 6px; border-radius: 4px; left: 33px; top: 61px; border-top-color: #06b6d4; border-bottom-color: transparent; border-left-color: #06b6d4; border-right-color: #06b6d4; }
    }
    .wrld-shifter {
      position: relative;
      width: 88px;
      height: 88px;
    }
    .wrld-shifter-group {
      position: absolute;
      inset: 12px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      animation: wrld-shifter-orbit 3.6s linear infinite;
    }
    .wrld-shifter-tile {
      border-radius: 50%;
      animation: wrld-shifter-morph 3.6s cubic-bezier(0.65,0,0.35,1) infinite;
    }
    .wrld-shifter-tile:nth-child(1) { background: linear-gradient(135deg, #a78bfa, #823bdd); animation-delay: 0s; }
    .wrld-shifter-tile:nth-child(2) { background: linear-gradient(135deg, #818cf8, #6366f1); animation-delay: -0.9s; }
    .wrld-shifter-tile:nth-child(3) { background: linear-gradient(135deg, #67e8f9, #06b6d4); animation-delay: -1.8s; }
    .wrld-shifter-tile:nth-child(4) { background: linear-gradient(135deg, #c084fc, #9e67e5); animation-delay: -2.7s; }
    @keyframes wrld-shifter-orbit { to { transform: rotate(360deg); } }
    @keyframes wrld-shifter-morph {
      0%, 100% { border-radius: 50%; transform: scale(1); box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
      15% { border-radius: 40%; transform: scale(0.82); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      32% { border-radius: 14px; transform: scale(1.18); box-shadow: 0 6px 20px rgba(0,0,0,0.22); }
      50% { border-radius: 3px; transform: scale(0.86); box-shadow: 0 3px 10px rgba(0,0,0,0.18); }
      66% { border-radius: 14px; transform: scale(1.12); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
      83% { border-radius: 40%; transform: scale(0.86); box-shadow: 0 2px 5px rgba(0,0,0,0.12); }
    }
    .wrld-google {
      position: relative;
      width: 180px;
      height: 76px;
    }
    .wrld-google-dot {
      position: absolute;
      left: 20px;
      top: 28px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      transform-origin: center;
      animation-duration: 2.2s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    .wrld-google-dot--blue { background: #823bdd; animation-name: wrld-google-blue; }
    .wrld-google-dot--red { background: #6366f1; animation-name: wrld-google-red; }
    .wrld-google-dot--yellow { background: #06b6d4; animation-name: wrld-google-yellow; }
    .wrld-google-dot--green { background: #9e67e5; animation-name: wrld-google-green; }
    @keyframes wrld-google-blue {
      0% { transform: translateX(0) scale(1); }
      12.5% { transform: translateX(60px) translateY(-18px) scale(1.14); }
      25% { transform: translateX(120px) scale(1); }
      50% { transform: translateX(80px) scale(1); }
      75% { transform: translateX(40px) scale(1); }
      100% { transform: translateX(0) scale(1); }
    }
    @keyframes wrld-google-red {
      0% { transform: translateX(40px) scale(1); }
      25% { transform: translateX(0) scale(1); }
      37.5% { transform: translateX(60px) translateY(-18px) scale(1.14); }
      50% { transform: translateX(120px) scale(1); }
      75% { transform: translateX(80px) scale(1); }
      100% { transform: translateX(40px) scale(1); }
    }
    @keyframes wrld-google-yellow {
      0% { transform: translateX(80px) scale(1); }
      25% { transform: translateX(40px) scale(1); }
      50% { transform: translateX(0) scale(1); }
      62.5% { transform: translateX(60px) translateY(-18px) scale(1.14); }
      75% { transform: translateX(120px) scale(1); }
      100% { transform: translateX(80px) scale(1); }
    }
    @keyframes wrld-google-green {
      0% { transform: translateX(120px) scale(1); }
      25% { transform: translateX(80px) scale(1); }
      50% { transform: translateX(40px) scale(1); }
      75% { transform: translateX(0) scale(1); }
      87.5% { transform: translateX(60px) translateY(-18px) scale(1.14); }
      100% { transform: translateX(120px) scale(1); }
    }
    .wrld-ai {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 16px;
    }
    .wrld-ai-balls {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .wrld-ai-ball {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      animation: wrld-ai-wave 1.6s cubic-bezier(.36,.07,.19,.97) infinite var(--d, 0s);
    }
    .wrld-ai-ball:nth-child(1) { background: radial-gradient(circle at 38% 32%, #d8b4fe, #7c3aed); --d: 0s; }
    .wrld-ai-ball:nth-child(2) { background: radial-gradient(circle at 38% 32%, #a5b4fc, #4f46e5); --d: -0.28s; }
    .wrld-ai-ball:nth-child(3) { background: radial-gradient(circle at 38% 32%, #7dd3fc, #0369a1); --d: -0.56s; }
    .wrld-ai-ball:nth-child(4) { background: radial-gradient(circle at 38% 32%, #34d399, #0d9488); --d: -0.84s; }
    .wrld-ai-ball:nth-child(5) { background: radial-gradient(circle at 38% 32%, #22d3ee, #0e7490); --d: -1.12s; }
    .wrld-ai--sm .wrld-ai-ball { width: 10px; height: 10px; animation-name: wrld-ai-wave-sm; }
    .wrld-ai--lg .wrld-ai-ball { width: 26px; height: 26px; animation-name: wrld-ai-wave-lg; }
    .wrld-ai-label {
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 40%, #8b5cf6 80%, #06b6d4 100%);
      background-size: 240% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: wrld-ai-shimmer 2.6s linear infinite;
    }
    @keyframes wrld-ai-wave {
      0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 4px 10px rgba(99,102,241,0.12); }
      46% { transform: translateY(-26px) scale(1.22); box-shadow: 0 18px 32px rgba(99,102,241,0.3); }
    }
    @keyframes wrld-ai-wave-sm {
      0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 2px 6px rgba(99,102,241,0.12); }
      46% { transform: translateY(-14px) scale(1.2); box-shadow: 0 10px 18px rgba(99,102,241,0.22); }
    }
    @keyframes wrld-ai-wave-lg {
      0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 6px 16px rgba(99,102,241,0.14); }
      46% { transform: translateY(-36px) scale(1.24); box-shadow: 0 24px 44px rgba(99,102,241,0.34); }
    }
    @keyframes wrld-ai-shimmer { to { background-position: 240% center; } }
    .wrld-clip-shell {
      width: min(100%, 560px);
      min-width: 0;
      padding: 24px;
      border: 1px solid rgba(199,210,254,0.72);
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,248,255,0.96));
      box-shadow: 0 18px 44px rgba(99,102,241,0.12);
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    .wrld-clip-shell::before,
    .wrld-clip-shell::after {
      content: '';
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
      filter: blur(18px);
    }
    .wrld-clip-shell::before {
      width: 180px;
      height: 180px;
      top: -40px;
      right: -24px;
      background: rgba(99,102,241,0.1);
    }
    .wrld-clip-shell::after {
      width: 220px;
      height: 220px;
      left: -70px;
      bottom: -90px;
      background: rgba(130,59,221,0.08);
    }
    .wrld-clip-stage {
      position: relative;
      min-height: 208px;
      z-index: 1;
    }
    .wrld-clip-title {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: clamp(2.7rem, 8vw, 4.35rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: -0.06em;
      line-height: 0.95;
      margin: 0;
    }
    .wrld-clip-line {
      display: block;
      width: 100%;
      max-width: 100%;
      color: #272a2b;
      clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%);
      transform: translateY(36px) scale(0.96);
      opacity: 0;
      animation: wrld-clip-loop 7.2s cubic-bezier(0.22,1,0.36,1) infinite;
      text-shadow: 0 10px 22px rgba(99,102,241,0.08);
      white-space: nowrap;
    }
    .wrld-clip-title--a .wrld-clip-line:first-child { animation-delay: 0.18s; }
    .wrld-clip-title--a .wrld-clip-line:last-child {
      background: linear-gradient(90deg, #c4b5fd 0%, #818cf8 45%, #67e8f9 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation-delay: 0s;
    }
    .wrld-clip-title--b .wrld-clip-line:first-child {
      color: #45484a;
      animation-delay: 3.82s;
    }
    .wrld-clip-title--b .wrld-clip-line:last-child {
      background: linear-gradient(90deg, #06b6d4 0%, #6366f1 50%, #823bdd 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation-delay: 3.62s;
    }
    @keyframes wrld-clip-loop {
      0%, 8% { transform: translateY(40px) scale(0.95); opacity: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%); }
      14%, 38% { transform: translateY(0) scale(1); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 10%); }
      46%, 100% { transform: translateY(-34px) scale(1.02); opacity: 0; clip-path: polygon(100% 0, 100% 0, 0 100%, 0 100%); }
    }
  `;

  document.head.appendChild(style);
}

export class WebropolRoyalLoader extends BaseComponent {
  static get observedAttributes() {
    return ['type', 'size', 'text', 'line1', 'line2', 'line3', 'line4'];
  }

  init() {
    ensureStyles();
    if (this._originalText === undefined) {
      this._originalText = this.textContent.trim();
    }
  }

  render() {
    ensureStyles();

    const type = this.getAttr('type', 'ring-orbits');
    const size = this.getAttr('size', 'md');
    const scale = { sm: '0.82', md: '1', lg: '1.16', xl: '1.3' }[size] || '1';

    this.innerHTML = `
      <div class="wrld-root" role="status" aria-live="polite" style="--wrld-scale:${scale};">
        <div class="wrld-art">${this.renderVariant(type, size)}</div>
      </div>
    `;
  }

  renderVariant(type, size) {
    switch (type) {
      case 'quadrant-spin':
        return '<div class="wrld-quadrant" aria-label="Quadrant spin loader"></div>';
      case 'ring-orbits':
        return `
          <svg class="wrld-rings" width="240" height="240" viewBox="0 0 240 240" aria-label="Ring orbits loader">
            <circle class="wrld-ring wrld-ring--a" cx="120" cy="120" r="105" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330"></circle>
            <circle class="wrld-ring wrld-ring--b" cx="120" cy="120" r="35" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110"></circle>
            <circle class="wrld-ring wrld-ring--c" cx="85" cy="120" r="70" stroke-width="20" stroke-dasharray="0 440"></circle>
            <circle class="wrld-ring wrld-ring--d" cx="155" cy="120" r="70" stroke-width="20" stroke-dasharray="0 440"></circle>
          </svg>
        `;
      case 'server-node':
        return this.renderServerNode();
      case 'shape-follow':
        return `
          <div class="wrld-shape-shell">
            <div class="wrld-shape" aria-label="Shape follow loader">
              <div class="wrld-shape-box"></div>
              <div class="wrld-shape-box"></div>
              <div class="wrld-shape-box"></div>
            </div>
          </div>
        `;
      case 'shape-shifter':
        return `
          <div class="wrld-shifter" aria-label="Shape shifter loader">
            <div class="wrld-shifter-group">
              <div class="wrld-shifter-tile"></div>
              <div class="wrld-shifter-tile"></div>
              <div class="wrld-shifter-tile"></div>
              <div class="wrld-shifter-tile"></div>
            </div>
          </div>
        `;
      case 'google-style':
        return `
          <div class="wrld-google" aria-label="Google style loader">
            <div class="wrld-google-dot wrld-google-dot--blue"></div>
            <div class="wrld-google-dot wrld-google-dot--red"></div>
            <div class="wrld-google-dot wrld-google-dot--yellow"></div>
            <div class="wrld-google-dot wrld-google-dot--green"></div>
          </div>
        `;
      case 'ai-wave':
        return this.renderAiWave(size);
      case 'clip-reveal':
        return this.renderClipReveal();
      default:
        return this.renderVariant('ring-orbits', size);
    }
  }

  renderAiWave(size) {
    const text = this.getAttr('text', this._originalText || 'AI is thinking...');
    const sizeClass = size === 'sm' ? ' wrld-ai--sm' : size === 'lg' || size === 'xl' ? ' wrld-ai--lg' : '';

    return `
      <div class="wrld-ai${sizeClass}">
        <div class="wrld-ai-balls" aria-hidden="true">
          <div class="wrld-ai-ball"></div>
          <div class="wrld-ai-ball"></div>
          <div class="wrld-ai-ball"></div>
          <div class="wrld-ai-ball"></div>
          <div class="wrld-ai-ball"></div>
        </div>
        <span class="wrld-ai-label">${text}</span>
      </div>
    `;
  }

  renderClipReveal() {
    const line1 = this.getAttr('line1', 'AI is');
    const line2 = this.getAttr('line2', 'Thinking');
    const line3 = this.getAttr('line3', 'Almost');
    const line4 = this.getAttr('line4', 'Done!');

    return `
      <div class="wrld-clip-shell" aria-label="Clip reveal loader">
        <div class="wrld-clip-stage">
          <h3 class="wrld-clip-title wrld-clip-title--a">
            <span class="wrld-clip-line">${line1}</span>
            <span class="wrld-clip-line">${line2}</span>
          </h3>
          <h3 class="wrld-clip-title wrld-clip-title--b">
            <span class="wrld-clip-line">${line3}</span>
            <span class="wrld-clip-line">${line4}</span>
          </h3>
        </div>
      </div>
    `;
  }

  renderServerNode() {
    return `
      <div class="wrld-server" aria-label="Server node loader">
        <svg class="wrld-svg-global" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 94 136" height="136" width="94">
          <path class="wrld-bounce" stroke="#6922c4" d="M87.3629 108.433L49.1073 85.3765C47.846 84.6163 45.8009 84.6163 44.5395 85.3765L6.28392 108.433C5.02255 109.194 5.02255 110.426 6.28392 111.187L44.5395 134.243C45.8009 135.004 47.846 135.004 49.1073 134.243L87.3629 111.187C88.6243 110.426 88.6243 109.194 87.3629 108.433Z"></path>
          <path class="wrld-bounce wrld-bounce--delay-a" stroke="#823bdd" d="M91.0928 95.699L49.2899 70.5042C47.9116 69.6734 45.6769 69.6734 44.2986 70.5042L2.49568 95.699C1.11735 96.5298 1.11735 97.8767 2.49568 98.7074L44.2986 123.902C45.6769 124.733 47.9116 124.733 49.2899 123.902L91.0928 98.7074C92.4712 97.8767 92.4712 96.5298 91.0928 95.699Z"></path>
          <g class="wrld-bounce wrld-bounce--delay-b">
            <path fill="url(#wrld-srv-paint0)" d="M2.48637 72.0059L43.8699 96.9428C45.742 98.0709 48.281 97.8084 50.9284 96.2133L91.4607 71.7833C92.1444 71.2621 92.4197 70.9139 92.5421 70.1257V86.1368C92.5421 86.9686 92.0025 87.9681 91.3123 88.3825C84.502 92.4724 51.6503 112.204 50.0363 113.215C48.2352 114.343 45.3534 114.343 43.5523 113.215C41.9261 112.197 8.55699 91.8662 2.08967 87.926C1.39197 87.5011 1.00946 86.5986 1.00946 85.4058V70.1257C1.11219 70.9289 1.49685 71.3298 2.48637 72.0059Z"></path>
            <path stroke="url(#wrld-srv-paint2)" fill="url(#wrld-srv-paint1)" d="M91.0928 68.7324L49.2899 43.5375C47.9116 42.7068 45.6769 42.7068 44.2986 43.5375L2.49568 68.7324C1.11735 69.5631 1.11735 70.91 2.49568 71.7407L44.2986 96.9356C45.6769 97.7663 47.9116 97.7663 49.2899 96.9356L91.0928 71.7407C92.4712 70.91 92.4712 69.5631 91.0928 68.7324Z"></path>
          </g>
          <g class="wrld-bounce wrld-bounce--delay-b">
            <path fill="url(#wrld-srv-paint3)" d="M43.5482 32.558C44.5429 32.558 45.3493 31.7162 45.3493 30.6778C45.3493 29.6394 44.5429 28.7976 43.5482 28.7976C42.5535 28.7976 41.7471 29.6394 41.7471 30.6778C41.7471 31.7162 42.5535 32.558 43.5482 32.558Z" class="wrld-particle wrld-p1"></path>
            <path fill="url(#wrld-srv-paint4)" d="M50.0323 48.3519C51.027 48.3519 51.8334 47.5101 51.8334 46.4717C51.8334 45.4333 51.027 44.5915 50.0323 44.5915C49.0375 44.5915 48.2311 45.4333 48.2311 46.4717C48.2311 47.5101 49.0375 48.3519 50.0323 48.3519Z" class="wrld-particle wrld-p2"></path>
            <path fill="url(#wrld-srv-paint5)" d="M40.3062 62.6416C41.102 62.6416 41.7471 61.9681 41.7471 61.1374C41.7471 60.3067 41.102 59.6332 40.3062 59.6332C39.5104 59.6332 38.8653 60.3067 38.8653 61.1374C38.8653 61.9681 39.5104 62.6416 40.3062 62.6416Z" class="wrld-particle wrld-p3"></path>
            <path fill="url(#wrld-srv-paint6)" d="M50.7527 73.9229C52.1453 73.9229 53.2743 72.7444 53.2743 71.2906C53.2743 69.8368 52.1453 68.6583 50.7527 68.6583C49.3601 68.6583 48.2311 69.8368 48.2311 71.2906C48.2311 72.7444 49.3601 73.9229 50.7527 73.9229Z" class="wrld-particle wrld-p4"></path>
            <path fill="url(#wrld-srv-paint7)" d="M48.5913 76.9312C49.1882 76.9312 49.672 76.4262 49.672 75.8031C49.672 75.1801 49.1882 74.675 48.5913 74.675C47.9945 74.675 47.5107 75.1801 47.5107 75.8031C47.5107 76.4262 47.9945 76.9312 48.5913 76.9312Z" class="wrld-particle wrld-p5"></path>
            <path fill="url(#wrld-srv-paint8)" d="M52.9153 67.1541C53.115 67.1541 53.2768 66.9858 53.2768 66.7781C53.2768 66.5704 53.115 66.402 52.9153 66.402C52.7156 66.402 52.5538 66.5704 52.5538 66.7781C52.5538 66.9858 52.7156 67.1541 52.9153 67.1541Z" class="wrld-particle wrld-p6"></path>
            <path fill="url(#wrld-srv-paint9)" d="M52.1936 43.8394C52.7904 43.8394 53.2743 43.3344 53.2743 42.7113C53.2743 42.0883 52.7904 41.5832 52.1936 41.5832C51.5967 41.5832 51.1129 42.0883 51.1129 42.7113C51.1129 43.3344 51.5967 43.8394 52.1936 43.8394Z" class="wrld-particle wrld-p7"></path>
            <path fill="url(#wrld-srv-paint10)" d="M57.2367 29.5497C57.8335 29.5497 58.3173 29.0446 58.3173 28.4216C58.3173 27.7985 57.8335 27.2935 57.2367 27.2935C56.6398 27.2935 56.156 27.7985 56.156 28.4216C56.156 29.0446 56.6398 29.5497 57.2367 29.5497Z" class="wrld-particle wrld-p8"></path>
            <path fill="url(#wrld-srv-paint11)" d="M43.9084 34.8144C44.3063 34.8144 44.6289 34.4777 44.6289 34.0623C44.6289 33.647 44.3063 33.3102 43.9084 33.3102C43.5105 33.3102 43.188 33.647 43.188 34.0623C43.188 34.4777 43.5105 34.8144 43.9084 34.8144Z" class="wrld-particle wrld-p9"></path>
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" y2="92.0933" x2="92.5421" y1="92.0933" x1="1.00946" id="wrld-srv-paint0"><stop stop-color="#8B5CF6"></stop><stop stop-color="#6366F1" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="91.1638" x2="6.72169" y1="70" x1="92.5" id="wrld-srv-paint1"><stop stop-color="#6366F1"></stop><stop stop-color="#4338CA" offset="0.29"></stop><stop stop-color="#823bdd" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="85.0762" x2="3.55544" y1="70" x1="92.5" id="wrld-srv-paint2"><stop stop-color="#C7D2FE"></stop><stop stop-color="#6922c4" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="32.558" x2="43.5482" y1="28.7976" x1="43.5482" id="wrld-srv-paint3"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="48.3519" x2="50.0323" y1="44.5915" x1="50.0323" id="wrld-srv-paint4"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="62.6416" x2="40.3062" y1="59.6332" x1="40.3062" id="wrld-srv-paint5"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="73.9229" x2="50.7527" y1="68.6583" x1="50.7527" id="wrld-srv-paint6"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="76.9312" x2="48.5913" y1="74.675" x1="48.5913" id="wrld-srv-paint7"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="67.1541" x2="52.9153" y1="66.402" x1="52.9153" id="wrld-srv-paint8"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="43.8394" x2="52.1936" y1="41.5832" x1="52.1936" id="wrld-srv-paint9"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="29.5497" x2="57.2367" y1="27.2935" x1="57.2367" id="wrld-srv-paint10"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="34.8144" x2="43.9084" y1="33.3102" x1="43.9084" id="wrld-srv-paint11"><stop stop-color="#6922c4"></stop><stop stop-color="#C7D2FE" offset="1"></stop></linearGradient>
          </defs>
        </svg>
      </div>
    `;
  }
}

if (!customElements.get('webropol-royal-loader')) {
  customElements.define('webropol-royal-loader', WebropolRoyalLoader);
}