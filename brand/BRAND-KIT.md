---
type: brand-kit
project: Small Pot Stained Glass
version: 1.0
updated: 2026-07-26
---

# Small Pot - brand kit

How Small Pot looks and sounds, across the links site, Instagram, TikTok, class
listings, custom orders, and the physical pieces that leave the studio.

**Companion files**
- `tokens.css` - drop-in color and type tokens. Replaces the top half of
  `src/index.css`.
- `brand-kit.html` - the visual version of this document, tabbed by round.

**Important:** the palette was not invented. Every value below was sampled out of
`public/logo.png`, the stained-glass teapot Lisa already uses. The dark ground,
the brown neutrals, the mustard tagline and the Crimson Pro / Lato pairing that
are already on the site all stay. Nothing published becomes wrong.

Sampled anchors, with the share of the logo they cover:

| Sampled | Hex | Where in the logo |
|---|---|---|
| Pot body, deep facet | `#1C3008` | 53.6% of the dark pixels. Also the came lines |
| Pot body, lit facet | `#28440C` | 17.7% of the dark pixels |
| Handle | `#483010` | The wooden grip |
| Flower | `#642438` | The one warm color in the whole mark |
| Sparkles | `#F8E834` | The four stars |
| Panes | `#EAF6F6` | ~40% of the mark, pale glass |

---

## 1. Positioning

**The one line the whole brand answers to:** stained glass looks like something
you buy, and it is something you can be taught to make. Lisa does both, and the
teaching is the part almost nobody else leads with.

| | |
|---|---|
| **Brand line** | Made one piece at a time. |
| **Classes line** | Come make one with me. |
| **Plain descriptor** (profiles, meta tags, bios) | Stained glass handcrafted in Virginia. |
| **Maker** | Lisa Stephen, Lynchburg VA |
| **Audience** | People who want one piece for their own window, people looking for a class, and other makers. |
| **Promise** | Cut, foiled and soldered by hand, by the person you are talking to. |
| **Who it lifts** | Other glass artists (10 of them get their own page and their own links) and beginners who have never touched a glass cutter. |
| **Personality** | Warm, botanical, unhurried, handmade. A kitchen table with a project on it, not a boutique. |

The teaching and the artists page are the distinguishing act. Most maker brands
point every link back at their own shop; this one sends people to ten other
artists and to two class registrations it does not own. Keep that. It is the
reason to follow the account.

The existing tagline, "stained glass handcrafted in virginia," is already right.
It says the craft, the fact that a person made it, and where. It stays as the
plain descriptor everywhere a profile needs one line.

---

## 2. Where it stood before this kit (the audit)

| Surface | State | Action |
|---|---|---|
| **Logo** | Stained-glass teapot, arched frame, four sparkles, a wine flower. Warm and specific. | **Keep.** It is the whole palette, and this kit is built out of it. |
| **Color** | "Dark academia" browns with a green called `--color-teal` (it is a moss green) and a mustard. Chosen deliberately, but drifted from the logo. | **Retheme** with `tokens.css`. Same idea, values pulled back to the logo. |
| **Buttons** | Green fill `#6b8e4e` under cream text `#e8dcc4` measures **2.76:1**. Hover lightens the fill to `#7fa85f` and drops it to **2.02:1**. | **Fix first.** Every button on the landing page. See below. |
| **Links** | `#8b6f47` on the ground measures **3.88:1**, under the 4.5:1 body-text line. | **Lighten** to `#BFA070` (7.36:1). |
| **Focus ring** | Mustard `#d4a017` outline, and buttons are green-filled. Mustard on that fill measures **1.13:1**. Keyboard focus is invisible on the one control people use. | **Replace** with the two-ring spec in section 6. |
| **Favicon** | The full teapot at 32px. 344 of 1024 pixels carry any ink; the arch, the panes, the sparkles and the flower all collapse into green. | **Size tiers.** Reduced mark below 48px. |
| **Off-token colors** | `#8a8272` hardcoded in the footer (4.12:1, under AA), `#ff4444` hardcoded twice for form errors, and `src/assets/react.svg` still carries the React cyan `#00d8ff`. | **Replace** the first two with tokens; delete `react.svg` and `public/vite.svg`, which nothing references. |
| **Type weight** | `font-weight: 300` used twice on a near-black ground, where light strokes thin out and lose definition. | **Floor of 400.** See section 4. |
| **Hero type** | `text-shadow: 2px 2px 4px rgba(0,0,0,0.7)` on the h1 and tagline, over a gradient that a 65% overlay has already flattened. | **Drop the shadow.** It is compensating for a problem the overlay solved. |
| **`/home`** | Not linked from anywhere (`/` redirects to `/links`, and the footer route list excludes it). Carries a placeholder gallery of Lucide icons labelled "(In Progress)" and the only Title-Case boilerplate copy on the site. | **Fix or delete.** Do not leave it reachable as-is. |

