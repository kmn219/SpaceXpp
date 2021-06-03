var loadedMap = {
    cols: 12,
    rows: 12,
    tsize: 64,
    layers: [[
        
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ], [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]],
    
    getTile: function (layer, col, row) {
        return this.layers[layer][row * loadedMap.cols + col];
    },
    isSolidTileAtXY: function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // tiles 3 and 5 are solid -- the rest are walkable
        // loop through all layers and return TRUE if any tile is solid
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = tile === 3 || tile === 5 || tile === 6 || tile === 7 || tile === 8 || tile === 9 || tile === 10 ;
            return res || isSolid;
        }.bind(this), false);
    },
    getCol: function (x) {
        return Math.floor(x / this.tsize);
    },
    getRow: function (y) {
        return Math.floor(y / this.tsize);
    },
    getX: function (col) {
        return col * this.tsize;
    },
    getY: function (row) {
        return row * this.tsize;
    }
};



function Camera(loadedMap, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = loadedMap.cols * loadedMap.tsize - width;
    this.maxY = loadedMap.rows * loadedMap.tsize - height;
}

Camera.prototype.follow = function (sprite) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
};

Camera.prototype.update = function () {
    // assume followed sprite should be placed at the center of the screen
    // whenever possible
    this.following.screenX = this.width / 2;
    this.following.screenY = this.height / 2;

    // make the camera follow the sprite
    this.x = this.following.x - this.width / 2;
    this.y = this.following.y - this.height / 2;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // in loadedMap corners, the sprite cannot be placed in the center of the screen
    // and we have to change its screen coordinates

    // left and right sides
    if (this.following.x < this.width / 2 ||
        this.following.x > this.maxX + this.width / 2) {
        this.following.screenX = this.following.x - this.x;
    }
    // top and bottom sides
    if (this.following.y < this.height / 2 ||
        this.following.y > this.maxY + this.height / 2) {
        this.following.screenY = this.following.y - this.y;
    }
};

function cursor(loadedMap, x, y) {
    this.loadedMap = loadedMap;
    this.x = x;
    this.y = y;
    this.width = loadedMap.tsize;
    this.height = loadedMap.tsize;

    this.image = Loader.getImage('cursor');
}

function rover(loadedMap, x, y) {
    this.loadedMap = loadedMap;
    this.x = x;
    this.y = y;
    this.width = loadedMap.tsize;
    this.height = loadedMap.tsize;

    this.image = Loader.getImage('cursor');
}


cursor.SPEED = 1; // pixels per second

cursor.prototype.move = function (delta, dirx, diry) {
    // move cursor
    this.x += dirx * 64;
    this.y += diry * 64;

    // check if we walked into a non-walkable tile
    this._collide(dirx, diry);

    // clamp values
    var maxX = this.loadedMap.cols * this.loadedMap.tsize;
    var maxY = this.loadedMap.rows * this.loadedMap.tsize;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
};

cursor.prototype._collide = function (dirx, diry) {
    var row, col;
    // -1 in right and bottom is because image ranges from 0..63
    // and not up to 64
    var left = this.x - this.width / 2;
    var right = this.x + this.width / 2 - 1;
    var top = this.y - this.height / 2;
    var bottom = this.y + this.height / 2 - 1;

    // check for collisions on sprite sides
    var collision =
        this.loadedMap.isSolidTileAtXY(left, top) ||
        this.loadedMap.isSolidTileAtXY(right, top) ||
        this.loadedMap.isSolidTileAtXY(right, bottom) ||
        this.loadedMap.isSolidTileAtXY(left, bottom);
    if (!collision) { return; }

    if (diry > 0) {
        row = this.loadedMap.getRow(bottom);
        this.y = -this.height / 2 + this.loadedMap.getY(row);
    }
    else if (diry < 0) {
        row = this.loadedMap.getRow(top);
        this.y = this.height / 2 + this.loadedMap.getY(row + 1);
    }
    else if (dirx > 0) {
        col = this.loadedMap.getCol(right);
        this.x = -this.width / 2 + this.loadedMap.getX(col);
    }
    else if (dirx < 0) {
        col = this.loadedMap.getCol(left);
        this.x = this.width / 2 + this.loadedMap.getX(col + 1);
    }

};

