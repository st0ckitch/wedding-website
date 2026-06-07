# გიორგი და ანა — Wedding Website

A mobile-first wedding website, fully localized in Georgian (ქართული).

## Features
- **Fonts (self-hosted):** [Vardi Serif](https://typeface.ge) for titles, [FiraGO](https://github.com/bBoxType/FiraGO) (Latin + Georgian subset) for body text.
- **Georgian localization** throughout, including dynamic RSVP and gift-contribution messages.
- **Responsive / mobile-optimized** layout with safe-area support.
- Countdown, RSVP form (saved to `localStorage`), gift registry with contribute modal, FAQ accordion, and a photo gallery.

## Structure
```
Giorgi & Anna.html              # main page (links to assets/)
Giorgi & Anna (standalone).html # single-file export (original bundle)
assets/
  styles.css                    # styles + @font-face
  script.js                     # interactions
  tweaks.jsx                    # optional design panel
  fonts/                        # Vardi + FiraGO web fonts (woff2)
tweaks-panel.jsx                # optional design panel UI
```

## Local preview
```bash
python3 -m http.server 4610
# then open http://localhost:4610/Giorgi%20%26%20Anna.html
```
