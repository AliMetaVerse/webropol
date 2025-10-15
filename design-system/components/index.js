/**
 * Webropol Design System - Unified Component Export
 * All enhanced components with backward compatibility
 */

// Core utilities
export { BaseComponent } from '../utils/base-component.js';

// Button components
export { WebropolButton } from './buttons/Button.js';

// Card components
export { WebropolCard } from './cards/Card.js';
export { WebropolCardLegacy, WebropolCardHeader, WebropolCardContent, WebropolCardList, WebropolCardListItem, WebropolCardActions, WebropolGradientCard } from './cards/CardLegacy.js';
export { WebropolActionCard } from './cards/ActionCard.js';
export { WebropolConfigurableCard } from './cards/ConfigurableCard.js';
export { WebropolListCard } from './cards/ListCard.js';
export { WebropolVideoCard } from './cards/VideoCard.js';

// Navigation components
export { WebropolHeader } from './navigation/Header.js';
export { WebropolHeader as WebropolHeaderEnhanced } from './navigation/HeaderEnhanced.js';
export { WebropolSidebar } from './navigation/Sidebar.js';
export { WebropolSidebarEnhanced } from './navigation/SidebarEnhanced.js';
export { WebropolBreadcrumbs } from './navigation/Breadcrumbs.js';
export { Tabs } from './navigation/Tabs.js';
export { WebropolBrand } from './navigation/Brand.js';

// Interactive components
export { WebropolFloatingButton } from './interactive/FloatingButton.js';

// Form components
export { Input } from './forms/Input.js';
export { WebropolRadioPill } from './forms/RadioPill.js';

// Feedback components
export { Badge } from './feedback/Badge.js';
export { Loading } from './feedback/Loading.js';
export { Tooltip } from './feedback/Tooltip.js';
export { WebropolPromo } from './feedback/PromoToast.js';
// AI components
export { WebropolAIAssistant } from './ai/AIAssistantPanel.js';

// Modal components
export { Modal } from './modals/Modal.js';
export { WebropolSettingsModal } from './modals/SettingsModal.js';

// Auto-register all components when this module is imported
import './buttons/Button.js';
import './cards/Card.js';
import './cards/CardLegacy.js';
import './cards/ActionCard.js';
import './cards/ConfigurableCard.js';
import './cards/ListCard.js';
import './cards/VideoCard.js';
import './navigation/Header.js';
import './navigation/HeaderEnhanced.js';
import './navigation/Sidebar.js';
import './navigation/SidebarEnhanced.js';
import './navigation/Breadcrumbs.js';
import './navigation/Tabs.js';
import './navigation/Brand.js';
import './interactive/FloatingButton.js';
import './forms/Input.js';
import './forms/RadioPill.js';
import './feedback/Badge.js';
import './feedback/Loading.js';
import './feedback/Tooltip.js';
import './feedback/PromoToast.js';
import './modals/Modal.js';
import './modals/SettingsModal.js';
import './ai/AIAssistantPanel.js';

// Backward compatibility aliases
window.WebropolComponents = {
  Button: 'webropol-button',
  Card: 'webropol-card',
  CardLegacy: 'webropol-card-legacy',
  CardHeader: 'webropol-card-header',
  CardContent: 'webropol-card-content',
  CardList: 'webropol-card-list',
  CardListItem: 'webropol-card-list-item',
  CardActions: 'webropol-card-actions',
  GradientCard: 'webropol-gradient-card',
  ActionCard: 'webropol-action-card',
  ConfigurableCard: 'webropol-configurable-card',
  ListCard: 'webropol-list-card',
  VideoCard: 'webropol-video-card',
  Header: 'webropol-header',
  HeaderEnhanced: 'webropol-header-enhanced',
  Sidebar: 'webropol-sidebar',
  SidebarEnhanced: 'webropol-sidebar-enhanced',
  Brand: 'webropol-brand',
  Breadcrumbs: 'webropol-breadcrumbs',
  Tabs: 'webropol-tabs',
  FloatingButton: 'webropol-floating-button',
  Input: 'webropol-input',
  Badge: 'webropol-badge',
  Loading: 'webropol-loading',
  Tooltip: 'webropol-tooltip',
  Promo: 'webropol-promo',
  Modal: 'webropol-modal',
  SettingsModal: 'webropol-settings-modal',
  AIAssistant: 'webropol-ai-assistant'
};
