<script lang="ts">
	import IonPage from "$ionpage";
    import { pb } from '$services/backend.service';
	import { onMount } from "svelte"
    interface Question {
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
        question.correctAnswer = question.a;
        console.log('correctAnswer', question.correctAnswer)
        const a = question.a;
        const b = question.b;
        const c = question.c;
        const d = question.d;   
        console.log('a', a) 
        console.log('b', b)
        console.log('c', c)
        console.log('d', d)   
        const answers = [question.a, question.b, question.c, question.d];
        // randomize the order of the answers
        answers.sort(() => Math.random() - 0.5);
        console.log('answers: ', answers);
        question.a = answers[0];
        question.b = answers[1];
        question.c = answers[2];
        question.d = answers[3];
        // find the letter of the correct answer
        if (question.a === question.correctAnswer) {
            question.correctLetter = 'a';
        } else if (question.b === question.correctAnswer) {
            question.correctLetter = 'b';
        } else if (question.c === question.correctAnswer) {
            question.correctLetter = 'c';
        } else if (question.d === question.correctAnswer) {
            question.correctLetter = 'd';
        }
        // copy the record to the question variable
    }
    onMount(async () => {
        await getQuestion();
    });
    const selectAnswer = (answer: string, letter: string) => {
        return () => {
            const x: any= document.getElementById(question.correctLetter);
            if (x) x.color = "success"
            if (answer === question.correctAnswer) {
                result = 'Correct!';
            } else {
                result = 'Incorrect!';
                const y: any= document.getElementById(letter);
                if (y) y.color = "danger"
            }
            setTimeout(() => {
                result = '';
                const aa: any = document.getElementById('a');
                const bb: any = document.getElementById('b');
                const cc: any = document.getElementById('c');
                const dd: any = document.getElementById('d');
                aa.color = "dark";
                bb.color = "dark";
                cc.color = "dark";
                dd.color = "dark";
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
        <h1>
            quiz 
        </h1>
        <h2>
            {question.question}
        </h2>
        <ion-list>
            <ion-item on:click={selectAnswer(question.a, 'a')}>
                <ion-label id="a">{question.a}</ion-label>
            </ion-item>
            <ion-item on:click={selectAnswer(question.b, 'b')}>
                <ion-label id="b">{question.b}</ion-label>
            </ion-item>
            <ion-item on:click={selectAnswer(question.c, 'c')}>
                <ion-label id="c">{question.c}</ion-label>
            </ion-item>
            <ion-item on:click={selectAnswer(question.d, 'd')}>
                <ion-label id="d">{question.d}</ion-label>
            </ion-item>
        </ion-list>
            <h1>{result}</h1>
        <pre>{JSON.stringify(question,null,2)}</pre>
    </ion-content>
</IonPage>
<style>
    .correct {
        color: green;
    }
</style>