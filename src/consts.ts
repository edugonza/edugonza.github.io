// Global site metadata. Edit these to personalise the site.

export const SITE = {
  title: 'Eduardo Gonzalez Lopez de Murillas',
  // Used as the default <meta name="description"> and in the RSS feed.
  description: 'Personal site of Eduardo Gonzalez Lopez de Murillas, machine learning engineer: projects, notes and technical writing on computer science, ML and AI agents.',
  author: 'Eduardo Gonzalez Lopez de Murillas',
  // Short tagline shown under the name on the home page.
  tagline: "Machine learning engineer at Xebia, full stack developer and former researcher with a PhD in process mining. I'm curious about how things work, and I'm happiest when I'm building them. Here I write about what I learn along the way.",
  locale: 'en',
  // Profile picture shown on the home page; GitHub serves the current avatar at this URL.
  avatar: 'https://github.com/edugonza.png?size=256',
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
];

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/edugonza', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/edugonza', icon: 'linkedin' },
  // { label: 'Email', href: 'mailto:you@example.com', icon: 'mail' },
  { label: 'RSS', href: '/rss.xml', icon: 'rss' },
] as const;
