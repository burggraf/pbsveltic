import { pb } from '$services/pocketbase.service';
import { writable } from 'svelte/store';

export let currentUser: any = writable<any | null>(null);


const removeListener1 = pb.authStore.onChange((token, model) => {
  console.log('********* authStore changed:', token, model)
  currentUser.set(model);
});

export const loadUser = async () => {
  // get all keys from localStorage
  if (pb.authStore.model) {
    currentUser.set(pb.authStore.model);
  }
  pb.collection('users').authRefresh()
  const user = await pb.collection('users').authRefresh();
  if (user?.record) {
    currentUser.set(user.record);
  }
};
loadUser();

// supabase.auth.onAuthStateChange(async (event, session) => {
//   currentUser.set(session?.user ?? null);
// });  

// export let currentUserId = '';
// currentUser.subscribe((value: any) => {
//   if (value?.id) {
//     currentUserId = value?.id;
//   } else {
//     currentUserId = '';
//   }
// })



