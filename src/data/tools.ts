export type Seller = 'anything' | 'amazon' | 'dollartree' | 'kroger';

export const sellerLabel: Record<Seller, string> = {
  anything: 'Anything in Stained Glass',
  amazon: 'Amazon',
  dollartree: 'Dollar Tree',
  kroger: 'Kroger',
};

/** Shown in the page footer. Prices were read off each linked listing then. */
export const pricesReviewed = 'September 2026';

export interface ToolVariant {
  label: string;
  price: number;
}

export interface Tool {
  /** Display name, shown under the photo. */
  name: string;
  /** Second line under the name, for items whose name is a brand. */
  subtitle?: string;
  /** Basename of the image in /public/tools. Null when there is no photo yet. */
  slug: string | null;
  /** Price on the linked listing when last reviewed. Null when unknown or when variants carry it. */
  price: number | null;
  /** Qualifier shown after the price, e.g. a pack size. */
  priceNote?: string;
  /** One line per size or option, each with its own price. */
  variants?: ToolVariant[];
  seller: Seller | null;
  /** Null shows the item with no button. */
  url: string | null;
  /** One-line caption under the price. */
  note?: string;
}

export interface ToolGroup {
  title: string;
  items: Tool[];
}

const AISG = 'https://www.anythinginstainedglass.com';
const amazon = (asin: string) => `https://www.amazon.com/dp/${asin}`;

