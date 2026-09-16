/**
 * Small Pot newsletter - the one HTML template every issue is rendered through.
 *
 * Shared by the admin preview (browser) and the Netlify send functions (server),
 * so what Lisa sees in the preview is byte-for-byte what goes out. Keep this
 * file free of React and DOM imports.
 *
 * The look is Lisa's own Canva design (issue 1, September 2026): an olive body
 * on a light grey page, cream Lato/Arial text, copper rounded buttons, photo
 * and text rows that alternate sides, big uppercase olive title bands, a
 * two-column photo grid, an icon-and-text resources block, a crow beside a
 * copper monospace sign-off, and a copper footer band.
 *
 * What is different from the Canva export is only the plumbing that made it
 * fall apart on phones: one 600px table that collapses to 100% under 620px,
 * every style inlined, every image capped at its column, the side-by-side rows
 * stacking (photo first) on a phone, and body copy held at 16px.
 */

export type SectionKind = 'row' | 'band' | 'gallery' | 'columns';

export interface NewsletterColumn {
  iconUrl?: string;
  heading: string;
  body: string;
  linkUrl?: string;
}

/** A small clickable image (a Spotify button, a podcast logo) shown in a horizontal row under a section's text. */
export interface NewsletterIconLink {
  iconUrl: string;
  url: string;
  alt?: string;
}

export interface NewsletterSection {
  /** row (photo beside text, default), band (big title bar), gallery (photo grid), columns (icon + text blocks). */
  kind?: SectionKind;
  heading?: string;
  /** Italic line under the heading, e.g. "[two bird patterns to pick from]". Rows only. */
  subheading?: string;
  /** Plain text. A blank line starts a new paragraph. */
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Which side the photo sits on in a row on desktop. "auto" alternates, starting on the left. */
  imageSide?: 'left' | 'right' | 'auto';
  /** Rendered as a copper button under the text. Rows only. */
  linkLabel?: string;
  linkUrl?: string;
  /** Clickable icons in a horizontal row under the text (podcast platforms). Rows only. */
  iconLinks?: NewsletterIconLink[];
  /** Photo URLs for a gallery section, two per row. */
  gallery?: string[];
  /** Blocks for a columns section, two per row. */
  columns?: NewsletterColumn[];
}

export interface NewsletterContent {
  /** Email subject line. */
  subject: string;
  /** Inbox preview text shown under the subject. Optional. */
  previewText?: string;
  /** Full-width banner at the top (Lisa's "what's next?" graphic). */
  heroImageUrl?: string;
  heroImageAlt?: string;
  /** Optional headline under the banner. Lisa's design has none; the banner carries it. */
  title?: string;
  /** Optional opening paragraphs, centered. Blank line = new paragraph. */
  intro?: string;
  sections: NewsletterSection[];
  /** Optional copper button at the end of the sections. */
  ctaLabel?: string;
  ctaUrl?: string;
  /** Sign-off block: line, name, and a smaller line under the name. */
  signoffLine?: string;
  signoff?: string;
  signoffSub?: string;
  /** Illustration beside the sign-off (the crow). */
  signoffImageUrl?: string;
  /** Footer band lines. Default "Small Pot | Stained Glass" and "Lynchburg, Virginia". */
  footerLine1?: string;
  footerLine2?: string;
}

export interface Newsletter extends NewsletterContent {
  id: string;
  status: 'draft' | 'sent';
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  recipientCount?: number;
  testSentAt?: string;
}

export interface RenderOptions {
  /** Per-recipient unsubscribe link. */
  unsubscribeUrl: string;
  /** Public site origin, e.g. https://shopsmallpot.com (no trailing slash). */
  siteUrl: string;
}

/* Lisa's palette, sampled from her Canva export. */
export const COLORS = {
  page: '#f0f1f5',
  olive: '#64690d',
  band: '#79793e',
  bandText: '#595f1c',
  cream: '#fff7e7',
  copper: '#b87333',
  /** Lighter copper for the resource card bodies. */
  copperLight: '#c98f5e',
  ink: '#050504',
} as const;

