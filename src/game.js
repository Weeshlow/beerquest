define([
    'phaser'
], function (Phaser) {
    'use strict';

    function Game() {
        console.log('Making the Game');
    }

    Game.prototype = {
        constructor: Game,

        start: function() {
            this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameWindow', {
                preload: this.preload,
                create: this.create,
                httpGet: this.httpGet

            });
        },

        preload: function() {
            this.game.load.image('logo', 'assets/phaser.png');
            this.game.load.image('beermug', 'assets/images/beermug.svg'); //Attribution: Twitter
            this.game.load.image('beermug2', 'assets/images/beermug2.svg'); //Attribution: Google (Noto)

        },

        create: function() {
            var beerOne = this.game.add.sprite(this.game.world.centerX / 2, this.game.world.centerY, 'beermug');
            beerOne.scale.setTo(0.25, 0.25);
            beerOne.anchor.setTo(0.5, 0.5);
            var beerTwo = this.game.add.sprite((this.game.world.centerX + this.game.world.width) / 2, this.game.world.centerY, 'beermug2');
            beerTwo.scale.setTo(0.25, 0.25);
            beerTwo.anchor.setTo(0.5, 0.5);

            this.httpGet('http://localhost:8080/v2/?key=7d1915a6aa7315b63c14b5464c3e2476/search?q=Goosinator&type=beer', this.addBeerCallback);
            //this.httpGet('http://localhost:8081/v2/?key=7d1915a6aa7315b63c14b5464c3e2476/search?q=Goosinator&type=beer', function(data){console.log('Data: ' + data)});
            //this.httpGet('http://localhost:8080/', function(data){console.log('Data: ' + data)});
            //this.httpGet('http://localhost:8080/v2', this.addBeerCallback);


        },

        addBeerCallback: function(response) {
            this.addBeer('Beer here.');
        },

        addBeer: function(beer) {
            console.log('Beer: ' + beer );
        },

        httpGet: function(theUrl, callback)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    callback(xmlHttp.responseText);
                } else {
                    console.log('Error:' + xmlHttp.responseText);
                }

            }
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.send(null);
        }
    };

    return Game;
});