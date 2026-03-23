export type NoteMode = 'Sargam' | 'Western';

export interface Note {
  key: string;
  sargam: string;
  western: string;
  frequency: number;
  type: 'white' | 'black';
}

export interface SongNote {
  note: string; // sargam or western
  duration: number; // in ms
  lyrics: string;
}

export interface Song {
  title: string;
  artist: string;
  notes: SongNote[];
}
