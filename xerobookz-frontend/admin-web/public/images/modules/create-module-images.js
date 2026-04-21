const fs = require('fs');
const path = require('path');

// Create SVG images for each module
const modules = [
  { name: 'platform-core', title: 'Platform Core', color: '#0EA5E9', icon: '🔐' },
  { name: 'website', title: 'Website Module', color: '#22C55E', icon: '🌐' },
  { name: 'sales', title: 'Sales Module', color: '#0EA5E9', icon: '🛒' },
  { name: 'finance', title: 'Finance Module', color: '#22C55E', icon: '💰' },
  { name: 'inventory', title: 'Inventory & Manufacturing', color: '#0EA5E9', icon: '📦' },
  { name: 'hr', title: 'Human Resources', color: '#22C55E', icon: '👥' },
  { name: 'marketing', title: 'Marketing Module', color: '#0EA5E9', icon: '📢' },
  { name: 'services', title: 'Services Module', color: '#22C55E', icon: '💼' },
  { name: 'productivity', title: 'Productivity Module', color: '#0EA5E9', icon: '⚡' },
  { name: 'customization', title: 'Customization Module', color: '#22C55E', icon: '🎨' }
];

modules.forEach(module => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${module.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${module.color}33;stop-opacity:1" />
      <stop offset="100%" style="stop-color:${module.color}66;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#grad-${module.name})"/>
  <text x="400" y="200" font-family="Arial, sans-serif" font-size="120" text-anchor="middle" fill="#1F2937">${module.icon}</text>
  <text x="400" y="320" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#1F2937">${module.title}</text>
  <text x="400" y="370" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#6B7280">XeroBookz Enterprise Platform</text>
</svg>`;
  
  fs.writeFileSync(path.join(__dirname, `${module.name}.svg`), svg);
  console.log(`Created ${module.name}.svg`);
});

console.log('All module images created!');
