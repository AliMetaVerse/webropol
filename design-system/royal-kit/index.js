import { componentTokens, designTokens } from '../styles/tokens.js';

const sidebarItems = [
  {
    id: 'home',
    href: '#/home',
    icon: 'fa-duotone fa-thin fa-home',
    label: 'Home'
  },
  {
    id: 'surveys',
    href: '#/surveys/list',
    icon: 'fa-duotone fa-thin fa-user-magnifying-glass',
    label: 'Surveys',
    moduleKey: 'surveysEnabled'
  },
  {
    id: 'events',
    href: '#/events/list',
    icon: 'fa-duotone fa-thin fa-calendar-alt',
    label: 'Events',
    moduleKey: 'eventsEnabled'
  },
  {
    id: 'sms',
    href: '#/sms/list',
    icon: 'fa-duotone fa-thin fa-sms',
    label: '2-Way SMS',
    moduleKey: 'smsEnabled'
  },
  {
    id: 'exw',
    href: '#/exw',
    icon: 'fa-duotone fa-thin fa-user-chart',
    label: 'EXW',
    moduleKey: 'exwEnabled'
  },
  {
    id: 'case-management',
    href: '#/case-management',
    icon: 'fa-duotone fa-thin fa-briefcase',
    label: 'Case Management',
    moduleKey: 'caseManagementEnabled'
  },
  {
    type: 'divider',
    id: 'primary-divider'
  },
  {
    id: 'news',
    href: '#/news',
    icon: 'fa-duotone fa-thin fa-newspaper',
    label: 'News',
    moduleKey: 'newsEnabled'
  },
  {
    id: 'mywebropol',
    href: '#/mywebropol',
    icon: 'fa-duotone fa-thin fa-book-open',
    label: 'MyWebropol',
    moduleKey: 'mywebropolEnabled'
  },
  {
    id: 'branding',
    href: '#/branding',
    icon: 'fa-duotone fa-thin fa-swatchbook',
    label: 'Branding',
    moduleKey: 'brandingEnabled',
    defaultEnabled: false
  },
  {
    id: 'admin-tools',
    href: '#/admin-tools',
    icon: 'fa-duotone fa-thin fa-tools',
    label: 'Admin Tools',
    moduleKey: 'adminToolsEnabled'
  },
  {
    id: 'training-videos',
    href: '#/training-videos',
    icon: 'fa-duotone fa-thin fa-video',
    label: 'Training Videos',
    moduleKey: 'trainingEnabled'
  },
  {
    id: 'shop',
    href: '#/shop',
    icon: 'fa-duotone fa-thin fa-shopping-cart',
    label: 'Shop',
    moduleKey: 'shopEnabled'
  }
];

const headerItems = [
  {
    id: 'collapsed-menu',
    label: 'Open menu',
    icon: 'fa-duotone fa-thin fa-bars',
    visibility: 'desktop-collapsed-only'
  },
  {
    id: 'create-menu',
    label: 'Create New',
    icon: 'fal fa-plus',
    settingKey: 'showHeaderCreateMenu',
    defaultEnabled: true
  },
  {
    id: 'sidebar-toggle',
    label: 'Toggle sidebar',
    icon: 'fa-duotone fa-thin fa-columns'
  },
  {
    id: 'theme-selector',
    label: 'View and Theme',
    icon: 'fa-duotone fa-thin fa-sliders',
    attribute: 'show-theme-selector',
    defaultEnabled: true
  },
  {
    id: 'rating-selector',
    label: 'Feedback',
    icon: 'fa-duotone fa-thin fa-star',
    settingKey: 'showRatingSelector',
    defaultEnabled: true
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: 'fa-duotone fa-thin fa-sparkles',
    visibility: 'requires aiAssistant.enabledInApp and aiAssistant.enabledFromSettings'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'fa-duotone fa-thin fa-bell',
    attribute: 'show-notifications'
  },
  {
    id: 'help',
    label: 'Help',
    icon: 'fa-duotone fa-thin fa-question-circle',
    attribute: 'show-help'
  },
  {
    id: 'user-menu',
    label: 'User menu',
    icon: 'fa-duotone fa-thin fa-chevron-down',
    attribute: 'show-user-menu',
    defaultEnabled: true
  }
];

