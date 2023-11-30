<script lang="ts">
	import IonPage from "$ionpage";
    import { pb } from '$services/backend.service';
	import { onMount } from "svelte"
    type tplotOptions = {
    [key: string]: boolean
    }

    type Question = {
        [key: string]: any;
        id: string;
        category: string;
        subcategory: string;
        question: string;
        a: string;
        b: string;
        c: string;
        d: string;
        difficulty: string;
        updated: string;
        created: string;
        collectionId: string;
        collectionName: string;
        correctAnswer: string;
        correctLetter: string;
        answerMap: any; //string[];
    }
    let question: Question = {
        id: '',
        category: '',
        subcategory: '',
        question: '',
        a: '',
        b: '',
        c: '',
        d: '',
        difficulty: '',
        updated: '',
        created: '',
        collectionId: '',
        collectionName: '',
        correctAnswer: '',
        correctLetter: '',
        answerMap: [],
    };
    let result = '';
    // create a random string of 15 characters containing only lower-case letters and digits
    const randomString = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 15; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    };
    const getQuestion = async () => {
        // or fetch only the first record that matches the specified filter
        const record = await pb.collection('trivia').getFirstListItem(`id>="${randomString()}"`, {
            expand: 'id,category,subcategory,question,a,b,c,d,difficulty',
        });
        // randomize the order of the answers
        question = record as Question; 
        question.answerMap = ['a', 'b', 'c', 'd'].sort(() => Math.random() - 0.5);
    }
    onMount(async () => {
        await getQuestion();
    });
    const selectAnswer = (letter: string) => {
        // get position of this letter in the answerMap
        const index = question.answerMap.indexOf(letter);
        const chosenEl: any = document.getElementById(`item-${index}`);
        return () => {
            if (letter === 'a') {
                result = 'Correct!';
                if (chosenEl) {
                    chosenEl.color = 'success';
                }
            } else {
                if (chosenEl) {
                    chosenEl.color = 'danger';
                }
                const correctEl: any = document.getElementById(`item-${question.answerMap.indexOf('a')}`);
                if (correctEl) {
                    correctEl.color = 'success';
                }
                result = 'Incorrect!';
            }
            setTimeout(() => {
                result = '';
                for (let i = 0; i < 4; i++) {
                    const el: any = document.getElementById(`item-${i}`);
                    if (el) {
                        el.color = '';
                    }
                }
                getQuestion();
            }, 2000)
        }
    }
</script>
<IonPage>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button />
            </ion-buttons>
            <ion-title>Quiz</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <h3>
            Category: {question.category} <br/>
            Subcategory: {question.subcategory}
        </h3>
        <h2>
            {question.question}
        </h2>
        <ion-list>
            <ion-item id="item-0" on:click={selectAnswer(question.answerMap[0])}>
                <ion-label>{question[question.answerMap[0]]}</ion-label>
            </ion-item>
            <ion-item id="item-1" on:click={selectAnswer(question.answerMap[1])}>
                <ion-label>{question[question.answerMap[1]]}</ion-label>
            </ion-item>
            <ion-item id="item-2" on:click={selectAnswer(question.answerMap[2])}>
                <ion-label>{question[question.answerMap[2]]}</ion-label>
            </ion-item>
            <ion-item id="item-3" on:click={selectAnswer(question.answerMap[3])}>
                <ion-label>{question[question.answerMap[3]]}</ion-label>
            </ion-item>
        </ion-list>
            <h1>{result}</h1>
    </ion-content>
</IonPage>
<style>
    .correct {
        color: green;
    }
</style>