const FONT = 'Lato, Arial, Helvetica, sans-serif';
const FONT_MONO = "'Courier New', Courier, monospace";
const CONTAINER = 600;

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(input: string): string {
  return escapeHtml(input.trim());
}

/** Only allow http(s) and mailto links; anything else becomes a harmless "#". */
function safeUrl(input: string | undefined): string {
  const url = (input ?? '').trim();
  if (/^(https?:\/\/|mailto:)/i.test(url)) return escapeAttr(url);
  return '#';
}

const P_STYLE = `margin:0 0 14px;font-family:${FONT};font-size:16px;line-height:1.4;color:${COLORS.cream};text-align:center;`;

/** Plain text to <p> blocks. Blank line = new paragraph, single newline = <br>. */
export function paragraphs(text: string, style: string = P_STYLE): string {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="${style}">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

function spacer(px: number): string {
  return `<div style="height:${px}px;line-height:${px}px;font-size:${px}px;">&nbsp;</div>`;
}

function button(label: string, url: string): string {
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:4px auto 0;">` +
    `<tr><td align="center" bgcolor="${COLORS.copper}" style="background-color:${COLORS.copper};border-radius:11px;">` +
    `<a href="${safeUrl(url)}" style="display:inline-block;padding:9px 20px;font-family:${FONT};font-size:16px;line-height:1.2;font-weight:700;color:${COLORS.ink};text-decoration:none;border-radius:11px;">` +
    `${escapeHtml(label.trim())}</a></td></tr></table>`
  );
}

/**
 * Every sizeable photo is wrapped in a link. Gmail adds a hover "download"
 * button to large images that are not linked (it treats them as attachments);
 * linked images and small icons are left alone, which is why other newsletters
 * do not show it.
 */
function img(url: string, alt: string, width: number, extraStyle = '', href?: string): string {
  const tag =
    `<img src="${safeUrl(url)}" alt="${escapeAttr(alt)}" width="${width}" ` +
    `style="display:block;width:100%;max-width:${width}px;height:auto;border:0;${extraStyle}">`;
  return href ? `<a href="${safeUrl(href)}" style="display:block;text-decoration:none;">${tag}</a>` : tag;
}

/** Photo beside text. On a phone the two cells stack, photo first. */
function row(s: NewsletterSection, index: number, siteUrl: string): string {
  const side = s.imageSide && s.imageSide !== 'auto' ? s.imageSide : index % 2 === 0 ? 'left' : 'right';
  const hasImage = Boolean(s.imageUrl?.trim());
  const text: string[] = [];
  if (s.heading?.trim()) {
    text.push(
      `<p style="margin:0 0 ${s.subheading?.trim() ? '2' : '14'}px;font-family:${FONT};font-size:19px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${COLORS.cream};text-align:center;">${escapeHtml(s.heading.trim())}</p>`,
    );
  }
  if (s.subheading?.trim()) {
    text.push(
      `<p style="margin:0 0 14px;font-family:${FONT};font-size:16px;line-height:1.3;font-style:italic;color:${COLORS.cream};text-align:center;">${escapeHtml(s.subheading.trim())}</p>`,
    );
  }
  if (s.body?.trim()) text.push(paragraphs(s.body));
  if (s.linkLabel?.trim() && s.linkUrl?.trim()) text.push(button(s.linkLabel, s.linkUrl));
  const icons = (s.iconLinks ?? []).filter((l) => l.iconUrl?.trim() && l.url?.trim());
  if (icons.length) {
    const cells = icons
      .map(
        (l) =>
          `<td style="padding:0 6px;"><a href="${safeUrl(l.url)}" style="display:inline-block;text-decoration:none;">` +
          `<img src="${safeUrl(l.iconUrl)}" alt="${escapeAttr(l.alt ?? '')}" height="44" style="display:block;height:44px;width:auto;border:0;"></a></td>`,
      )
      .join('');
    text.push(
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:6px auto 0;"><tr>${cells}</tr></table>`,
    );
  }

  const textCell =
    `<td class="sp-col" dir="ltr" valign="middle" width="${hasImage ? '55%' : '100%'}" ` +
    `style="width:${hasImage ? '55%' : '100%'};padding:12px 24px;">${text.join('\n')}</td>`;
  const imageCell = hasImage
    ? `<td class="sp-col" dir="ltr" valign="middle" width="45%" style="width:45%;padding:12px 24px;">` +
      `${img(s.imageUrl as string, s.imageAlt ?? '', 246, 'margin:0 auto;', s.linkUrl?.trim() || siteUrl)}</td>`
    : '';
  // dir="rtl" flips the visual order on desktop while the DOM keeps the photo first,
  // so a phone always stacks photo-then-text.
  const dir = side === 'right' ? 'rtl' : 'ltr';
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="${dir}" style="margin:12px 0;">` +
    `<tr>${imageCell}${textCell}</tr></table>`
  );
}

/** Big uppercase title bar in the lighter olive. */
function band(s: NewsletterSection): string {
  const label = (s.heading ?? '').trim();
  if (!label) return '';
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">` +
    `<tr><td class="sp-pad" bgcolor="${COLORS.band}" style="background-color:${COLORS.band};padding:22px 24px;">` +
    `<div class="sp-band" style="font-family:${FONT};font-size:56px;line-height:0.95;font-weight:900;letter-spacing:-0.02em;text-transform:uppercase;color:${COLORS.bandText};text-align:center;">${escapeHtml(label)}</div>` +
    `</td></tr></table>`
  );
}

