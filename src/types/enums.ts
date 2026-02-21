export const ERegion = {
  Andijan: 1,
  Bukhara: 2,
  Fergana: 3,
  Jizzakh: 4,
  Karakalpakstan: 5,
  Kashkadarya: 6,
  Khorezm: 7,
  Namangan: 8,
  Navoi: 9,
  Samarkand: 10,
  Sirdarya: 11,
  Surkhandarya: 12,
  Tashkent: 13,
  TashkentRegion: 14,
} as const;
export type ERegion = (typeof ERegion)[keyof typeof ERegion];

export const EGender = {
  Male: 1,
  Female: 2,
} as const;
export type EGender = (typeof EGender)[keyof typeof EGender];

export const EExamingPeriod = {
  First: 1,
  Second: 2,
  Third: 3,
} as const;
export type EExamingPeriod = (typeof EExamingPeriod)[keyof typeof EExamingPeriod];

/** Map SVG location id (from @svg-maps/uzbekistan) → ERegion */
export const svgIdToRegion: Record<string, ERegion> = {
  andijan: ERegion.Andijan,
  bukhara: ERegion.Bukhara,
  fergana: ERegion.Fergana,
  jizzakh: ERegion.Jizzakh,
  karakalpakstan: ERegion.Karakalpakstan,
  qashqadaryo: ERegion.Kashkadarya,
  xorazm: ERegion.Khorezm,
  namangan: ERegion.Namangan,
  navoiy: ERegion.Navoi,
  samarqand: ERegion.Samarkand,
  sirdaryo: ERegion.Sirdarya,
  surxondaryo: ERegion.Surkhandarya,
  tashkent: ERegion.Tashkent,
};

/** ERegion → SVG location id */
export const regionToSvgId: Record<number, string[]> = {
  [ERegion.Andijan]: ["andijan"],
  [ERegion.Bukhara]: ["bukhara"],
  [ERegion.Fergana]: ["fergana"],
  [ERegion.Jizzakh]: ["jizzakh"],
  [ERegion.Karakalpakstan]: ["karakalpakstan"],
  [ERegion.Kashkadarya]: ["qashqadaryo"],
  [ERegion.Khorezm]: ["xorazm"],
  [ERegion.Namangan]: ["namangan"],
  [ERegion.Navoi]: ["navoiy"],
  [ERegion.Samarkand]: ["samarqand"],
  [ERegion.Sirdarya]: ["sirdaryo"],
  [ERegion.Surkhandarya]: ["surxondaryo"],
  [ERegion.Tashkent]: ["tashkent"],
  [ERegion.TashkentRegion]: ["tashkent"],
};

export const regionLabels: Record<ERegion, string> = {
  [ERegion.Andijan]: "Andijon",
  [ERegion.Bukhara]: "Buxoro",
  [ERegion.Fergana]: "Farg'ona",
  [ERegion.Jizzakh]: "Jizzax",
  [ERegion.Karakalpakstan]: "Qoraqalpog'iston",
  [ERegion.Kashkadarya]: "Qashqadaryo",
  [ERegion.Khorezm]: "Xorazm",
  [ERegion.Namangan]: "Namangan",
  [ERegion.Navoi]: "Navoiy",
  [ERegion.Samarkand]: "Samarqand",
  [ERegion.Sirdarya]: "Sirdaryo",
  [ERegion.Surkhandarya]: "Surxondaryo",
  [ERegion.Tashkent]: "Toshkent shahri",
  [ERegion.TashkentRegion]: "Toshkent viloyati",
};

export const periodLabels: Record<EExamingPeriod, string> = {
  [EExamingPeriod.First]: "1-smena (08:00-10:30)",
  [EExamingPeriod.Second]: "2-smena (11:00-13:30)",
  [EExamingPeriod.Third]: "3-smena (14:00-16:30)",
};
