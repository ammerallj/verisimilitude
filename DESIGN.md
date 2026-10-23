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
| Lockup title ("Verisimilitude") | 32px Palatino | The same size before and after the blow, as in the intro (`.name`); " Studio" is revealed beside it when she lands |
| Lockup phonetic | 18px | Italic, soft grey `#555`, 10px under the title; fades out when she falls (1.5s) |
| Lockup definition | 15px | Ink, 8px under the phonetic, same size as the studio line, on a 310px measure so it is as wide as the finished lockup (title 301px, studio line 295px); fades out when she falls (1.5s) |
| Lockup studio line | 15px | Ink, 336px measure, is revealed when she lands (2.5s), 20px under the title (as `.desc`) |
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
| Lockup phonetic / definition / studio line | 18px / 20px / 20px | Same sequence as the web: phonetic (soft grey `#555`) and definition fade out when she falls, then " Studio" and the studio line (at the phonetic's top, `top: 34px * 1.15 + 4px`) are revealed. The swap eases the registered `--so` and `--sw` properties. The old centred statement below the hero is gone, so the studio line is not repeated |
| Top bar title | 20px Palatino | |
| Top bar "Menu" button | 16px | Opens the full-page menu |
| Menu links | 40px Palatino | Current page or section in italic + underline, 24px between items; the seed mark (`favicon.svg`, 28px) sits centred at the bottom; "*Student community only" note 13px italic `#555` |
| Scroll cue | 18px italic | Also on desktop (18px italic, centred under the left lockup, 384px wide from the page gutter); is revealed (0.8s fade) the moment the opening count reaches 100, the same moment scroll unlocks; gone after ~180px of scroll |
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
| `--lockup-gap` | 48px from the art to the lockup (was 20px) |
| `--hero-h` | `max(100svh, art + lockup-gap + lockup + cue)` |
| `--hero-min` | `art-h * .7`; the hero shrinks to this as you scroll, so the first example rises under the top bar |
| `--hero-p` | 0 to 1 over one screen of scroll (eased); set by `script.js` |

### Phone spacing

| Space | Value |
|---|---|
| Hero text lockup under the art | 48px (`--lockup-gap`) |
| Hero to first example | 24px above and 96px below the (now empty) statement slot |
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

- **Opening hero.** Two clips: `hero-phone` (portrait, 1080 wide) and `hero-full` (16:9, desktop). The title, phonetic and definition are part of the page from the first paint (no script or video needed; `intro-title` is on `<body>` in the HTML) and simply display, with no fade in. When she falls out of the bag (`data-fall-at="1.5"` seconds) the phonetic and definition fade and blur out (0.9s, `--so`); when she has landed (`data-land-at="2.5"` seconds, the same moment the count reaches 100 and scroll unlocks) " Studio" and "Design studio based in San Francisco and Seattle creating honest and simple digital experiences." are revealed together (1s after a 0.15s pause, `--sw`). All at the final lockup's sizes (title 32px, 15px lines), kept vertically centred on the finished lockup, so nothing moves or resizes. If the video never plays, the same change happens when the opening gives up and shows the still. That title and studio line are the resting state of the landing (including on return, and at once when the opening is skipped). Scroll is locked until she has landed: the count reaches 100, scroll unlocks, the scroll cue appears and the final lockup is revealed, all together.
  - Opening progress: a 13px Palatino `0/100` count centred 44px above a 2px black line running edge to edge along the bottom of the screen. `script.js` drives it from the video's playback toward the first blow (up to 90%), then runs it out to 100 as the text arrives; it fades out when scroll unlocks. Only shown while the opening holds scroll.
  - Both clips stop at `data-rest-at="14.5"` seconds and rest on the bare dandelion: the regrow at the end of the clip is cut, on the first visit and on every return.
  - Coming back to the top she just blows again: the clip plays from `data-intro-at` (3.6s) to `RETURN_END` (6.5s, seeds in the air) at normal speed and rests on that frame. Never the whole sequence, and not the bag, the long tail or the regrow.
  - Coming back to the top, the hero picture fades in at once (no delay) so the landing is never blank.
  - Autoplay fallback (phones): if the video won't play (Low Power Mode, data saver), the still `opening-hero-phone-still.webp` shows and the lockup comes in straight away.
- **Scroll cue (desktop, mouse).** Once the pointer moves, "Scroll down" with its arrow below (18px italic, as on phones) follows it, centred 26px under the pointer and kept 120px in from the window edges, on the same green-to-blue watercolour wash as the phone cue (76 by 116px, a small tall oval like the phone wash, blurred 22px). It fades out with the same scroll as the fixed cue, and the fixed cue is hidden. Hidden until the count reaches 100. Touch and keyboard visitors keep the fixed cue.
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
| Lockup swap (desktop) | Fade out .9s when she falls; reveal 1s `cubic-bezier(.65, 0, .35, 1)` (`--lk-ease`) after a 0.15s pause when she lands | Light 5px blur and no size or position change. The scroll handover keeps its own quicker, 14px-blur fades |
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
