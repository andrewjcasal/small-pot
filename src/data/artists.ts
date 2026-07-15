export type SocialKey =
  | 'website'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'etsy'
  | 'amazon';

export interface Artist {
  /** Display name, shown under the photo. */
  name: string;
  /** Basename of the images in /public/artists. Null when we have no artwork yet. */
  slug: string | null;
  /**
   * True when the logo carries its own background, pre-extended to the frame's
   * 4:5 so it bleeds edge to edge. Transparent-background logos leave this off
   * and sit inset on the card instead.
   */
  logoBleed?: boolean;
  socials: Partial<Record<SocialKey, string>>;
  /** Which social the photo itself links to. Bolded by Lisa in the source sheet. */
  primary: SocialKey;
}

export const artists: Artist[] = [
  {
    name: 'Sparkle and Shine Glass',
    slug: 'sparkle-and-shine',
    logoBleed: true,
    primary: 'tiktok',
    socials: {
      website: 'https://1f7526-a3.myshopify.com/',
      tiktok: 'https://www.tiktok.com/@sparkleandshineglass',
      instagram: 'https://www.instagram.com/sparkleandshineglass/',
      facebook: 'https://www.facebook.com/profile.php?id=100089421934759',
      etsy: 'https://www.etsy.com/shop/SparkleShineGlassArt',
      amazon:
        'https://www.amazon.com/shop/sparkleandshineglass/list/3U7I9RUVX9W1H?linkCode=spc&tag=juliestarbuck-20&domainId=influencer&asc_contentid=amzn1.ideas.3U7I9RUVX9W1H&ccs_id=2534445c-1e44-43b7-a900-90c731aaf923',
    },
  },
  {
    name: 'Mountain Woman Products',
    slug: 'mountain-woman',
    primary: 'youtube',
    socials: {
      website: 'https://www.mountainwomanproducts.com/shop/',
      tiktok: 'https://www.tiktok.com/@mountainwomanproducts',
      instagram: 'https://www.instagram.com/mountainwomanproducts/',
      facebook: 'https://www.facebook.com/profile.php?id=100057710868546',
      youtube: 'https://www.youtube.com/channel/UCsoE--MTAOy2D408hJAJssQ',
    },
  },
  {
    name: 'Samantha Ashley Glass',
    slug: 'samantha-ashley',
    primary: 'youtube',
    socials: {
      website: 'https://samanthaashleyglass.bigcartel.com/',
      tiktok: 'https://www.tiktok.com/@samanthaashleyglass',
      instagram: 'https://www.instagram.com/samanthaashleyglass/',
      facebook: 'https://www.facebook.com/SamanthaAshleyGlass',
      youtube: 'https://www.youtube.com/@SamanthaAshleyGlass',
      etsy: 'https://www.etsy.com/shop/SamanthaAshleyGlass?etsrc=sdt',
      amazon:
        'https://www.amazon.com/shop/samanthaashleyglass?ccs_id=a38350f1-582e-47a5-9996-8d1e6f72ae5d',
    },
  },
  {
    name: 'Curiosity Garden Glass',
    slug: 'curiosity-garden',
    logoBleed: true,
    primary: 'instagram',
    socials: {
      website: 'https://curiositygarden.bigcartel.com',
      tiktok: 'https://www.tiktok.com/@curiositygarden',
      instagram: 'https://www.instagram.com/curiositygardenglass/',
      facebook: 'https://www.facebook.com/CuriosityGardenStainedGlass',
    },
  },
  {
    name: 'Amaya Jade',
    slug: 'amaya-jade',
    logoBleed: true,
    primary: 'youtube',
    socials: {
      website:
        'https://amayajade.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio',
      tiktok: 'https://www.tiktok.com/@amayajadeart',
      instagram: 'https://www.instagram.com/amayajadeart/',
      facebook: 'https://www.facebook.com/profile.php?id=61575027855843',
      youtube: 'https://www.youtube.com/@AmayaJade/videos',
      amazon:
        'https://www.amazon.com/shop/amayajade?ref=ac_inf_tb_vh&ccs_id=cc3d788b-39fa-4f48-83d9-f8e88a41db2f',
    },
  },
  {
    name: 'Makenzie Hallie',
    slug: null,
    primary: 'youtube',
    socials: {
      tiktok: 'https://www.tiktok.com/@makenziethehallie',
      instagram: 'https://www.instagram.com/makenziehallie',
      youtube: 'https://www.youtube.com/@MakenzieHallie',
      etsy: 'https://www.etsy.com/shop/MakisMysticGlass',
      amazon:
        'https://www.amazon.com/shop/makenziehallie/list/2TOSMGVBHSAON?tag=makenziehalli-20&ref_=cm_sw_r_mwn_aipsfshop_7S0Y6MW5MDHHC4P43F8F&ccs_id=f0787881-5ff0-40ef-90b2-5b0089dda3fa',
    },
  },
  {
    name: 'Lumpy Glass',
    slug: 'lumpy-glass',
    logoBleed: true,
    primary: 'instagram',
    socials: {
      website: 'https://www.lumpyglass.com.au/',
      tiktok: 'https://www.tiktok.com/@lumpyglass',
      instagram: 'https://www.instagram.com/lumpy.glass/',
      facebook: 'https://www.facebook.com/profile.php?id=100085118799471',
    },
  },
  {
    name: 'Linebaugh Studios',
    slug: 'linebaugh-studios',
    logoBleed: true,
    primary: 'tiktok',
    socials: {
      website: 'https://linebaughstudios.com/',
      tiktok: 'https://www.tiktok.com/@linebaughstudios',
      instagram: 'https://www.instagram.com/linebaughstudios/',
      facebook: 'https://www.facebook.com/profile.php?id=61558805305181',
      youtube: 'https://www.youtube.com/@linebaughstudios',
      etsy: 'https://www.etsy.com/shop/LinebaughStudios',
    },
  },
  {
    name: 'Sway Design Studio',
    slug: 'sway-design',
    logoBleed: true,
    primary: 'tiktok',
    socials: {
      website: 'https://swaydesignstudio.com/',
      tiktok: 'https://www.tiktok.com/@swaydesignstudio',
      instagram: 'https://www.instagram.com/swaydesignstudio/',
      facebook: 'https://www.facebook.com/swaydesignstudio',
      amazon:
        'https://www.amazon.com/shop/swaydesignstudio/list/2PPM0RLF5SL58?ref_=cm_sw_r_cp_ud_aipsflist_Y0KHQ99HCQ328NQ2QFQM&ccs_id=a4214e4d-5ab6-45a9-b83e-cb3003f235cb',
    },
  },
];

/** Render order for the icon row, so every card lists socials the same way. */
export const socialOrder: SocialKey[] = [
  'website',
  'tiktok',
  'instagram',
  'facebook',
  'youtube',
  'etsy',
  'amazon',
];

export const socialLabels: Record<SocialKey, string> = {
  website: 'Website',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  etsy: 'Etsy',
  amazon: 'Amazon',
};

/** icons8 publishes no animated variant of the Etsy mark, so it stays static. */
const staticOnlyIcons: SocialKey[] = ['etsy'];

export function iconSrc(kind: SocialKey, animated: boolean) {
  const suffix = animated && !staticOnlyIcons.includes(kind) ? '-anim' : '';
  return `/icons/${kind}${suffix}.webp`;
}

/** Warm the animated files so the first hover doesn't wait on a fetch. */
export function preloadAnimatedIcons(kinds: SocialKey[]) {
  kinds
    .filter((kind) => !staticOnlyIcons.includes(kind))
    .forEach((kind) => {
      const img = new Image();
      img.src = iconSrc(kind, true);
    });
}
