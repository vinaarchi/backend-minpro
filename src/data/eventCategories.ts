export const eventTopics = [
  "Desain, Foto, Video",
  "Kuliner",
  "Pendidikan",
  "Fashion",
  "Musik",
  "Sport",
  "Teknologi",
  "Travel",
] as const;

export const eventFormats = [
  "Konser, Pertunjukan",
  "Pertandingan",
  "Seminar, Talk Show",
  "Trip, Tur",
  "Festival, Fair, Baazar",
  "Pameran, Expo, Exhibition",
  "Konferensi",
  "Training, Sertifikasi, Ujian",
] as const;

export type EventTopic = (typeof eventTopics)[number];
export type EventFormat = (typeof eventFormats)[number];
