var isHome = $('body').is('#page-WiHome');
var isKids = $('body').is('#page-Kids');
// var isGenre = $('body').is('#page-WiGenre') || $('body').is('#page-WiAltGenre');
// var isRoleDisplay = $('body').is('#page-WiRoleDisplay');

function getRating(url,boxArt,callback) {
	$.get(url, function(data){
		var html = jQuery('<div>').html(data);
		var starbar = html.find('.starbar:first').find('span:first');
		boxArt.append(starbar);
		var classes = starbar.find('span').attr('class');
		hideBadMovie(classes,boxArt);
		if (isHome)
			hideSelfRated(classes,boxArt);
	});
}

function hideBadMovie(classes,boxArt) {
		if (/sbmf-[01][0-9]|sbmf-2[0-5]/.test(classes)) {
			boxArt.parent().remove();
	}
}

function hideSelfRated(classes,boxArt) {
		if (/sbmfrt/.test(classes)) {
			boxArt.parent().hide();
	}
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
		$(this).addClass('checked');
		$(this).attr('href',url);
		$(this).css('background-image', 'none');
		getRating(url,$(this).parent());
	});
}

$(document).ready(function(){
	// Remove all sliders in favour of plain ol' boxes
	
	cleanUpPage();
	processInterval = window.setInterval(processNewLinks, 1000);

	if (isHome || isKids) {
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