export const reactColorTokens = {
  ...designTokens.colors,
  aliases: {
    webropolGray: designTokens.colors.neutral,
    webropolPrimary: designTokens.colors.primary
  }
};

export const reactTypographyTokens = {
  ...designTokens.typography,
  presets: {
    display: {
      fontFamily: 'Roboto Condensed, Arial Narrow, sans-serif',
      fontSize: '3rem',
      lineHeight: '3.5rem',
      fontWeight: '700'
    },
    h1: {
      fontFamily: 'Roboto Condensed, Arial Narrow, sans-serif',
      fontSize: '2rem',
      lineHeight: '2.5rem',
      fontWeight: '700'
    },
    h2: {
      fontFamily: 'Roboto Condensed, Arial Narrow, sans-serif',
      fontSize: '1.8125rem',
      lineHeight: '2rem',
      fontWeight: '700'
    },
    h3: {
      fontFamily: 'Roboto Condensed, Arial Narrow, sans-serif',
      fontSize: '1.625rem',
      lineHeight: '2rem',
      fontWeight: '700'
    },
    bodyLarge: {
      fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif',
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: '400'
    },
    bodyMedium: {
      fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: '400'
    },
    bodySmall: {
      fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif',
      fontSize: '0.8125rem',
      lineHeight: '1.25rem',
      fontWeight: '400'
    },
    caption: {
      fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '400'
    }
  }
};

