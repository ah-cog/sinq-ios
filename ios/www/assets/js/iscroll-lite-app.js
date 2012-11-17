
// Next two lines for JS-Lint, first a pragma instruction, then global vars specified
"use strict";
var $, iScroll, window, alert;

function iscroll_init() {
	var numTiles = 3000; // max number of "tiles" in the scroll area
	var tileWidth = 200; // width of "tiles"
	width = (numTiles + 1) * tileWidth;
	height = 200;

	// determine the height dynamically
	$("#question-horizontalWrapper").css('height', height);
	$("#causeandeffect-horizontalWrapper").css('height', height);
	// $("#investigation-horizontalWrapper").css('height', height);

	// question_myScroll = new iScroll('question-horizontalWrapper');
	// causeandeffect_myScroll = new iScroll('causeandeffect-horizontalWrapper');
	// var investigation_myScroll = new iScroll('investigation-horizontalWrapper');

	// TODO: Place this in a function to call when the chosen question div is hidden (i.e., when slideUp is called?)?
	// pagehide = function () {
	// 	myScroll.destroy();
	// 	myScroll = null;
	// };
}