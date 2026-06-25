import { useState, useEffect, useRef } from "react";

/* ============================================================
   ♡ cozy corkboard ♡  — a pixel-art Animal Crossing style
   bulletin board task manager with a shop + leaf currency.
   ============================================================ */

const FONT_DISPLAY = "'Press Start 2P', monospace";
const FONT_BODY = "'Silkscreen', 'Courier New', monospace";

/* ---------- shop catalogs ---------- */

const FRAMES = {
  classic:   { name: "Sage",     frame: "#C7E0BB", dark: "#B2D2A2", cork: "#F6ECD9", corkDk: "#EBDDC2", ink: "#8B795F", cost: 0 },
  honey:     { name: "Honey",    frame: "#F3DEA6", dark: "#E8CD86", cork: "#FBF2D8", corkDk: "#F3E6C2", ink: "#94794A", cost: 130 },
  cherry:    { name: "Cocoa",    frame: "#DDBCA8", dark: "#CCA48C", cork: "#F6ECD9", corkDk: "#EBDAC2", ink: "#8B6A52", cost: 120 },
  sakura:    { name: "Sakura",   frame: "#F5D0DB", dark: "#EDBDCC", cork: "#FDF0F4", corkDk: "#F8E2EA", ink: "#B07A93", cost: 120 },
  midnight:  { name: "Twilight", frame: "#A39CC0", dark: "#8E87AE", cork: "#E6E2F0", corkDk: "#D8D3E8", ink: "#6A6390", cost: 150 },
  bluebell:  { name: "Bluebell", frame: "#B8D4E8", dark: "#9BBEDD", cork: "#EEF5FA", corkDk: "#DDE9F2", ink: "#5A7A9A", cost: 120 },
  latte:     { name: "Latte",    frame: "#E8D4B8", dark: "#DDBF98", cork: "#FAF2E8", corkDk: "#F2E6D4", ink: "#8A6A44", cost: 110 },
  peach:     { name: "Peachy",   frame: "#F2C4A0", dark: "#E8AD85", cork: "#FBF0E8", corkDk: "#F5E2D0", ink: "#9A6848", cost: 120 },
  minty:     { name: "Minty",    frame: "#A8DCC8", dark: "#8ECBB4", cork: "#E8F8F2", corkDk: "#D4F0E6", ink: "#4A8A72", cost: 130 },
  lilac:     { name: "Lilac",    frame: "#C8B8E8", dark: "#B4A0D8", cork: "#F2EEF8", corkDk: "#E6DEFA", ink: "#7060A0", cost: 140 },
  rose:      { name: "Rosé",     frame: "#E8C0C8", dark: "#D8A8B4", cork: "#FAF0F2", corkDk: "#F2E0E4", ink: "#9A6070", cost: 130 },
  lemon:     { name: "Lemon",    frame: "#E8EAA0", dark: "#D8DA88", cork: "#F8FAE8", corkDk: "#EEF0D4", ink: "#7A7840", cost: 110 },
  cloud:     { name: "Cloud",    frame: "#C8D4E4", dark: "#B4C2D4", cork: "#EEF2F8", corkDk: "#E0E6F0", ink: "#607088", cost: 130 },
  berry:     { name: "Berry",    frame: "#D4A0C8", dark: "#C288B4", cork: "#F8EEF6", corkDk: "#EEE0EA", ink: "#8A4878", cost: 150 },
  mocha:     { name: "Mocha",    frame: "#C8A888", dark: "#B89070", cork: "#F4EDE4", corkDk: "#EAE0D4", ink: "#7A5840", cost: 140 },
};

const NOTE_COLORS = {
  cream:    { name: "Cream",    bg: "#FFFBF1", ink: "#94815E", cost: 0 },
  butter:   { name: "Butter",   bg: "#FEF6CE", ink: "#9A8448", cost: 0 },
  sage:     { name: "Sage",     bg: "#EAF2DD", ink: "#728B5C", cost: 0 },
  sakura:   { name: "Sakura",   bg: "#FDEAF0", ink: "#B8748D", cost: 25 },
  mint:     { name: "Mint",     bg: "#DFF4EC", ink: "#549B83", cost: 25 },
  sky:      { name: "Sky",      bg: "#E6F1FA", ink: "#6283AA", cost: 25 },
  lavender: { name: "Lavender", bg: "#F0E9F9", ink: "#8470B4", cost: 30 },
  peach:    { name: "Peach",    bg: "#FFEEDF", ink: "#BE8058", cost: 30 },
};

const PIN_COLORS = {
  red:    { name: "Coral",  c: "#F2ABAB", cost: 0 },
  yellow: { name: "Butter", c: "#F6DD98", cost: 0 },
  blue:   { name: "Sky",    c: "#AAC4EA", cost: 0 },
  pink:   { name: "Rose",   c: "#F4BAD4", cost: 20 },
  green:  { name: "Mint",   c: "#B6D9B7", cost: 20 },
  gold:   { name: "Gold",   c: "#F0D48C", cost: 40 },
};

const PATTERNS = {
  none:    { name: "Plain",   cost: 0 },
  dots:    { name: "Dots",    cost: 35 },
  stripes: { name: "Stripes", cost: 40 },
  gingham: { name: "Gingham", cost: 45 },
};

/* ---------- pixel sprites ---------- */

