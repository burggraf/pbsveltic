<script lang="ts">
	import IonPage from "$ionpage";
	import { personOutline } from "ionicons/icons"
    import { pb, currentUser } from '$services/backend.service'
    let name = '';
    const handleNameChange = async (event: any) => {
        console.log('handleNameChange', event.target.value!)
		name = event.target.value!
        console.log('name', name)
        if (!$currentUser) {
            console.log('*** no currentUser -- aborting handleNameChange() ***');
            return;
        }
        pb.collection('users').update($currentUser.id, {
            name: name,
        });
	}


</script>
<IonPage>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button />
            </ion-buttons>
            <ion-title>Account</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <h1>
            Account
        </h1>
        <ion-grid class="ion-padding">

        <ion-row>
            <ion-col>
                <ion-label>Name</ion-label>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>
                <ion-item class="loginItem" lines="none">
                    <ion-input
                        on:ionInput={handleNameChange}
                        class="loginInputBoxWithIcon"
                        type="text"
                        placeholder="Your name"
                        style="--padding-start: 10px;"
                        value={name}
                        debounce={500}
                    />
                    <ion-icon
                        class="inputIcon"
                        icon={personOutline}
                        slot="start"
                        size="large"
                        color="medium"
                    />
                </ion-item>
            </ion-col>
        </ion-row>
    </ion-grid>


    </ion-content>
</IonPage>
<style>
	.LoginGrid {
		max-width: 375px;
	}
	.ProvidersGrid {
		max-width: 375px;
	}
	input:-webkit-autofill {
		-webkit-text-fill-color: var(--ion-color-FORCEDARK);
		font-weight: 500px;
	}

	input:-webkit-autofill:focus {
		-webkit-text-fill-color: var(--ion-color-FORCEDARK);
		font-weight: 500px;
	}

	.inputIcon {
		margin-left: 10px;
		margin-right: 10px;
	}

	.loginItem {
		--padding-start: 0px;
		--padding-end: 0px;
		--inner-padding-end: 0px;
	}
	.loginInputBoxWithIcon {
		height: 50px;
		border: 1px solid rgb(212, 212, 212);
		background-color: var(--ion-background-color) !important;
		border-radius: 5px;
	}
	.toast {
		font-weight: bold;
	}
	.flex-container {
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		flex-flow: row wrap;
		-webkit-flex-flow: row wrap;
		-moz-flex-flow: row wrap;
		justify-content: center;
	}
</style>