export const reactButtonSpec = {
  states: ['default', 'hover', 'active', 'focus', 'disabled', 'loading'],
  sizes: {
    ...componentTokens.button.sizes,
    micro: { padding: '6px 12px', fontSize: 'xs', lineHeight: '1.25rem' },
    'icon-sm': { width: '32px', height: '32px' },
    'icon-md': { width: '40px', height: '40px' },
    'icon-lg': { width: '48px', height: '48px' },
    'icon-xl': { width: '56px', height: '56px' }
  },
  roundness: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
  props: {
    iconPosition: ['left', 'right'],
    fullWidth: [true, false],
    iconOnly: [true, false],
    hrefMode: [true, false]
  },
  variants: {
    primary: {
      default: { background: '#1e6880', text: '#ffffff', border: 'rgba(255,255,255,0.2)' },
      hover: { background: '#215669', text: '#ffffff' },
      active: { background: '#204859', text: '#ffffff' },
      focus: { ring: '#1e6880' },
      disabled: { background: '#e6e7e8', text: '#61686a', cursor: 'not-allowed' }
    },
    secondary: {
      default: { background: '#eefbfd', text: '#1e6880', border: '#1e6880' },
      hover: { background: '#b0e8f1', text: '#215669', border: '#215669' },
      active: { background: '#9cd9e6', text: '#204859', border: '#204859' },
      focus: { ring: '#1e6880' },
      disabled: { background: '#e6e7e8', text: '#61686a', border: '#bfc3c4', cursor: 'not-allowed' }
    },
    tertiary: {
      default: { background: 'transparent', text: '#1e6880', border: 'transparent' },
      hover: { background: '#eefbfd', text: '#215669' },
      active: { background: '#b0e8f1', text: '#204859' },
      focus: { ring: '#1e6880' },
      disabled: { text: '#61686a', cursor: 'not-allowed' }
    },
    success: {
      default: { background: '#1a7e4a', text: '#ffffff', border: 'rgba(255,255,255,0.2)' },
      hover: { background: '#156b3e' },
      active: { background: '#105833' },
      focus: { ring: '#1a7e4a' },
      disabled: { background: '#e6e7e8', text: '#61686a', cursor: 'not-allowed' }
    },
    danger: {
      default: { background: '#be1241', text: '#ffffff', border: 'rgba(255,255,255,0.2)' },
      hover: { background: '#a60e38' },
      active: { background: '#8e0c30' },
      focus: { ring: '#be1241' },
      disabled: { background: '#e6e7e8', text: '#61686a', cursor: 'not-allowed' }
    },
    'danger-outline': {
      default: { background: '#ffe4e7', text: '#88133a', border: '#88133a' },
      hover: { background: '#fcc8cf', text: '#7a1133', border: '#7a1133' },
      active: { background: '#f9acb6', text: '#6b0f2d', border: '#6b0f2d' },
      focus: { ring: '#be1241' },
      disabled: { background: '#e6e7e8', text: '#61686a', border: '#bfc3c4', cursor: 'not-allowed' }
    },
    royal: {
      default: { gradient: ['#823bdd', '#4f46e5'], text: '#ffffff', border: 'rgba(255,255,255,0.2)' },
      hover: { gradient: ['#6922c4', '#4338ca'] },
      active: { gradient: ['#511a98', '#3730a3'] },
      focus: { ring: '#d5bef4' },
      disabled: { background: '#e6e7e8', text: '#61686a', cursor: 'not-allowed' }
    },
    royalLight: {
      default: { gradient: ['#f1e9fb', '#eef2ff'], text: '#6922c4', border: '#6922c4' },
      hover: { gradient: ['#eef2ff', '#f1e9fb'], shadow: '0px 6px 15px rgba(0,0,0,0.2)' },
      active: { gradient: ['#d5bef4', '#eef2ff'], border: '#67e8f9' },
      focus: { ring: '#6922c4' },
      disabled: { background: '#e6e7e8', text: '#61686a', border: 'transparent', cursor: 'not-allowed' }
    },
    royalSecondary: {
      default: { background: 'transparent', text: '#6922c4', border: '#6922c4' },
      hover: { gradient: ['#eef2ff', '#f1e9fb'], shadow: '0px 6px 15px rgba(0,0,0,0.2)' },
      active: { gradient: ['#d5bef4', '#eef2ff'] },
      focus: { ring: '#6922c4' },
      disabled: { background: '#e6e7e8', text: '#61686a', border: 'transparent', cursor: 'not-allowed' }
    },
    royalTertiary: {
      default: { background: 'transparent', text: '#6922c4', border: 'transparent' },
      hover: { gradient: ['#eef2ff', '#f1e9fb'], border: '#6922c4', shadow: '0px 6px 15px rgba(0,0,0,0.2)' },
      active: { gradient: ['#d5bef4', '#eef2ff'] },
      focus: { ring: '#6922c4' },
      disabled: { text: '#61686a', cursor: 'not-allowed' }
    },
    royalIcon: {
      default: { background: 'transparent', text: '#6922c4', border: 'transparent' },
      hover: { gradient: ['#eef2ff', '#f1e9fb'], border: '#6922c4', shadow: '0px 6px 15px rgba(0,0,0,0.2)' },
      active: { gradient: ['#d5bef4', '#eef2ff'] },
      focus: { ring: '#6922c4' },
      disabled: { text: '#61686a', cursor: 'not-allowed' }
    }
  }
};

export const reactTabsSpec = {
  states: ['default', 'hover', 'active', 'disabled', 'focus'],
  variants: {
    unified: {
      sizes: ['sm', 'md', 'lg'],
      shapes: ['pill', 'rounded'],
      alignment: ['start', 'center', 'end'],
      supports: ['icon', 'badge', 'panel'],
      activeState: 'filled active tab inside shared container'
    },
    primary: {
      supports: ['icon', 'badge'],
      default: { background: 'transparent', text: '#61686a' },
      hover: { background: '#79d6e7', text: '#204859' },
      active: { background: '#1e6880', text: '#ffffff' },
      disabled: { opacity: 0.5, cursor: 'not-allowed' }
    },
    secondary: {
      supports: ['icon', 'badge'],
      default: { background: 'transparent', text: '#61686a' },
      hover: { background: '#b0e8f1', text: '#204859' },
      active: { background: '#b0e8f1', text: '#204859' },
      disabled: { opacity: 0.5, cursor: 'not-allowed' }
    },
    light: {
      supports: ['icon', 'badge'],
      default: { background: 'transparent', borderBottom: 'transparent' },
      hover: { borderBottom: '#79d6e7', text: '#204859' },
      active: { borderBottom: '#1e6880', text: '#1e6880' },
      disabled: { opacity: 0.5, cursor: 'not-allowed' }
    },
    heavy: {
      orientation: ['horizontal', 'vertical'],
      alignment: ['start', 'center', 'end'],
      supports: ['icon', 'description', 'badgeCircle', 'selectionCheck'],
      activeState: 'card-style active state with checkmark'
    },
    'main-primary': {
      alignment: ['start', 'center', 'end'],
      supports: ['icon', 'badge', 'selectionIndicator'],
      activeState: 'bottom line indicator plus active label state'
    }
  }
};

