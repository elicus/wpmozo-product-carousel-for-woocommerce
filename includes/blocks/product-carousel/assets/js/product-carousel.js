(function($) {

	"use strict";

	var ProductTypes = wpmozo_carousel_object.products_types;

	var swiper = [];

	$('.wpmozo-product-carousel-wrap').each(function(){

		var $this = $(this),
		 	atts = $(this).data('atts');

		var sw_obj = {
			slidesPerView: atts.Columns,
		  	spaceBetween: atts.SpaceBetween,
			loop: atts.Loop,
			on: {
                beforeInit: function(swiper){

                	let add_to_cart_selector = '.add_to_cart_button';
                    if ( ProductTypes.length ) {
                        jQuery.each(ProductTypes, function(key, type){
                            add_to_cart_selector += ', .button.product_type_'+type;
                        });
                    }

                    let styles = [
                    	{attKey: 'TitleStyle', selector: '.woocommerce-loop-product__title'},
                    	{attKey: 'PriceStyle', selector: '.price'},
                    	{attKey: 'AddToCartStyle', selector: add_to_cart_selector},
                    	{attKey: 'QuickViewStyle', selector: '.wpmozo-quick-view-button'},
                    	{attKey: 'SaleLabelStyle', selector: '.onsale'},
                    	{attKey: 'StockLabelStyle', selector: '.soldout-text'},
                    ];

                    styles.map(
					  	function(item) { appendInlineStyle(item, $this, atts); }
					);

                }
            },
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

	function appendInlineStyle( item, wraper, atts ){

		let attKey = item.attKey;
		let selector = item.selector;
		let inlineStyle = convetInlineStyle( atts[attKey] );
        if ( '' !== inlineStyle ) {
            wraper.find(selector).attr('style', inlineStyle);
        }

	}

	function convetInlineStyle( options ){

        let style = '';

        if ( 'undefined' !== typeof options.FontSize && '' !== options.FontSize ) {
            style += 'font-size: '+options.FontSize+';';
        }
        if ( 'undefined' !== typeof options.FontAppearance.fontStyle && '' !== options.FontAppearance.fontStyle ) {
            style += 'font-style: '+options.FontAppearance.fontStyle+';';
        }
        if ( 'undefined' !== typeof options.FontAppearance.fontWeight && '' !== options.FontAppearance.fontWeight ) {
            style += 'font-weight: '+options.FontAppearance.fontWeight+';';
        }
        if ( 'undefined' !== typeof options.LetterSpacing && '' !== options.LetterSpacing ) {
            style += 'letter-spacing: '+options.LetterSpacing+';';
        }
        if ( 'undefined' !== typeof options.Decoration && '' !== options.Decoration ) {
            style += 'text-decoration: '+options.Decoration+';';
        }
        if ( 'undefined' !== typeof options.LetterCase && '' !== options.LetterCase ) {
            style += 'text-transform: '+options.LetterCase+';';
        }

        return style;

    }

} )(jQuery);