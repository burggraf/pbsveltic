<script lang="ts">
	import { IonPage } from "ionic-svelte"
    import { currentUser } from "$services/pocketbase.auth.service";
    console.log('*** currentUser', $currentUser);
    setTimeout(() => {
        console.log('*** currentUser', $currentUser);
    }, 2000);
</script>
<IonPage>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button />
            </ion-buttons>
            <ion-title>Welcome</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <h1>
            Welcome!
        </h1>
    </ion-content>
</IonPage>