export const reactSmartNotifierSpec = {
  states: ['default', 'dismissed', 'action-clicked'],
  variants: {
    informative: {
      title: 'Info',
      icon: 'fal fa-circle-info',
      panel: { background: '#eefbfd', border: '#1d809d', text: '#204859' },
      iconShell: { background: '#d5f4f8', border: '#b0e8f1', text: '#1d809d' },
      primaryAction: { background: '#1e6880', text: '#ffffff', hover: '#204859' },
      secondaryAction: { text: '#1e6880', hoverBackground: '#d5f4f8' }
    },
    success: {
      title: 'Success',
      icon: 'fal fa-circle-check',
      panel: { background: '#edf9f1', border: '#1a7e4a', text: '#155c37' },
      iconShell: { background: '#d4f2df', border: '#b7e6ca', text: '#1a7e4a' },
      primaryAction: { background: '#1a7e4a', text: '#ffffff', hover: '#155c37' },
      secondaryAction: { text: '#1a7e4a', hoverBackground: '#d4f2df' }
    },
    warning: {
      title: 'Warning',
      icon: 'fal fa-triangle-exclamation',
      panel: { background: '#fff7e8', border: '#d97706', text: '#8b4a06' },
      iconShell: { background: '#ffedd5', border: '#fed7aa', text: '#d97706' },
      primaryAction: { background: '#b45309', text: '#ffffff', hover: '#92400e' },
      secondaryAction: { text: '#b45309', hoverBackground: '#ffedd5' }
    },
    error: {
      title: 'Error',
      icon: 'fal fa-circle-exclamation',
      panel: { background: '#fff1f3', border: '#be123c', text: '#881337' },
      iconShell: { background: '#ffe4e7', border: '#fecdd3', text: '#be123c' },
      primaryAction: { background: '#be123c', text: '#ffffff', hover: '#9f1239' },
      secondaryAction: { text: '#be123c', hoverBackground: '#ffe4e7' }
    },
    neutral: {
      title: 'Neutral',
      icon: 'fal fa-bell',
      panel: { background: '#ffffff', border: '#787f81', text: '#45484a' },
      iconShell: { background: '#f3f4f4', border: '#e6e7e8', text: '#787f81' },
      primaryAction: { background: '#1e6880', text: '#ffffff', hover: '#204859' },
      secondaryAction: { text: '#1e6880', hoverBackground: '#f3f4f4' }
    },
    'royal-light': {
      title: 'Royal Light',
      icon: 'fal fa-megaphone',
      panel: { gradient: ['#f4ecfc', '#eef7ff'], border: '#6922c4', text: '#3d2459' },
      iconShell: { background: 'rgba(255,255,255,0.55)', border: '#d5bef4', text: '#6922c4' },
      action: { gradient: ['#f1e9fb', '#eef2ff'], text: '#6922c4', border: '#6922c4' }
    },
    'royal-dark': {
      title: 'Royal Dark',
      icon: 'fal fa-megaphone',
      panel: { gradient: ['#823bdd', '#5c3dd9', '#1096ba'], border: '#f1e9fb', text: '#ffffff' },
      iconShell: { background: 'rgba(0,0,0,0.10)', border: '#6922c4', text: '#f1e9fb' },
      action: { gradient: ['#f1e9fb', '#eef2ff'], text: '#6922c4', border: '#6922c4' }
    }
  },
  sizes: {
    auto: { maxWidth: '100%' },
    desktop: { maxWidth: '620px', stackActions: false },
    tablet: { maxWidth: '580px', stackActions: false },
    mobile: { maxWidth: '448px', stackActions: true },
    'mobile-compact': { maxWidth: '448px', compact: true, stackActions: false }
  },
  toggles: ['dismissible', 'showIcon', 'showDescription', 'showActions']
};

