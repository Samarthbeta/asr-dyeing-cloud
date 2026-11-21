import { INITIAL_DATA } from '../data/initialData';
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'ASR_DYEING_ERP_V1';
const SUPABASE_CONFIG_KEY = 'ASR_SUPABASE_CONFIG';

export function getSupabaseConfig() {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    return raw ? JSON.parse(raw) : { url: '', anonKey: '', autoSync: false };
  } catch (e) {
    return { url: '', anonKey: '', autoSync: false };
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
    // Guarantee required top-level arrays exist
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
    console.error("Failed to load ERP local state:", err);
    return INITIAL_DATA;
  }
}

export function saveERPData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // If Supabase autoSync is enabled, trigger background sync
    const config = getSupabaseConfig();
    if (config.autoSync && config.url && config.anonKey) {
      pushToSupabase(data, config.url, config.anonKey).catch(e => {
        console.warn("Background Supabase auto-sync failed:", e);
      });
    }
  } catch (err) {
    console.error("Failed to save ERP local state:", err);
  }
}

export async function testSupabaseConnection(url, anonKey) {
  try {
    if (!url || !anonKey) throw new Error("URL and Anon Key are required");
    const supabase = createClient(url, anonKey);
    // Quick probe query
    const { data, error } = await supabase.from('asr_erp_snapshots').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      // 42P01 is table does not exist, which is fine, means auth succeeded
      throw error;
    }
    return { success: true, message: "Connected to Supabase successfully!" };
  } catch (err) {
    return { success: false, error: err.message || "Failed to reach Supabase" };
  }
}

export async function pushToSupabase(data, url, anonKey) {
  const supabase = createClient(url, anonKey);
  const payload = {
    app_version: "1.0.0",
    last_updated: new Date().toISOString(),
    state: data
  };
  
  const { error } = await supabase
    .from('asr_erp_snapshots')
    .upsert({ id: 'primary_mill_snapshot', ...payload });
    
  if (error) throw error;
  return { success: true };
}

export async function pullFromSupabase(url, anonKey) {
  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase
    .from('asr_erp_snapshots')
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
