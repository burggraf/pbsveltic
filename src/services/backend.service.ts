import PocketBase, { BaseAuthStore } from 'pocketbase';
import { writable } from 'svelte/store';

/*
class CustomAuthStore extends BaseAuthStore {
    save(token: any, model: any) {
        super.save(token, model);

        // your custom business logic...
    }
}
export const pb = new PocketBase('http://127.0.0.1:8090', new CustomAuthStore());
*/
export const pb = new PocketBase('http://127.0.0.1:8090');

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