export const reactBannerSpec = {
  states: ['default', 'dismissed'],
  types: {
    regular: {
      background: '#ffffff',
      border: '#e6e7e8',
      shadow: 'card'
    },
    outlined: {
      background: 'transparent',
      border: '#d1d5d6',
      shadow: 'none'
    }
  },
  sizes: {
    desktop: {
      padding: '24px',
      iconBox: '48px',
      headingSize: '1.25rem',
      descriptionSize: '0.875rem'
    },
    tablet: {
      padding: '16px',
      iconBox: '44px',
      headingSize: '1.25rem',
      descriptionSize: '0.875rem'
    },
    mobile: {
      padding: '16px',
      iconBox: '44px',
      headingSize: '1rem',
      descriptionSize: '0.8125rem',
      actionLayout: 'stacked'
    }
  },
  actions: {
    primary: {
      background: '#eefbfd',
      border: '#1e6880',
      text: '#1e6880',
      hoverBackground: '#d5f4f8'
    },
    secondary: {
      background: 'transparent',
      text: '#1e6880',
      hoverBackground: '#eefbfd'
    }
  },
  toggles: ['dismissible', 'showIcon', 'showActions']
};

export const reactBadgeSpec = {
  states: ['default', 'dismissible', 'dismissed'],
  variants: {
    primary: { background: '#B0E8F1', text: '#102E3C' },
    secondary: { background: '#d5f4f8', text: '#1e6880' },
    success: { background: '#A9D69F', text: '#38672E' },
    warning: { background: '#FCCE4D', text: '#B44E09' },
    error: { background: '#FDA4B2', text: '#BE1241' },
    neutral: { background: '#D1D5D6', text: '#61686A' }
  },
  sizes: {
    sm: { padding: '4px 8px', fontSize: '0.75rem' },
    md: { padding: '4px 12px', fontSize: '0.875rem' },
    lg: { padding: '8px 16px', fontSize: '1rem' }
  }
};

export const reactLoadingSpec = {
  states: ['default', 'overlay', 'hidden'],
  types: ['spinner', 'dots', 'pulse', 'bars'],
  sizes: {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  },
  color: '#1d809d',
  overlay: {
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(4px)',
    zIndex: 50
  }
};

export const reactNavbarSpec = {
  sidebarItems,
  headerItems,
  states: ['default', 'hover', 'active', 'disabled', 'collapsed', 'mobile-open'],
  sidebarStateTokens: {
    active: {
      background: '#eefbfd',
      text: '#1e6880',
      border: '#b0e8f1'
    },
    hover: {
      background: '#f3f4f4',
      text: '#45484a'
    }
  }
};

export function getReactCssVariables(prefix = '--webropol') {
  const lines = [];
  const pushGroup = (group, value, path = []) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([key, nestedValue]) => {
        pushGroup(group, nestedValue, [...path, key]);
      });
      return;
    }

    const variableName = [prefix, group, ...path].join('-');
    const cssValue = Array.isArray(value) ? value.join(', ') : value;
    lines.push(`${variableName}: ${cssValue};`);
  };

  pushGroup('color', designTokens.colors);
  pushGroup('font-family', designTokens.typography.fontFamily);
  pushGroup('font-size', designTokens.typography.fontSize);
  pushGroup('font-weight', designTokens.typography.fontWeight);
  pushGroup('line-height', designTokens.typography.lineHeight);
  pushGroup('spacing', designTokens.spacing);
  pushGroup('radius', designTokens.borderRadius);
  pushGroup('shadow', designTokens.boxShadow);

  return `:root {\n  ${lines.join('\n  ')}\n}`;
}

export const reactDesignSystemExport = {
  colors: reactColorTokens,
  typography: reactTypographyTokens,
  buttons: reactButtonSpec,
  navbar: reactNavbarSpec,
  tabs: reactTabsSpec,
  smartNotifier: reactSmartNotifierSpec,
  banner: reactBannerSpec,
  badge: reactBadgeSpec,
  loading: reactLoadingSpec,
  tokens: designTokens,
  componentTokens
};

export default reactDesignSystemExport;