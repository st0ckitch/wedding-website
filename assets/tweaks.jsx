/* Tweaks for Giorgi & Anna — applies values to CSS variables on :root.
   The site itself is vanilla; this only mounts the panel + syncs vars. */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "sage",
  "heading": "Vardi Serif",
  "veil": 30
}/*EDITMODE-END*/;

const ACCENTS = {
  sage:  { accent: "#8c9678", ink: "#3f4733", label: "Sage" },
  clay:  { accent: "#bd8268", ink: "#5a3527", label: "Clay" },
  blue:  { accent: "#7e94a6", ink: "#33414e", label: "Dusty blue" },
  gold:  { accent: "#b69653", ink: "#54421f", label: "Antique gold" },
  mauve: { accent: "#a8849a", ink: "#4d3344", label: "Mauve" }
};

const HEADINGS = {
  "Vardi Serif": "'Vardi Serif', 'Sylfaen', Georgia, serif",
  "FiraGO":      "'FiraGO', 'Sylfaen', sans-serif"
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const root = document.documentElement.style;
    const a = ACCENTS[t.accent] || ACCENTS.sage;
    root.setProperty('--accent', a.accent);
    root.setProperty('--accent-ink', a.ink);
    root.setProperty('--display', HEADINGS[t.heading] || HEADINGS['Vardi Serif']);
  }, [t.accent, t.heading]);

  useEffect(() => {
    const scrim = document.querySelector('.hero__scrim');
    if (!scrim) return;
    const v = (t.veil ?? 30) / 100;
    scrim.style.background =
      `linear-gradient(180deg, rgba(28,25,20,${(v).toFixed(2)}) 0%, rgba(28,25,20,${(v*0.4).toFixed(2)}) 35%, rgba(28,25,20,${(v*0.73).toFixed(2)}) 70%, rgba(28,25,20,${(v*1.5).toFixed(2)}) 100%)`;
  }, [t.veil]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent colour" />
      <TweakColor
        label="Accent"
        value={(ACCENTS[t.accent] || ACCENTS.sage).accent}
        options={Object.values(ACCENTS).map((a) => a.accent)}
        onChange={(hex) => {
          const key = Object.keys(ACCENTS).find((k) => ACCENTS[k].accent === hex) || 'sage';
          setTweak('accent', key);
        }}
      />
      <TweakSection label="Typography" />
      <TweakSelect
        label="Headings"
        value={t.heading}
        options={Object.keys(HEADINGS)}
        onChange={(v) => setTweak('heading', v)}
      />
      <TweakSection label="Hero" />
      <TweakSlider
        label="Photo overlay"
        value={t.veil}
        min={10} max={60} step={5} unit="%"
        onChange={(v) => setTweak('veil', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
