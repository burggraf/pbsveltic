import PocketBase, { BaseAuthStore } from 'pocketbase';

class CustomAuthStore extends BaseAuthStore {
    save(token: any, model: any) {
        super.save(token, model);

        // your custom business logic...
    }
}

// export const pb = new PocketBase('http://127.0.0.1:8090', new CustomAuthStore());
export const pb = new PocketBase('http://127.0.0.1:8090');