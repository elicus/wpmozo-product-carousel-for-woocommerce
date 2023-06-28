(function($) {

	"use strict";

	var ProductTypes = wpmozo_carousel_object.products_types;

	var swiper = [];

	$('.wpmozo-product-carousel-wrap').each(function(){

		var $this = $(this),
		 	atts = $(this).data('atts');

        let options = atts.CarContStyle;
        let style = '';
        if ( 'undefined' !== typeof options.padding && '' !== options.padding && ( 
            'undefined' !== typeof options.padding.top || 
            'undefined' !== typeof options.padding.right || 
            'undefined' !== typeof options.padding.bottom || 
            'undefined' !== typeof options.padding.left ) ) {
            let spacing = convetVarStyle(options.padding);
            style += 'padding: '+spacing.top+' '+spacing.right+' '+spacing.bottom+' '+spacing.left+';';
        }
        $this.attr('style', style);
        let mobileSett = atts.Responsive.mobile;
        let tabletSett = atts.Responsive.tablet;

		var sw_obj = {
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
                    	{attKey: 'TitleColor', type: 'color', selector: '.woocommerce-loop-product__title'},
                        {attKey: 'PriceColor', type: 'color', selector: '.price'},
                        {attKey: 'AddToCartColor', type: 'color', selector: add_to_cart_selector},
                        {attKey: 'QuickViewColor', type: 'color', selector: '.wpmozo-quick-view-button'},
                        {attKey: 'SaleLabelColor', type: 'color', selector: '.onsale'},
                        {attKey: 'StockLabelColor', type: 'color', selector: '.soldout-text'},
                    ];

                    styles.map(
					  	function(item) { appendInlineStyle(item, $this, atts); }
					);

                },
                afterInit: function(swiper){

                	$this.find('.wpmozo-loader').remove();
                	$this.removeClass('loading');

                }
            },
            breakpoints: {
                0: {
                  slidesPerView: mobileSett.Columns,
                  spaceBetween: mobileSett.SpaceBetween,
                  slidesPerGroup: mobileSett.SlidesToScroll,
                },
                480: {
                  slidesPerView: tabletSett.Columns,
                  spaceBetween: tabletSett.SpaceBetween,
                  slidesPerGroup: tabletSett.SlidesToScroll,
                },
                1025: {
                  slidesPerView: atts.Columns,
                  spaceBetween: atts.SpaceBetween,
                  slidesPerGroup: atts.SlidesToScroll,
                },
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

        let attKey = item.attKey,
            selector = item.selector,
            type = item.type,
            inlineStyle = convetInlineStyle( atts[attKey], type );
        if ( '' !== inlineStyle ) {
            var defaultStyle = wraper.find(selector).attr('style');
            if ( '' !== defaultStyle && 'undefined' !== typeof defaultStyle ) {
                inlineStyle += defaultStyle;
            }
            wraper.find(selector).attr('style', inlineStyle);
        }

    }

    function convetVarStyle( spacing ){

        for (const type in spacing) {
            let value = spacing[type];
            if ( value.startsWith("var:") ) {
                let str = value.replace('var:', 'var(--wp--').replace(/\|/g, '--') + ')';
                spacing[type] = str;
            }
        }

        return spacing;

    }

	function convetInlineStyle( options, type ){

        let style = '';

        if ( 'style' === type ) {
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
        }

        if ( 'color' === type ) {
            if ( 'undefined' !== typeof options.text && '' !== options.text ) {
                style += 'color: '+options.text+';';
            }
            if ( 'undefined' !== typeof options.background && '' !== options.background ) {
                style += 'background: '+options.background+';';
            }
        }

        return style;

    }

} )(jQuery);