**Already right and worth protecting:**

- **The lowercase house voice** on `/links` and `/custom-orders` ("take a class
  with me", "thank you!", "i'll be in touch soon"). It sounds like a person. It
  is the voice; `/home` is the outlier.
- **The mustard tagline** at `#d4a017`, which measures 7.68:1 and passes AAA.
- **The brown neutrals.** `--color-secondary: #4a2c1a` sits within three points
  of the logo handle's `#483010`. Whoever picked it was looking at the logo.
- **The artists page.** Ten artists, their own logos, their own links.
- **The dark ground.** Glass is a transmitted-light material. It reads as glass
  when the field behind it is dark and the color glows through, and it reads as
  a sticker on white. Keep the site dark. The light "Pane" set below is for
  print, email and hang tags.

---

## 3. Color

Five ramps, all sampled from the logo, each named after the part it came from.

### Fern (the brand ramp)

The pot body. This is the primary.

| Token | Hex | Use |
|---|---|---|
| `fern-50` | `#EFF7E4` | Faintest wash |
| `fern-100` | `#D8ECC4` | |
| `fern-200` | `#B4DA8E` | **Button hover fill.** 12.08:1 under ink |
| `fern-300` | `#8CC258` | **Button fill.** 9.02:1 under ink, 8.66:1 against the ground |
| `fern-400` | `#66A335` | Accent text on dark, 5.95:1 |
| `fern-500` | `#4A7F1E` | |
| `fern-600` | `#356013` | |
| `fern-700` | **`#28440C`** | Sampled, pot lit facet |
| `fern-800` | **`#1C3008`** | Sampled, pot deep facet. **The print/one-color green** |
| `fern-900` | `#0E1A04` | |

### Oak (warm neutrals)

The handle, and the ground the site already uses.

| Role | Hex | Contrast on ground | Use |
|---|---|---|---|
| Ground | `#1A1410` | - | Page ground. Already published, unchanged |
| Surface | `#2A2218` | - | Cards, buttons, inputs. Already published |
| Text | `#E8DCC4` | 13.43:1 | Body and headings. Already published |
| Text muted | `#C4B5A0` | 9.09:1 | Secondary text. Already published |
| Link | `#BFA070` | 7.36:1 | **Replaces `#8b6f47`** |
| Control border | `#8A7660` | 4.20:1 on ground, 3.61:1 on surface | **Inputs and buttons.** Passes the 3:1 that WCAG 1.4.11 asks of a control boundary |
| Hairline | `#4A3C2A` | 1.71:1 | Dividers only. Decorative, so the 3:1 rule does not apply |
| Oak mid | `#483010` | - | Sampled, the handle. Print and fills |
| Ink | `#141005` | - | Text **on** any light fill (fern, sparkle, pane) |

### Sparkle (amber)

The four stars in the logo, and the mustard already on the tagline.

| Token | Hex | Contrast on ground | Use |
|---|---|---|---|
| `sparkle-700` | `#B8860B` | 5.60:1 | |
| `sparkle-600` | **`#D4A017`** | 7.68:1 | Already published. The type accent, taglines, focus ring |
| `sparkle-500` | `#E6B830` | 9.78:1 | Hover |
| `sparkle-400` | **`#F8E834`** | 14.40:1 | Sampled, the sparkles. Graphic device only |

**Amber is a dark-ground color.** `#B8860B` on the pale ground measures 2.95:1
and fails. On anything light, amber is decoration and the type goes fern-800 or
oak.

### Wine (the flower)

The only warm color in the logo, and it appears nowhere in the current CSS.

| Token | Hex | Use |
|---|---|---|
| `wine-800` | **`#642438`** | Sampled. **A fill, not a text color.** 1.61:1 as text on the ground, but 8.35:1 under cream text as a fill |
| `wine-600` | `#8A3149` | |
| `wine-500` | `#B04A63` | Large type and non-text only, 3.48:1 |
| `wine-400` | `#C97385` | The text step on dark, 5.45:1 |
| `wine-300` | `#E0A3B0` | 8.72:1 |

Wine's job is the one ornamental accent: the heart on custom orders, a filled
tag or chip, the hang tag, a small mark on packaging. It is the color that makes
the brand feel handmade rather than agricultural, which is where an all-green
palette lands.

### Pane (the light ground)

The pale glass, for the surfaces the dark site does not cover.

| Role | Hex | Use |
|---|---|---|
| Pane | `#EAF6F6` | Print, hang tags, care cards, email, invoices |
| Pane bright | `#F6FCFC` | |

On `#EAF6F6`: fern-800 measures 12.88:1, wine-800 10.27:1, oak mid 11.41:1. All
comfortable. Amber does not go here.

### Semantic color is separate from brand color

| State | Hex | Contrast on ground |
|---|---|---|
| Error | `#E8705F` | 6.00:1 |
| Success | `#8CC258` (fern-300) | 8.66:1 |

Error replaces the two hardcoded `#ff4444`. `#ff4444` was not failing contrast
(5.35:1); it is being replaced because it is a stock web red sitting in a warm
palette, and because it is written into two stylesheets by hand. `#E8705F` is
warm enough to belong and bright enough that nobody confuses it with wine.

Never let wine mean "error." Wine means Small Pot.

### Rules

- **Any green fill carries ink `#141005`, never cream.** Cream on green is the
  2.76:1 bug.
- **Hover gets lighter, and contrast goes up with it.** The current hover
  lightens the fill and drops contrast to 2.02:1, which is backwards.
- Never pure `#000000` for text or `#FFFFFF` for a ground. Ink `#141005` and
  pane `#EAF6F6` are what keep it warm.
- On the dark ground the green accent is fern-400 or lighter. fern-800 against
  the ground measures 1.2:1 and disappears.
- Amber on dark, fern and oak on light.
- The ground stays `#1A1410`. It is published, it suits transmitted-light
  material, and the ferns photo overlay is built on it.

---

## 4. Typography

Crimson Pro and Lato stay. Somebody picked them, they are both free, they are
already loading, and Crimson Pro's bookish old-style warmth suits the craft. The
problems are settings, not families.

### The rule that fixes most of it

**On the dark ground, add one weight step.** Light type on a near-black field
looks thinner than the same type on paper, because the bright strokes bleed
outward into the dark. Crimson Pro is a high-contrast old-style face with thin
hairlines, so it feels this most. What reads as 400 on paper wants 500 or 600
here.

Concretely: `font-weight: 300` is used twice today. **Floor of 400, everywhere.**

### Scale

| Role | Face | Size / line | Notes |
|---|---|---|---|
| Wordmark | Crimson Pro 600 | 28-32 / 1.1 | Lowercase. Letter-spacing 0.01em |
| Page title | Crimson Pro 600 | 28-32 / 1.15 | `text-wrap: balance`, no shadow |
| Section head | Crimson Pro 500 | 20-24 / 1.25 | |
| Button / link label | Lato 400 | 14-15 / 1.3 | Lowercase |
| Body | Lato 400 | 16 / 1.6 | Cap line length near 66 characters |
| Meta, price, class time | Lato 400 | 13 / 1.4 | **Tabular figures required** |
| Micro label | Lato 700 | 11 | Uppercase, letter-spacing 0.08em |

**Tabular figures.** Class times, dates, prices and dimensions stack in columns
on the class pages and any price list. `font-variant-numeric: tabular-nums`.
Proportional digits make a list of times look uneven.

### Fallback stack

Most inboxes will not load a webfont, and neither will a print shop's PDF
pipeline if the font is not embedded.

```
"Crimson Pro", Georgia, "Iowan Old Style", serif
"Lato", -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

Georgia is warm, is on every machine, and still looks chosen. Never let it fall
through to Times.

### Never

- No `text-shadow` on display type. Two uses today, both over a gradient a 65%
  overlay has already flattened. If type needs a shadow to be readable, the
  ground behind it is the problem.
- No letter-spacing above 2px on lowercase body copy. The tagline runs 2px and
  that is the ceiling.

---

## 5. Logo and mark

The teapot stays as drawn. It is warm, it is specific, it names the business, and
it is where the whole palette came from. What it needs is size tiers.

### Size tiers

At 32px the current favicon carries ink on 344 of its 1024 pixels, and the arch,
the panes, the sparkles and the flower all merge into one green blob. Nine
elements do not survive a favicon.

| Size | Mark |
|---|---|
| **180px and up** | Full mark: arched frame, panes, pot, handle, sparkles, flower |
| **48 to 180px** | Frame and panes dropped. Pot, handle, flower, one sparkle |
| **16 to 32px** | Pot silhouette in flat fern-800, with the flower as a single wine dot. Nothing else |

The pot silhouette is the right reduction because the pot is the name. A sparkle
or a flower alone would be prettier and would stop meaning "Small Pot."

### Lockups

- **Primary:** the mark alone, on the dark ground.
- **Horizontal:** mark plus "small pot" in Crimson Pro 600 lowercase, gap equal
  to a quarter of the mark's width.
- **One-color:** fern-800 `#1C3008` on pane, or pane on fern-800. For stamps,
  vinyl, embroidery, and anything a print shop quotes per color.

### Rules

- Clear space on all sides is half the mark's height.
- Minimum sizes: mark 16px, horizontal lockup 120px wide.
- On a photograph the mark sits on a solid fern-800 or pane plate, never
  directly on the image. Glass photos are busy by nature.
- Reversed version is the one-color mark in pane on fern-800.

### Never

- No drop shadow, no glow, no bevel.
- No rotation, no stretching, no outline-only version.
- Do not recolor the pot per season or per product. The pot is the fixed point.
- Do not put the wordmark in all caps. Lowercase is the voice.

---

## 6. Components

### Link button

The `/links` page is the landing (`/` redirects to it), so this is the most-used
object in the brand.

| State | Fill | Border | Label |
|---|---|---|---|
| Rest | surface `#2A2218` | control `#8A7660` | text `#E8DCC4` |
| Hover | fern-300 `#8CC258` | fern-300 | **ink `#141005`** |
| Active | fern-200 `#B4DA8E` | fern-200 | ink |

Radius 4px, as today. The label says what happens, so "take a class with me"
rather than "classes."

### Focus ring

Buttons are filled, and a single-color ring cannot pass on both the dark ground
and a light green fill. Mustard on fern-300 measures 1.13:1.

**Two rings, always:**

```css
:focus-visible {
  outline: 2px solid var(--sp-ink);      /* inner, holds on light fills */
  outline-offset: 0;
  box-shadow: 0 0 0 4px var(--sp-sparkle-600); /* outer, holds on the ground */
}
```

One of the two always has contrast, whatever it lands on.

Also: `.form-group input:focus` currently sets `outline: none` and only changes
the border color. Keep the border change, and add the ring back.

### Form field

Background surface, border control `#8A7660` (3.61:1 on surface, which is the
3:1 a control boundary needs). Placeholder at text-muted, and no lower than 60%
opacity. Error text in `#E8705F` with the message under the field it belongs to.

### Artist card

Ten of them, alphabetical. Logo tile filled with the artist's own primary color,
sample image, name, and their social icons. **The artists' own colors win inside
their card.** Small Pot's palette runs the frame around them, never the tile.
Recoloring another maker's mark to match this palette would be the wrong move.

### Hang tag and care card

Does not exist yet, and every piece that leaves the studio should carry one.
Light ground, since it is print.

- Pane `#EAF6F6` stock, 2 x 3.5 in.
- One-color mark in fern-800, wordmark under it.
- Back: "made one piece at a time in Lynchburg, VA", the Instagram handle, and
  two lines of care ("clean with a dry cloth; no ammonia").
- A wine `#642438` dot or rule as the one warm mark.

---

## 7. Voice

Lowercase, warm, first person, and specific about the work. The `/links` and
`/custom-orders` pages already have it. Keep that and bring `/home` to match.

Underneath, the same rules as everything else: plain words, actual numbers, no
hype, **no em dashes**.

| Not this | This |
|---|---|
| Welcome to Small Pot, where the ancient art of stained glass meets contemporary design. | i cut, foil and solder every piece by hand in lynchburg. |
| Each piece is meticulously handcrafted in our studio, combining traditional techniques with modern aesthetics. | copper foil and lead came, the same way it has been done for a hundred years. |
| Gallery Wall (In Progress) | *(nothing, until there are photos)* |

**"Our studio" is one person.** The fake plural is the single clearest tell on
the site that the copy was not written by the maker. It is "i" and "my studio."

**Always**
- First person, lowercase, contractions welcome.
- Say the size, the glass, the hours, the price. Specifics are the proof.
- Name the other artists and the class venues. That is the point of those pages.
- Say when you do not know. "i will need to see the window first" builds trust.

**Never**
- **No em dashes.** Comma, semicolon or hyphen.
- No "ancient art," no "meets contemporary design," no "meticulously." Craft
  copy fails by reaching for the ceremonial word.
- No "our" for one person.
- No urgency that is not true. If a class has three seats left, say three.

### Photography

Stained glass is a transmitted-light material, and a photo of it lying flat on a
table lit from the front is a photo of a gray object.

- **Shoot it backlit**, in a window or against a light box. That is the rule.
- Phone-camera quality from the actual studio beats a polished stock shot.
- **Never generated imagery.** Nothing in this brand is generated, and one AI
  image on a handmade-craft account undoes the whole premise.
- Show hands and the bench sometimes. Work in progress is the proof that a person
  is doing this.

---

## 8. Channel specs

| Surface | Assets and sizes | What must be true |
|---|---|---|
| **Links site** | Favicon 16/32/180, PWA 512, OG 1200x630 | Import `tokens.css`. Size-tiered favicon. This is the landing, so the link button is the highest-value component in the brand |
| **Instagram** (@shopsmallpot) | Profile 320 round, feed 1080x1350, story 1080x1920 | Feed is 4:5, never square; glass is usually taller than it is wide. Story keeps 250px clear top and bottom. Backlit shots only |
| **TikTok** (@shopsmallpot) | Profile 200 round, video 1080x1920 | Same handle, same avatar as Instagram. Process video is the format that suits the craft |
| **Custom orders** | - | Wine accent, the form spec in section 6, error color `#E8705F` |
| **Class listings** (Bower Center, Lynchburg Parks & Rec) | Sizes to confirm with each venue | Neither venue is ours, so the listing wears their template. Supply a backlit photo and the "come make one with me" line; do not fight their layout |
| **Amazon beginner-kit list** | - | No branding surface. The link's label on the site does the work |
| **Print** (hang tag, care card, business card) | Hang tag 2 x 3.5 in, card 3.5 x 2 in, 300dpi | Pane ground, one-color fern-800 mark. Amber does not print here |
| **Email** | - | Georgia and Arial fallbacks. Light ground, since inboxes are light |

The live domain is not recorded in the repo (it deploys to Netlify with a SPA
redirect). Confirm it before the OG tags and any printed piece go out.

---

## 9. Build checklist

Ordered by impact. The first three are most of the gain and are roughly an hour
together.

**First**
- [ ] **Fix the button contrast.** Cream on green is 2.76:1 and the hover makes
      it 2.02:1. Green fills take ink `#141005`. This is on every button on the
      landing page.
- [ ] **Drop in `tokens.css`**, replacing the token block at the top of
      `src/index.css`. Then replace the four hardcoded colors: `#8a8272` in
      `Footer.css`, `#ff4444` in `Home.css` and `CustomOrders.css`.
- [ ] **Two-ring focus.** Keyboard focus is currently invisible on the primary
      button (1.13:1).
- [ ] **Size-tiered favicon.** Pot silhouette in flat fern-800 at 16 and 32,
      reduced mark at 48-180, full mark at 180+.

**Then**
- [ ] Raise the link color to `#BFA070` and the weight floor to 400.
- [ ] Delete the two `text-shadow` rules on the hero.
- [ ] Fix or delete `/home`. It is unreachable, its gallery is Lucide
      placeholders labelled "(In Progress)", and its copy is the only Title-Case
      boilerplate on the site.
- [ ] Delete `src/assets/react.svg` and `public/vite.svg`. Nothing references
      either, and `react.svg` carries a cyan that belongs to another project.
- [ ] Backlit photo set: five pieces, shot in a window, for the feed, the OG
      image and the class listings.

**Later**
- [ ] Hang tag and care card, printed.
- [ ] Instagram and TikTok avatars swapped to the 180px reduced mark so they
      match each other and the favicon.
- [ ] A price list using the tabular-figure spec.

---

## 10. Open decisions

Yours, not researchable. A recommendation for each.

1. **Brand line.** "Made one piece at a time." is the recommendation, with "come
   make one with me" reserved for the class surfaces.
2. **The green button.** fern-300 `#8CC258` under ink is bright, and it reads as
   light coming through glass. The quieter alternative is a surface fill with a
   fern-400 border and fern-300 label. Both pass; the first has more life.
3. **`/home`.** Fix the copy and put photos in the gallery, or delete the route.
   Recommendation: delete it for now and let `/links` be the site until there are
   photos worth showing.
4. **The live domain.** Not in the repo. Needed before OG tags and print.
5. **Whether Lisa wants her name on it.** `/home` says "Lisa Stephen" and
   `/links` does not. Recommendation: yes, on the links page, because "made by
   the person you are talking to" is the promise.

---

## Related

- `tokens.css` - the drop-in token file.
- `brand-kit.html` - the visual version, tabbed by round.
- `public/logo.png` - the source of every color in this document.
- Andrew's voice rules: `~/dev/obsidian/content/01-Me/brand-voice.md`.