/** Two-column photo grid. Stays two-up on phones. */
function gallery(urls: string[], siteUrl: string): string {
  const clean = urls.map((u) => u.trim()).filter(Boolean);
  if (!clean.length) return '';
  const cellWidth = Math.floor((CONTAINER - 48 - 16) / 2);
  const rows: string[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    const pair = clean.slice(i, i + 2);
    const cells = pair.map(
      (u, j) =>
        `<td width="50%" valign="top" style="width:50%;padding:${j === 0 ? '0 8px 16px 0' : '0 0 16px 8px'};">` +
        `${img(u, '', cellWidth, '', siteUrl)}</td>`,
    );
    if (pair.length === 1) cells.push(`<td width="50%" style="width:50%;padding:0 0 16px 8px;"></td>`);
    rows.push(`<tr>${cells.join('')}</tr>`);
  }
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">` +
    `<tr><td class="sp-pad" style="padding:8px 24px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody>${rows.join('')}</tbody></table>` +
    `</td></tr></table>`
  );
}

/**
 * Resource cards, two per row (four across is too tight on a phone). Each card
 * is a copper header holding the title, then a lighter-copper body with the
 * description and the icon under it. Cream text throughout.
 */
function columns(items: NewsletterColumn[]): string {
  const clean = items.filter((c) => (c.heading ?? '').trim() || (c.body ?? '').trim());
  if (!clean.length) return '';
  // Each pair of cards is ONE table with two rows (headers, then bodies) and a
  // transparent gap column, so both cards in a pair are always the same height.
  const headerCell = (c: NewsletterColumn): string => {
    const heading = escapeHtml((c.heading ?? '').trim());
    const headingHtml = c.linkUrl?.trim()
      ? `<a href="${safeUrl(c.linkUrl)}" style="color:${COLORS.cream};text-decoration:underline;">${heading}</a>`
      : heading;
    return (
      `<td width="48%" align="center" valign="middle" bgcolor="${COLORS.copper}" style="width:48%;background-color:${COLORS.copper};border-radius:8px 8px 0 0;padding:12px 14px;">` +
      `<p style="margin:0;font-family:${FONT};font-size:18px;line-height:1.2;font-weight:700;color:${COLORS.cream};text-align:center;">${headingHtml}</p></td>`
    );
  };
  const bodyCell = (c: NewsletterColumn): string => {
    const icon = c.iconUrl?.trim()
      ? `<img src="${safeUrl(c.iconUrl)}" alt="" height="56" style="display:block;height:56px;width:auto;max-width:100%;border:0;margin:4px auto 0;">`
      : '';
    return (
      `<td width="48%" align="center" valign="top" bgcolor="${COLORS.copperLight}" style="width:48%;background-color:${COLORS.copperLight};border-radius:0 0 8px 8px;padding:14px 14px 16px;">` +
      (c.body?.trim() ? paragraphs(c.body, `margin:0 0 12px;font-family:${FONT};font-size:16px;line-height:1.4;color:${COLORS.cream};text-align:center;`) : '') +
      icon +
      `</td>`
    );
  };
  const gap = `<td width="4%" style="width:4%;font-size:0;line-height:0;">&nbsp;</td>`;
  const empty = `<td width="48%" style="width:48%;"></td>`;
  const pairs: string[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    const [a, b] = clean.slice(i, i + 2);
    pairs.push(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">` +
        `<tr>${headerCell(a)}${gap}${b ? headerCell(b) : empty}</tr>` +
        `<tr>${bodyCell(a)}${gap}${b ? bodyCell(b) : empty}</tr>` +
        `</table>`,
    );
  }
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">` +
    `<tr><td class="sp-pad" style="padding:12px 24px;">${pairs.join('')}</td></tr></table>`
  );
}