/** Listed in the order of Lisa's sheet, which is also the grid order. */
export const toolGroups: ToolGroup[] = [
  {
    title: 'Personal Protection Equipment',
    items: [
      {
        name: 'Dust Masks',
        slug: 'dust-masks',
        price: 8.99,
        seller: 'amazon',
        url: amazon('B09GNXYWDQ'),
      },
      {
        name: '3M Rugged Comfort Half Facepiece Respirator',
        slug: 'respirator',
        price: 31.48,
        seller: 'amazon',
        url: amazon('B00IF7RBS4'),
      },
      {
        name: 'Klein Tools Heat Safe Gloves, 2 pack',
        slug: 'klein-heat-safe-gloves',
        price: 9.98,
        seller: 'amazon',
        url: amazon('B0C9G8PJ7Z'),
      },
      {
        name: 'Nitrile Gloves, 100 ct',
        slug: 'nitrile-gloves',
        price: 7.28,
        seller: 'amazon',
        url: amazon('B0GCHC2RTL'),
      },
      {
        name: 'Safety Glasses',
        slug: 'safety-glasses',
        price: 3.35,
        seller: 'anything',
        url: `${AISG}/tools/handtools1.html`,
      },
    ],
  },
  {
    title: 'Cutting',
    items: [
      {
        name: 'Sharpie, Black',
        slug: 'sharpie-black',
        price: 7.99,
        priceNote: '12 pack',
        seller: 'amazon',
        url: amazon('B00006IFHD'),
      },
      {
        name: 'Sharpie, Silver',
        slug: 'sharpie-silver',
        price: 13.64,
        priceNote: '12 pack',
        seller: 'amazon',
        url: amazon('B001AZ3KHY'),
      },
      {
        name: 'Dust Pan, 3 pack',
        slug: 'dust-pan',
        price: 7.99,
        seller: 'amazon',
        url: amazon('B08H8SG94Q'),
      },
      {
        name: 'Top Tools Pistol Grip Cutter',
        slug: 'pistol-grip-cutter',
        price: 9.95,
        seller: 'anything',
        url: `${AISG}/tools/glasscutters.html`,
      },
      {
        name: 'Running and Grozer Pliers Set',
        slug: 'running-grozer-pliers',
        price: 14.29,
        seller: 'anything',
        url: `${AISG}/flyer/flyer5.html#supplies`,
      },
      {
        name: 'Waffle Grid',
        slug: 'waffle-grid',
        price: 11.0,
        seller: 'anything',
        url: `${AISG}/cuttermate/cuttermatetools.html#wafflegrid`,
      },
    ],
  },
  {
    title: 'Grinding',
    items: [
      {
        name: 'Finger Cots, 20 count',
        slug: 'finger-cots',
        price: 6.99,
        seller: 'amazon',
        url: amazon('B08FRBMYKD'),
      },
      {
        name: 'Knife Safe Gloves',
        slug: 'cut-resistant-gloves',
        price: 9.99,
        seller: 'amazon',
        url: amazon('B06XBGR2L9'),
      },
      {
        name: 'Gryphette Grinder',
        slug: 'gryphette-grinder',
        price: 114.0,
        seller: 'anything',
        url: `${AISG}/tools/glass-grinders-gryphon.html`,
      },
    ],
  },
  {
    title: 'Taping',
    items: [
      {
        name: 'Fid',
        slug: 'fid',
        price: 1.79,
        seller: 'anything',
        url: `${AISG}/tools/handtools1.html`,
      },
      {
        name: 'Xacto Knife, 10 pack',
        slug: 'xacto-knife',
        price: 9.99,
        seller: 'amazon',
        url: amazon('B0CJ8S7RRT'),
      },
      {
        name: 'Techniglass',
        subtitle: 'Copper Foil Tape',
        slug: 'techniglass-foil',
        price: null,
        variants: [
          { label: '3/16 inch', price: 5.59 },
          { label: '7/32 inch', price: 6.45 },
        ],
        seller: 'anything',
        url: `${AISG}/metals/techniglass-foil.html`,
        note: 'Black, copper, silver backed',
      },
      {
        name: 'Edco',
        subtitle: 'Copper Foil Tape',
        slug: 'edco-foil',
        price: null,
        variants: [
          { label: '3/16 inch', price: 9.35 },
          { label: '7/32 inch', price: 11.0 },
        ],
        seller: 'anything',
        url: `${AISG}/metals/edco-foil.html`,
        note: 'Black, copper, silver backed',
      },
    ],
  },
  {
    title: 'Soldering',
    items: [
      {
        name: '60/40 Solder',
        slug: 'amerway-solder',
        price: 23.95,
        seller: 'anything',
        url: `${AISG}/metals/solder.html`,
      },
      {
        name: "Tiger's Eye Gel Flux",
        slug: 'tigers-eye-flux',
        price: 7.95,
        seller: 'anything',
        url: `${AISG}/chemicals/patinaflux.html`,
      },
      {
        name: 'Flux Brushes',
        slug: 'flux-brush',
        price: 6.49,
        priceNote: '36 pack',
        seller: 'amazon',
        url: amazon('B07PHG2DQY'),
      },
      {
        name: 'Hakko FX-601 Soldering Iron',
        slug: 'hakko-601-iron',
        price: 75.95,
        seller: 'anything',
        url: `${AISG}/tools/ironsHakko.html`,
      },
      {
        name: 'Hakko Iron Stand with Sponge',
        slug: 'hakko-663-stand',
        price: 27.95,
        seller: 'anything',
        url: `${AISG}/tools/ironsHakko.html`,
      },
      {
        name: 'Silicone Mat',
        slug: 'silicone-mat',
        price: 8.99,
        seller: 'amazon',
        url: amazon('B072148P33'),
      },
    ],
  },
  {
    title: 'Finishing',
    items: [
      {
        name: '18 Gauge Tinned Wire, 1/4 lb',
        slug: 'tinned-wire',
        price: 10.95,
        seller: 'anything',
        url: `${AISG}/finishing/hooksClipsChain.html#wire`,
      },
      {
        name: 'Jewelry Making Pliers, 3 piece',
        slug: 'jewelry-pliers',
        price: 8.49,
        seller: 'amazon',
        url: amazon('B07ZGFK411'),
      },
      {
        name: 'Bail Making Pliers, 6 step',
        slug: 'bail-making-pliers',
        price: 8.97,
        seller: 'amazon',
        url: amazon('B08CKLYGH8'),
      },
      {
        name: 'Dawn Platinum Dish Soap, 30 oz',
        slug: 'dawn-platinum',
        price: 5.94,
        seller: 'amazon',
        url: amazon('B0G35M41RQ'),
      },
      {
        name: "CJ's Flux Remover",
        slug: 'cjs-flux-remover',
        price: 6.95,
        priceNote: '8 oz',
        seller: 'anything',
        url: `${AISG}/chemicals/cleaners.html`,
      },
      {
        name: 'Kwik Clean',
        slug: 'kwik-clean',
        price: 11.49,
        priceNote: '16 oz',
        seller: 'anything',
        url: `${AISG}/chemicals/cleaners.html`,
      },
      {
        name: 'Curved Kelly Forceps',
        slug: 'kelly-forceps',
        price: 5.53,
        seller: 'amazon',
        url: amazon('B00GGAAPD0'),
      },
      {
        name: 'Fishing Line',
        slug: 'fishing-line',
        price: 10.99,
        seller: 'amazon',
        url: amazon('B00144B7SK'),
      },
      {
        name: 'Light Box Chain or Jack Chain',
        slug: 'jack-chain',
        price: null,
        seller: 'anything',
        url: `${AISG}/finishing/hooksClipsChain.html`,
      },
      {
        name: 'Heavy Duty Scouring Sponges',
        slug: 'scouring-sponges',
        price: 1.5,
        priceNote: '5 pack',
        seller: 'dollartree',
        url: 'https://www.dollartree.com/scrub-buddies-heavy-duty-scouring-pads-5ct-packs/237252',
      },
      {
        name: 'Isopropyl Alcohol, 16 oz',
        slug: 'isopropyl-alcohol',
        price: 2.29,
        seller: 'kroger',
        url: 'https://www.kroger.com/p/kroger-70-isopropyl-alcohol-antiseptic/0001111079450',
      },
      {
        name: 'Howard Feed-N-Wax, 8 oz',
        slug: 'howard-feed-n-wax',
        price: 6.65,
        seller: 'anything',
        url: `${AISG}/chemicals/cleaners.html`,
      },
      {
        name: 'Liva Glass Polish',
        slug: 'liva-glass-polish',
        price: 18.95,
        seller: 'anything',
        url: `${AISG}/chemicals/cleaners.html`,
      },
    ],
  },
  {
    title: 'Cleanup',
    items: [
      {
        name: 'D-Lead Wipes, 150 count',
        slug: 'd-lead-wipes',
        price: 21.48,
        seller: 'amazon',
        url: amazon('B07CF77Q3N'),
      },
      {
        name: 'D-Lead Hand Soap, 8 oz',
        slug: 'd-lead-handsoap',
        price: 7.49,
        seller: 'anything',
        url: `${AISG}/chemicals/cleaners.html`,
      },
    ],
  },
];
