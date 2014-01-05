var isHome = $('body').is('#page-WiHome');
var isKids = $('body').is('#page-Kids');
// var isGenre = $('body').is('#page-WiGenre') || $('body').is('#page-WiAltGenre');
// var isRoleDisplay = $('body').is('#page-WiRoleDisplay');

const storage = chrome.storage.sync;

function getRating(url,boxArt,callback) {
	$.get(url, function(data){
	  storage.get(["displayRatings","ratedMovies"], function(o) { 
			var html = jQuery('<div>').html(data);
			var starbar = html.find('.starbar:first').find('span:first');
			if (!("displayRatings" in o) || o["displayRatings"] == true)
				boxArt.append(starbar);
			var classes = starbar.find('span').attr('class');
			hideBadMovie(classes,boxArt);
			if (isHome && (!("ratedMovies" in o) || o["ratedMovies"] == true))
				hideSelfRated(classes,boxArt);
		});
	});
}

function hideBadMovie(classes,boxArt) {
  storage.get("hiddenRatings", function(o) { 
  	//alert(JSON.stringify(o));
	if (o["hiddenRatings"] == undefined || o["hiddenRatings"] == "2.5") {
		if (/sbmf-[01][0-9]|sbmf-2[0-5]/.test(classes))
			boxArt.parent().remove();
	} else if (o["hiddenRatings"] == "2") {
		if (/sbmf-[01][0-9]/.test(classes))
			boxArt.parent().remove();
	} else if (o["hiddenRatings"] == "1.5") {
		if (/sbmf-0[0-9]|sbmf-1[0-5]/.test(classes))
			boxArt.parent().remove();
	} else if (o["hiddenRatings"] == "1") {
		if (/sbmf-0[0-9]/.test(classes))
			boxArt.parent().remove();
	} else if (o["hiddenRatings"] == "0.5") {
		if (/sbmf-0[0-5]/.test(classes))
			boxArt.parent().remove();
	}
  });
}

function hideSelfRated(classes,boxArt) {
	if (/sbmfrt/.test(classes))
		boxArt.parent().hide();
}

function cleanUpPage() {
	//not sure if I like this
	$('.mrow:not(.characterRow) .slider').each(function(){
		$(this).removeClass('triangleBtns');
		$('.sliderButton').remove();
		$('.boxShotDivider').remove();
		$(this).removeClass('slider');
	});

	// remove the facebook row
	$('.mrow.fb').remove();

	// hide annotations for even rows
	$('.videoAnnotation').hide();
}

function cleanUpURL(url) {
	url = url.replace(/WiPlayer\?movieid=/i, "WiMovie/");
	url = url.replace(/\&/i, "?");
	return url;
}

function processNewLinks() {
	$('.agMovieSet a:not(.checked)[href*=WiPlayer]').each(function(){
		var url = cleanUpURL($(this).attr('href'));
		var movieLink = $(this);
		movieLink.addClass('checked');
	  	storage.get("noInstantPlay", function(o) {
			if (!("noInstantPlay" in o) || o["noInstantPlay"] == true) {
				movieLink.attr('href',url);
				movieLink.css('background-image', 'none');
			}
		});
		getRating(url,movieLink.parent());
	});
}

$(document).ready(function(){	
	processInterval = window.setInterval(processNewLinks, 1000);

	storage.get("hideSliders", function(o) {
		if ((isHome || isKids) && (!("hideSliders" in o) || o["hideSliders"] == true)) {
			cleanUpPage();

			$('.mrow:not(.characterRow) .agMovieSet').each (function () {
	    	$(this).addClass('truncated');
	    	$(this).after('<a href="#" class="toggleMovies">Show More</a>');
	    	$('.toggleMovies').unbind("click").click( function(e){
	    		e.preventDefault();
	    		$(this).prev('.agMovieSet').toggleClass('truncated');
	    		if ($(this).text() == "Show More")
	    			$(this).text("Hide More");
	    		else
	    			$(this).text("Show More");
	    	});
			});
		}
	});
});