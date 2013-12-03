function getRating(url,boxArt) {
	$.get(url, function(data){
		var html = jQuery('<div>').html(data);
		var starbar = html.find('.starbar:first').find('span:first');
		boxArt.append(starbar);
		var starClass = starbar.find('span').attr('class');//.match(/sbmf-[0-9]{2}/)[1];

		// hide poorly rated
		if (/sbmf-[01][0-9]|sbmf-2[0-5]/.test(starClass)) {
			boxArt.parent().hide();
		}
		// hide self rated
		if (/sbmfrt/.test(starClass)) {
			boxArt.parent().hide();
		}
	});
}

$(document).ready(function(){
	// Remove all sliders in favour of plain ol' boxes
	
	//not sure if I like this
	$('.slider').each(function(){
		$(this).removeClass('triangleBtns');
		$('.boxShotDivider').remove();
		$(this).removeClass('slider');
	});
	
	// remove the facebook row
	$('.mrow.fb').remove();

	$('a[href*=WiPlayer]').each(function(){
		var url = $(this).attr('href');
		url = url.replace(/WiPlayer\?movieid=/i, "WiMovie/");
		url = url.replace(/\&/i, "?");
		$(this).attr('href',url);
		$(this).css('background-image', 'none');
		getRating(url,$(this).parent());
	})
});