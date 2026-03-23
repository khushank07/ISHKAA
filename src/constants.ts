export const NOTES = [
  { key: 'a', sargam: 'Sa', western: 'C', frequency: 261.63, type: 'white' },
  { key: 'w', sargam: 'Re(b)', western: 'C#', frequency: 277.18, type: 'black' },
  { key: 's', sargam: 'Re', western: 'D', frequency: 293.66, type: 'white' },
  { key: 'e', sargam: 'Ga(b)', western: 'D#', frequency: 311.13, type: 'black' },
  { key: 'd', sargam: 'Ga', western: 'E', frequency: 329.63, type: 'white' },
  { key: 'f', sargam: 'Ma', western: 'F', frequency: 349.23, type: 'white' },
  { key: 't', sargam: 'Ma(#)', western: 'F#', frequency: 369.99, type: 'black' },
  { key: 'g', sargam: 'Pa', western: 'G', frequency: 392.00, type: 'white' },
  { key: 'y', sargam: 'Dha(b)', western: 'G#', frequency: 415.30, type: 'black' },
  { key: 'h', sargam: 'Dha', western: 'A', frequency: 440.00, type: 'white' },
  { key: 'u', sargam: 'Ni(b)', western: 'A#', frequency: 466.16, type: 'black' },
  { key: 'j', sargam: 'Ni', western: 'B', frequency: 493.88, type: 'white' },
  { key: 'k', sargam: 'Sa+', western: 'C5', frequency: 523.25, type: 'white' },
] as const;

export const KEY_TO_NOTE: Record<string, string> = {
  'a': 'Sa',
  's': 'Re',
  'd': 'Ga',
  'f': 'Ma',
  'g': 'Pa',
  'h': 'Dha',
  'j': 'Ni',
  'k': 'Sa+',
};

export const SONG_ANUV_JAIN = {
  title: "Shayar Jo The Woh Kayar Bane",
  artist: "Anuv Jain",
  notes: [
    { note: 'Sa', duration: 800, lyrics: "Sha-" },
    { note: 'Re', duration: 800, lyrics: "yar" },
    { note: 'Ga', duration: 800, lyrics: "jo" },
    { note: 'Ma', duration: 800, lyrics: "the" },
    { note: 'Pa', duration: 800, lyrics: "woh" },
    { note: 'Dha', duration: 1200, lyrics: "ka-" },
    { note: 'Ni', duration: 800, lyrics: "yar" },
    { note: 'Sa+', duration: 1600, lyrics: "bane" },
    // Repeat or add more lines
    { note: 'Sa+', duration: 800, lyrics: "Ba-" },
    { note: 'Ni', duration: 800, lyrics: "ne" },
    { note: 'Dha', duration: 800, lyrics: "woh" },
    { note: 'Pa', duration: 1200, lyrics: "ka-" },
    { note: 'Ma', duration: 800, lyrics: "yar" },
    { note: 'Ga', duration: 1600, lyrics: "bane" },
  ]
};
