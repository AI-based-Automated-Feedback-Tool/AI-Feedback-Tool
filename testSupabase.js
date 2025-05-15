import { supabase } from "./src/SupabaseAuth/supabaseClient.js";

async function testSupabaseConnection() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Data:', data);
    }
  }
  
  testSupabaseConnection();