function section(s: NewsletterSection, rowIndex: number, siteUrl: string): string {
  switch (s.kind ?? 'row') {
    case 'band':
      return band(s);
    case 'gallery':
      return gallery(s.gallery ?? [], siteUrl);
    case 'columns':
      return columns(s.columns ?? []);
    default:
      return row(s, rowIndex, siteUrl);
  }
}

function signoffBlock(content: NewsletterContent, siteUrl: string): string {
  const line = (content.signoffLine ?? '').trim();
  const name = (content.signoff ?? '').trim();
  const sub = (content.signoffSub ?? '').trim();
  if (!line && !name && !sub) return '';
  const monoStyle = `margin:0;font-family:${FONT_MONO};font-weight:700;color:${COLORS.copper};text-align:right;letter-spacing:0.04em;`;
  const text =
    (line ? `<p style="${monoStyle}font-size:20px;line-height:1.5;">${escapeHtml(line)}</p>` : '') +
    (name ? `<p style="${monoStyle}font-size:18px;line-height:1.5;">${escapeHtml(name)}</p>` : '') +
    (sub ? `<p style="${monoStyle}font-size:16px;line-height:1.5;">${escapeHtml(sub)}</p>` : '');
  const picture = content.signoffImageUrl?.trim()
    ? `<td width="45%" valign="middle" style="width:45%;padding:0 12px 0 0;">${img(content.signoffImageUrl, '', 240, '', siteUrl)}</td>`
    : '';
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 0;">` +
    `<tr><td class="sp-pad" style="padding:12px 24px 28px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${picture}` +
    `<td valign="middle" style="padding:0;">${text}</td></tr></table>` +
    `</td></tr></table>`
  );
}

function footer(content: NewsletterContent, unsubscribeUrl: string): string {
  const line1 = escapeHtml((content.footerLine1 ?? 'Small Pot | Stained Glass').trim());
  const line2 = escapeHtml((content.footerLine2 ?? 'Lynchburg, Virginia').trim());
  const year = new Date().getFullYear();
  const small = `font-family:${FONT};font-size:13px;line-height:1.45;color:${COLORS.cream};text-align:center;`;
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">` +
    `<tr><td class="sp-pad" bgcolor="${COLORS.copper}" style="background-color:${COLORS.copper};padding:22px 24px 24px;">` +
    `<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.4;font-weight:700;color:${COLORS.cream};text-align:center;">${line1}</p>` +
    `<p style="margin:0 0 14px;font-family:${FONT};font-size:15px;line-height:1.4;color:${COLORS.cream};text-align:center;">${line2}</p>` +
    `<p style="margin:0;${small}">&copy; ${year} Small Pot Stained Glass. All rights reserved.</p>` +
    `<p style="margin:0;${small}">You are receiving this newsletter because you signed up for our updates. ` +
    `<a href="${unsubscribeUrl}" style="color:${COLORS.cream};text-decoration:underline;">Unsubscribe</a> any time.</p>` +
    `</td></tr></table>`
  );
}

