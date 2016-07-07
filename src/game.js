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

        beers: null,

        background: null,

        currentDrift: null,

        //beer2: null,
        //beer1: null,

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
            this.game.load.image('sky', 'assets/images/sky.jpg'); //Attribution: Joniprittie
            this.game.time.advancedTiming = true;

        },

        create: function() {

            this.game.world.setBounds(-1536, -1152, 1536, 1152);
            this.stableCameraX = this.game.world.centerX - 512;
            this.stableCameraY = this.game.world.centerY - 384;
            this.game.camera.x = this.stableCameraX;
            this.game.camera.y = this.stableCameraY;

            this.background = this.game.add.image(512,384, 'sky');//.anchor.set(0.5);
            this.background.scale.setTo(2);
            this.background.anchor.setTo(0.5, 0.5);
            this.background.fixedToCamera = true;

            this.backGroup = this.game.add.group();
            this.middleGroup = this.game.add.group();
            this.frontGroup = this.game.add.group();

            this.beers = [];

            var beer = null;
            var distance = null;
            for (var i = 0; i < 10; i++) {
                beer = this.game.add.sprite(this.game.rnd.integerInRange(-1024,-512), this.game.rnd.integerInRange(-768,-384), 'beermug2');
                beer.anchor.setTo(0.5, 0.5);
                beer.inputEnabled = true;
                beer.events.onInputUp.add(this.spriteClick, this);
                distance = this.game.rnd.integerInRange(0,2);
                if (distance < 1) {
                    beer.scale.setTo(1);
                    this.frontGroup.add(beer);
                } else if (distance < 2) {
                    beer.scale.setTo(0.5);
                    this.middleGroup.add(beer);
                } else {
                    beer.scale.setTo(0.25);
                    this.backGroup.add(beer);
                }

                this.beers.push(beer);

            }

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.httpGet('http://localhost:8080/v2/?key=7d1915a6aa7315b63c14b5464c3e2476/search?q=Goosinator&type=beer', this.addBeerCallback);

        },


        spriteClick: function(event, sprite) {
            console.log('Sprite clicked: ' + sprite);
        },

        update: function()
        {
            if (this.cursors.left.isDown) {

                this.game.camera.x -= 6;
                this.middleGroup.x += 1;
                this.backGroup.x += 2;
            }
            else if (this.cursors.right.isDown) {
                this.game.camera.x += 6;
                this.middleGroup.x -= 1;
                this.backGroup.x -= 2;
            } else {
                if (this.game.camera.x < this.stableCameraX) {
                    this.game.camera.x += 6;
                    this.middleGroup.x -= 1;
                    this.backGroup.x -= 2;
                }
                if (this.game.camera.x > this.stableCameraX) {
                    this.game.camera.x -= 6;
                    this.middleGroup.x += 1;
                    this.backGroup.x += 2;
                }
            }

            if (this.cursors.up.isDown) {
                this.game.camera.y -= 6;
                this.middleGroup.y += 2;
                this.backGroup.y += 4;
            } else if (this.cursors.down.isDown) {
                this.game.camera.y += 6;
                this.middleGroup.y -= 1;
                this.backGroup.y -= 2;
            } else {
                if (this.game.camera.y < this.stableCameraY) {
                    this.game.camera.y += 6;
                    this.middleGroup.y -= 1;
                    this.backGroup.y -= 2;
                }
                if (this.game.camera.y > this.stableCameraY) {
                    this.game.camera.y -= 6;
                    this.middleGroup.y += 1;
                    this.backGroup.y += 2;
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