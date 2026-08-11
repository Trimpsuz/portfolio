export type Project = {
  id: string;
  title: string;
  description: string;
  languages: string[];
  url: string;
  year: number;
};

export const projects: Project[] = [
  {
    id: 'testaustime-wrapped',
    title: 'Testaustime wrapped',
    description: 'Year review for Testaustime',
    languages: ['TypeScript'],
    url: 'https://wrapped.testaustime.fi/',
    year: 2025,
  },
  {
    id: 'portfolio',
    title: 'portfolio',
    description: 'This website, built with React and Vite',
    languages: ['TypeScript'],
    url: 'https://github.com/Trimpsuz/portfolio',
    year: 2026,
  },
  {
    id: 'habitti',
    title: 'habitti',
    description: 'Build a jailbroken version of Abitti, the Finnish matriculation exam environment',
    languages: ['Bash'],
    url: 'https://github.com/trimpsuz/habitti',
    year: 2023,
  },
  {
    id: 'anilist-wearos',
    title: 'AniList WearOS',
    description: 'AniList client for WearOS',
    languages: ['Kotlin'],
    url: 'https://github.com/Trimpsuz/anilist-wearos',
    year: 2025,
  },
  {
    id: 'vertaarauhassa',
    title: 'VertaaRauhassa',
    description: 'Journey finder for Finnish trains with better filtering and sorting',
    languages: ['TypeScript'],
    url: 'https://vertaarauhassa.fi/',
    year: 2025,
  },
  {
    id: 'testaus-link',
    title: 'testaus.link',
    description: 'Quick and easy URL shortener',
    languages: ['TypeScript'],
    url: 'https://testaus.link/',
    year: 2023,
  },
  {
    id: 'vlc-rpc',
    title: 'VLC RPC',
    description: 'Discord rich presence for VLC Media Player',
    languages: ['TypeScript'],
    url: 'https://github.com/Trimpsuz/vlc-rpc',
    year: 2025,
  },
  {
    id: 'morphe-busuu',
    title: 'Morphe busuu',
    description: 'Morphe patches for Busuu',
    languages: ['Kotlin'],
    url: 'https://github.com/Trimpsuz/morphe-busuu',
    year: 2026,
  },
  {
    id: 'spotify-widget',
    title: 'Spotify widget',
    description: 'Discord-style widget for Spotify',
    languages: ['TypeScript'],
    url: 'https://github.com/Trimpsuz/spotify-widget',
    year: 2025,
  },
  {
    id: 'maptools',
    title: 'Maptools',
    description: 'QOL tools for the Guess the City Discord bot',
    languages: ['TypeScript'],
    url: 'https://maptools.trimpsuz.dev/',
    year: 2025,
  },
  {
    id: 'tjbar',
    title: 'tjbar',
    description: 'TJ for your waybar',
    languages: ['Rust'],
    url: 'https://github.com/Trimpsuz/tjbar',
    year: 2026,
  },
  {
    id: 'no-wasting-rockets',
    title: 'No Wasting Rockets',
    description: 'Fabric mod to prevent wasting firework rockets',
    languages: ['Kotlin'],
    url: 'https://github.com/Trimpsuz/no-wasting-rockets',
    year: 2024,
  },
  {
    id: 'msc-coolerbox',
    title: 'MSC Cooler Box',
    description: 'Cooler Boxes mod for My Summer Car',
    languages: ['C#'],
    url: 'https://github.com/trimpsuz/msc-coolerbox',
    year: 2024,
  },
];
