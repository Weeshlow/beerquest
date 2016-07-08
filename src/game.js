define([
    'phaser'
], function (Phaser) {
    'use strict';

    function Game() {
    }

    Game.prototype = {
        constructor: Game,

        stableCameraX: 0,
        stableCameraY: 0,
        cameraDecayVelocity: 1,

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
                addRandomBeer: this.addRandomBeer,
                spriteClick: this.spriteClick,
                spriteOver: this.spriteOver,
                spriteOut: this.spriteOut,
                randomNameGenerator: this.randomNameGenerator,
                mouseHold: this.mouseHold

            });
        },

        preload: function() {
            this.game.load.image('logo', 'assets/phaser.png');
            this.game.load.image('beermug', 'assets/images/beermug.svg'); //Attribution: Twitter
            this.game.load.image('beermug2', 'assets/images/beermug2.svg'); //Attribution: Google (Noto)
            this.game.load.image('sky', 'assets/images/sky.jpg'); //Attribution: Joniprittie
            this.game.load.image('whiteCircle', 'assets/images/white_circle.png');
            this.game.time.advancedTiming = true;

        },

        create: function() {

            //World bounds and Camera
            this.game.world.setBounds(0, 0, 1024, 768);
            this.stableCameraX = this.game.world.centerX;
            this.stableCameraY = this.game.world.centerY;
            this.game.camera.x = this.stableCameraX;
            this.game.camera.y = this.stableCameraY;

            //Background
            this.background = this.game.add.image(512,384, 'sky');
            this.background.scale.setTo(2);
            this.background.anchor.setTo(0.5, 0.5);
            this.background.fixedToCamera = true;

            //Menu
            var rectangle = this.game.add.graphics(0, 546);
            // set a fill and line style
            rectangle.beginFill(0xFFCC00);
            rectangle.lineStyle(10, 0xFFCC00, 1);
            // draw a rectangle
            rectangle.lineStyle(1, 0xFFCC00, 1);
            rectangle.drawRect(0, 0, 1024, 222);
            //Title
            this.title = this.game.add.text(1022,546, "BeerQuest", {font: "64px Arial bold", fill: "#100800", backgroundColor: "#FFCC00"});
            this.title.anchor.setTo(1.0, 0.0);
            this.title.fixedToCamera = true;
            //Info Panel
            this.infoPanel = this.game.add.text(0,546, "Current Beer Information", {font: "32px Arial bold", fill: "#100800", backgroundColor: "#FFCC00"});
            this.infoPanel.fixedToCamera = true;
            var itn = this.game.add.text(0,0, "Name:", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            this.infoPanel.addChild(itn);
            itn.y = 36;
            this.infoTextName = this.game.add.text(0,0, "Some type of beer", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            this.infoTextName.anchor.setTo(0.0,0.0);
            this.infoTextName.x = 256;
            itn.addChild(this.infoTextName);
            var itog = this.game.add.text(0,0, "Original Gravity:", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            itn.addChild(itog);
            itog.y = 36;
            this.infoTextOG = this.game.add.text(0,0, "9.8m/s^2", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            this.infoTextOG.anchor.setTo(0.0,0.0);
            this.infoTextOG.x = 256;
            itog.addChild(this.infoTextOG);
            var itabv = this.game.add.text(0,0, "ABV:", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            itog.addChild(itabv);
            itabv.y = 36;
            this.infoTextABV = this.game.add.text(0,0, "100%", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            this.infoTextABV.anchor.setTo(0.0,0.0);
            this.infoTextABV.x = 256;
            itabv.addChild(this.infoTextABV);
            var itibu = this.game.add.text(0,0, "IBU:", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            itabv.addChild(itibu);
            itibu.y = 36;
            this.infoTextIBU = this.game.add.text(0,0, "Very Bitter", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            this.infoTextIBU.anchor.setTo(0.0,0.0);
            this.infoTextIBU.x = 256;
            itibu.addChild(this.infoTextIBU);
            var its = this.game.add.text(0,0, "Style:", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            itibu.addChild(its);
            its.y = 36;
            this.infoTextStyle = this.game.add.text(0,0, "Beer", {font: "32px Arial", fill: "#100800", backgroundColor: "#FFCC00"});
            this.infoTextStyle.anchor.setTo(0.0,0.0);
            this.infoTextStyle.x = 256;
            its.addChild(this.infoTextStyle);

            this.beers = [];

            this.game.time.events.repeat(Phaser.Timer.SECOND, 1000, this.addRandomBeer, this);

        },

        mouseHold: function(sprite) {

        },

        spriteOver: function(sprite) {

            sprite.freeze = true;

            var beerData = sprite.beerData;

            if (beerData) {
                this.infoTextName.setText(beerData.name);
                this.infoTextOG.setText(beerData.originalGravity ? beerData.originalGravity : "Unknown");
                this.infoTextABV.setText(beerData.abv ? beerData.abv : "Unknown");
                this.infoTextIBU.setText(beerData.ibu ? beerData.ibu : "Unknown");
                if (beerData.style) {
                    this.infoTextStyle.setText(beerData.style.name ? beerData.style.name : "Unknown");
                } else {
                    this.infoTextStyle.setText("Unknown");
                }
            } else {
                this.infoTextName.setText("Unknown");
                this.infoTextOG.setText("Unknown");
                this.infoTextABV.setText("Unknown");
                this.infoTextIBU.setText("Unknown");
                this.infoTextStyle.setText("Unknown");
            }

        },

        spriteOut: function(sprite) {
          sprite.freeze = false;
        },

        spriteClick: function(event, sprite) {
        },

        update: function()
        {

          for (var i = 0; i < this.beers.length; i++) {
            if (!this.beers[i].freeze) {
              this.beers[i].x = this.beers[i].x - 6 * this.beers[i].scale.x;
            }

          }

        },

        addRandomBeer: function() {

            //Use the server
          this.httpGet('http://localhost:8080/v2/beer/random?key=74e3677f9d50024ce74395b5e2e88cde', this.addBeerCallback, this);

            //Straight from the browser
          //this.httpGet('http://api.brewerydb.com/v2/beer/random?key=74e3677f9d50024ce74395b5e2e88cde', this.addBeerCallback, this);

        },

        addBeerCallback: function(response, context) {
            context.addBeer(JSON.parse(response).data);
        },


        addBeer: function(beerData) {
          var beer = this.game.add.sprite(1088, this.game.rnd.integerInRange(32,512), 'beermug2');
            beer.anchor.setTo(0.5, 0.5);
            beer.inputEnabled = true;
            beer.events.onInputUp.add(this.spriteClick, this);
            beer.events.onInputOver.add(this.spriteOver, this);
            beer.events.onInputOut.add(this.spriteOut, this);
            var scale = this.game.rnd.realInRange(0.25,1.0);
            beer.scale.setTo(scale);
            beer.beerData = beerData;
            this.beers.push(beer);
            var beerText = this.game.add.text(beer.x,beer.y, beerData.name, {font: "32px Arial", fill: "#000000"})
            beer.addChild(beerText);
            beerText.x = 0;
            beerText.y = 0;
            var emitter = this.game.add.emitter(0,0,128);
            emitter.width = 64;
            emitter.makeParticles('whiteCircle');
            emitter.minParticleSpeed.set(0,0);
            emitter.maxParticleSpeed.set(10, 128);
            emitter.setRotation(0, 0);
            emitter.setAlpha(0.3, 1.0);
            emitter.setScale(0.015625, 0.0625, 0.015625, 0.0625);
            emitter.gravity = 100;
            beer.addChild(emitter);
            emitter.y = -10
            emitter.start(false, 3000, 300);
        },

        httpGet: function(theUrl, callback, context)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    callback(xmlHttp.responseText, context);
                } else {
                    console.log(xmlHttp.responseText);
                }
            }
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.send(null);
        },

    };

    return Game;
});
