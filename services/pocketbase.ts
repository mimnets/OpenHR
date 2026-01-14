
import PocketBase from 'https://esm.sh/pocketbase@0.25.0';

export const getPocketBaseConfig = () => {
  const saved = localStorage.getItem('pocketbase_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse local PocketBase config", e);
    }
  }
  return {
    url: '',
    source: 'NONE'
  };
};

const getCleanUrl = (url: string) => {
  if (!url) return '';
  
  // 1. Remove whitespace and trailing slashes
  let cleaned = url.trim().replace(/\/+$/, '');
  
  // 2. Remove trailing /api if the user included it (the SDK adds it automatically)
  cleaned = cleaned.replace(/\/api$/, '');

  // 3. Ensure protocol exists
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'http://' + cleaned;
  }
  
  return cleaned;
};

const config = getPocketBaseConfig();
const finalUrl = getCleanUrl(config.url);

// IMPORTANT: Disable autoCancellation to prevent simultaneous requests from killing each other
export const pb = finalUrl ? new PocketBase(finalUrl) : null;
if (pb) {
  pb.autoCancellation(false);
}

export const isPocketBaseConfigured = () => {
  const config = getPocketBaseConfig();
  return !!(config.url && config.url.trim().length > 5);
};

export const updatePocketBaseConfig = (newConfig: any, shouldReload = true) => {
  const finalConfig = {
    ...newConfig,
    url: getCleanUrl(newConfig.url)
  };
  localStorage.setItem('pocketbase_config', JSON.stringify(finalConfig));
  if (shouldReload) window.location.reload();
};
