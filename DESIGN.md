# Verisimilitude Studio: design tokens and styles

A reference for the values in `styles.css` and `script.js`. If you change a value in the code, change it here too.
Desktop is the default; "phone" means `max-width: 900px` (small tablets included).

## Principles

- Quiet, editorial, mostly black on white. Colour comes from the artwork (green, brown, dandelion blue-grey), not the UI.
- Two serif voices: Times for reading, Palatino for display.
- Motion is slow and soft: things blur and fade in, they don't slide hard. Everything respects `prefers-reduced-motion`.

## Colour

| Token | Value | Use |
|---|---|---|
| Ink | `#000` | Body text, headlines, focus ring |
| Soft grey | `#555` | Services list, Studio descriptions (phone), footer, small notes |
| Paper | `#fff` | Page background |
| Top bar wash | `rgba(255,255,255,.88)` + 12px backdrop blur | Phone top bar |
| Hairline | `rgba(0,0,0,.08)` | Top bar bottom border |
| Card shadow (desktop) | `-60px 60px 70px rgba(67,98,124,.2)` | Studio example frames |
| Card shadow (phone) | `0 20px 44px rgba(20,30,50,.2)` | Studio example frames |

The green/blue wash behind the phone scroll cue and the contact lockup is built from the animation's palette:
`rgba(86,114,132,.95)` stem blue, `rgba(118,152,118,.8)` stem green, `rgba(190,208,150,.5)` and `rgba(226,232,190,.38)` pale yellow-green.

## Type

| Token | Value |
|---|---|
| `--serif` | `"Times New Roman", Times, serif`, body and reading text |
| `--display` | `Palatino, "Palatino Linotype", "Book Antiqua", "URW Palladio L", serif`, titles, definition, footer, email |

### Desktop

| Style | Size | Notes |
|---|---|---|
| Body | 20px | Line-height normal |
| Lockup title ("Verisimilitude") | 44px Palatino | |
| Phonetic / definition | 24px | Phonetic is italic |
| Studio example headline | 24px | Regular weight |
| Studio example description | 18px | |
| About and Services text | 18px | About column max 500px, paragraphs 1 line apart |
| Services list | 14px italic `#555` | Line-height 1.7 |
| Rail name / `.name` | 32px Palatino | |
| Nav | 16px | Current item: italic + underline |
| Footer | 14px Palatino `#555` | |

### Phone

| Style | Size | Notes |
|---|---|---|
| Body text (About, Services, contact sentence, Studio note and descriptions) | 16px | |
| Studio example headline | 18px | |
| Studio example description | 16px italic `#555` | Same look as the Services list; full column width |
| Lockup title | 34px Palatino | |
| Phonetic / definition | 20px | |
| Studio statement ("Design studio based in…") | 26px / 1.25 Palatino | Centred |
| Top bar title | 20px Palatino | |
| Top bar "Menu" button | 16px | Opens the full-page menu |
| Menu links | 40px Palatino | Current page or section in italic + underline, 24px between items; the seed mark (`favicon.svg`, 28px) sits centred at the bottom; "*Student community only" note 13px italic `#555` |
| Scroll cue | 18px italic | |
| Contact email | Fitted by `script.js` (`fitEmail`) | Fills the column on one line, Palatino, 1px underline |

Text uses `text-wrap: pretty` so a single short word never sits alone on the last line.

## Layout

| Token | Desktop | Phone |
|---|---|---|
| `--gutter` (page margin) | 80px | 24px |
| `--rail` (left rail) | 376px | n/a (rail dissolves into one column) |
| `--grid-gap` | 24px, 12-column grid | n/a |
| Section padding-top | 150px | 100px |

Phone landing:

| Token | Value |
|---|---|
| `--art-h` | `92.593vw`, the visible part of the opening clip |
| `--lh` | Lockup height, kept current by `script.js` (116px default) |
| `--cue-h` | 112px reserved for the scroll cue |
| `--group-top` | 0px; the clip starts flush with the top of the screen |
| `--hero-h` | `max(100svh, art + 20px + lockup + cue)` |
| `--hero-min` | `art-h * .7`; the hero shrinks to this as you scroll, so the Studio statement rises under the top bar |
| `--hero-p` | 0 to 1 over one screen of scroll (eased); set by `script.js` |

