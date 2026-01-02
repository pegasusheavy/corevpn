import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

// Solid icons
import {
  faArrowRight,
  faBars,
  faBook,
  faBookOpen,
  faBug,
  faCheck,
  faChevronDown,
  faChevronRight,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCircleXmark,
  faClock,
  faCloud,
  faCode,
  faCog,
  faCogs,
  faCopy,
  faCube,
  faDatabase,
  faDownload,
  faExclamationTriangle,
  faExternalLink,
  faEye,
  faEyeSlash,
  faFile,
  faFileCode,
  faFileLines,
  faFilter,
  faFlask,
  faFolder,
  faGhost,
  faGlobe,
  faHeart,
  faHome,
  faKey,
  faLaptop,
  faLink,
  faList,
  faLock,
  faMagnifyingGlass,
  faMoon,
  faNetworkWired,
  faPaperPlane,
  faPlay,
  faPlug,
  faPlus,
  faQuestion,
  faRocket,
  faServer,
  faShield,
  faShieldHalved,
  faSliders,
  faSun,
  faTerminal,
  faTimes,
  faTools,
  faTriangleExclamation,
  faUser,
  faUserSecret,
  faUserShield,
  faWrench,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

// Brand icons
import {
  faDocker as fabDocker,
  faGithub,
  faLinux,
  faPatreon,
  faRust,
  faTwitter,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

// Regular icons
import {
  faCopy as farCopy,
  faFile as farFile,
  faFileLines as farFileLines,
} from '@fortawesome/free-regular-svg-icons';

/**
 * Initialize the Font Awesome icon library with all required icons.
 * Call this function in app.config.ts
 */
export function initializeIcons(library: FaIconLibrary): void {
  // Solid icons
  library.addIcons(
    faArrowRight,
    faBars,
    faBook,
    faBookOpen,
    faBug,
    faCheck,
    faChevronDown,
    faChevronRight,
    faCircleCheck,
    faCircleExclamation,
    faCircleInfo,
    faCircleXmark,
    faClock,
    faCloud,
    faCode,
    faCog,
    faCogs,
    faCopy,
    faCube,
    faDatabase,
    faDownload,
    faExclamationTriangle,
    faExternalLink,
    faEye,
    faEyeSlash,
    faFile,
    faFileCode,
    faFileLines,
    faFilter,
    faFlask,
    faFolder,
    faGhost,
    faGlobe,
    faHeart,
    faHome,
    faKey,
    faLaptop,
    faLink,
    faList,
    faLock,
    faMagnifyingGlass,
    faMoon,
    faNetworkWired,
    faPaperPlane,
    faPlay,
    faPlug,
    faPlus,
    faQuestion,
    faRocket,
    faServer,
    faShield,
    faShieldHalved,
    faSliders,
    faSun,
    faTerminal,
    faTimes,
    faTools,
    faTriangleExclamation,
    faUser,
    faUserSecret,
    faUserShield,
    faWrench,
    faXmark
  );

  // Brand icons
  library.addIcons(
    fabDocker,
    faGithub,
    faLinux,
    faPatreon,
    faRust,
    faTwitter,
    faXTwitter
  );

  // Regular icons
  library.addIcons(farCopy, farFile, farFileLines);
}

/**
 * Icon name constants for type safety
 */
export const Icons = {
  // Navigation
  home: 'home',
  arrowRight: 'arrow-right',
  chevronDown: 'chevron-down',
  chevronRight: 'chevron-right',
  externalLink: 'external-link',
  bars: 'bars',
  xmark: 'xmark',

  // Actions
  copy: 'copy',
  download: 'download',
  play: 'play',
  plus: 'plus',
  search: 'magnifying-glass',

  // Status
  check: 'check',
  circleCheck: 'circle-check',
  circleExclamation: 'circle-exclamation',
  circleInfo: 'circle-info',
  triangleExclamation: 'triangle-exclamation',

  // Features
  ghost: 'ghost',
  lock: 'lock',
  shield: 'shield',
  shieldHalved: 'shield-halved',
  key: 'key',
  userSecret: 'user-secret',
  userShield: 'user-shield',

  // Infrastructure
  server: 'server',
  database: 'database',
  cloud: 'cloud',
  networkWired: 'network-wired',
  cube: 'cube',
  terminal: 'terminal',
  cog: 'cog',
  cogs: 'cogs',
  sliders: 'sliders',
  wrench: 'wrench',
  tools: 'tools',
  plug: 'plug',

  // Documentation
  book: 'book',
  bookOpen: 'book-open',
  file: 'file',
  fileCode: 'file-code',
  fileLines: 'file-lines',
  code: 'code',
  rocket: 'rocket',
  globe: 'globe',
  laptop: 'laptop',

  // Brands
  github: ['fab', 'github'],
  docker: ['fab', 'docker'],
  linux: ['fab', 'linux'],
  rust: ['fab', 'rust'],
  twitter: ['fab', 'x-twitter'],
  patreon: ['fab', 'patreon'],
} as const;
