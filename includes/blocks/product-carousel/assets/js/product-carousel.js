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
			    clickable: true,
			};
		}

		if ( atts.ShowNavigation ) {
			sw_obj.navigation = {
		    	nextEl: ".swiper-button-next",
		    	prevEl: ".swiper-button-prev",
		  	};
		}

		let _swiper = new Swiper(this, sw_obj);
		swiper.push(_swiper);

	});

	$('.wpmozo-quick-view-button').click(function(e){

        e.preventDefault();

        var pro_id = $(this).data('pro-id');

		$.magnificPopup.open({
			items: {
				src: wpmozo_carousel_object.ajax_url,
			},
            type: 'ajax',
            mainClass: 'wpmozo-quick-view',
            preloader: true,
            tLoading: wpmozo_carousel_object.loading,
            ajax: {
                settings: {
                    type: 'GET',
                    data: {
                        action: 'wpmozo_quick_view_content',
                        _ajax_nonce: wpmozo_carousel_object.nonce,
                        pro_id: pro_id
                    }
                }
            },
            showCloseBtn: true,
            callbacks: {
                ajaxContentAdded: function () {
                    if (typeof wc_add_to_cart_variation_params !== 'undefined') {
                        var form_variation = jQuery('.wpmozo-product-quick-view').find('.variations_form');
                        form_variation.each(function () {
                            jQuery(this).wc_variation_form();
                        });
                    }

                    jQuery( '.woocommerce-product-gallery' ).each( function() {

						jQuery( this ).trigger( 'wc-product-gallery-before-init', [ this, wc_single_product_params ] );
						jQuery( this ).wc_product_gallery( wc_single_product_params );
						jQuery( this ).trigger( 'wc-product-gallery-after-init', [ this, wc_single_product_params ] );

					} );
                }
            },
        });

	});

} )(jQuery);