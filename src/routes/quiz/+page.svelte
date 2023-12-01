<script lang="ts">
	import IonPage from "$ionpage";
    import { pb } from '$services/backend.service';
	import { onMount } from "svelte"
    import type { Question } from './quiz.interfaces'
    import { initQuestion } from "./quiz.interfaces";
    import { currentUser } from '$services/backend.service';
    let question: Question = initQuestion();
    let result = '';
    // create a random string of 15 characters containing only lower-case letters and digits
    const randomString = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 15; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    };
    const getQuestion = async () => {
        console.log('****** getQuestion()');
        let record;
        try {
            // or fetch only the first record that matches the specified filter
            record = await pb.collection('trivia').getFirstListItem(`id>="${randomString()}"`, {
                expand: 'id,category,subcategory,question,a,b,c,d,difficulty',
                sort: 'id'
            });
        } catch (error: any) {
            if (error.status === 404) {
                try {
                    record = await pb.collection('trivia').getFirstListItem(`id<="${randomString()}"`, {
                        expand: 'id,category,subcategory,question,a,b,c,d,difficulty',
                        sort: '-id'
                    });
                } catch (error2: any) {
                    if (error2.status === 404) {
                        console.log('*** no more questions ***');
                        return;
                    } else {
                        console.log('*** error2 ***', error2);
                        return;
                    }

                }
            }
        }
        // look up the record by id
        try {
            const usedQuestion = await pb.collection('trivia_log').getFirstListItem(`question="${record?.id || ''}"`, {
                expand: 'question',
            });
            console.log('***************************************');
            console.log('*** usedQuestion ***', usedQuestion);
            console.log('***************************************');
            getQuestion();
        } catch (notUsed: any) {
            if (notUsed.status === 404) {
                // console.log('*** notUsed ***', notUsed);
                question = record as Question; 
                question.answerMap = ['a', 'b', 'c', 'd'].sort(() => Math.random() - 0.5);
            }
        }

        // randomize the order of the answers
    }
    onMount(async () => {
        await getQuestion();
    });
    const logQuestion = async (letter: string) => {
        if (!$currentUser) {
            console.log('*** no currentUser -- aborting logQuestion() ***');
            return;
        }
        pb.collection('trivia_log').create({
            question: question.id,
            chosen: letter,
            correct: letter === 'a',
            user: $currentUser.id,
        });
    }
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
            logQuestion(letter);
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