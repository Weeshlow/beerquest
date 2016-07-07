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

        title: null,

        infoPanel: null,
        infoTextName: null,
        infoTextOG: null,
        infoTextABV: null,
        infoTextIBU: null,
        infoTextStyle: null,

        currentDrift: null,

        start: function() {
            this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameWindow', {
                preload: this.preload,
                create: this.create,
                update: this.update,
                httpGet: this.httpGet,
                addBeerCallback: this.addBeerCallback,
                addBeer: this.addBeer,
                getBeers: this.getBeers,
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

            this.background = this.game.add.image(512,384, 'sky');
            this.background.scale.setTo(2);
            this.background.anchor.setTo(0.5, 0.5);
            this.background.fixedToCamera = true;

            this.title = this.game.add.text(0,0, "BeerQuest", {font: "64px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.title.fixedToCamera = true;

            this.infoPanel = this.game.add.text(0,546, "Current Beer Information", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.infoPanel.fixedToCamera = true;

            var itn = this.game.add.text(0,0, "Name:", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.infoPanel.addChild(itn);
            itn.y = 36;
            this.infoTextName = this.game.add.text(0,0, "Some type of beer", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.infoTextName.anchor.setTo(0.0,0.0);
            this.infoTextName.x = 256;
            itn.addChild(this.infoTextName);

            var itog = this.game.add.text(0,0, "Original Gravity:", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            itn.addChild(itog);
            itog.y = 36;
            this.infoTextOG = this.game.add.text(0,0, "9.8m/s^2", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.infoTextOG.anchor.setTo(0.0,0.0);
            this.infoTextOG.x = 256;
            itog.addChild(this.infoTextOG);

            var itabv = this.game.add.text(0,0, "ABV:", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            itog.addChild(itabv);
            itabv.y = 36;
            this.infoTextABV = this.game.add.text(0,0, "100%", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.infoTextABV.anchor.setTo(0.0,0.0);
            this.infoTextABV.x = 256;
            itabv.addChild(this.infoTextABV);

            var itibu = this.game.add.text(0,0, "IBU:", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            itabv.addChild(itibu);
            itibu.y = 36;
            this.infoTextIBU = this.game.add.text(0,0, "Very Bitter", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.infoTextIBU.anchor.setTo(0.0,0.0);
            this.infoTextIBU.x = 256;
            itibu.addChild(this.infoTextIBU);

            var its = this.game.add.text(0,0, "Style:", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            itibu.addChild(its);
            its.y = 36;
            this.infoTextStyle = this.game.add.text(0,0, "Beer", {font: "32px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.infoTextStyle.anchor.setTo(0.0,0.0);
            this.infoTextStyle.x = 256;
            its.addChild(this.infoTextStyle);

            this.backGroup = this.game.add.group();
            this.middleGroup = this.game.add.group();
            this.frontGroup = this.game.add.group();

            this.beers = [];

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.getBeers();

        },


        spriteClick: function(event, sprite) {
            console.log('Sprite clicked: ' + sprite);
        },

        //Paralax scrolling right-left
        //mouseover beer to see stats and freeze beer
        //hold mouse button down to freeze all beers



        update: function()
        {
            if (this.cursors.left.isDown) {

                this.game.camera.x -= 6;
                this.middleGroup.x += 1;
                this.frontGroup.x += 2;
            }
            else if (this.cursors.right.isDown) {
                this.game.camera.x += 6;
                this.middleGroup.x -= 1;
                this.frontGroup.x -= 2;
            } else {
                if (this.game.camera.x < this.stableCameraX) {
                    this.game.camera.x += 6;
                    this.middleGroup.x -= 1;
                    this.frontGroup.x -= 2;
                }
                if (this.game.camera.x > this.stableCameraX) {
                    this.game.camera.x -= 6;
                    this.middleGroup.x += 1;
                    this.frontGroup.x += 2;
                }
            }

            if (this.cursors.up.isDown) {
                this.game.camera.y -= 6;
                this.middleGroup.y += 2;
                this.frontGroup.y += 4;
            } else if (this.cursors.down.isDown) {
                this.game.camera.y += 6;
                this.middleGroup.y -= 1;
                this.frontGroup.y -= 2;
            } else {
                if (this.game.camera.y < this.stableCameraY) {
                    this.game.camera.y += 6;
                    this.middleGroup.y -= 1;
                    this.frontGroup.y -= 2;
                }
                if (this.game.camera.y > this.stableCameraY) {
                    this.game.camera.y -= 6;
                    this.middleGroup.y += 1;
                    this.frontGroup.y += 2;
                }
            }

        },


        getBeers: function() {

            //this.httpGet('http://localhost:8080/v2/?key=7d1915a6aa7315b63c14b5464c3e2476/search?q=Goosinator&type=beer', this.addBeerCallback);

            var beer = null;
            for (var i = 0; i < 10; i++) {
                this.addBeer({name: "Beer"+i});
            }

        },


        addBeerCallback: function(response) {
            this.addBeer('Beer here.');
        },

        addBeer: function(beerData) {

            var beer = this.game.add.sprite(this.game.rnd.integerInRange(-1024,-512), this.game.rnd.integerInRange(-768,-384), 'beermug2');
            beer.anchor.setTo(0.5, 0.5);
            beer.inputEnabled = true;
            beer.events.onInputUp.add(this.spriteClick, this);
            var distance = this.game.rnd.integerInRange(0,2);
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
            var beerText = this.game.add.text(beer.x,beer.y, beerData.name, {font: "32px Arial", fill: "#000000"})
            beer.addChild(beerText);
            beerText.x = 0;
            beerText.y = 0;
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