export type Pick = {
  element: number;
  position: number;
  selling_price: number;
  multiplier: number;
  purchase_price: number;
  is_captain: boolean;
  is_vice_captain: boolean;
};

export type Chip = {
  status_for_entry: 'available' | 'played' | 'unavailable';
  played_by_entry: number[];
  name: string;
  number: number;
  start_event: number;
  stop_event: number;
};

export type TransferInfo = {
  cost: number;
  status: string;
  limit: number;
  made: number;
  bank: number;
  value: number;
};

export type MyTeam = {
  picks: Pick[];
  chips: Chip[];
  transfers: TransferInfo;
};

export type TransferPayload = {
  chip: string | null;
  entry: number;
  event: number;
  transfers: {
    element_in: number;
    element_out: number;
    purchase_price: number;
    selling_price: number;
  }[];
};

export type ChipPayload = {
  chip: 'wildcard' | '3xc' | 'bboost' | 'freehit';
};
