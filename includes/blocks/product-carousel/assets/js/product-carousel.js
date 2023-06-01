(function($) {

	"use strict";

	var swiper = [];

	$('.wpmozo-product-carousel-wrap').each(function(){

		var atts = $(this).data('atts');

		var sw_obj = {
			slidesPerView: atts.Columns,
		  	spaceBetween: atts.SpaceBetween,
			loop: atts.Loop,
		}

		if ( atts.AutoPlay ) {
		  	sw_obj.autoplay = {
			   delay: atts.Delay,
			};
		}

		if ( atts.ShowPagination ) {
			sw_obj.pagination = {
			    el: '.swiper-pagination',
			    type: atts.PaginationType,
			};
		}

		if ( atts.ShowNavigation ) {
			sw_obj.navigation = {
		    	nextEl: ".swiper-button-next",
		    	prevEl: ".swiper-button-prev",
		  	};
		}
		console.log(sw_obj);

		let _swiper = new Swiper(this, sw_obj);
		swiper.push(_swiper);

	});

} )(jQuery);