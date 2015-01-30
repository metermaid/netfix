var isHome = $('body').is('#page-WiHome');
var isKids = $('body').is('#page-Kids');
// var isGenre = $('body').is('#page-WiGenre') || $('body').is('#page-WiAltGenre');
// var isRoleDisplay = $('body').is('#page-WiRoleDisplay');

const storage = chrome.storage.sync;

function getRating(movieID,boxArt, displayRatings, hideBadMovies, ratedMovies, callback) {
	$.getJSON("http://www.netflix.com/JSON/BOB?lnkce=bob&movieid=" + movieID, function (data) {
		var html = $('<div>').html(data.html);

		var starbar = html.find('.starbar:first').find('span:first');
		var classes = starbar.find('span').attr('class');
		starbar = starbar.wrap( "<div class='starbar'></div>" );

		if (displayRatings)
			boxArt.append(starbar);
		if (hideBadMovies)
			hideBadMovie(classes,boxArt);
		if (isHome && ratedMovies)
			hideSelfRated(classes,boxArt);

		boxArt.find('a').addClass('checked');
	});
}

function hideBadMovie(classes,boxArt) {
  storage.get("hiddenRatings", function(o) { 
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

function cleanUpRows() {
	$('.sliderButton').remove();
	$('.boxShotDivider').remove();

	$('.mrow:not(.characterRow) .hd:has(a)').each(function(){
		var url = $(this).find('a:first-child').attr('href');
		var slider = $(this).parent().find('.slider');
		slider.removeClass('triangleBtns');

    	slider.find('.agMovieSet').addClass('subset');
    	slider.find('.agMovieSet .agMovie:nth-child(n+8)').remove();
    	slider.after('<a href="' + url + '" class="showMore">Show More</a>');
	});
	
	$('.mrow:not(.characterRow) .hd:not(:has(a))').each(function(){
		var slider = $(this).parent().find('.slider');
		slider.removeClass('triangleBtns');

		slider.removeClass('slider');

    	slider.find('.agMovieSet').addClass('truncated');
    	slider.after('<a href="#" class="showMore toggleMovies">Show More</a>');
	});

 	$('.toggleMovies').unbind("click").click( function(e){
 		e.preventDefault();
 		$(this).prev().find('.agMovieSet').toggleClass('truncated');
 		if ($(this).text() == "Show More")
 			$(this).text("Hide More");
 		else
 			$(this).text("Show More");
 	});
}

function processNewLinks(noInstantPlay, displayRatings, hideBadMovies, ratedMovies) {
	$('.gallery a:not(.checked)[href*=WiPlayer], .agMovieSet a:not(.checked)[href*=WiPlayer]').each(function(i){
		var url = $(this).attr('href').replace(/WiPlayer/i, "WiMovie");

		if (noInstantPlay)
			$(this).attr('href',url).css('background-image', 'none');

		movieID = url.match(/\?movieid=([0-9]+)/)[1];

      setTimeout(function(movieID,boxArt) { return function() { getRating(movieID,boxArt, displayRatings, hideBadMovies, ratedMovies); }; }(movieID, $(this).parent()), 100*i);
	});
}

$(document).ready(function(){	
	// remove the facebook row
	$('.mrow.fb').remove();

	// remove the billboard
	$('#billboard').remove();

	// hide annotations
	$('.videoAnnotation').hide();

	storage.get(["noInstantPlay", "hideBadMovies","displayRatings","ratedMovies","hideSliders"], function(o) {
		if ((isHome || isKids) && (!("hideSliders" in o) || o["hideSliders"] == true))
			cleanUpRows();

		var noInstantPlay = (!("noInstantPlay" in o) || o["noInstantPlay"] == true);
		var displayRatings = (!("displayRatings" in o) || o["displayRatings"] == true);
		var hideBadMovies = (!("hideBadMovies" in o) || o["hideBadMovies"] == true);
		var ratedMovies = (!("ratedMovies" in o) || o["ratedMovies"] == true);

		processNewLinks(noInstantPlay, displayRatings, hideBadMovies, ratedMovies);

	});
});