export interface Modifier {
  inf: number;
  gun?: number;
  mort?: number;
  art?: number;
  stuka?: number;
}

export const defs = {
  terrain: {
    wooden_building: { inf: -1, gun: -1, mort: -1, art: -1, stuka: -1 },
    stone_building: { inf: -2, gun: -2, mort: -2, art: -2, stuka: -2 },
    hedgerow: { inf: -2, gun: -2, mort: 0, art: 0, stuka: 0 },
    woods: { inf: -1, mort: +1, art: +1 },
    foxhole: { inf: -2 },
    foxhole_in_woods: { inf: -2 },
    fortified: { inf: -3 },
    pillbox: { inf: -3 },
    truck: { inf: -2 },
    dike_road: { inf: -2 },
    orchards: { inf: 0 },
  },
  conceal: {
    conceal: { label: '', inf: -1, gun: -1, mort: -1, art: -1 }
  },
  adjacent: {
    adjacent: { inf: +3, }
  },
  final_op: {
    final_op: { inf: -2 }
  },
  elevation: {
    higher: { inf: -1, key: '' },
    lower: { inf: +1, key: '' },
  },
  smoke: {
    smoke: { label: '', inf: -1, key: '' },
    dispersed_smoke: { label: '', inf: 0, key: '' },
  },
  in_open: {
    '1-4': { inf: +4 },
    '5-8': { inf: +2 },
    '> 8': { inf: 0 },
  }
}