export function renderNewsletterHtml(content: NewsletterContent, opts: RenderOptions): string {
  const unsubscribeUrl = safeUrl(opts.unsubscribeUrl);
  const siteUrl = opts.siteUrl.replace(/\/+$/, '');
  const subject = escapeHtml(content.subject.trim());
  const preview = (content.previewText ?? '').trim();

  const body: string[] = [];
  if (content.heroImageUrl?.trim()) {
    body.push(img(content.heroImageUrl, content.heroImageAlt ?? '', CONTAINER, '', siteUrl));
  }
  if (content.title?.trim()) {
    body.push(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="sp-pad" style="padding:24px 24px 0;">` +
        `<p style="margin:0;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${COLORS.cream};text-align:center;">${escapeHtml(content.title.trim())}</p>` +
        `</td></tr></table>`,
    );
  }
  if (content.intro?.trim()) {
    body.push(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="sp-pad" style="padding:20px 32px 6px;">` +
        paragraphs(content.intro) +
        `</td></tr></table>`,
    );
  }
  if (!content.heroImageUrl?.trim() && !content.title?.trim() && !content.intro?.trim()) body.push(spacer(12));

  let rowIndex = 0;
  for (const s of content.sections ?? []) {
    const html = section(s, rowIndex, siteUrl);
    if ((s.kind ?? 'row') === 'row') rowIndex += 1;
    if (html) body.push(html);
  }
  if (content.ctaLabel?.trim() && content.ctaUrl?.trim()) {
    body.push(spacer(8), button(content.ctaLabel, content.ctaUrl), spacer(16));
  }
  body.push(signoffBlock(content, siteUrl));
  body.push(footer(content, unsubscribeUrl));

  // Preheader padding keeps clients from pulling body copy into the inbox preview.
  const preheader = preview
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${COLORS.page};">${escapeHtml(preview)}${'&nbsp;&zwnj;'.repeat(40)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${subject}</title>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet">
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse:collapse; mso-table-lspace:0; mso-table-rspace:0; }
  img { border:0; display:block; height:auto; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { color:${COLORS.cream}; }
  /* Gmail's iOS app fully inverts colours in dark mode (the olive turned pale green,
     the cream text went dark). Gmail rewrites the doctype into a <u> element, so
     "u + .body" matches only there. The gradient on the container keeps the olive,
     and these two blend layers rebuild the original text colours on top of it.
     Technique: Rémi Parmentier, "Fixing Gmail's dark mode issues with CSS blend modes". */
  u + .body .gmail-blend-screen { background:#000000; mix-blend-mode:screen; }
  u + .body .gmail-blend-difference { background:#000000; mix-blend-mode:difference; }
  @media only screen and (max-width:620px) {
    .sp-outer { padding:0 !important; }
    .sp-container { width:100% !important; }
    .sp-col { display:block !important; width:100% !important; box-sizing:border-box !important; padding:10px 20px !important; }
    .sp-pad { padding-left:16px !important; padding-right:16px !important; }
    .sp-band { font-size:40px !important; }
  }
</style>
</head>
<body class="body" style="margin:0;padding:0;background-color:${COLORS.page};">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.page};">
<tr><td align="center" class="sp-outer" style="padding:20px 8px;">
<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="sp-container" width="${CONTAINER}" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.olive}" style="width:${CONTAINER}px;max-width:100%;background-color:${COLORS.olive};">
<tr><td style="padding:0;background:${COLORS.olive};background-image:linear-gradient(${COLORS.olive},${COLORS.olive});color:${COLORS.cream};">
<div class="gmail-blend-screen"><div class="gmail-blend-difference">
${body.join('\n')}
</div></div>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

/** Plain-text alternative, sent alongside the HTML. */
export function renderNewsletterText(content: NewsletterContent, opts: RenderOptions): string {
  const siteUrl = opts.siteUrl.replace(/\/+$/, '');
  const lines: string[] = [];
  lines.push((content.footerLine1 ?? 'Small Pot | Stained Glass').trim(), '');
  if (content.title?.trim()) lines.push(content.title.trim(), '');
  if (content.intro?.trim()) lines.push(content.intro.trim(), '');
  for (const s of content.sections ?? []) {
    const kind = s.kind ?? 'row';
    if (kind === 'band') {
      if (s.heading?.trim()) lines.push('', s.heading.trim().toUpperCase(), '');
      continue;
    }
    if (kind === 'gallery') continue;
    if (kind === 'columns') {
      for (const c of s.columns ?? []) {
        if (c.heading?.trim()) lines.push(c.heading.trim());
        if (c.body?.trim()) lines.push(c.body.trim());
        if (c.linkUrl?.trim()) lines.push(c.linkUrl.trim());
        lines.push('');
      }
      continue;
    }
    lines.push('- - -', '');
    if (s.heading?.trim()) lines.push(s.heading.trim());
    if (s.subheading?.trim()) lines.push(s.subheading.trim());
    if (s.heading?.trim() || s.subheading?.trim()) lines.push('');
    if (s.body?.trim()) lines.push(s.body.trim(), '');
    if (s.linkUrl?.trim() && s.linkLabel?.trim()) lines.push(`${s.linkLabel.trim()}: ${s.linkUrl.trim()}`, '');
    for (const l of s.iconLinks ?? []) if (l.url?.trim()) lines.push(`${(l.alt ?? 'link').trim()}: ${l.url.trim()}`);
    if (s.iconLinks?.length) lines.push('');
  }
  if (content.ctaLabel?.trim() && content.ctaUrl?.trim()) lines.push(`${content.ctaLabel.trim()}: ${content.ctaUrl.trim()}`, '');
  for (const l of [content.signoffLine, content.signoff, content.signoffSub]) if (l?.trim()) lines.push(l.trim());
  lines.push('');
  lines.push((content.footerLine1 ?? 'Small Pot | Stained Glass').trim());
  lines.push((content.footerLine2 ?? 'Lynchburg, Virginia').trim());
  lines.push('You are receiving this newsletter because you signed up for our updates.');
  lines.push(`Unsubscribe: ${opts.unsubscribeUrl}`);
  lines.push(siteUrl);
  return lines.join('\n');
}

/** An empty issue with the fields the editor expects. */
export function blankNewsletterContent(): NewsletterContent {
  return {
    subject: '',
    previewText: '',
    heroImageUrl: '',
    heroImageAlt: '',
    title: '',
    intro: '',
    sections: [],
    ctaLabel: '',
    ctaUrl: '',
    signoffLine: 'Make your magic!',
    signoff: 'Lisa Stephen',
    signoffSub: 'Instructor & Artist',
    signoffImageUrl: '',
    footerLine1: 'Small Pot | Stained Glass',
    footerLine2: 'Lynchburg, Virginia',
  };
}

/** A fresh section of the given kind with the fields the editor expects. */
export function blankSection(kind: SectionKind = 'row'): NewsletterSection {
  switch (kind) {
    case 'band':
      return { kind, heading: '' };
    case 'gallery':
      return { kind, gallery: [] };
    case 'columns':
      return { kind, columns: [{ iconUrl: '', heading: '', body: '', linkUrl: '' }] };
    default:
      return { kind: 'row', heading: '', subheading: '', body: '', imageUrl: '', imageAlt: '', imageSide: 'auto', linkLabel: '', linkUrl: '', iconLinks: [] };
  }
}
