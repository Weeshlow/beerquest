define([
    'phaser'
], function (Phaser) {
    'use strict';

    function Game() {
        console.log('Making the Game');
    }

    Game.prototype = {
        constructor: Game,

        stableCameraX: 0,
        stableCameraY: 0,
        cameraDecayVelocity: 1,

        frontGroup: null,
        middleGroup: null,
        backGroup: null,

        beer2: null,
        beer1: null,

        start: function() {
            this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameWindow', {
                preload: this.preload,
                create: this.create,
                update: this.update,
                httpGet: this.httpGet,
                addBeerCallback: this.addBeerCallback,
                addBeer: this.addBeer,
                spriteClick: this.spriteClick

            });
        },

        preload: function() {
            this.game.load.image('logo', 'assets/phaser.png');
            this.game.load.image('beermug', 'assets/images/beermug.svg'); //Attribution: Twitter
            this.game.load.image('beermug2', 'assets/images/beermug2.svg'); //Attribution: Google (Noto)
            this.game.time.advancedTiming = true;

        },

        create: function() {

            this.game.world.setBounds(-2048, -1536, 2048, 1536);
            this.stableCameraX = this.game.world.centerX - 512;
            this.stableCameraY = this.game.world.centerY - 384;
            this.game.camera.x = this.stableCameraX;
            this.game.camera.y = this.stableCameraY;

            this.backGroup = this.game.add.group();
            this.middleGroup = this.game.add.group();
            this.frontGroup = this.game.add.group();

            this.beerTwo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'beermug2');
            this.beerTwo.scale.setTo(0.25, 0.25);
            this.beerTwo.anchor.setTo(0.5, 0.5);
            this.beerTwo.inputEnabled = true;
            this.beerTwo.events.onInputUp.add(this.spriteClick, this);

            this.beerOne = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'beermug2');
            this.beerOne.scale.setTo(0.5, 0.5);
            this.beerOne.anchor.setTo(0.5, 0.5);

            this.frontGroup.add(this.beerOne);
            this.middleGroup.add(this.beerTwo);


            //this.beerTo.fixedToCamera = true;

            this.cursors = this.game.input.keyboard.createCursorKeys();




            //this.cameraPos = new Phaser.Point(0, 0)
            //this.cameraPos.setTo(0, 0);

            //this.httpGet('http://localhost:8080/v2/?key=7d1915a6aa7315b63c14b5464c3e2476/search?q=Goosinator&type=beer', this.addBeerCallback);

        },


        spriteClick: function(event, sprite) {
            console.log('Sprite clicked: ' + sprite);
        },

        update: function()
        {
            if (this.cursors.left.isDown) {

                this.game.camera.x -= 6;
                this.middleGroup.x += 2;
            }
            else if (this.cursors.right.isDown) {
                this.game.camera.x += 6;
                this.middleGroup.x -= 2;
            } else {
                if (this.game.camera.x < this.stableCameraX) {
                    this.game.camera.x += 6;
                    this.middleGroup.x -= 2;
                }
                if (this.game.camera.x > this.stableCameraX) {
                    this.game.camera.x -= 6;
                    this.middleGroup.x += 2;
                }
            }



            if (this.cursors.up.isDown) {
                this.game.camera.y -= 6;
                this.middleGroup.y += 2;
            } else if (this.cursors.down.isDown) {
                this.game.camera.y += 6;
                this.middleGroup.y -= 2;
            } else {
                if (this.game.camera.y < this.stableCameraY) {
                    this.game.camera.y += 6;
                    this.middleGroup.y -= 2;
                }
                if (this.game.camera.y > this.stableCameraY) {
                    this.game.camera.y -= 6;
                    this.middleGroup.y += 2;
                }
            }





            // change this value to alter the amount of damping, lower values = smoother camera movement
            //var lerp = 0.1;
            //cameraPos.x += (this.square.x - cameraPos.x) * lerp;
            //cameraPos.y += (this.square.y - cameraPos.y) * lerp;

            //this.game.camera.focusOnXY(this.cameraPos.x, this.cameraPos.y);
            //this.beerTwo.x = this.game.camera.x * - 0.5;
            //this.beerTwo.y = this.game.camera.y * -0.5;
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
                    console.log(xmlHttp.responseText);
                }

            }
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.send(null);
        }
    };

    return Game;
});