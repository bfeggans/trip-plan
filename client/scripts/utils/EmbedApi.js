import $ from 'jquery';

export default class EmbedApi {

	getMedia(link, cb){
		var mediaTag;

		$.ajax({
			url: 'https://noembed.com/embed?url=' + link,
			dataType: "jsonp",
			success:function(response){
				// if noembed cant return a provider or if a gif is provided (they show as broken images) return a clickable link instead
				if ((response.error && link.startsWith('http')) || (response.html.indexOf('.gif') > -1)){
					mediaTag = '<a href="'+link+'">'+link+'</a>';	
				} else {
					mediaTag = response.html;
				}
				cb(mediaTag);
			},
			error:function(response){
				console.log(response);
				mediaTag = '<a href="'+link+'">'+link+'</a>';
				cb(mediaTag);
			}
		})
	}

}