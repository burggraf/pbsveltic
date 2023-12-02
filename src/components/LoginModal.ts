import { pb } from '$services/backend.service';
import { currentUser } from '$services/backend.service';
import { toast } from '$services/toast';

export const signUpWithEmail = async (email: string, password: string) => {
  let error: any = null;
  try {
    const user = await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
    });
    console.log('******************************************************')
    console.log('******* create user returned this', user);
    console.log('******************************************************')
    currentUser.set(user);
    if (pb.authStore.model) console.log('pb.authStore.model',pb.authStore.model);
    else console.log('pb.authStore.model', 'null');


    try {
      const result = await pb.collection("users").requestVerification(email);
      console.log('******* requestVerification', result);
      // message = "Check your email for the login link";

      // try logging in...
      const { user, error } = await signInWithEmail(email, password);
      console.log('******************************************************')
      console.log('******* signInWithEmail returned this', user, error);
      console.log('******************************************************')

      return { user, error: null};
    } catch (error: any) {
      console.error(error);
      return { user, error};
    }
    return { user, error: null};
  } catch (error: any) {
    console.error(error);
    return { user: null, error}
  }

//  return { user: data.user, session: data.session, error };

  }
  
  // TODO: this is not working
  export const sendMagicLink = async (email: string) => {
    toast('Magic link not implemented yet')
    // const { data, error } = await supabase.auth.signInWithOtp({
    //   email: email,
    //   options: {
    //     emailRedirectTo: window.location.origin
    //   }
    // });
    // return { user: data.user, session: data.session, error };
  }
  
  export const signInWithEmail = async (email: string, password: string) => {

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);

      // after the above you can also access the auth data from the authStore
      console.log('**********************************************')
      console.log('******* menu: pb.authStore', pb.authStore);
      console.log('**********************************************')

      console.log('pb.authStore.isValid', pb.authStore.isValid);
      console.log('pb.authStore.token',pb.authStore.token);
      if (pb.authStore.model) console.log('pb.authStore.model',pb.authStore.model);
      else console.log('pb.authStore.model', 'null');
      currentUser.set(pb.authStore.model);
      let error: any = null;
      return { user: authData, error: null };
  
    } catch (error: any) {
      console.error(error);
      currentUser.set(null);
      return { user: null, error}
    }
  }

  export const resetPassword = async (email: string) => {
    try {
      const data = await pb.collection('users').requestPasswordReset(email);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }
  