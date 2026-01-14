
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

export const getSupabaseConfig = () => {
  const saved = localStorage.getItem('supabase_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse local supabase config", e);
    }
  }
  return {
    url: '',
    anonKey: '',
    source: 'NONE'
  };
};

// Internal helper for clean URL construction
const getCleanUrl = (url: string) => {
  let cleaned = url?.trim().replace(/\/+$/, '') || '';
  if (!cleaned) return '';

  const isLocal = cleaned.includes('localhost') || 
                  cleaned.includes('127.0.0.1') || 
                  cleaned.match(/^192\.168\./) ||
                  cleaned.match(/^172\./) ||
                  cleaned.match(/^10\./);

  // Strip protocol if it exists to normalize
  cleaned = cleaned.replace(/^https?:\/\//, '');

  // Strictly enforce HTTP for local network addresses
  if (isLocal) {
    return `http://${cleaned}`;
  }
  
  // Default to HTTPS for cloud/public addresses
  return `https://${cleaned}`;
};

const config = getSupabaseConfig();
const finalUrl = getCleanUrl(config.url);

export const supabase = finalUrl && config.anonKey 
  ? createClient(finalUrl, config.anonKey) 
  : null;

export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig();
  const currentUrl = getCleanUrl(config.url);
  return !!(currentUrl && config.anonKey && currentUrl.length > 5);
};

export const updateSupabaseConfig = (newConfig: any, shouldReload = true) => {
  const finalConfig = {
    ...newConfig,
    url: getCleanUrl(newConfig.url)
  };

  localStorage.setItem('supabase_config', JSON.stringify(finalConfig));
  if (shouldReload) {
    window.location.reload();
  }
};
