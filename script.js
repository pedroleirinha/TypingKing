class Model {
    //Game Logic
    constructor() {
        this.wordArray = ["king"];
        this.loadWords(this.wordArray);
        this.statsObj = {
            correctWords: 0,
            pressedKeys: 0
        }

    }

    pickNextWord() {
        return this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
    }

    loadWords() {
        fetch('words.txt')
            .then(res => {
                return res.text();
            })
            .then(text => {
                this.wordArray = text.split("\n");
            });
    }
}

class View {
    //Visual Interface
    constructor() {
        this.textInput = document.querySelector("#userTextInput");
        this.wordShown = document.getElementById("wordShown");
        this.timerInput = document.getElementById("timer");
        this.textInput.focus();
        this.TotalSeconds = 60;
        this.currentSeconds = this.TotalSeconds;
    }

    startTimer(stats) {

        this.timer = setInterval(() => {
            if (this.currentSeconds >= 0) {
                this.timerInput.innerHTML = `00:${this.currentSeconds > 9 ? this.currentSeconds : "0" + this.currentSeconds}`;
                this.currentSeconds--
            }
            else {
                //Show Stats
                clearInterval(this.timer)
                document.getElementById("stats").innerHTML = `
                <tr><td>Correct Words</td><td> ${stats.correctWords}</td></tr>
                <tr><td>Keys Pressed</td><td> ${stats.pressedKeys}</td></tr>
                <tr><td>Keys Per Second</td><td> ${Math.round((stats.pressedKeys / this.TotalSeconds) * 100) / 100}</td></tr>`;
                this.textInput.disabled = true;
            }
        }, 1000)
    }

    updateWord(newWord) {
        this.wordShown.innerHTML = newWord.trim();
        this.clearUserTypedWord();
    }
    clearUserTypedWord() {
        this.textInput.value = "";
    }

    showErrorText() {
        this.wordShown.classList.remove("correct");
        this.wordShown.classList.add("error");
    }
    showCorrectText() {
        this.wordShown.classList.remove("error");
        this.wordShown.classList.add("correct");
    }

    checkCorrectWord() {
        return this.textInput.value == this.wordShown.innerHTML;
    }

}

class Controller {
    //Main App
    constructor() {
        this.game = new Model();
        this.view = new View();

        this.view.startTimer(this.game.statsObj);
        this.view.showErrorText();

        this.view.textInput.addEventListener("input", () => {
            this.game.statsObj.pressedKeys++;
            if (this.view.checkCorrectWord()) {

                this.game.statsObj.correctWords++;
                this.view.showCorrectText();
                setTimeout(() => {
                    this.view.showErrorText();
                    this.view.updateWord(this.game.pickNextWord());
                }, 200);

            } else {
                this.view.showErrorText();
            }
        }, false);


        this.view.updateWord(this.game.pickNextWord());
    }

}

window.addEventListener('load', () => {
    let game = new Controller();
}, false)