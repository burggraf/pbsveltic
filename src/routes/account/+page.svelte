<script lang="ts">
	import IonPage from "$ionpage";
	import { imageOutline, personOutline } from "ionicons/icons"
    import { pb, currentUser, apiURL } from '$services/backend.service'
	import { onMount } from "svelte"
    let name = '';
    const handleNameChange = async (event: any) => {
		name = event.target.value!
        if ($currentUser) {
            pb.collection('users').update($currentUser.id, {
                name: name,
            });
        } else {
            console.log('*** no currentUser -- aborting name change ***');
            return;
        }
	}

    onMount(async () => {
        if ($currentUser) {
            name = $currentUser.name;
        }

        const fileInput: any = document.getElementById('fileInput');
        if (fileInput) {
            console.log('*** fileInput found ***', fileInput)
            // listen to file input changes and add the selected files to the form data
            fileInput.addEventListener('change', async function () {

                const formData = new FormData();
                /*
                const updateData = new FormData();
                updateData.append("about", about);
                updateData.append("avatar", avatar); // must be File or Blob
                await locals.pb.collection('users').update(locals.user.id, updateData);                
                */                

                console.log('*** fileInput change ***', fileInput.files);
                for (let file of fileInput.files) {
                    console.log('*** file', file);
                    formData.append('avatar', file);
                }

                // upload and create new record
                // const createdRecord = await pb.collection('example').create(formData);
                console.log('*** formData', formData, formData.entries.length)
                try {
                    const result = await pb.collection('users').update($currentUser.id, formData);
                    console.log('file upload result', result);
                } catch (error) {
                    console.error('Error uploading file:', error);
                }

            });

        } else {
            console.log('*** fileInput not found ***')
        }

    });

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

        <ion-row>
            <ion-col>
                <ion-label>Avatar/Image</ion-label>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>
                <ion-item class="loginItem" lines="none">
                    <input type="file" id="fileInput" />
                    <ion-icon
                        class="inputIcon"
                        icon={imageOutline}
                        slot="start"
                        size="large"
                        color="medium"
                    />
                    <ion-img src={`${apiURL}/api/files/users/${$currentUser.id}/${$currentUser.avatar}?thumb=150x150`}></ion-img>

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