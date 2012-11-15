
// Next two lines for JS-Lint, first a pragma instruction, then global vars specified
"use strict";
var $, iScroll, window, alert;

// create our own namespace
var RocknCoder = RocknCoder || {};
RocknCoder.Pages = RocknCoder.Pages || {};

RocknCoder.Pages.Kernel = function (event) {
	var that = this,
		eventType = event.type,
		pageName = $(this).attr("data-rockncoder-jspage");
	if (RocknCoder && RocknCoder.Pages && pageName && RocknCoder.Pages[pageName] && RocknCoder.Pages[pageName][eventType]) {
		RocknCoder.Pages[pageName][eventType].call(that);
	}
};

RocknCoder.Pages.Events = (function () {
	$("div[data-rockncoder-jspage]").on(
		'pagebeforecreate pagecreate pagebeforeload pagebeforeshow pageshow pagebeforechange pagechange pagebeforehide pagehide pageinit',
		RocknCoder.Pages.Kernel
	);
}());

RocknCoder.Dimensions = (function () {
	var width, height, headerHeight, footerHeight, contentHeight,
		getContentDimensions = function () {
			return {
				width: width,
				height: contentHeight
			};
		},
		init = function () {
			//width = $(window).width();
			var numTiles = 3000; // number of "tiles" in the scroll area
			var tileWidth = 200; // width of "tiles"
			width = (numTiles + 1) * tileWidth;
			//height = $(window).height();
			height = 200;
			headerHeight = $("header", $.mobile.activePage).height();
			footerHeight = $("footer", $.mobile.activePage).height();
			contentHeight = height - headerHeight - footerHeight;
		};
	return {
		init: init,
		getContent: getContentDimensions
	};
}());

RocknCoder.Pages.homePage = (function () {
	var pageshow = function () {
			RocknCoder.Dimensions.init();
			// determine the height dynamically
			var dim = RocknCoder.Dimensions.getContent();
			$("#horizontalWrapper").css('height', dim.height);
			$("#verticalWrapper").css('height', dim.height);
		};
	return {
		pageshow: pageshow
	};
}());

function iscroll_init() {
	RocknCoder.Dimensions.init();
	// determine the height dynamically
	var dim = RocknCoder.Dimensions.getContent();
	$("#horizontalWrapper").css('height', dim.height);


	var myScroll;
		// pageshow = function () {
	myScroll = new iScroll('horizontalWrapper');
		// },
		// pagehide = function () {
		// 	myScroll.destroy();
		// 	myScroll = null;
		// };
}

RocknCoder.Pages.verticalPage = (function () {
	var myScroll,
		pageshow = function () {
			myScroll = new iScroll('verticalWrapper');

		},
		pagehide = function () {
			myScroll.destroy();
			myScroll = null;
		};
	return {
		pageshow: pageshow,
		pagehide: pagehide
	};
}());

RocknCoder.Pages.horizontalPage = (function () {
	var myScroll,
		pageshow = function () {
			myScroll = new iScroll('horizontalWrapper');
		},
		pagehide = function () {
			myScroll.destroy();
			myScroll = null;
		};
	return {
		pageshow: pageshow,
		pagehide: pagehide
	};
}());