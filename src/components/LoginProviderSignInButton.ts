import { pb } from '$services/backend.service';
export const signInWithProvider = async (provider: string) => {
  // If the popup is being blocked on Safari, you can try the suggestion from:
  // https://github.com/pocketbase/pocketbase/discussions/2429#discussioncomment-5943061.
  return await pb.collection('users').authWithOAuth2({ provider });
}
  