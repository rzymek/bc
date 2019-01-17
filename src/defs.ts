export interface Modifier {
  inf: number;
  gun: number;
  mort: number;
  art: number;
  stuka: number;
  flame?: number;
}

interface Defs {
  [key: string]: {
    [key: string]: Modifier
  }
}
export const defs/*: Defs*/ = {
  terrain: {
    wooden_building: { inf: -1, gun: -1, mort: -1, art: -1, stuka: -1, flame: 0 },
    stone_building: { inf: -2, gun: -2, mort: -2, art: -2, stuka: -2, flame: 0 },
    hedgerow: { inf: -2, gun: -2, mort: 0, art: 0, stuka: 0, flame: 0 },
    woods: { inf: -1, gun: -1, mort: +1, art: +1, stuka: NaN, flame: 0 },
    foxhole: { inf: -2, gun: -2, mort: -4, art: -4, stuka: -2, flame: 0 },
    foxhole_in_woods: { inf: -2, gun: -2, mort: -2, art: -2, stuka: NaN, flame: 0 },
    fortified: { inf: -3, gun: -3, mort: -3, art: -3, stuka: -3, flame: 0 },
    pillbox: { inf: -3, gun: -3, mort: -6, art: -6, stuka: -3, flame: 0 },
    truck: { inf: -2, gun: NaN, mort: -2, art: NaN, stuka: NaN, flame: 0 }, //TODO
    dike_road: { inf: -2, gun: 0, art: 0, mort: 0, stuka: 0, flame: 0 },
    orchards: { inf: 0, gun: 0, art: 0, mort: 0, stuka: 0, flame: 0 },
  },
  conceal: {
    conceal: { inf: -1, gun: -1, mort: -1, art: -1, stuka: NaN, flame: -1 }
  },
  adjacent: {
    adjacent: { inf: +3, gun: 0, mort: 0, art: 0, stuka: 0, flame: 0 }
  },
  final_op: {
    final_op: { inf: -2, gun: 0, mort: -2, art: NaN, stuka: NaN, flame: 0 }
  },
  elevation: {
    higher: { inf: -1, gun: -1, mort: 0, art: 0, stuka: 0, flame: 0 },
    lower: { inf: +1, gun: +1, mort: 0, art: 0, stuka: 0, flame: 0 },
  },
  smoke: {
    smoke: { inf: -1, gun: 0, mort: -1, art: 0, stuka: NaN, flame: 0 },
    dispersed_smoke: { inf: 0, gun: 0, mort: 0, art: 0, stuka: NaN, flame: 0 },
  },
  in_open: {
    '1-4': { inf: +4, gun: 0, mort: 4, art: +4, stuka: 0, flame: 0 },
    '5-8': { inf: +2, gun: 0, mort: 2, art: +4, stuka: 0, flame: 0 },
    '> 8': { inf: 0, gun: 0, mort: 0, art: +4, stuka: 0, flame: 0 },
  }
}