cursor.prototype.select = function(entr) {
    if (entr > 0) {
       //indx = Math.floor(this.x/64) + (Math.floor(this.y/64) * loadedMap.cols );
       //console.log(Math.floor(this.x/64), Math.floor(this.y/64));
       sendTargetCoords(Math.floor(this.x/64), Math.floor(this.y/64));
    }
}


Game.load = function () {
    return [
        Loader.loadImage('tiles', '../assets/tiles.png'),
        Loader.loadImage('rover', '../assets/rover.png'),
        Loader.loadImage('cursor', '../assets/cursor.png')
    ];
};

Game.init = function () {
    Keyboard.listenForEvents(
        [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN, Keyboard.ENTER]);
    this.tileAtlas = Loader.getImage('tiles');
    this.roverAtlas = Loader.getImage('rover')

    this.cursor = new cursor(loadedMap, 352, 352);
    this.rover = new rover(loadedMap, 0, 0);
    this.camera = new Camera(loadedMap, 512, 512);
    this.camera.follow(this.cursor);
};

Game.update = function (delta) {
    // handle cursor movement with arrow keys
    var dirx = 0;
    var diry = 0;
    var entr = 0;
    if (Keyboard.isDown(Keyboard.LEFT)) {Keyboard.resetKeys(Keyboard.LEFT); dirx = -1;  }
    else if (Keyboard.isDown(Keyboard.RIGHT)) {Keyboard.resetKeys(Keyboard.RIGHT); dirx = 1;  }
    else if (Keyboard.isDown(Keyboard.UP)) {Keyboard.resetKeys(Keyboard.UP); diry = -1;  }
    else if (Keyboard.isDown(Keyboard.DOWN)) {Keyboard.resetKeys(Keyboard.DOWN); diry = 1;  }
    else if (Keyboard.isDown(Keyboard.ENTER)) {Keyboard.resetKeys(Keyboard.ENTER); entr = 1; }
    this.cursor.move(delta, dirx, diry);
    this.cursor.select(entr);
    this.camera.update();
};

Game._drawLayer = function (layer) {
    var startCol = Math.floor(this.camera.x / loadedMap.tsize);
    var endCol = startCol + (this.camera.width / loadedMap.tsize);
    var startRow = Math.floor(this.camera.y / loadedMap.tsize);
    var endRow = startRow + (this.camera.height / loadedMap.tsize);
    var offsetX = -this.camera.x + startCol * loadedMap.tsize;
    var offsetY = -this.camera.y + startRow * loadedMap.tsize;
    var images = this.tileAtlas
    if(layer == 1){
        images = this.roverAtlas
    }

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = loadedMap.getTile(layer, c, r);
            var x = (c - startCol) * loadedMap.tsize + offsetX;
            var y = (r - startRow) * loadedMap.tsize + offsetY;
            if (tile !== 0) { // 0 => empty tile
                this.ctx.drawImage(
                    images, // image
                    (tile - 1) * loadedMap.tsize, // source x
                    0, // source y
                    loadedMap.tsize, // source width
                    loadedMap.tsize, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    loadedMap.tsize, // target width
                    loadedMap.tsize // target height
                );
            }
        }
    }
};

Game._drawGrid = function () {
        var width = loadedMap.cols * loadedMap.tsize;
    var height = loadedMap.rows * loadedMap.tsize;
    var x, y;
    for (var r = 0; r < loadedMap.rows; r++) {
        x = - this.camera.x;
        y = r * loadedMap.tsize - this.camera.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
    }
    for (var c = 0; c < loadedMap.cols; c++) {
        x = c * loadedMap.tsize - this.camera.x;
        y = - this.camera.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
    }
};

Game.render = function () {
    // draw loadedMap background layer
    this._drawLayer(0);

    // draw loadedMap top layer
    this._drawLayer(1);

    // draw curser
    this.ctx.drawImage(
        this.cursor.image,
        this.cursor.screenX - this.cursor.width / 2,
        this.cursor.screenY - this.cursor.height / 2);

  

    this._drawGrid();
};