### Phone spacing

| Space | Value |
|---|---|
| Hero text lockup under the art | 20px |
| Above the Studio statement | 24px |
| Below the Studio statement (to first example) | 96px |
| Between Studio examples | 112px |
| Frame to its headline + description | 36px |
| Headline to description | 6px |
| Last example to About section | 100px padding; the dandelion tucks up by 12% of its width (about 61px clear of the last description) |
| About text to the contact email | 215px, to match the visual gap above the dandelion (61px + about 154px of empty frame) |

## Internship page

`internship.html` reuses `styles.css` (body class `p-intern`). Left: studio name, statement, nav, then the "Student community only" note (13px italic) over an italic underlined "Internship program" link. Right: 500px text at 18px, then the role list (name left, italic "Apply →" right, `mailto:` links). The home rail carries the same note and link on desktop; on phones the menu carries the link.

## Footer

Phone: a stacked layout. Top row has the dandelion seed mark (`logo-mark.svg`, 26px) on the left and LinkedIn and X icons (20px, `#555`) on the right; below that the definition, then the copyright, all left-aligned (14px Palatino `#555`, 24px (the page gutter) between the top row and the definition, 56px above and 56px below the email, then 24px between the copyright and "Design studio"). Desktop: one row, mark, definition, copyright, then the icons (18px). The social links point at the LinkedIn and X home pages until the studio's profile URLs are added.

## Components

- **Opening hero.** Two clips: `hero-phone` (portrait, 1080 wide) and `hero-full` (16:9, desktop). The lockup blurs in at `data-intro-at="3.6"` seconds, the first blow. Scroll is locked until the text is mostly in.
  - Autoplay fallback (phones): if the video won't play (Low Power Mode, data saver), the still `opening-hero-phone-still.webp` shows and the lockup comes in straight away.
- **Studio examples.**
  - Desktop: four frames at varied positions and widths; the caption fades in on hover or focus beside each frame.
  - Phone: a single column. Square frames, with the first one narrower (72%, max 300px). Description sits below with no toggle button. Cards scale, fade and blur as they pass the middle of the screen, and slide up 56px as they arrive.
- **About dandelion.** `solo-dand-3` plays once on scroll-in and rests on its last frame, which matches the first. If the phone refuses to play it, it rests on `solo-dand-3.webp`.
- **Phone top bar.** Fixed; slides in after the hero; title on the left, "Menu" on the right (always in on the Internship page). Menu opens a full-page white overlay of large links (From the Studio, About, Services, Internship program) that fades and blurs in and out (.45s). The top bar (title and button) is the one thing that does not fade: it stays in place above the overlay and Menu becomes Close. Close, Esc or choosing a link dismisses it. The current section is italic: Studio as soon as the landing has left the screen, About and Services when their sections reach the middle. Code in `menu.js`.
- **Contact lockup.** Email in Palatino, sized to the column, with a soft green wash behind it (blurred 28px, 72vw wide, 190px tall).
- **Seeds.** Dandelion seeds float over the whole page and blow away when touched.

## Motion

| Token | Value |
|---|---|
| Intro text blur-in | 1.2s ease, lines staggered .35s |
| Section blur | 14px at fully out |
| Card arrival | 1s `cubic-bezier(.2, .7, .3, 1)` |
| Top bar slide | .45s `cubic-bezier(.2, .7, .3, 1)` |
| Scroll cue nudge | 1.8s ease-in-out, 7px |
| Stagger blur-in (About, Services) | 1s, translate 16px |

## Accessibility

- Focus ring: 2px solid `#000`, 4px offset, on links and buttons.
- Skip link and a "Pause dandelion animation" button appear on keyboard focus.
- The hero videos are `aria-hidden`; the text lockup carries the content.
- `prefers-reduced-motion`: videos stay on their stills, transitions and staggers are off.
- Soft grey `#555` on white is about 7:1, well above 4.5:1.

## Assets

`images/`: `opening-hero.*` (desktop), `opening-hero-phone-tall.*` (phone), `opening-hero-phone-still.webp` (phone fallback still), `opening-hero-first.webp` (desktop poster), `solo-dand-3.*` (About dandelion), `work-*` and `threadscape.*` (Studio examples).
