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
                addRandomBeer: this.addRandomBeer,
                spriteClick: this.spriteClick,
                spriteOver: this.spriteOver,
                spriteOut: this.spriteOut,
                mouseHold: this.mouseHold

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

            this.game.world.setBounds(0, 0, 1024, 768);
            this.stableCameraX = this.game.world.centerX;
            this.stableCameraY = this.game.world.centerY;
            this.game.camera.x = this.stableCameraX;
            this.game.camera.y = this.stableCameraY;

            this.background = this.game.add.image(512,384, 'sky');
            this.background.scale.setTo(2);
            this.background.anchor.setTo(0.5, 0.5);
            this.background.fixedToCamera = true;


            var rectangle = this.game.add.graphics(0, 546);
            // set a fill and line style
            rectangle.beginFill(0xFF9900);
            rectangle.lineStyle(10, 0xFF9900, 1);

            // draw a rectangle
            rectangle.lineStyle(1, 0xFF9900, 1);
            rectangle.drawRect(0, 0, 1024, 222);





            this.title = this.game.add.text(1022,546, "BeerQuest", {font: "64px Arial", fill: "#FFFFFF", backgroundColor: "#FF9900"});
            this.title.anchor.setTo(1.0, 0.0);
            this.title.fixedToCamera = true;

            // button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);

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

        //Paralax scrolling right-left
        //mouseover beer to see stats and freeze beer
        //hold mouse button down to freeze all beers



        update: function()
        {


          for (var i = 0; i < this.beers.length; i++) {
            if (!this.beers[i].freeze) {
              this.beers[i].x = this.beers[i].x - 6 * this.beers[i].scale.x;
            }

          }

        },

        addRandomBeer: function() {
          this.httpGet('http://localhost:8080/v2/?key=7d1915a6aa7315b63c14b5464c3e2476/beer/random', this.addBeerCallback);

          this.addBeer({name: "Test Beer", id: this.game.rnd.integerInRange(-1000000,1000000)});
        },

        getBeers: function() {

            var beer = null;
            for (var i = 0; i < 10; i++) {
                this.addBeer({name: "Test Beer", id: this.game.rnd.integerInRange(-1000000,1000000)});
            }

        },


        addBeerCallback: function(response) {
            this.addBeer({name: 'name', id: 'id'});
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
