import { currentUser } from '$services/supabase.auth.service';
import { supabase } from '$services/supabase.service';
import { pb } from '$services/pocketbase.service';
export const signOut = async () => {
    pb.authStore.clear();
    localStorage.clear();
    currentUser.set(null);
    return { error: null };
    // const { error } = await supabase.auth.signOut();
    // currentUser.set(null);
    // return { error };
  }
  