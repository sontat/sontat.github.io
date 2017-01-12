var rules = {
conway: {b: [3], s: [2, 3]},
dayandnight: {b: [3, 6, 7, 8], s: [3, 4, 6, 7, 8]},
highlife: {b: [3, 6], s: [2, 3]},
lifewithoutdeath: {b: [3], s: [0, 1, 2, 3, 4, 5, 6, 7, 8]},
livefreeordie: {b: [2], s: [0]},
maze: {b: [3], s: [1, 2, 3, 4, 5]},
seeds: {b: [2], s: []}
};

var intervalID;
var n = 100;
var cellsize = 6;
var rand_threshold = 0.2;
var cells = new Array(n);  
for (var i = 0; i < n; i++) {
    cells[i] = new Array(n);
}

var ruleset = rules["conway"];

var canvas = document.getElementById("lifecanvas");
var ctx = canvas.getContext("2d");

function draw(x, y, state) {
    ctx.fillStyle = ((state == 1) ? "#000000" : "#FFFFFF");
    ctx.fillRect(cellsize*x, cellsize*y, cellsize, cellsize)
}

function mod(x, y) {
    return ((x % y) + y) % y;
}

function clamp(num, min, max) {
  return ((num < min) ? min : ((num > max) ? max : num));
}

function inArray(target, arr) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] === target) {
            return true;
        }
    }
    return false; 
}

function insertEntity(ename) {
    if (ename == '') return;
    var e = entities[ename];
    var xstart = Math.floor(n/2 - e.width/2);
    var ystart = Math.floor(n/2 - e.height/2);
    for (var i = 0; i < e.height; i++) {
        for (var j = 0; j < e.width; j++) {
            var status = Number(e.form.charAt(j + i*e.width));
            cells[j + xstart][i + ystart] = status;
            draw(j + xstart, i + ystart, status);
        }
    }
}

function changeRules(rname) {
    ruleset = rules[rname];
}

function generateCells(threshold) {
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (Math.random() < threshold) {
                cells[i][j] = 1;
                draw(i,j,1);
            } else {
                cells[i][j] = 0;
                draw(i,j,0);
            }
        }
    }
}

function iterate() {
    var new_cells = new Array(n);
    for (var i = 0; i < n; i++) {
        new_cells[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            var neighbors = cells[mod((i-1),n)][j] +
                cells[mod((i-1), n)][mod((j-1), n)] +
                cells[i][mod((j-1), n)] +
                cells[mod((i+1), n)][mod((j-1), n)] +
                cells[mod((i+1), n)][j] +
                cells[mod((i+1), n)][mod((j+1), n)] +
                cells[i][mod((j+1),n)] +
                cells[mod((i-1), n)][mod((j+1), n)];
            if (cells[i][j]) {
                if (inArray(neighbors, ruleset.s)) {
                    new_cells[i][j] = 1;
                } else {
                    new_cells[i][j] = 0;
                    draw(i,j,0);
                }
            } else {
                if (inArray(neighbors, ruleset.b)) {
                    new_cells[i][j] = 1;
                    draw(i,j,1);
                } else {
                    new_cells[i][j] = 0;
                }
            }
        }
    }
    cells = new_cells;
}

function run() {
    clearInterval(intervalID);
    intervalID = setInterval(iterate, 100);
    document.getElementById("statusicon").className = "glyphicon glyphicon-play";
    document.getElementById("statusicon").style.color = "#5FCC28";
}

function stop() {
    clearInterval(intervalID);
    document.getElementById("statusicon").className = "glyphicon glyphicon-pause";
    document.getElementById("statusicon").style.color = "#CC2828";
}

function toggle(e) {
    var rect = canvas.getBoundingClientRect();
    var x = Math.floor(clamp(Math.floor(e.clientX - rect.left), 0, n*cellsize-1)/cellsize);
    var y = Math.floor(clamp(Math.floor(e.clientY - rect.top),  0, n*cellsize-1)/cellsize);
    if (cells[x][y]) {
        cells[x][y] = 0;
        draw(x, y, 0);
    } else {
        cells[x][y] = 1;
        draw(x, y, 1);
    }
}

var entities = {
glider: {
width:3,height:3,form:"\
011\
101\
001\
"},
lwss: {
width:5,height:4,form:"\
01001\
10000\
10001\
11110\
"},
mwss: {
width:6,height:5,form:"\
000100\
010001\
100000\
100001\
111110\
"},
hwss: {
width:7,height:5,form:"\
0001100\
0100001\
1000000\
1000001\
1111110\
"},
figureeight: {
width:6,height:6,form:"\
111000\
111000\
111000\
000111\
000111\
000111\
"},
tumbler: {
width:9,height:5,form:"\
010000010\
101000101\
100101001\
001000100\
001101100\
"},
koksgalaxy: {
width:9,height:9,form:"\
110111111\
110111111\
110000000\
110000011\
110000011\
110000011\
000000011\
111111011\
111111011\
"},
queenbeeshuttle: {
width:22,height:7,form:"\
0000000001000000000000\
0000000101000000000000\
0000001010000000000000\
1100010010000000000011\
1100001010000000000011\
0000000101000000000000\
0000000001000000000000\
"},
gosperglidergun: {
width:36,height:16,form:"\
000000000000000000000000100000000000\
000000000000000000000010100000000000\
000000000000110000001100000000000011\
000000000001000100001100000000000011\
110000000010000010001100000000000000\
110000000010001011000010100000000000\
000000000010000010000000100000000000\
000000000001000100000000000000000000\
000000000000110000000000000000000000\
000000000000000000000000000000000000\
000000000000000000000000000000000000\
000000000000000000000000000000000000\
000000000000000000000000001100000000\
000000000000000000000000001010000000\
000000000000000000000000000010000000\
000000000000000000000000000011000000\
"},
copperhead: {
width:8,height:12,form:"\
01100110\
00011000\
00011000\
10100101\
10000001\
00000000\
10000001\
01100110\
00111100\
00000000\
00011000\
00011000\
"},
loafer: {
width:9,height:9,form:"\
011001011\
100100110\
010100000\
001000000\
000000001\
000000111\
000001000\
000000100\
000000011\
"}
};