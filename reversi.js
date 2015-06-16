"use strict";

var A = 0, B = 1, C = 2, D = 3, E = 4, F = 5, G = 6, H = 7;

var f = function(x,y){return start()};

function start() {
	var width = 512;
	var height = 512;
	var HUMAN_COLOR=1;
	var COMPUTER_COLOR=2;

	var board = [
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,2,1,0,0,0],
		[0,0,0,1,2,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0]
	];

	var aiScoreMap = new Array(
		[100, -1,  1,  0,  0,  1, -1,100],
		[ -1, -2,  0,  0,  0,  0, -2, -1],
		[  1,  0,  1,  0,  0,  1,  0,  1],
		[  0,  0,  0,  0,  0,  0,  0,  0],
		[  0,  0,  0,  0,  0,  0,  0,  0],
		[  1,  0,  1,  0,  0,  1,  0,  1],
		[ -1, -2,  0,  0,  0,  0, -2, -1],
		[100, -1,  1,  0,  0,  1, -1,100]
	);

	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	var ctx = canvas.getContext("2d");

	var count = function(x, y, c) {
		if (board[y][x]) return 0;
		var d = [[0,1],[1,0],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
		var cc = 0;
		for (var i=0;i<8;i++) {
			for (var px=x+d[i][0], py=y+d[i][1], n=0; py>=0 && py<board.length && px>=0 && px < board[0].length; px+=d[i][0], py+=d[i][1], n++) {
				if (board[py][px] == c) {cc += n; break;}
				if (board[py][px] == 0) {break;}
			}
		}
		return cc;
	}
	
	var score = function(x, y, c) {
		var cc = count(x,y, c);
		return cc > 0 ? (cc*10 + aiScoreMap[y][x]) : 0;
	}

	var set = function(x, y, c) {
		board[y][x] = c;
		var d = [[0,1],[1,0],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
		var cc = 0;
		for (var i=0;i<8;i++) {
			for (var px=x+d[i][0], py=y+d[i][1], n=0; py>=0 && py<board.length && px>=0 && px < board[0].length; px+=d[i][0], py+=d[i][1], n++) {
				if (board[py][px] == c) {
					for (var j=1; j<=n; j++) {
						board[y+d[i][1]*j][x+d[i][0]*j] = c;
					}
					cc += n;
					break;
				}
				if (board[py][px] == 0) {break;}
			}
		}
		return cc;
	}

	var draw = function () {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		ctx.lineWidth  = 2;
		ctx.strokeStyle = "black";
		ctx.fillStyle = "white";
		var cw = (width - 40) / board[0].length;
		var ch = (height - 40) / board.length;
		for (var y = 0; y < board.length; y++) {
			ctx.fillText("" + y, 4, y*ch + 20 + ch*0.5);
		}
		for (var x = 0; x < board[0].length; x++) {
			ctx.fillText("ABCDEFGHIJK".substr(x,1), x*cw + 20 + cw*0.5, 14);
		}
		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < row.length; x++) {
				ctx.rect(x*cw + 20, y*ch + 20, cw, ch);
				ctx.stroke();
				if (board[y][x]) {
					ctx.fillStyle = board[y][x] == 1 ? 'black': 'white';
					ctx.beginPath();
					ctx.arc(x*cw + 20 + cw*0.5, y*ch + 20 + ch*0.5, cw*0.4, 0, Math.PI*2, false);
					ctx.fill();
				}
			}
		}
	}

	var print = function () {
		console.log("%c ", "font-size:0px;padding-left:"+width+"px;padding-top:"+height+"px;background:green url("+ canvas.toDataURL() + ") no-repeat");
	}

	var ff = function(x,y) {
		if (count(x,y, HUMAN_COLOR) == 0) return "?";
		set(x,y, HUMAN_COLOR);
		draw();
		print();
		setTimeout(ai, 1000);
		f = function(x,y){return "please wait!"};
		return "please wait..."
	};

	var ai = function() {
		var max = 0, px, py;
		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < row.length; x++) {
				var s = score(x,y, COMPUTER_COLOR);
				if (s > max) {
					max = s;
					px = x;
					py = y;
				}
			}
		}
		if (max > 0) {
			set(px, py, COMPUTER_COLOR);
			draw();
			print();
		} else {
			console.log("PASS!");
		}
		console.log("Your turn : call f(x,y); // ex: f(D, 2)");
		f = ff;
	}

	console.log("%c ", "font-size:512px");
	draw();
	print();
	f = ff;
	return "Your turn : call f(x,y); // ex: f(D, 2)";
}

window.addEventListener('load',(function(e){
	console.log("%c Reversi", 'color:green ; font-weight:bold; font-size:40pt');
	console.log("Please call start();");
}),false);