const SPRITES = {
  leaf: {
    pal: { g: "#A9DA8C", d: "#94C97A", v: "#6FA84C" },
    grid: [
      "....ggg....",
      "..ggggggg..",
      ".ggggvgggg.",
      "gggggvggggg",
      "gggdgvgdggg",
      "gggggvggggg",
      "gggdgvgdggg",
      ".ggggvgggg.",
      "..gggvggg..",
      "....gvg....",
      ".....v.....",
    ],
  },
  flower: {
    pal: { p: "#F6AECB", y: "#FCE08A", d: "#E892B4", l: "#97CB8E" },
    grid: [
      "..p...p..",
      ".ppp.ppp.",
      ".pppyppp.",
      "..pyyyp..",
      ".pppyppp.",
      ".ppp.ppp.",
      "..p.l.p..",
      "....l....",
      "...lll...",
    ],
  },
  star: {
    pal: { y: "#FCE08A", o: "#EDC768" },
    grid: [
      "....y....",
      "...yyy...",
      "yyyyyyyyy",
      "..yyyyy..",
      "...yyy...",
      "..yy.yy..",
      "..y...y..",
      ".........",
    ],
  },
  note: {
    pal: { d: "#6B5840", y: "#FCE08A" },
    grid: [
      "....dd....",
      "...dddd...",
      "...dddd...",
      ".....d....",
      ".....d....",
      ".....d....",
      ".....d....",
      "....yyy...",
      "...yyyyy..",
      "..yyyyy...",
      ".yyy......",
    ],
  },
  heart: {
    pal: { r: "#F4A6C6", d: "#E58FB4" },
    grid: [
      ".rr.rr...",
      "rrrrrrr..",
      "rrrrrrr..",
      "rrrrrrr..",
      ".rrrrr...",
      "..rrr....",
      "...r.....",
      ".........",
      ".........",
    ],
  },
  mushroom: {
    pal: { r: "#EE9C9C", w: "#FFF5EC", s: "#EEDCC2", k: "#CDB99C" },
    grid: [
      "..rrrrr..",
      ".rwrrwrr.",
      "rrrrrrrrr",
      "rwrrrrwrr",
      ".rrrrrrr.",
      "...sss...",
      "...sks...",
      "..sssss..",
      ".........",
    ],
  },

  /* ---- focus plant growth stages ---- */
  plant0: {
    pal: { t: "#E0A878", o: "#8A6A4A" },
    grid: [
      "............",
      "............",
      "............",
      "............",
      "............",
      "............",
      "............",
      "............",
      ".....oo.....",
      ".tttttttttt.",
      ".tttttttttt.",
      "..tttttttt..",
      "...tttttt...",
    ],
  },
  plant1: {
    pal: { t: "#E0A878", s: "#86C063", l: "#A9DA8C" },
    grid: [
      "............",
      "............",
      "............",
      "............",
      "............",
      "............",
      "....l.l.....",
      ".....s......",
      ".....s......",
      ".tttttttttt.",
      ".tttttttttt.",
      "..tttttttt..",
      "...tttttt...",
    ],
  },
  plant2: {
    pal: { t: "#E0A878", s: "#86C063", l: "#A9DA8C" },
    grid: [
      "............",
      "............",
      "............",
      ".....s......",
      "...l.s......",
      ".....s.l....",
      ".....s......",
      ".....s......",
      ".....s......",
      ".tttttttttt.",
      ".tttttttttt.",
      "..tttttttt..",
      "...tttttt...",
    ],
  },
  plant3: {
    pal: { t: "#E0A878", s: "#86C063", l: "#A9DA8C" },
    grid: [
      "............",
      ".....s......",
      "...l.s.l....",
      "..lllslll...",
      "...l.s.l....",
      ".....s......",
      ".....s......",
      ".....s......",
      ".....s......",
      ".tttttttttt.",
      ".tttttttttt.",
      "..tttttttt..",
      "...tttttt...",
    ],
  },
  plant4: {
    pal: { t: "#E0A878", s: "#86C063", l: "#A9DA8C", f: "#F4A6C6", y: "#FCE08A" },
    grid: [
      "....fff.....",
      "...fffff....",
      "...ffyff....",
      "...fffff....",
      "....fff.....",
      "...l.s.l....",
      "..lllslll...",
      "...l.s.l....",
      ".....s......",
      ".tttttttttt.",
      ".tttttttttt.",
      "..tttttttt..",
      "...tttttt...",
    ],
  },

  /* ---- kitties (3 patterns) ---- */
  kitty_cream: {
    pal: { b: "#F8E2C2", d: "#F2BD96", p: "#ECA6BC", e: "#6A5444", w: "#FFF6EA", i: "#ECA6BC" },
    grid: [
      ".dd......bb.",
      ".ddd....bbb.",
      ".dib....bib.",
      "..dbbbbbbb..",
      ".bbbbbbbbbb.",
      ".bbbbbbbbbb.",
      ".beebbbbeeb.",
      ".bbbbppbbbb.",
      ".bbbwwwwbbb.",
      "..bbbbbbbb..",
      "..bbbbbbbb..",
      ".bbbbbbbbbb.",
    ],
  },
  kitty_gray: {
    pal: { b: "#CDD1D8", d: "#AAB0BB", p: "#ECA6BC", e: "#4E4A56", w: "#F4F6FA", i: "#E2AEBA" },
    grid: [
      ".bb......bb.",
      ".bdb....bdb.",
      ".bib....bib.",
      "..bdbbbbdb..",
      ".bbdbbbbdbb.",
      ".bbbbbbbbbb.",
      ".beebbbbeeb.",
      ".bbbbppbbbb.",
      ".bbbwwwwbbb.",
      "..bdbbbbdb..",
      "..bbbbbbbb..",
      ".bbdbbbbdbb.",
    ],
  },
  kitty_tuxedo: {
    pal: { b: "#65606E", w: "#F6F4F8", p: "#ECA6BC", e: "#FFFFFF", i: "#C99AAC" },
    grid: [
      ".bb......bb.",
      ".bbb....bbb.",
      ".bib....bib.",
      "..bbbbbbbb..",
      ".bbbbbbbbbb.",
      ".bbbbbbbbbb.",
      ".beebbbbeeb.",
      ".bbbwppwbbb.",
      ".bwwwwwwwwb.",
      "..wwwwwwww..",
      "..wwwwwwww..",
      ".bbwwwwwwbb.",
    ],
  },

  /* ---- puppies (3 patterns) ---- */
  puppy_gold: {
    pal: { b: "#F2CE92", d: "#E3B873", w: "#FFF5E4", n: "#6E5644", e: "#5E483A" },
    grid: [
      ".dd......dd.",
      ".ddbbbbbbdd.",
      "ddbbbbbbbbdd",
      "dbbbbbbbbbbd",
      ".bbbbbbbbbb.",
      ".beebbbbeeb.",
      ".bbbbbbbbbb.",
      ".bbbwwwwbbb.",
      ".bbwwnnwwbb.",
      "..bwwwwwwb..",
      "..bbbbbbbb..",
      ".bbbbbbbbbb.",
    ],
  },
  puppy_brown: {
    pal: { b: "#CFA079", d: "#AC8059", w: "#F6E9D6", n: "#4E3C2E", e: "#4E3C2E" },
    grid: [
      ".dd......dd.",
      ".ddbbbbbbdd.",
      "ddbbbbbbbbdd",
      "dbbbbbbbbbbd",
      ".bbbbbbbbbb.",
      ".beebbbbeeb.",
      ".bbbbbbbbbb.",
      ".wwwwwwwwww.",
      ".bwwwnnwwwb.",
      "..wwwwwwww..",
      "..bbbbbbbb..",
      ".bbbbbbbbbb.",
    ],
  },
  puppy_spotted: {
    pal: { b: "#F3F0EA", d: "#8E8278", w: "#FFFFFF", n: "#4E4040", e: "#4A3C3C" },
    grid: [
      ".dd......dd.",
      ".ddbbbbbbdd.",
      "ddbbbbbbbbdd",
      "dbbbbbbbbbbd",
      ".dddbbbbbb..",
      ".ddeebbbeeb.",
      ".dddbbbbbb..",
      ".bbbwwwwbbb.",
      ".bbwwnnwwbb.",
      "..bwwwwwwb..",
      "..bbbbbddb..",
      ".bbbbbbddbb.",
    ],
  },

  /* ---- bows (main colors) ---- */
  ...bow("bow_pink",    "#F2A8C4", "#DC85A6", "#FBD0DF"),
  ...bow("bow_red",     "#EC9A9A", "#D77676", "#F8C9C9"),
  ...bow("bow_blue",    "#9CBCE6", "#7A9CCB", "#CCDDF2"),
  ...bow("bow_yellow",  "#F4D67E", "#E0BD5E", "#FBECB8"),
  ...bow("bow_mint",    "#A6DCC4", "#82C2A4", "#CDEEDD"),
  ...bow("bow_lavender","#C9B6E6", "#A992CB", "#E2D6F2"),
};

function bow(key, b, d, k) {
  return {
    [key]: {
      pal: { b, d, k },
      grid: [
        ".bb.....bb.",
        "bbbb...bbbb",
        "bbbbdkdbbbb",
        "bbbbdkdbbbb",
        "bbbb...bbbb",
        ".bb.ddd.bb.",
        "....d.d....",
        "...d...d...",
      ],
    },
  };
}

/* icons offered when creating a task (kept small + simple) */
const ICON_OPTIONS = ["leaf", "flower", "star", "heart", "mushroom", "bow_pink"];

/* placeable decorations sold in the shop */
const DECOR_ITEMS = [
  { key: "leaf",         name: "Leaf",          cost: 20 },
  { key: "flower",       name: "Flower",        cost: 30 },
  { key: "star",         name: "Star",          cost: 30 },
  { key: "heart",        name: "Heart",         cost: 30 },
  { key: "mushroom",     name: "Mushroom",      cost: 40 },
  { key: "kitty_cream",  name: "Cream Kitty",   cost: 55 },
  { key: "kitty_gray",   name: "Gray Kitty",    cost: 55 },
  { key: "kitty_tuxedo", name: "Tuxedo Kitty",  cost: 55 },
  { key: "puppy_gold",   name: "Golden Puppy",  cost: 55 },
  { key: "puppy_brown",  name: "Brown Puppy",   cost: 55 },
  { key: "puppy_spotted",name: "Spotted Puppy", cost: 55 },
  { key: "bow_pink",     name: "Pink Bow",      cost: 30 },
  { key: "bow_red",      name: "Red Bow",       cost: 30 },
  { key: "bow_blue",     name: "Blue Bow",      cost: 30 },
  { key: "bow_yellow",   name: "Yellow Bow",    cost: 30 },
  { key: "bow_mint",     name: "Mint Bow",      cost: 30 },
  { key: "bow_lavender", name: "Lavender Bow",  cost: 30 },
];

function PixelArt({ name, scale = 4, style }) {
  const s = SPRITES[name];
  if (!s) return null;
  const cols = s.grid[0].length;
  const rows = s.grid.length;
  return (
    <svg
      width={cols * scale}
      height={rows * scale}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", display: "block", ...style }}
    >
      {s.grid.map((row, y) =>
        row.split("").map((ch, x) =>
          s.pal[ch] ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={s.pal[ch]} />
          ) : null
        )
      )}
    </svg>
  );
}

/* ---------- little ui helpers ---------- */

function patternOverlay(pattern, ink) {
  const c = ink + "22";
  switch (pattern) {
    case "dots":
      return { backgroundImage: `radial-gradient(${ink}33 1.5px, transparent 1.6px)`, backgroundSize: "8px 8px" };
    case "stripes":
      return { backgroundImage: `repeating-linear-gradient(45deg, ${c} 0 4px, transparent 4px 10px)` };
    case "gingham":
      return {
        backgroundImage: `linear-gradient(${c} 50%, transparent 50%), linear-gradient(90deg, ${c} 50%, transparent 50%)`,
        backgroundSize: "10px 10px, 10px 10px",
      };
    default:
      return {};
  }
}

const SOFT_INK = "#8A7257";
const SOFT_SHADOW = "rgba(138,114,87,.22)";

const PXBORDER = (col = SOFT_INK) => ({
  border: `3px solid ${col}`,
  borderRadius: 10,
  boxShadow: `2px 3px 0 ${SOFT_SHADOW}`,
});

