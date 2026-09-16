export type Seller = 'anything' | 'amazon' | 'dollartree' | 'kroger';

export const sellerLabel: Record<Seller, string> = {
  anything: 'Anything in Stained Glass',
  amazon: 'Amazon',
  dollartree: 'Dollar Tree',
  kroger: 'Kroger',
};

/** Prices below were read off each linked listing on this date, not off the sheet. */
export const pricesCheckedOn = 'September 16, 2026';

export interface Tool {
  /** Display name, shown under the photo. */
  name: string;
  /** Basename of the image in /public/tools. Null when there is no photo yet. */
  slug: string | null;
  /** Price on the linked listing when last checked. Null when unknown. */
  price: number | null;
  /** Qualifier shown after the price, e.g. a pack size or a variant. */
  priceNote?: string;
  seller: Seller | null;
  /** Null shows the item with no button. */
  url: string | null;
  /** One-line caption from Lisa's sheet. */
  note?: string;
  /**
   * Items sharing a key are interchangeable by preference or budget; they are
   * listed next to each other and tagged "pick one".
   */
  pick?: string;
}

export interface ToolGroup {
  title: string;
  items: Tool[];
}

const AISG = 'https://www.anythinginstainedglass.com';
const amazon = (asin: string) => `https://www.amazon.com/dp/${asin}`;

/**
 * Listed in the order of Lisa's sheet, which is also the grid order: the
 * "pick one" sets are already adjacent there.
 */
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
        pick: 'mask',
      },
      {
        name: '3M Rugged Comfort Half Facepiece Respirator',
        slug: null,
        price: null,
        seller: 'amazon',
        url: null,
        pick: 'mask',
      },
      {
        name: 'Klein Tools Heat Safe Gloves, 2 pack',
        slug: 'klein-heat-safe-gloves',
        price: 9.98,
        seller: 'amazon',
        url: amazon('B0C9G8PJ7Z'),
        note: 'Large',
      },
      {
        name: 'Nitrile Gloves, 100 ct',
        slug: 'nitrile-gloves',
        price: null,
        priceNote: 'by size',
        seller: 'amazon',
        url: amazon('B0GCHC2RTL'),
      },
      {
        name: 'Safety Glasses',
        slug: 'safety-glasses',
        price: 3.35,
        seller: 'anything',
        url: `${AISG}/tools/handtools1.html`,
        note: 'Or hardware store',
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
        name: 'Glass',
        slug: null,
        price: null,
        seller: null,
        url: null,
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
        note: 'Greatly reduces cuts',
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
        pick: 'cut',
      },
      {
        name: 'Knife Safe Gloves',
        slug: 'cut-resistant-gloves',
        price: 9.99,
        seller: 'amazon',
        url: amazon('B06XBGR2L9'),
        pick: 'cut',
      },
      {
        name: 'Grinder Shield, Storage Bin, or Aquarium',
        slug: null,
        price: null,
        seller: null,
        url: null,
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
        name: 'Techniglass Copper Foil Tape, 3/16 or 7/32 inch',
        slug: 'techniglass-foil',
        price: 5.59,
        priceNote: '3/16 inch, 7/32 is $6.45',
        seller: 'anything',
        url: `${AISG}/metals/techniglass-foil.html`,
        note: 'Black, copper, or silver backed',
        pick: 'foil',
      },
      {
        name: 'Edco Copper Foil Tape, 3/16 or 7/32 inch',
        slug: null,
        price: null,
        seller: 'anything',
        url: null,
        note: 'Black, copper, or silver backed',
        pick: 'foil',
      },
    ],
  },
  {
    title: 'Soldering',
    items: [
      {
        name: 'Amerway 60/40 Solder',
        slug: 'amerway-solder',
        price: 23.95,
        seller: 'anything',
        url: `${AISG}/metals/solder.html`,
      },
      {
        name: "Amerway Tiger's Eye Gel Flux",
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
        note: 'Protects the table',
      },
    ],
  },
  {
    title: 'Finishing',
    items: [
      {
        name: '18 Gauge Tinned Wire, 1/4 lb',
        slug: null,
        price: 10.95,
        seller: 'anything',
        url: `${AISG}/finishing/hooksClipsChain.html#wire`,
        note: 'To make hooks',
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
        pick: 'clean',
      },
      {
        name: "CJ's Flux Remover",
        slug: 'cjs-flux-remover',
        price: null,
        seller: 'anything',
        url: null,
        pick: 'clean',
      },
      {
        name: 'Kwik Clean',
        slug: 'kwik-clean',
        price: null,
        seller: 'anything',
        url: null,
        pick: 'clean',
      },
      {
        name: 'Curved Kelly Forceps',
        slug: 'kelly-forceps',
        price: 5.53,
        seller: 'amazon',
        url: amazon('B00GGAAPD0'),
        note: 'For adding hooks',
      },
      {
        name: 'Fishing Line',
        slug: 'fishing-line',
        price: 10.99,
        seller: 'amazon',
        url: amazon('B00144B7SK'),
        note: 'To hang',
        pick: 'hang',
      },
      {
        name: 'Light Box Chain or Jack Chain',
        slug: 'jack-chain',
        price: null,
        seller: 'anything',
        url: `${AISG}/finishing/hooksClipsChain.html`,
        note: 'To hang',
        pick: 'hang',
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
        slug: null,
        price: 2.99,
        seller: 'kroger',
        url: null,
      },
      {
        name: 'Howard Feed-N-Wax, 8 oz',
        slug: 'howard-feed-n-wax',
        price: 6.65,
        seller: 'anything',
        url: `${AISG}/chemicals/cleaners.html`,
        pick: 'polish',
      },
      {
        name: 'Liva Glass Polish',
        slug: 'liva-glass-polish',
        price: 18.95,
        seller: 'anything',
        url: `${AISG}/chemicals/cleaners.html`,
        pick: 'polish',
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
