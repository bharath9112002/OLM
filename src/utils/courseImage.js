const SIMPLE_ICONS_BASE = 'https://cdn.simpleicons.org/';
const ICONS8_BASE = 'https://img.icons8.com/color/96/';
const ICONIFY_BASE = 'https://api.iconify.design/mdi/';

const simpleIcon = (slug) => `${SIMPLE_ICONS_BASE}${slug}`;
// Simple Icons excludes trademarked Microsoft/Amazon logos, so those few
// (Excel, AWS, Azure) come from Icons8's hotlinkable icon set instead.
const icons8Icon = (id) => `${ICONS8_BASE}${id}.png`;
const categoryIcon = (icon, color) => `${ICONIFY_BASE}${icon}.svg?color=${encodeURIComponent(color)}`;

// Checked in order (most specific phrase first) against the course name so
// a title that names a specific tool/brand shows that brand's logo instead
// of a generic category icon — e.g. "Business Analytics with Excel" gets
// the Excel logo.
const NAME_ICONS = [
  [/excel/i, icons8Icon('microsoft-excel-2019')],
  [/figma/i, simpleIcon('figma')],
  [/azure/i, icons8Icon('azure-1')],
  [/\baws\b/i, icons8Icon('amazon-web-services')],
  [/google cloud/i, simpleIcon('googlecloud')],
  [/google ads/i, simpleIcon('googleads')],
  [/app store/i, simpleIcon('appstore')],
  [/play store|google play/i, simpleIcon('googleplay')],
  [/docker/i, simpleIcon('docker')],
  [/kubernetes/i, simpleIcon('kubernetes')],
  [/tensorflow/i, simpleIcon('tensorflow')],
  [/pandas/i, simpleIcon('pandas')],
  [/numpy/i, simpleIcon('numpy')],
  [/python/i, simpleIcon('python')],
  [/react/i, simpleIcon('react')],
  [/node\.?js/i, simpleIcon('nodedotjs')],
  [/flutter/i, simpleIcon('flutter')],
  [/\bdart\b/i, simpleIcon('dart')],
  [/swift/i, simpleIcon('swift')],
  [/kotlin/i, simpleIcon('kotlin')],
  [/\bcss\b/i, simpleIcon('css')],
  [/javascript/i, simpleIcon('javascript')],
  [/\bsql\b/i, simpleIcon('mysql')],
  [/mongodb|mern/i, simpleIcon('mongodb')],
];

// Fallback for course names that don't mention a specific tool: a curated,
// on-topic icon per category. Deliberately not a stock-photo search — that
// approach (Flickr keyword search) returned essentially random results,
// including completely unrelated or inappropriate photos.
const CATEGORY_ICONS = {
  'web development': categoryIcon('code-tags', '#6366f1'),
  'data science': categoryIcon('chart-line', '#0ea5e9'),
  'ui/ux design': categoryIcon('palette', '#ec4899'),
  'mobile development': categoryIcon('cellphone', '#22c55e'),
  'cloud computing': categoryIcon('cloud', '#38bdf8'),
  'cyber security': categoryIcon('shield-lock', '#ef4444'),
  business: categoryIcon('briefcase', '#f59e0b'),
  marketing: categoryIcon('bullhorn', '#a855f7'),
};
const DEFAULT_ICON = categoryIcon('school', '#6366f1');

export function isLogoImage(url = '') {
  return url.startsWith(SIMPLE_ICONS_BASE) || url.startsWith(ICONS8_BASE) || url.startsWith(ICONIFY_BASE);
}

// Returns an image relevant to the course: a brand logo when the course
// name mentions a recognizable tool (Excel, React, AWS, ...), otherwise an
// icon matching the course category.
export function getCourseImage(category = '', name = '') {
  const match = NAME_ICONS.find(([pattern]) => pattern.test(name));
  if (match) {
    return match[1];
  }
  return CATEGORY_ICONS[category.trim().toLowerCase()] || DEFAULT_ICON;
}