function TextButton({ children, onClick, disabled, active, color = "#8B795F", style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none",
        border: "none",
        padding: "4px 2px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: FONT_DISPLAY,
        fontSize: 10,
        lineHeight: 1.5,
        color: disabled ? "#A89A7E" : active ? "#6FA84C" : color,
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function PixelButton({ children, onClick, color = "#FCEEB8", ink = "#7A6346", disabled, style }) {
  const [down, setDown] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onMouseLeave={() => setDown(false)}
      onTouchStart={() => setDown(true)}
      onTouchEnd={() => setDown(false)}
      style={{
        fontFamily: FONT_DISPLAY,
        fontSize: 9,
        lineHeight: 1.5,
        background: disabled ? "#DED6C5" : color,
        color: disabled ? "#A79E8C" : ink,
        padding: "9px 12px",
        cursor: disabled ? "not-allowed" : "pointer",
        ...PXBORDER(ink),
        boxShadow: down && !disabled ? `1px 1px 0 ${SOFT_SHADOW}` : `2px 3px 0 ${SOFT_SHADOW}`,
        transform: down && !disabled ? "translate(1px,2px)" : "none",
        transition: "transform .04s",
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const PUSHPIN_ROWS = [
  ".ooooo.",
  "obbbbbo",
  "ohbbbbo",
  "obbbbbo",
  ".ooooo.",
  "...o...",
  ".ooooo.",
  "ohbbbbo",
  ".ooooo.",
  "...n...",
  "...o...",
];

function PushpinSvg({ color, scale = 3 }) {
  const DARK = "#3A3028";
  const NEEDLE = "#DDD0BA";
  const W = PUSHPIN_ROWS[0].length;
  const H = PUSHPIN_ROWS.length;
  return (
    <svg
      width={W * scale}
      height={H * scale}
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      {PUSHPIN_ROWS.map((row, y) =>
        row.split("").map((ch, x) => {
          if (ch === ".") return null;
          if (ch === "h") return (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width={1} height={1} fill={color} />
              <rect x={x} y={y} width={1} height={1} fill="white" fillOpacity={0.45} />
            </g>
          );
          const fill = ch === "o" ? DARK : ch === "b" ? color : ch === "n" ? NEEDLE : null;
          return fill ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} /> : null;
        })
      )}
    </svg>
  );
}

function Pushpin({ color = "#F2ABAB" }) {
  return (
    <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
      <PushpinSvg color={color} scale={3} />
    </div>
  );
}

/* ---------- default state ---------- */

const FOCUS_PRESETS = [
  { min: 15, reward: 12, label: "Short" },
  { min: 25, reward: 20, label: "Classic" },
  { min: 50, reward: 42, label: "Deep" },
];

/* Long-form YouTube streams — playlist or video id from the share link */
const RADIO_STATIONS = [
  { id: "PLLRRXURicM", kind: "playlist", name: "upbeat daytime lofi", vibe: "bouncy sunny beats" },
  { id: "rIFDqCYMOAQ", kind: "video",    name: "late night lofi",     vibe: "chill mellow beats" },
  { id: "gsVT8-Uc1vY", kind: "video",    name: "vintage oldies",      vibe: "crafting, tea sipping or studying" },
  { id: "YgU261Zlkco", kind: "video",    name: "night city phonk",    vibe: "deep coding / dev sessions" },
];

const loadRadioVideo = (player, station) => {
  if (!player || !station?.id) return;
  const start = station.start || 0;
  if (station.kind === "playlist") {
    if (typeof player.loadPlaylist === "function") {
      player.loadPlaylist(station.id, 0, start);
    } else {
      player.loadVideoById({ listType: "playlist", list: station.id, startSeconds: start });
    }
    return;
  }
  if (start) player.loadVideoById({ videoId: station.id, startSeconds: start });
  else player.loadVideoById(station.id);
};

const RADIO_PREFS_KEY = "cozy-corkboard-radio";

const DEFAULT_STATE = {
  leaves: 45,
  completed: 0,
  focusSessions: 0,
  focusMinutes: 0,
  musicSeconds: 0,
  tasks: [],
  decorations: [],
  equippedFrame: "classic",
  owned: {
    frames: ["classic"],
    notes: ["cream", "butter", "sage"],
    pins: ["red", "yellow", "blue"],
    patterns: ["none"],
    decor: [],
  },
};

const uid = () => Math.random().toString(36).slice(2, 9);
const rnd = (a, b) => a + Math.random() * (b - a);
const clampPct = (v, min = 4, max = 92) => Math.min(max, Math.max(min, v));

/* ============================================================
   APP
   ============================================================ */

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("board"); // board | shop
  const [modal, setModal] = useState(null); // {mode:'add'} | {mode:'edit',task} | {mode:'detail',task}
  const [floats, setFloats] = useState([]);

  /* ---------- focus timer runtime ---------- */
  const [presetIdx, setPresetIdx] = useState(1);
  const [focusStatus, setFocusStatus] = useState("idle"); // idle | running | paused | done
  const [endTime, setEndTime] = useState(0);
  const [remainingMs, setRemainingMs] = useState(FOCUS_PRESETS[1].min * 60000);
  const [, setTick] = useState(0);
  const [decorMode, setDecorMode] = useState(false);
  const mainScrollRef = useRef(null);

  const handleDecorModeChange = (open) => {
    setDecorMode(open);
    if (!open && mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };

  useEffect(() => {
    if (view !== "board") {
      setDecorMode(false);
      if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
    }
  }, [view]);

  /* load */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cozy-corkboard");
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({ ...DEFAULT_STATE, ...parsed, owned: { ...DEFAULT_STATE.owned, ...(parsed.owned || {}) } });
      }
    } catch (e) { /* first run */ }
    setLoaded(true);
  }, []);

  /* save */
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("cozy-corkboard", JSON.stringify(state)); }
    catch (e) { /* ignore */ }
  }, [state, loaded]);

  const frame = FRAMES[state.equippedFrame] || FRAMES.classic;

  const earn = (n, anchor) => {
    setState((s) => ({ ...s, leaves: s.leaves + n }));
    const id = uid();
    setFloats((f) => [...f, { id, n, ...anchor }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1100);
  };

  /* ---------- focus timer ---------- */
  const focusDuration = FOCUS_PRESETS[presetIdx].min * 60000;
  const focusRemaining = focusStatus === "running" ? Math.max(0, endTime - Date.now()) : remainingMs;

  const completeFocus = () => {
    const p = FOCUS_PRESETS[presetIdx];
    setFocusStatus("done");
    setRemainingMs(0);
    setState((s) => ({ ...s, focusSessions: s.focusSessions + 1, focusMinutes: s.focusMinutes + p.min }));
    earn(p.reward, { top: 70, right: 16 });
    setTimeout(() => { setFocusStatus("idle"); setRemainingMs(p.min * 60000); }, 2800);
  };

  useEffect(() => {
    if (focusStatus !== "running") return;
    const iv = setInterval(() => {
      if (endTime - Date.now() <= 0) completeFocus();
      else setTick((t) => t + 1);
    }, 400);
    return () => clearInterval(iv);
  }, [focusStatus, endTime]);

  const startFocus = () => {
    const left = focusStatus === "paused" ? remainingMs : focusDuration;
    setEndTime(Date.now() + left);
    setFocusStatus("running");
  };
  const pauseFocus = () => {
    setRemainingMs(Math.max(0, endTime - Date.now()));
    setFocusStatus("paused");
  };
  const resetFocus = () => { setFocusStatus("idle"); setRemainingMs(focusDuration); };
  const pickPreset = (i) => { setPresetIdx(i); setFocusStatus("idle"); setRemainingMs(FOCUS_PRESETS[i].min * 60000); };

  const focusFrac = 1 - focusRemaining / focusDuration;
  const focusStage =
    focusStatus === "done" ? 4 : focusStatus === "idle" ? 0 : focusFrac < 0.33 ? 1 : focusFrac < 0.66 ? 2 : 3;

  /* ---------- task actions ---------- */
  const addTask = (task) => setState((s) => ({ ...s, tasks: [...s.tasks, task] }));
  const updateTask = (task) => setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === task.id ? task : t)) }));
  const removeTask = (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  const reorderTasks = (dragId, targetId) => setState((s) => {
    const arr = [...s.tasks];
    const from = arr.findIndex((t) => t.id === dragId);
    const to = arr.findIndex((t) => t.id === targetId);
    if (from === -1 || to === -1) return s;
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    return { ...s, tasks: arr };
  });

  const completeTask = (task) => {
    const reward = task.type === "poster" ? 12 + (task.checklist?.length || 0) * 3 : 8;
    setState((s) => ({
      ...s,
      completed: s.completed + 1,
      tasks: s.tasks.map((t) => (t.id === task.id ? { ...t, completing: true } : t)),
    }));
    earn(reward, { top: 70, right: 16 });
    setTimeout(() => removeTask(task.id), 750);
    setModal(null);
  };

  const toggleCheck = (taskId, itemId) =>
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) } : t
      ),
    }));

  /* ---------- shop ---------- */
  const canAfford = (cost) => state.leaves >= cost;
  const buy = (category, key, cost, autoPlace) => {
    if (!canAfford(cost)) return;
    setState((s) => {
      const owned = { ...s.owned, [category]: [...new Set([...(s.owned[category] || []), key])] };
      const next = { ...s, leaves: s.leaves - cost, owned };
      if (category === "frames") next.equippedFrame = key;
      if (autoPlace) next.decorations = [...s.decorations, { id: uid(), type: key, x: rnd(8, 82), y: rnd(8, 78), r: rnd(-12, 12) }];
      return next;
    });
  };
  const equipFrame = (key) => setState((s) => ({ ...s, equippedFrame: key }));
  const placeDecorAt = (type, x, y) =>
    setState((s) => ({
      ...s,
      decorations: [...s.decorations, { id: uid(), type, x: clampPct(x), y: clampPct(y), r: rnd(-12, 12) }],
    }));
  const placeDecor = (type) => placeDecorAt(type, rnd(8, 82), rnd(8, 78));
  const moveDecor = (id, x, y) =>
    setState((s) => ({
      ...s,
      decorations: s.decorations.map((d) => (d.id === id ? { ...d, x: clampPct(x), y: clampPct(y) } : d)),
    }));
  const removeDecor = (id) => setState((s) => ({ ...s, decorations: s.decorations.filter((d) => d.id !== id) }));
  const addMusicSecond = () => setState((s) => ({ ...s, musicSeconds: (s.musicSeconds || 0) + 1 }));

  if (!loaded) {
    return (
      <div style={{ ...page(frame), display: "flex", alignItems: "center", justifyContent: "center", color: "#7A6346", fontFamily: FONT_DISPLAY, fontSize: 12 }}>
        <PixelArt name="leaf" scale={6} /> &nbsp;loading…
      </div>
    );
  }

  return (
    <div style={page(frame)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Press+Start+2P&display=swap');
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        @keyframes popin { 0% { transform: scale(.4) rotate(var(--rot)); opacity: 0; } 70% { transform: scale(1.08) rotate(var(--rot)); } 100% { transform: scale(1) rotate(var(--rot)); opacity: 1; } }
        @keyframes floatup { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-42px); opacity: 0; } }
        @keyframes done { 0% { transform: scale(1) rotate(var(--rot)); } 40% { transform: scale(1.1) rotate(var(--rot)); } 100% { transform: scale(.2) rotate(var(--rot)); opacity: 0; } }
        @keyframes sway { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @keyframes grow { 0% { transform: scale(.7); } 60% { transform: scale(1.12); } 100% { transform: scale(1); } }
        @keyframes breathe { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .note-enter { animation: popin .35s ease-out both; }
        input, textarea { font-family: ${FONT_BODY}; }
      `}</style>

      {/* floating leaf rewards */}
      {floats.map((f) => (
        <div key={f.id} style={{ position: "fixed", top: f.top, right: f.right, zIndex: 200, animation: "floatup 1.1s ease-out forwards", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_DISPLAY, fontSize: 12, color: "#6FA84C", textShadow: "1px 1px 0 #fff" }}>
          +{f.n} <PixelArt name="leaf" scale={3} />
        </div>
      ))}

      <TitleBar />
      <Header
        frame={frame}
        leaves={state.leaves}
        completed={state.completed}
        focusSessions={state.focusSessions}
        focusMinutes={state.focusMinutes}
        musicSeconds={state.musicSeconds || 0}
        decorCount={state.decorations.length}
        ownedDecor={state.owned.decor.length}
      />

      <div
        ref={mainScrollRef}
        style={{ flex: 1, minHeight: 0, minWidth: 0, overflowY: view === "shop" || view === "radio" || decorMode ? "auto" : "hidden", overflowX: "hidden", padding: "10px 14px 100px", width: "100%", maxWidth: "100%" }}
      >
        {view === "board" && (
          <Board
            frame={frame}
            tasks={state.tasks}
            decorations={state.decorations}
            ownedDecor={state.owned.decor}
            completed={state.completed}
            onOpen={(task) => setModal({ mode: "detail", task })}
            onRemoveDecor={removeDecor}
            onPlaceDecor={placeDecorAt}
            onMoveDecor={moveDecor}
            onAdd={() => setModal({ mode: "add" })}
            onDecorModeChange={handleDecorModeChange}
          />
        )}
        {view === "focus" && (
          <Focus
            frame={frame}
            presetIdx={presetIdx}
            status={focusStatus}
            remaining={focusRemaining}
            stage={focusStage}
            sessions={state.focusSessions}
            minutes={state.focusMinutes}
            onPick={pickPreset}
            onStart={startFocus}
            onPause={pauseFocus}
            onReset={resetFocus}
          />
        )}
        {view === "shop" && (
          <Shop
            state={state}
            frame={frame}
            canAfford={canAfford}
            buy={buy}
            equipFrame={equipFrame}
            placeDecor={placeDecor}
          />
        )}
        {view === "radio" && (
          <Radio
            frame={frame}
            onListenTick={addMusicSecond}
          />
        )}
      </div>

      <TabBar view={view} setView={setView} frame={frame} />

      {modal?.mode === "detail" && (
        <DetailModal
          task={state.tasks.find((t) => t.id === modal.task.id)}
          onClose={() => setModal(null)}
          onComplete={completeTask}
          onEdit={(t) => setModal({ mode: "edit", task: t })}
          onDelete={(id) => { removeTask(id); setModal(null); }}
          onToggle={toggleCheck}
        />
      )}

      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <TaskForm
          state={state}
          editing={modal.mode === "edit" ? modal.task : null}
          onClose={() => setModal(null)}
          onSave={(t) => { modal.mode === "edit" ? updateTask(t) : addTask(t); setModal(null); }}
        />
      )}
    </div>
  );
}

/* ============================================================
   layout pieces
   ============================================================ */

function page(frame) {
  return {
    fontFamily: FONT_BODY,
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    background:
      frame.name === "Twilight" ? "#EEEAF6" : "#FBF4E4",
    color: frame.ink,
    overflow: "hidden",
    position: "relative",
  };
}

// Drag handle for the frameless Electron window
function TitleBar() {
  const isElectron = !!window.electronAPI;
  const [pinned, setPinned] = useState(true);
  const drag = useRef({ active: false, lastX: 0, lastY: 0 });

  if (!isElectron) return null;

  useState(() => {
    window.electronAPI.onPinChanged((val) => setPinned(val));
  });

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { active: true, lastX: e.screenX, lastY: e.screenY };
    const onMove = (ev) => {
      if (!drag.current.active) return;
      window.electronAPI.drag(ev.screenX - drag.current.lastX, ev.screenY - drag.current.lastY);
      drag.current.lastX = ev.screenX;
      drag.current.lastY = ev.screenY;
    };
    const onUp = () => {
      drag.current.active = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, padding: "4px 8px 0", cursor: "grab", userSelect: "none" }}
    >
      <button
        title={pinned ? "unpin (allow behind windows)" : "pin on top"}
        onClick={(e) => { e.stopPropagation(); window.electronAPI.togglePin(); }}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, opacity: pinned ? 1 : 0.4, padding: "2px 4px" }}
      >📌</button>
      <button
        title="minimise"
        onClick={(e) => { e.stopPropagation(); window.electronAPI.minimize(); }}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, opacity: 0.5, padding: "2px 4px" }}
      >—</button>
      <button
        title="close"
        onClick={(e) => { e.stopPropagation(); window.electronAPI.close(); }}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, opacity: 0.5, padding: "2px 4px" }}
      >✕</button>
    </div>
  );
}

function Header({ frame, leaves, completed, focusSessions, focusMinutes, musicSeconds, decorCount, ownedDecor }) {
  const [open, setOpen] = useState(false);
  const [titleHover, setTitleHover] = useState(false);
  const hrs = Math.floor(focusMinutes / 60);
  const mins = focusMinutes % 60;
  const focusLabel = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  const musicMins = Math.floor((musicSeconds || 0) / 60);
  const musicHrs = Math.floor(musicMins / 60);
  const musicLabel = musicHrs > 0 ? `${musicHrs}h ${musicMins % 60}m` : `${musicMins}m`;

  const rows = [
    { icon: "heart", label: "tasks done", value: completed },
    { icon: "plant3", label: "focus sessions", value: focusSessions },
    { icon: "star", label: "time focused", value: focusLabel, img: "./focus-clock-icon.png" },
    { icon: "note", label: "music listened", value: musicLabel, img: "./music-note-icon.png" },
    { icon: "flower", label: "decorations placed", value: decorCount },
    { icon: "leaf", label: "leaves", value: leaves },
  ];

  return (
    <div style={{ position: "relative", padding: "10px 12px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="stats and guide"
          onMouseEnter={() => setTitleHover(true)}
          onMouseLeave={() => setTitleHover(false)}
          style={{
            background: "none", border: "none", padding: "4px 2px", cursor: "pointer",
            fontFamily: FONT_DISPLAY, fontSize: 13, lineHeight: 1.3, position: "relative",
            color: frame.name === "Twilight" ? "#6A6390" : "#8B795F",
          }}
        >
          Cozy Corkboard
          {titleHover && !open && (
            <div style={{
              position: "absolute", top: -26, left: 0, whiteSpace: "nowrap",
              background: "#FFFBF1", ...PXBORDER(), padding: "4px 7px",
              fontFamily: FONT_DISPLAY, fontSize: 7, color: "#6FA84C",
              pointerEvents: "none", zIndex: 50,
            }}>
              Click Me!
            </div>
          )}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FFFBF1", padding: "6px 10px", ...PXBORDER() }}>
        <PixelArt name="leaf" scale={3} />
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 12, color: "#6FA84C" }}>{leaves}</span>
      </div>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div
            style={{
              position: "absolute", top: 42, left: 10, zIndex: 100, width: 260,
              background: "#FFFBF1", ...PXBORDER(), padding: 12,
              animation: "popin .22s ease-out", "--rot": "0deg",
              maxHeight: "70vh", overflowY: "auto",
            }}
          >
            {/* ── stats ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontFamily: FONT_DISPLAY, fontSize: 9, color: "#8B795F" }}>
              <PixelArt name="star" scale={2} /> your little garden
            </div>
            {rows.map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px dashed rgba(120,95,70,.16)" }}>
                {r.img ? (
                  <img src={r.img} alt="" draggable={false} style={{ width: 20, height: 20, imageRendering: "pixelated", flexShrink: 0 }} />
                ) : (
                  <PixelArt name={r.icon} scale={2} />
                )}
                <span style={{ flex: 1, fontSize: 13, color: "#94815E" }}>{r.label}</span>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, color: "#6B5840" }}>{r.value}</span>
              </div>
            ))}
            <div style={{ fontSize: 11, color: "#A89A7E", marginTop: 8, textAlign: "center" }}>keep growing ♡</div>

            {/* ── user guide ── */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "2px dashed rgba(120,95,70,.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontFamily: FONT_DISPLAY, fontSize: 9, color: "#8B795F" }}>
                <PixelArt name="flower" scale={2} /> user guide
              </div>
              {[
                { icon: "heart",   title: "board",   body: "your corkboard! pin tasks here. click any card to open it, mark it done, or delete it." },
                { icon: "plant3",  title: "quick task", body: "a small sticky note for one-off things. pick a pin color + note color, add a title." },
                { icon: "star",    title: "poster task", body: "a bigger card with a checklist. great for multi-step projects. check items off as you go." },
                { icon: "leaf",    title: "leaves ♡",  body: "earn leaves by completing tasks. quick tasks = +8, poster tasks = +12 and up. spend them in the shop!" },
                { icon: "flower",  title: "shop",     body: "buy new board colors, note colors, pins, patterns and cute decorations with your leaves." },
                { img: "./focus-clock-icon.png", title: "focus",  body: "a pomodoro-style timer. pick a preset, start a session, earn bonus leaves when you finish." },
                { icon: "heart",   title: "radio",   body: "cozy background music from long youtube streams. pick a station, hit play, adjust volume. needs internet." },
                { icon: "star",    title: "tidy",     body: "appears when you have decorations. click it to enter removal mode — tap any decor's ✕ to remove it. use + decorate your board below to place or move them anytime." },
              ].map(({ icon, img, title, body }) => (
                <div key={title} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px dashed rgba(120,95,70,.12)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    {img ? (
                      <img src={img} alt="" draggable={false} style={{ width: 20, height: 20, imageRendering: "pixelated", flexShrink: 0 }} />
                    ) : (
                      <PixelArt name={icon} scale={2} />
                    )}
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 8, color: "#6B5840", textTransform: "capitalize" }}>{title}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94815E", lineHeight: 1.5, paddingLeft: 4 }}>{body}</div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: "#A89A7E", textAlign: "center" }}>everything saves in your browser ♡</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DecorPalette({ ownedDecor, placing, onPick }) {
  const items = DECOR_ITEMS.filter(({ key }) => ownedDecor.includes(key));
  return (
    <div style={{ marginTop: 10, padding: 12, background: "#FFFBF1", ...PXBORDER(), width: "100%", boxSizing: "border-box" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 7, color: "#8B795F", marginBottom: 10, textAlign: "center", lineHeight: 1.6 }}>
        drag onto the board or tap one, then click where you want it ♡
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {items.map(({ key, name }) => (
          <div
            key={key}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/x-cozy-decor", key);
              e.dataTransfer.effectAllowed = "copy";
            }}
            onClick={() => onPick(placing === key ? null : key)}
            style={{
              padding: 8,
              cursor: "grab",
              background: placing === key ? "#BFE3AE" : "#FFFBF1",
              ...PXBORDER(placing === key ? "#6FA84C" : SOFT_INK),
              borderRadius: 10,
              userSelect: "none",
            }}
          >
            <PixelArt name={key} scale={3} />
            <div style={{ fontSize: 10, textAlign: "center", marginTop: 4, textTransform: "capitalize", color: "#6B5840" }}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Board({ frame, tasks, decorations, ownedDecor, completed, onOpen, onRemoveDecor, onPlaceDecor, onMoveDecor, onAdd, onDecorModeChange }) {
  const [tidy, setTidy] = useState(false);
  const [decorOpen, setDecorOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [placing, setPlacing] = useState(null);
  const corkRef = useRef(null);
  const movingRef = useRef(null);
  const paletteRef = useRef(null);

  const hasOwnedDecor = ownedDecor.length > 0;
  const ink = frame.name === "Twilight" ? "#6A6390" : "#8B795F";

  const setDecorMode = (open) => {
    setDecorOpen(open);
    onDecorModeChange?.(open);
  };

  useEffect(() => {
    if (!decorOpen) return;
    requestAnimationFrame(() => {
      paletteRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [decorOpen]);

  const pctFromEvent = (clientX, clientY) => {
    const rect = corkRef.current?.getBoundingClientRect();
    if (!rect) return { x: 50, y: 50 };
    return {
      x: clampPct(((clientX - rect.left) / rect.width) * 100),
      y: clampPct(((clientY - rect.top) / rect.height) * 100),
    };
  };

  const toggleDecor = () => {
    setDecorMode(!decorOpen);
    setTidy(false);
    setPlacing(null);
    setDragOver(false);
  };

  const toggleTidy = () => {
    setTidy((t) => !t);
    if (decorOpen) setDecorMode(false);
    setPlacing(null);
    setDragOver(false);
  };

  useEffect(() => {
    const onMove = (e) => {
      const m = movingRef.current;
      if (!m) return;
      const { x, y } = pctFromEvent(e.clientX - m.ox, e.clientY - m.oy);
      onMoveDecor(m.id, x, y);
    };
    const onUp = () => { movingRef.current = null; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [onMoveDecor]);

  const makeCardProps = (task) => ({
    onClick: decorOpen && placing ? undefined : () => onOpen(task),
    style: decorOpen && placing ? { pointerEvents: "none" } : undefined,
  });

  const handleCorkClick = (e) => {
    if (!placing) return;
    const { x, y } = pctFromEvent(e.clientX, e.clientY);
    onPlaceDecor(placing, x, y);
    setPlacing(null);
  };

  const handleCorkDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const type = e.dataTransfer.getData("application/x-cozy-decor");
    if (!type) return;
    const { x, y } = pctFromEvent(e.clientX, e.clientY);
    onPlaceDecor(type, x, y);
    setPlacing(null);
  };

  const startMoveDecor = (e, d) => {
    if (!decorOpen || tidy) return;
    e.stopPropagation();
    e.preventDefault();
    const rect = corkRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = rect.left + (d.x / 100) * rect.width;
    const py = rect.top + (d.y / 100) * rect.height;
    movingRef.current = { id: d.id, ox: e.clientX - px, oy: e.clientY - py };
  };

  return (
    <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* sign banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 2px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_DISPLAY, fontSize: 10, color: frame.name === "Twilight" ? "#6A6390" : "#8B795F" }}>
          {completed} task{completed === 1 ? "" : "s"} done ♡
        </div>
        {decorations.length > 0 && (
          <PixelButton color={tidy ? "#BFE3AE" : "#FFFBF1"} onClick={toggleTidy} style={{ fontSize: 8, padding: "6px 9px" }}>
            {tidy ? "✓ done" : "✦ tidy"}
          </PixelButton>
        )}
      </div>

      {/* framed corkboard */}
      <div
        style={{
          background: `linear-gradient(180deg, ${frame.frame}, ${frame.dark})`,
          padding: 12,
          borderRadius: 18,
          border: "3px solid rgba(120,95,70,.32)",
          boxShadow: "3px 5px 0 rgba(138,114,87,.2)",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >

        <div
          ref={corkRef}
          onClick={handleCorkClick}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleCorkDrop}
          style={{
            position: "relative",
            minHeight: 360,
            background: `${frame.cork}`,
            backgroundImage: `radial-gradient(${frame.corkDk} 1.5px, transparent 1.6px), radial-gradient(${frame.corkDk} 1px, transparent 1.2px)`,
            backgroundSize: "9px 9px, 14px 14px",
            backgroundPosition: "0 0, 5px 7px",
            border: "3px solid rgba(120,95,70,.22)",
            borderRadius: 12,
            boxShadow: "inset 0 0 16px rgba(138,114,87,.18)",
            padding: "26px 14px 18px",
            cursor: placing ? "crosshair" : decorOpen ? "default" : undefined,
            outline: dragOver ? "3px dashed #6FA84C" : decorOpen ? "2px dashed rgba(111,168,76,.45)" : undefined,
            outlineOffset: -4,
          }}
        >
          {/* decoration layer */}
          {decorations.map((d) => (
            <div
              key={d.id}
              onClick={() => tidy && onRemoveDecor(d.id)}
              onPointerDown={(e) => startMoveDecor(e, d)}
              style={{
                position: "absolute",
                left: `${d.x}%`,
                top: `${d.y}%`,
                transform: `rotate(${d.r}deg)`,
                zIndex: tidy || decorOpen ? 10 : 1,
                cursor: tidy ? "pointer" : decorOpen ? "grab" : "default",
                opacity: tidy ? 1 : 0.92,
                touchAction: decorOpen ? "none" : undefined,
              }}
            >
              <PixelArt name={d.type} scale={4} />
              {tidy && (
                <div style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, background: "#EC9494", color: "#fff", fontFamily: FONT_DISPLAY, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", borderRadius: "50%", zIndex: 11 }}>✕</div>
              )}
            </div>
          ))}

          {/* tasks */}
          {tasks.length === 0 && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 2,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "24px 16px", color: frame.ink,
              pointerEvents: decorOpen ? "none" : "auto",
            }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, marginBottom: 14 }}>board's empty!</div>
              <div style={{ fontSize: 22, marginBottom: 20, opacity: .8, maxWidth: 280 }}>pin your first task to get started ♡</div>
              <div style={{ pointerEvents: "auto" }}>
                <TextButton onClick={onAdd} color={ink}>+ pin a task</TextButton>
              </div>
            </div>
          )}

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", alignItems: "flex-start", pointerEvents: decorOpen && placing ? "none" : "auto" }}>
            {tasks.map((t) => (t.type === "poster" ? (
              <PosterCard key={t.id} task={t} cardProps={makeCardProps(t)} />
            ) : (
              <SquareCard key={t.id} task={t} cardProps={makeCardProps(t)} />
            )))}
          </div>
        </div>

      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 14 }}>
        {tasks.length > 0 && !decorOpen && (
          <TextButton onClick={onAdd} color={ink}>+ pin a task</TextButton>
        )}
        {!decorOpen && (
          <TextButton onClick={toggleDecor} disabled={!hasOwnedDecor} color={ink}>
            + decorate your board
          </TextButton>
        )}
      </div>

      {decorOpen && hasOwnedDecor && (
        <>
          <div ref={paletteRef}>
            <DecorPalette ownedDecor={ownedDecor} placing={placing} onPick={setPlacing} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12, paddingBottom: 8 }}>
            <TextButton onClick={toggleDecor} active color={ink}>done</TextButton>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- cards ---------- */

function SquareCard({ task, cardProps }) {
  const col = NOTE_COLORS[task.color] || NOTE_COLORS.cream;
  const pin = PIN_COLORS[task.pin] || PIN_COLORS.red;
  return (
    <div
      className={task.completing ? "" : "note-enter"}
      {...cardProps}
      style={{
        position: "relative",
        width: 116,
        minHeight: 116,
        background: col.bg,
        color: col.ink,
        padding: "16px 10px 10px",
        cursor: "pointer",
        transform: `rotate(${task.rot}deg)`,
        border: "3px solid rgba(120,95,70,.2)",
        borderRadius: 12,
        boxShadow: "2px 4px 0 rgba(138,114,87,.16)",
        userSelect: "none",
        animation: task.completing ? "done .7s ease-in forwards" : undefined,
      }}
    >
      <Pushpin color={pin.c} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, pointerEvents: "none", ...patternOverlay(task.pattern, col.ink) }} />
      {task.icon && (
        <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 6 }}>
          <PixelArt name={task.icon} scale={3} />
        </div>
      )}
      <div style={{ position: "relative", fontSize: 14, lineHeight: 1.25, wordBreak: "break-word", textAlign: "center", fontWeight: 700 }}>
        {task.title}
      </div>
    </div>
  );
}

function PosterCard({ task, cardProps }) {
  const col = NOTE_COLORS[task.color] || NOTE_COLORS.cream;
  const pin = PIN_COLORS[task.pin] || PIN_COLORS.red;
  const total = task.checklist?.length || 0;
  const done = task.checklist?.filter((c) => c.done).length || 0;
  return (
    <div
      className={task.completing ? "" : "note-enter"}
      {...cardProps}
      style={{
        position: "relative",
        width: 248,
        maxWidth: "100%",
        background: col.bg,
        color: col.ink,
        padding: "20px 14px 14px",
        cursor: "pointer",
        transform: `rotate(${task.rot}deg)`,
        border: "3px solid rgba(120,95,70,.2)",
        borderRadius: 12,
        boxShadow: "3px 5px 0 rgba(138,114,87,.16)",
        userSelect: "none",
        animation: task.completing ? "done .7s ease-in forwards" : undefined,
      }}
    >
      <Pushpin color={pin.c} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, pointerEvents: "none", ...patternOverlay(task.pattern, col.ink) }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, borderBottom: `2px dashed ${col.ink}66`, paddingBottom: 6, marginBottom: 8 }}>
        {task.icon && <PixelArt name={task.icon} scale={3} />}
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, wordBreak: "break-word" }}>{task.title}</div>
      </div>
      <div style={{ position: "relative" }}>
        {(task.checklist || []).slice(0, 6).map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 6, alignItems: "flex-start", fontSize: 13, marginBottom: 4, opacity: c.done ? 0.5 : 1 }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 9 }}>{c.done ? "☑" : "☐"}</span>
            <span style={{ textDecoration: c.done ? "line-through" : "none", wordBreak: "break-word" }}>{c.text}</span>
          </div>
        ))}
        {total > 6 && <div style={{ fontSize: 12, opacity: .6 }}>+{total - 6} more…</div>}
      </div>
      <div style={{ position: "relative", marginTop: 8 }}>
        <div style={{ height: 8, background: col.ink + "22", border: `2px solid ${col.ink}44`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: total ? `${(done / total) * 100}%` : "0%", background: col.ink + "aa", borderRadius: 6 }} />
        </div>
        <div style={{ fontSize: 11, marginTop: 3, textAlign: "right" }}>{done}/{total}</div>
      </div>
    </div>
  );
}

/* ============================================================
   modals
   ============================================================ */

function Overlay({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(74,58,42,.42)", zIndex: 150,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0 12px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          maxHeight: "88vh",
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box",
          background: "#FFFBF1",
          color: "#6B5840",
          ...PXBORDER(),
          borderRadius: "18px 18px 0 0",
          borderBottom: "none",
          padding: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function DetailModal({ task, onClose, onComplete, onEdit, onDelete, onToggle }) {
  if (!task) return null;
  const col = NOTE_COLORS[task.color] || NOTE_COLORS.cream;
  const isPoster = task.type === "poster";
  const allDone = isPoster && task.checklist.length > 0 && task.checklist.every((c) => c.done);
  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        {task.icon && <PixelArt name={task.icon} scale={4} />}
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, flex: 1, wordBreak: "break-word" }}>{task.title}</div>
        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>

      {isPoster && (
        <div style={{ background: col.bg, padding: 12, marginBottom: 12, border: "3px solid rgba(120,95,70,.18)", borderRadius: 12 }}>
          {task.checklist.map((c) => (
            <div
              key={c.id}
              onClick={() => onToggle(task.id, c.id)}
              style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", cursor: "pointer", borderBottom: "1px dashed rgba(120,95,70,.18)" }}
            >
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 12 }}>{c.done ? "☑" : "☐"}</span>
              <span style={{ fontSize: 14, textDecoration: c.done ? "line-through" : "none", opacity: c.done ? .55 : 1, wordBreak: "break-word" }}>{c.text}</span>
            </div>
          ))}
          {task.checklist.length === 0 && <div style={{ fontSize: 13, opacity: .6 }}>no items on this flyer</div>}
        </div>
      )}

      {!isPoster && task.notes && (
        <div style={{ fontSize: 14, marginBottom: 12, lineHeight: 1.4 }}>{task.notes}</div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <PixelButton color={allDone || !isPoster ? "#BFE3AE" : "#FCEEB8"} onClick={() => onComplete(task)}>
          ✓ complete {isPoster ? "(+" + (12 + task.checklist.length * 3) + ")" : "(+8)"}
        </PixelButton>
        <PixelButton color="#D8E9F6" onClick={() => onEdit(task)}>edit</PixelButton>
        <PixelButton color="#FFE2CE" onClick={() => onDelete(task.id)}>delete</PixelButton>
      </div>
    </Overlay>
  );
}

const closeBtn = {
  fontFamily: FONT_DISPLAY, fontSize: 11, background: "#FFE2CE", color: "#7A6346",
  width: 30, height: 30, ...PXBORDER(), cursor: "pointer",
};

function TaskForm({ state, editing, onClose, onSave }) {
  const [type, setType] = useState(editing?.type || "square");
  const [title, setTitle] = useState(editing?.title || "");
  const [notes, setNotes] = useState(editing?.notes || "");
  const [color, setColor] = useState(editing?.color || state.owned.notes[0]);
  const [pin, setPin] = useState(editing?.pin || state.owned.pins[0]);
  const [pattern, setPattern] = useState(editing?.pattern || "none");
  const [icon, setIcon] = useState(editing?.icon || "");
  const [items, setItems] = useState(editing?.checklist || [{ id: uid(), text: "", done: false }]);

  const ownedNotes = state.owned.notes;
  const ownedPins = state.owned.pins;
  const ownedPatterns = state.owned.patterns;

  const addItem = () => setItems((it) => [...it, { id: uid(), text: "", done: false }]);
  const setItem = (id, text) => setItems((it) => it.map((x) => (x.id === id ? { ...x, text } : x)));
  const delItem = (id) => setItems((it) => it.filter((x) => x.id !== id));

  const save = () => {
    if (!title.trim()) return;
    const base = {
      id: editing?.id || uid(),
      type, title: title.trim(), color, pin, pattern,
      icon: icon || null,
      rot: editing?.rot ?? rnd(-5, 5),
    };
    if (type === "poster") {
      base.checklist = items.filter((i) => i.text.trim()).map((i) => ({ id: i.id, text: i.text.trim(), done: i.done }));
    } else {
      base.notes = notes.trim();
    }
    onSave(base);
  };

  const col = NOTE_COLORS[color];

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12 }}>{editing ? "edit task" : "new task"}</div>
        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>

      {/* type toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <PixelButton color={type === "square" ? "#FCEEB8" : "#F0E8D6"} onClick={() => setType("square")} style={{ flex: 1 }}>□ quick</PixelButton>
        <PixelButton color={type === "poster" ? "#FCEEB8" : "#F0E8D6"} onClick={() => setType("poster")} style={{ flex: 1 }}>▤ poster</PixelButton>
      </div>

      <Label>{type === "poster" ? "flyer title" : "task"}</Label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === "poster" ? "Q3 content launch" : "small task; one and done mission"} style={inputStyle} maxLength={60} />

      {type === "square" && (
        <>
          <Label>note (optional)</Label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="extra details…" rows={2} style={{ ...inputStyle, resize: "vertical" }} maxLength={140} />
        </>
      )}

      {type === "poster" && (
        <>
          <Label>checklist</Label>
          {items.map((it, i) => (
            <div key={it.id} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 9, width: 14 }}>☐</span>
              <input value={it.text} onChange={(e) => setItem(it.id, e.target.value)} placeholder={`step ${i + 1}`} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} maxLength={70} />
              {items.length > 1 && (
                <button onClick={() => delItem(it.id)} style={{ ...closeBtn, width: 28, height: 28, fontSize: 9 }}>−</button>
              )}
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <PixelButton color="#D8E9F6" onClick={addItem} style={{ fontSize: 8, padding: "6px 9px" }}>+ add step</PixelButton>
          </div>
        </>
      )}

      {/* color */}
      <Label>note color</Label>
      <Swatches>
        {ownedNotes.map((k) => (
          <Swatch key={k} active={color === k} onClick={() => setColor(k)} style={{ background: NOTE_COLORS[k].bg }} />
        ))}
      </Swatches>

      {/* pin */}
      <Label>pushpin</Label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {ownedPins.map((k) => (
          <div
            key={k}
            onClick={() => setPin(k)}
            style={{
              width: 34, height: 44, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 9, border: pin === k ? "3px solid #8A7257" : "3px solid rgba(120,95,70,.2)",
              background: "#fff", boxShadow: pin === k ? `2px 2px 0 ${SOFT_SHADOW}` : "none",
              position: "relative", overflow: "visible",
            }}
          >
            <PushpinSvg color={PIN_COLORS[k].c} scale={2} />
          </div>
        ))}
      </div>

      {/* pattern */}
      {ownedPatterns.length > 1 && (
        <>
          <Label>pattern</Label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {ownedPatterns.map((k) => (
              <div key={k} onClick={() => setPattern(k)} style={{ position: "relative", width: 44, height: 36, background: col.bg, cursor: "pointer", borderRadius: 8, border: pattern === k ? "3px solid #8A7257" : "3px solid rgba(120,95,70,.2)" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 6, ...patternOverlay(k, col.ink) }} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* icon */}
      <Label>icon (optional)</Label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <div onClick={() => setIcon("")} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff", borderRadius: 8, border: icon === "" ? "3px solid #8A7257" : "3px solid rgba(120,95,70,.2)", fontSize: 11, fontFamily: FONT_DISPLAY, color: "#9A8466" }}>∅</div>
        {ICON_OPTIONS.map((k) => (
          <div key={k} onClick={() => setIcon(k)} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff", borderRadius: 8, border: icon === k ? "3px solid #8A7257" : "3px solid rgba(120,95,70,.2)" }}>
            <PixelArt name={k} scale={3} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <PixelButton color="#BFE3AE" onClick={save} disabled={!title.trim()} style={{ flex: 1 }}>{editing ? "save" : "pin it ♡"}</PixelButton>
        <PixelButton color="#F0E8D6" onClick={onClose}>cancel</PixelButton>
      </div>
    </Overlay>
  );
}

const Label = ({ children }) => (
  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 8, marginBottom: 6, marginTop: 2, color: "#9A8466" }}>{children}</div>
);
const inputStyle = {
  width: "100%", fontSize: 15, padding: "9px 11px", marginBottom: 12,
  background: "#fff", color: "#6B5840", border: "3px solid rgba(120,95,70,.22)", borderRadius: 9, outline: "none",
};
const Swatches = ({ children }) => <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>{children}</div>;
function Swatch({ active, onClick, style, round }) {
  return (
    <div onClick={onClick} style={{ width: 34, height: 34, cursor: "pointer", borderRadius: round ? "50%" : 9, border: active ? "3px solid #8A7257" : "3px solid rgba(120,95,70,.2)", boxShadow: active ? `2px 2px 0 ${SOFT_SHADOW}` : "none", ...style }} />
  );
}

/* ============================================================
   shop
   ============================================================ */

function Shop({ state, frame, canAfford, buy, equipFrame, placeDecor }) {
  const [tab, setTab] = useState("frames");
  const tabs = [
    ["frames", "boards"],
    ["notes", "colors"],
    ["pins", "pins"],
    ["patterns", "patterns"],
    ["decor", "decor"],
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontFamily: FONT_DISPLAY, fontSize: 11, color: frame.name === "Twilight" ? "#F1ECFB" : "#6B5840" }}>
        <PixelArt name="star" scale={3} /> the little shop ♡
      </div>

      {/* shop tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {tabs.map(([k, label]) => (
          <PixelButton key={k} color={tab === k ? "#FCEEB8" : "#FFFBF1"} onClick={() => setTab(k)} style={{ fontSize: 8, padding: "6px 8px" }}>{label}</PixelButton>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
        {tab === "frames" && Object.entries(FRAMES).map(([k, f]) => {
          const owned = state.owned.frames.includes(k);
          const equipped = state.equippedFrame === k;
          return (
            <ShopCard key={k} name={f.name} cost={f.cost} owned={owned}>
              <div style={{ height: 56, background: `linear-gradient(180deg,${f.frame},${f.dark})`, padding: 6, borderRadius: 9, border: "3px solid rgba(120,95,70,.22)" }}>
                <div style={{ height: "100%", background: f.cork, backgroundImage: `radial-gradient(${f.corkDk} 1.5px,transparent 1.6px)`, backgroundSize: "8px 8px", borderRadius: 5, border: "2px solid rgba(120,95,70,.18)" }} />
              </div>
              {owned ? (
                <PixelButton color={equipped ? "#BFE3AE" : "#D8E9F6"} onClick={() => equipFrame(k)} disabled={equipped} style={{ fontSize: 8, width: "100%", marginTop: 8 }}>
                  {equipped ? "✓ in use" : "use"}
                </PixelButton>
              ) : (
                <BuyBtn cost={f.cost} can={canAfford(f.cost)} onClick={() => buy("frames", k, f.cost)} />
              )}
            </ShopCard>
          );
        })}

        {tab === "notes" && Object.entries(NOTE_COLORS).map(([k, n]) => {
          const owned = state.owned.notes.includes(k);
          return (
            <ShopCard key={k} name={n.name} cost={n.cost} owned={owned}>
              <div style={{ height: 56, background: n.bg, borderRadius: 9, border: "3px solid rgba(120,95,70,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: n.ink, fontFamily: FONT_DISPLAY, fontSize: 9 }}>Aa</div>
              {owned ? <OwnedTag /> : <BuyBtn cost={n.cost} can={canAfford(n.cost)} onClick={() => buy("notes", k, n.cost)} />}
            </ShopCard>
          );
        })}

        {tab === "pins" && Object.entries(PIN_COLORS).map(([k, p]) => {
          const owned = state.owned.pins.includes(k);
          return (
            <ShopCard key={k} name={p.name} cost={p.cost} owned={owned}>
              <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFBF1", borderRadius: 9, border: "3px solid rgba(120,95,70,.18)" }}>
                <PushpinSvg color={p.c} scale={3} />
              </div>
              {owned ? <OwnedTag /> : <BuyBtn cost={p.cost} can={canAfford(p.cost)} onClick={() => buy("pins", k, p.cost)} />}
            </ShopCard>
          );
        })}

        {tab === "patterns" && Object.entries(PATTERNS).map(([k, p]) => {
          const owned = state.owned.patterns.includes(k);
          return (
            <ShopCard key={k} name={p.name} cost={p.cost} owned={owned}>
              <div style={{ position: "relative", height: 56, background: "#FFFBF1", borderRadius: 9, border: "3px solid rgba(120,95,70,.18)" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 6, ...patternOverlay(k, "#74624A") }} />
              </div>
              {owned ? <OwnedTag /> : <BuyBtn cost={p.cost} can={canAfford(p.cost)} onClick={() => buy("patterns", k, p.cost)} />}
            </ShopCard>
          );
        })}

        {tab === "decor" && DECOR_ITEMS.map(({ key: k, name, cost }) => {
          const owned = state.owned.decor.includes(k);
          return (
            <ShopCard key={k} name={name} cost={cost} owned={owned}>
              <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFBF1", borderRadius: 9, border: "3px solid rgba(120,95,70,.18)" }}>
                <PixelArt name={k} scale={4} />
              </div>
              {owned ? (
                <PixelButton color="#BFE3AE" onClick={() => placeDecor(k)} style={{ fontSize: 8, width: "100%", marginTop: 8 }}>+ place on board</PixelButton>
              ) : (
                <BuyBtn cost={cost} can={canAfford(cost)} onClick={() => buy("decor", k, cost, true)} />
              )}
            </ShopCard>
          );
        })}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, textAlign: "center", color: frame.name === "Twilight" ? "#cfc7e6" : "#74624A", opacity: .85 }}>
        earn leaves by completing tasks ♡ quick = +8, poster = +12 & up
      </div>
    </div>
  );
}

function ShopCard({ name, children }) {
  return (
    <div style={{ background: "#FFFBF1", padding: 10, ...PXBORDER(), color: "#6B5840" }}>
      {children}
      <div style={{ fontSize: 13, marginTop: 6, textAlign: "center", textTransform: "capitalize" }}>{name}</div>
    </div>
  );
}
function BuyBtn({ cost, can, onClick }) {
  return (
    <PixelButton color={can ? "#FCEEB8" : "#E7DFCD"} onClick={onClick} disabled={!can} style={{ fontSize: 8, width: "100%", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
      {cost} <PixelArt name="leaf" scale={2} />
    </PixelButton>
  );
}
const OwnedTag = () => (
  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 8, textAlign: "center", marginTop: 10, color: "#6FA84C" }}>✓ owned</div>
);

/* ============================================================
   cozy radio (youtube streams)
   ============================================================ */

function Radio({ frame, onListenTick }) {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(RADIO_PREFS_KEY) || "{}"); }
    catch { return {}; }
  })();

  const [stationIdx, setStationIdx] = useState(saved.stationIdx ?? 0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(saved.volume ?? 60);
  const playerRef = useRef(null);
  const mountRef = useRef(null);
  const stationIdxRef = useRef(stationIdx);
  const initStarted = useRef(false);
  const pendingPlay = useRef(false);
  const loadTimeoutRef = useRef(null);
  const readyRef = useRef(false);
  const onListenTickRef = useRef(onListenTick);
  onListenTickRef.current = onListenTick;
  stationIdxRef.current = stationIdx;
  readyRef.current = ready;

  const sub = frame.name === "Twilight" ? "#cfc7e6" : "#84714F";
  const station = RADIO_STATIONS[stationIdx] || RADIO_STATIONS[0];

  useEffect(() => {
    localStorage.setItem(RADIO_PREFS_KEY, JSON.stringify({ stationIdx, volume }));
  }, [stationIdx, volume]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => onListenTickRef.current?.(), 1000);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => () => {
    try { playerRef.current?.destroy?.(); } catch { /* ignore */ }
    playerRef.current = null;
    initStarted.current = false;
  }, []);

  const clearLoadTimeout = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  };

  const resetPlayer = () => {
    clearLoadTimeout();
    try { playerRef.current?.destroy?.(); } catch { /* ignore */ }
    playerRef.current = null;
    initStarted.current = false;
    setReady(false);
    setPlaying(false);
    setLoading(false);
    pendingPlay.current = false;
  };

  const createPlayer = () => {
    if (!mountRef.current || playerRef.current) return;
    const shouldAutoplay = pendingPlay.current;
    playerRef.current = new window.YT.Player(mountRef.current, {
      height: "200",
      width: "200",
      playerVars: {
        autoplay: shouldAutoplay ? 1 : 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (e) => {
          clearLoadTimeout();
          setReady(true);
          setLoading(false);
          setError("");
          e.target.setVolume(volume);
          const s = RADIO_STATIONS[stationIdxRef.current];
          if (s) loadRadioVideo(e.target, s);
          if (pendingPlay.current) {
            pendingPlay.current = false;
            e.target.playVideo();
          }
        },
        onStateChange: (e) => {
          const YT = window.YT;
          const isActive = e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.BUFFERING;
          setPlaying(isActive);
          if (isActive) setError("");
        },
        onError: (e) => {
          const codes = { 2: "invalid station", 5: "html5 error", 100: "video not found", 101: "embed blocked", 150: "embed blocked" };
          setError(codes[e?.data] || "station couldn't load — try another");
          setLoading(false);
          resetPlayer();
        },
      },
    });
  };

  const ensureYouTubeApi = (onReady) => {
    if (window.YT?.ready) {
      window.YT.ready(onReady);
      return;
    }
    if (window.YT?.Player) {
      onReady();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      onReady();
    };
    if (!document.getElementById("yt-iframe-api")) {
      const s = document.createElement("script");
      s.id = "yt-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      s.onerror = () => {
        setError("couldn't reach youtube — check your internet");
        setLoading(false);
        initStarted.current = false;
      };
      document.body.appendChild(s);
    }
  };

  const initPlayer = () => {
    if (playerRef.current || initStarted.current) return;
    initStarted.current = true;
    setLoading(true);
    setError("");
    loadTimeoutRef.current = setTimeout(() => {
      if (!readyRef.current) {
        setError("radio took too long — check internet and try again");
        setLoading(false);
        initStarted.current = false;
      }
    }, 25000);
    ensureYouTubeApi(createPlayer);
  };

  const loadStation = (idx) => {
    setStationIdx(idx);
    const next = RADIO_STATIONS[idx];
    if (!playerRef.current?.loadVideoById || !ready) return;
    loadRadioVideo(playerRef.current, next);
    if (playing) playerRef.current.playVideo();
  };

  const togglePlay = () => {
    if (!ready || !playerRef.current) {
      pendingPlay.current = true;
      initPlayer();
      return;
    }
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const onVolume = (v) => {
    setVolume(v);
    playerRef.current?.setVolume?.(v);
  };

  return (
    <div>
      {/* now playing */}
      <div style={{ background: "#FFFBF1", ...PXBORDER(), padding: "12px 14px", textAlign: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6, animation: playing ? "breathe 2.8s ease-in-out infinite" : "none" }}>
          <img
            src="./radio-icon.png"
            alt=""
            draggable={false}
            style={{ width: 56, height: 56, imageRendering: "pixelated" }}
          />
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, color: "#6B5840", marginBottom: 4 }}>{station.name}</div>
        <div style={{ fontSize: 12, color: sub, marginBottom: 10 }}>{station.vibe}</div>
        <PixelButton color={playing ? "#FCEEB8" : "#BFE3AE"} onClick={togglePlay} disabled={loading} style={{ minWidth: 120, fontSize: 9 }}>
          {loading ? "loading…" : playing ? "❚❚ pause" : "▶ play"}
        </PixelButton>
        {error && (
          <div style={{ fontSize: 11, color: "#B85C5C", marginTop: 10, lineHeight: 1.4 }}>{error}</div>
        )}
      </div>

      {/* volume */}
      <div style={{ background: "#FFFBF1", ...PXBORDER(), padding: "10px 14px", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontFamily: FONT_DISPLAY, fontSize: 8, color: sub }}>
          <span>volume</span>
          <span>{volume}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolume(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#A9DA8C" }}
        />
      </div>

      {/* stations */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 9, color: sub, marginBottom: 8 }}>pick a station</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {RADIO_STATIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => loadStation(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: stationIdx === i ? frame.frame : "#FFFBF1",
              border: `3px solid ${stationIdx === i ? frame.dark : "rgba(120,95,70,.25)"}`,
              borderRadius: 12,
              cursor: "pointer",
              textAlign: "left",
              boxShadow: stationIdx === i ? "2px 3px 0 rgba(138,114,87,.16)" : "none",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 8, color: "#6B5840", marginBottom: 3 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: sub }}>{s.vibe}</div>
            </div>
            {stationIdx === i && playing && (
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 7, color: "#6FA84C" }}>♪</span>
            )}
          </button>
        ))}
      </div>

      {/* hidden youtube player — fixed off-screen so iframe can't widen the layout */}
      <div
        ref={mountRef}
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          width: 200,
          height: 200,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ============================================================
   focus garden (pomodoro)
   ============================================================ */

function Focus({ frame, presetIdx, status, remaining, stage, sessions, minutes, onPick, onStart, onPause, onReset }) {
  const txt = frame.name === "Twilight" ? "#F1ECFB" : "#6B5840";
  const sub = frame.name === "Twilight" ? "#cfc7e6" : "#84714F";
  const p = FOCUS_PRESETS[presetIdx];
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  const frac = 1 - remaining / (p.min * 60000);
  const running = status === "running";
  const done = status === "done";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontFamily: FONT_DISPLAY, fontSize: 11, color: txt }}>
        <PixelArt name="leaf" scale={3} /> focus garden
      </div>

      {/* plant pot panel */}
      <div style={{ background: "#FFFBF1", ...PXBORDER(), padding: "18px 14px 16px", textAlign: "center" }}>
        <div
          key={stage}
          style={{ display: "flex", justifyContent: "center", animation: done ? "grow .6s ease-out" : running ? "breathe 3.2s ease-in-out infinite" : "grow .4s ease-out" }}
        >
          <PixelArt name={`plant${stage}`} scale={9} />
        </div>

        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: "#6B5840", marginTop: 12, letterSpacing: 1 }}>
          {done ? "♡ ♡ ♡" : `${mm}:${ss}`}
        </div>
        <div style={{ fontSize: 13, color: "#9A8466", marginTop: 4 }}>
          {done ? "bloomed! leaves earned ♡" : running ? "growing… stay focused" : status === "paused" ? "paused" : `${p.label} · ${p.min} min`}
        </div>

        {/* progress */}
        <div style={{ height: 10, background: "rgba(120,95,70,.15)", border: "2px solid rgba(120,95,70,.2)", borderRadius: 7, overflow: "hidden", margin: "12px 4px 0" }}>
          <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, frac * 100))}%`, background: "#A9DA8C", borderRadius: 7, transition: "width .4s linear" }} />
        </div>
      </div>

      {/* preset picker */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, marginBottom: 12 }}>
        {FOCUS_PRESETS.map((fp, i) => (
          <PixelButton
            key={fp.min}
            color={presetIdx === i ? "#FCEEB8" : "#FFFBF1"}
            onClick={() => !running && onPick(i)}
            disabled={running}
            style={{ flex: 1, flexDirection: "column", display: "flex", alignItems: "center", gap: 3, padding: "8px 4px" }}
          >
            {fp.min}m
            <span style={{ fontSize: 7, opacity: .8 }}>+{fp.reward}</span>
          </PixelButton>
        ))}
      </div>

      {/* controls */}
      <div style={{ display: "flex", gap: 8 }}>
        {status === "idle" && (
          <PixelButton color="#BFE3AE" onClick={onStart} style={{ flex: 1 }}>▶ start focus</PixelButton>
        )}
        {running && (
          <>
            <PixelButton color="#FCEEB8" onClick={onPause} style={{ flex: 1 }}>❚❚ pause</PixelButton>
            <PixelButton color="#FFE2CE" onClick={onReset}>reset</PixelButton>
          </>
        )}
        {status === "paused" && (
          <>
            <PixelButton color="#BFE3AE" onClick={onStart} style={{ flex: 1 }}>▶ resume</PixelButton>
            <PixelButton color="#FFE2CE" onClick={onReset}>reset</PixelButton>
          </>
        )}
        {done && (
          <PixelButton color="#BFE3AE" onClick={() => {}} disabled style={{ flex: 1 }}>✓ +{p.reward} leaves</PixelButton>
        )}
      </div>

      {/* stats */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <StatCard label="sessions" value={sessions} />
        <StatCard label="focus mins" value={minutes} />
      </div>

      <div style={{ marginTop: 14, fontSize: 12, textAlign: "center", color: sub, opacity: .9 }}>
        finish a session to grow your plant &amp; earn leaves ♡
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ flex: 1, background: "#FFFBF1", ...PXBORDER(), padding: "10px 8px", textAlign: "center", color: "#6B5840" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: "#6FA84C" }}>{value}</div>
      <div style={{ fontSize: 12, marginTop: 4, color: "#9A8466" }}>{label}</div>
    </div>
  );
}

/* ============================================================
   bottom tab bar
   ============================================================ */

function TabBar({ view, setView, frame }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", display: "flex", background: frame.frame, borderTop: "3px solid rgba(120,95,70,.32)", boxShadow: "0 -2px 0 rgba(138,114,87,.16)", boxSizing: "border-box" }}>
      <TabBtn active={view === "board"} onClick={() => setView("board")} label="board" />
      <TabBtn active={view === "focus"} onClick={() => setView("focus")} label="focus" />
      <TabBtn active={view === "radio"} onClick={() => setView("radio")} label="radio" />
      <TabBtn active={view === "shop"} onClick={() => setView("shop")} label="shop" />
    </div>
  );
}
function TabBtn({ active, onClick, label }) {
  return (
    <button onClick={onClick} style={{ flex: 1, minWidth: 0, background: active ? "rgba(255,255,255,.4)" : "transparent", border: "none", padding: "16px 4px 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 8, color: "#4A3C2A" }}>
      {label}
    </button>
  );
}
