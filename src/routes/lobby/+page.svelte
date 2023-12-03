<script lang="ts">
    import IonPage from "$ionpage";
	import { onMount } from "svelte"
    import { pb } from '$services/backend.service';
    import { currentUser } from '$services/backend.service';
    let subscriptionRecordId: string = '';
    let usersInLobby: any = [];
    
    onMount(async () => {
        document.addEventListener("visibilitychange", async () => {
            if (document.visibilityState === 'hidden') {
                const record = await pb.collection('lobby').update(subscriptionRecordId, {state:{status: 'away',name: $currentUser.name}});
            } else {
                const record = await pb.collection('lobby').update(subscriptionRecordId, {state:{status: 'online',name: $currentUser.name}});
            }
        });  
        window.addEventListener('blur', async () => {
            const record = await pb.collection('lobby').update(subscriptionRecordId, {state:{status: 'away',name: $currentUser.name}});
        });      
        window.addEventListener('focus', async () => {
            const record = await pb.collection('lobby').update(subscriptionRecordId, {state:{status: 'online',name: $currentUser.name}});
        });      
        pb.collection('lobby').subscribe('*', function (e) {
            getAllUsersInLobby();
        });
        getAllUsersInLobby();
        currentUser.subscribe((user: any) => {
            setUserStatus();
        });
    });
    const setUserStatus = async () => {
        if (!$currentUser) {
            console.log('*** LOBBY: ionViewWillEnter *** currentUser not found')
            return;
        }
        try {
            const resultList = await pb.collection('lobby').getFirstListItem(`user="${$currentUser.id}"`, {});
            if (resultList) {
                subscriptionRecordId = resultList.id;
                const result = await pb.collection('lobby').update(subscriptionRecordId, {entered:(new Date().toISOString()),state:{status: 'online',name: $currentUser.name}});
                return;
            }
        } catch (error) {
        }
        const result = await pb.collection('lobby').create({
            user: $currentUser.id,
            state: {entered: (+new Date()), 
                    name: $currentUser.name, 
                    status: 'online'
                    },
        });
        subscriptionRecordId = result.id;
    }
    const ionViewWillEnter = async () => {
        // console.log('ionViewWillEnter event fired');
    }
    const ionViewWillLeave = async () => {
        const result = await pb.collection('lobby').delete(subscriptionRecordId);
    }
    const getAllUsersInLobby = async () => {
        const records = await pb.collection('lobby').getFullList({
            sort: '-created',
        });
        usersInLobby = records;
    }
</script>
<IonPage {ionViewWillEnter} {ionViewWillLeave}>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button />
            </ion-buttons>
            <ion-title>Lobby</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">

        <pre>

            {JSON.stringify(usersInLobby, null, 2)}
        </pre>
    </ion-content>
</IonPage>