(function($) {

	"use strict";

	var swiper = [];

	$('.wpmozo-product-carousel-wrap').each(function(){

		var atts = $(this).data('atts');

		let _swiper = new Swiper(this, {
			slidesPerView: atts.Columns,
		  	spaceBetween: atts.SpaceBetween,
		  	autoplay: {
			   delay: atts.Speed,
			},
			loop: true,
		  	navigation: {
		    	nextEl: ".swiper-button-next",
		    	prevEl: ".swiper-button-prev",
		  	},
		});
		swiper.push(_swiper);

	});

} )(jQuery);