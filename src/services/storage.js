import { INITIAL_DATA } from '../data/initialData';
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'ASR_DYEING_ERP_V1';
const SUPABASE_CONFIG_KEY = 'ASR_SUPABASE_CONFIG';

const DEFAULT_SUPABASE_URL = "https://ocbzbysqtenqwfljyiyz.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYnpieXNxdGVucXdmbGp5aXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyMjYzNTAsImV4cCI6MjExMDgwMjM1MH0.xteCkR8nI56h1Tt3GtgDWK2jORzUWA0m4IbgpD_nWmw";

export function getSupabaseConfig() {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      const cfg = JSON.parse(raw);
      if (cfg.url && cfg.anonKey) return cfg;
    }
    return {
      url: DEFAULT_SUPABASE_URL,
      anonKey: DEFAULT_SUPABASE_KEY,
      autoSync: true
    };
  } catch (e) {
    return {
      url: DEFAULT_SUPABASE_URL,
      anonKey: DEFAULT_SUPABASE_KEY,
      autoSync: true
    };
  }
}

export function saveSupabaseConfig(config) {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
}

export function loadERPData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      saveERPData(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(saved);
    return {
      company: parsed.company || INITIAL_DATA.company,
      parties: parsed.parties || INITIAL_DATA.parties,
      items: parsed.items || INITIAL_DATA.items,
      machines: parsed.machines || INITIAL_DATA.machines,
      shades: parsed.shades || INITIAL_DATA.shades,
      standardRecipes: parsed.standardRecipes || INITIAL_DATA.standardRecipes,
      igrs: parsed.igrs || INITIAL_DATA.igrs,
      jobCards: parsed.jobCards || INITIAL_DATA.jobCards,
      dispatches: parsed.dispatches || INITIAL_DATA.dispatches,
      gatePasses: parsed.gatePasses || INITIAL_DATA.gatePasses
    };
  } catch (err) {
    console.error("Failed to load local state:", err);
    return INITIAL_DATA;
  }
}

export function saveERPData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const config = getSupabaseConfig();
    if (config.autoSync && config.url && config.anonKey) {
      pushToSupabase(data, config.url, config.anonKey).catch(e => {
        console.warn("Background auto-sync failed:", e);
      });
    }
  } catch (err) {
    console.error("Failed to save local state:", err);
  }
}

export async function testSupabaseConnection(url, anonKey) {
  try {
    if (!url || !anonKey) throw new Error("URL and Anon Key are required");
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.from('asr_erp_state').select('id').limit(1);
    if (error) throw error;
    return { success: true, message: "Connected to Supabase PostgreSQL successfully!" };
  } catch (err) {
    return { success: false, error: err.message || "Failed to reach Supabase" };
  }
}

export async function pushToSupabase(data, url, anonKey) {
  const supabase = createClient(url || DEFAULT_SUPABASE_URL, anonKey || DEFAULT_SUPABASE_KEY);
  const payload = {
    id: 'primary_mill_snapshot',
    state: data,
    updated_at: new Date().toISOString()
  };
  
  const { error } = await supabase
    .from('asr_erp_state')
    .upsert(payload, { onConflict: 'id' });
    
  if (error) throw error;
  return { success: true };
}

export async function pullFromSupabase(url, anonKey) {
  const supabase = createClient(url || DEFAULT_SUPABASE_URL, anonKey || DEFAULT_SUPABASE_KEY);
  const { data, error } = await supabase
    .from('asr_erp_state')
    .select('state')
    .eq('id', 'primary_mill_snapshot')
    .single();

  if (error) throw error;
  if (data && data.state) {
    saveERPData(data.state);
    return data.state;
  }
  throw new Error("No remote snapshot found in Supabase");
}
