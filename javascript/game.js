exports = typeof window !== "undefined" && window !== null ? window : global;

var QuestionSet = function(category) {
    var questions = [];

    this.category = category;

    this.addQuestion = function(question) {
        questions.push(category + ': ' + question);
    };

    this.getNextQuestion = function() {
        return questions.shift();
    };

    //generate questions
    for (var i = 0; i < 50; i++) {
        this.addQuestion('question ' + i);
    }

};

var Player = function(name) {
    var purse = 0;

    this.name = name;
    this.isInPenaltyBox = false;
    this.isGettingOutOfPenaltyBox = false;
    this.place = 0;

    this.addCoin = function() {
        purse++;
        console.log(name + ' now has ' + purse  + ' Gold Coins.');
    };

    this.getCoinCount = function() {
        return purse;
    };

    this.isWinner = function() {
        return purse != 6;
    };
};

exports.Game = function() {

    var players = [],
        playerIndex = 0,
        questions = {
            Pop: new QuestionSet('Pop'),
            Science: new QuestionSet('Science'),
            Sports: new QuestionSet('Sports'),
            Rock: new QuestionSet('Rock')
        };
    ;

    var getCurrentPlayer = function() {
        return players[playerIndex];
    };

    var currentCategory = function() {
        var place = getCurrentPlayer().place;

        if (place == 0 || place == 4 || place == 8) {
            return 'Pop';
        }

        if (place == 1 || place == 5 || place == 9) {
            return 'Science';
        }

        if (place == 2 || place == 6 || place == 10) {
            return 'Sports';
        }

        return 'Rock';
    };

    var askQuestion = function() {
        console.log(questions[currentCategory()].getNextQuestion());
    };

    var goToNextPlayer = function() {
        playerIndex++;
        if (playerIndex == players.length) {
            playerIndex = 0;
        }

    };

    this.add = function(playerName) {
        players.push(new Player(playerName));

        console.log(playerName + ' was added');
        console.log('There are ' + players.length + ' players');

        return true;
    };

    this.isPlayable = function(howManyPlayers){
        return howManyPlayers >= 2;
    };

    this.roll = function(roll) {
        var player = getCurrentPlayer();
        console.log(player.name + ' is the current player');
        console.log('They have rolled a ' + roll);

        var isBlocked = false;
        if (player.isInPenaltyBox) {
            if (roll % 2 != 0) {
                player.isGettingOutOfPenaltyBox = true;
                console.log(player.name + ' is getting out of the penalty box');
            } else {
                console.log(players.name + ' is not getting out of the penalty box');
                player.isGettingOutOfPenaltyBox = false;
                isBlocked = true;
            }
        }

        if (!isBlocked) {
            player.place += roll;
            if (player.place > 11) {
                player.place -= 12;
            }

            console.log(player.name + "'s new location is " + player.place);
            console.log('The category is ' + currentCategory());
            askQuestion();
        }
    };

    this.wasCorrectlyAnswered = function() {
        var player = getCurrentPlayer();
        var didPlayerWin = false;

        if (!player.isInPenaltyBox ||
            (player.isInPenaltyBox && player.isGettingOutOfPenaltyBox)) {
            console.log("Answer was correct!!!!");
            player.addCoin();
            didPlayerWin = player.isWinner();
        } else {
            didPlayerWin = true
        }

        goToNextPlayer();

        return didPlayerWin;
    };

    this.wrongAnswer = function() {
        var player = getCurrentPlayer();

        console.log('Question was incorrectly answered');
        console.log(player.name + ' was sent to the penalty box');

        player.isInPenaltyBox = true;

        goToNextPlayer();

        return true;
    };



};

var game = new Game();
game.add('Chet');
game.add('Pat');
game.add('Sue');

do{
    game.roll(Math.floor(Math.random()*6) + 1);

    if(Math.floor(Math.random()*10) == 7){
        notAWinner = game.wrongAnswer();
    }else{
        notAWinner = game.wasCorrectlyAnswered();
    }

} while(notAWinner);

/*var testData = [
    [ 3, false ],
    [ 6, false ],
    [ 4, false ],
    [ 4, false ],
    [ 4, false ],
    [ 3, false ],
    [ 5, false ],
    [ 6, false ],
    [ 5, false ],
    [ 6, false ],
    [ 5, false ],
    [ 1, false ],
    [ 6, true ],
    [ 1, false ],
    [ 3, false ],
    [ 1, false ],
    [ 2, false ]
];

testData.forEach(function(pair) {
    game.roll(pair[0]);

    if (pair[1]) {
        notAWinner = game.wrongAnswer();
    } else {
        notAWinner = game.wasCorrectlyAnswered();
    }
});*/
