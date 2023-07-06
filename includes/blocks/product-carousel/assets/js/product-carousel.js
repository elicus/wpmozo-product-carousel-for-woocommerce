(function($) {

	"use strict";

	var ProductTypes = wpmozo_carousel_object.products_types;

	var swiper = [];

	$('.wpmozo-product-carousel-wrap').each(function(){

		var $this = $(this),
		 	atts = $(this).data('atts');

        let options = atts.CarouContStyle;
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
                        {attKey: 'TitleStyle', type: 'style', selector: '.woocommerce-loop-product__title'},
                        {attKey: 'PriceStyle', type: 'style', selector: '.price'},
                        {attKey: 'AddToCartStyle', type: 'style', selector: add_to_cart_selector},
                        {attKey: 'QuickViewStyle', type: 'style', selector: '.wpmozo-quick-view-button'},
                        {attKey: 'SaleLabelStyle', type: 'style', selector: '.onsale'},
                        {attKey: 'StockLabelStyle', type: 'style', selector: '.stock.out-of-stock'},
                        {attKey: 'TitleColor', type: 'color', selector: '.woocommerce-loop-product__title'},
                        {attKey: 'PriceColor', type: 'color', selector: '.price'},
                        {attKey: 'AddToCartColor', type: 'color', selector: add_to_cart_selector},
                        {attKey: 'QuickViewColor', type: 'color', selector: '.wpmozo-quick-view-button'},
                        {attKey: 'SaleLabelColor', type: 'color', selector: '.onsale'},
                        {attKey: 'StockLabelColor', type: 'color', selector: '.stock.out-of-stock'},
                        {attKey: 'StockLabelBorder', type: 'border', selector: '.stock.out-of-stock'},
                        {attKey: 'StockLabelDimensions', type: 'dimensions', selector: '.stock.out-of-stock'},
                        {attKey: 'CarouNavigation', type: 'navigation', selector: '.swiper-navigation'},
                        {attKey: 'CarouNavigation', type: 'color', selector: '.swiper-navigation'},
                        {attKey: 'CarouNavigation', type: 'dimensions', selector: '.swiper-navigation'},
                        {attKey: 'CarouNavigationLeft', type: 'dimensions', selector: '.swiper-button-prev'},
                        {attKey: 'CarouNavigationRight', type: 'dimensions', selector: '.swiper-button-next'},
                        {attKey: 'AddToCartBorder', type: 'border', selector: add_to_cart_selector},
                        {attKey: 'QuickViewBorder', type: 'border', selector: '.wpmozo-quick-view-button'},
                        {attKey: 'AddToCartDimensions', type: 'dimensions', selector: add_to_cart_selector},
                        {attKey: 'QuickViewDimensions', type: 'dimensions', selector: '.wpmozo-quick-view-button'},
                    ];

                    styles.map(
					  	function(item) { appendInlineStyle(item, $this, atts); }
					);

                },
                afterInit: function(swiper){

                    let PaginationSelector = ( 'fraction' !== atts.PaginationType ) ? '.swiper-pagination span' : '.swiper-pagination';

                    let styles = [
                        {attKey: 'CarouPagination', type: 'pagination', selector: PaginationSelector},
                    ];

                    if ( 'progressbar' === atts.PaginationType ) {
                        let pagi = {attKey: 'CarouPagination', type: 'progressbar', selector: '.swiper-pagination'}
                        styles.push(pagi);
                    }

                    styles.map(
                        function(item) { appendInlineStyle(item, $this, atts); }
                    );

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
        var wraper = $(this).closest('.wpmozo-product-carousel-wrap'),
            atts = wraper.data('atts'),
            pro_id = $(this).data('pro-id'),
            body = jQuery('body');

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

                    let $this = jQuery('.wpmozo-product-quick-view');
                    let add_to_cart_selector = '.add_to_cart_button, .single_add_to_cart_button';
                    if ( ProductTypes.length ) {
                        jQuery.each(ProductTypes, function(key, type){
                            add_to_cart_selector += ', .button.product_type_'+type;
                        });
                    }

                    let styles = [];
                    if ( atts.SameAsCarousel ) {
                        styles = [
                            {attKey: 'TitleStyle', type: 'style', selector: '.product_title'},
                            {attKey: 'PriceStyle', type: 'style', selector: '.price'},
                            {attKey: 'AddToCartStyle', type: 'style', selector: add_to_cart_selector},
                            {attKey: 'SaleLabelStyle', type: 'style', selector: '.onsale'},
                            {attKey: 'StockLabelStyle', type: 'style', selector: '.stock.out-of-stock'},
                            {attKey: 'StockLabelBorder', type: 'border', selector: '.stock.out-of-stock'},
                            {attKey: 'StockLabelDimensions', type: 'dimensions', selector: '.stock.out-of-stock'},
                            {attKey: 'TitleColor', type: 'color', selector: '.product_title'},
                            {attKey: 'PriceColor', type: 'color', selector: '.price'},
                            {attKey: 'AddToCartColor', type: 'color', selector: add_to_cart_selector},
                            {attKey: 'SaleLabelColor', type: 'color', selector: '.onsale'},
                            {attKey: 'StockLabelColor', type: 'color', selector: '.stock.out-of-stock'},
                            {attKey: 'AddToCartBorder', type: 'border', selector: add_to_cart_selector},
                            {attKey: 'AddToCartDimensions', type: 'dimensions', selector: add_to_cart_selector},
                        ];
                    }else{
                        styles = [
                            {attKey: 'QuickViewTitleStyle', type: 'style', selector: '.product_title'},
                            {attKey: 'QuickViewPriceStyle', type: 'style', selector: '.price'},
                            {attKey: 'QuickViewAddToCartStyle', type: 'style', selector: add_to_cart_selector},
                            {attKey: 'QuickViewSaleLabelStyle', type: 'style', selector: '.onsale'},
                            {attKey: 'QuickViewStockLabelStyle', type: 'style', selector: '.stock.out-of-stock'},
                            {attKey: 'QuickViewStockLabelBorder', type: 'border', selector: '.stock.out-of-stock'},
                            {attKey: 'QuickViewStockLabelDimensions', type: 'dimensions', selector: '.stock.out-of-stock'},
                            {attKey: 'QuickViewTitleColor', type: 'color', selector: '.product_title'},
                            {attKey: 'QuickViewPriceColor', type: 'color', selector: '.price'},
                            {attKey: 'QuickViewAddToCartColor', type: 'color', selector: add_to_cart_selector},
                            {attKey: 'QuickViewSaleLabelColor', type: 'color', selector: '.onsale'},
                            {attKey: 'QuickViewStockLabelColor', type: 'color', selector: '.stock.out-of-stock'},
                            {attKey: 'QuickViewAddToCartBorder', type: 'border', selector: add_to_cart_selector},
                            {attKey: 'QuickViewAddToCartDimensions', type: 'dimensions', selector: add_to_cart_selector},
                        ];
                    }

                    var popup_styles = [
                        {attKey: 'QuickViewPopupBackground', type: 'color', selector: '.wpmozo-product-quick-view'},
                        {attKey: 'QuickViewPopupDimensions', type: 'dimensions', selector: '.wpmozo-product-quick-view'},
                        {attKey: 'QuickViewCloseStyle', type: 'style', selector: '.mfp-close'},
                        {attKey: 'QuickViewCloseColor', type: 'color', selector: '.mfp-close'},
                        {attKey: 'QuickViewCloseBorder', type: 'border', selector: '.mfp-close'},
                        {attKey: 'QuickViewCloseDimensions', type: 'dimensions', selector: '.mfp-close'},
                        {attKey: 'QuickViewCloseSize', type: 'size', selector: '.mfp-close'},
                    ];

                    popup_styles.map(
                        function(item) { appendInlineStyle(item, body, atts); }
                    );

                    styles.map(
                        function(item) { appendInlineStyle(item, $this, atts); }
                    );
                }
            },
        });

	});

	function appendInlineStyle( item, wraper, atts ){

        let attKey = item.attKey,
            selector = item.selector,
            type = item.type,
            inlineStyle = convetInlineStyle( atts[attKey], type, atts );
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

	function convetInlineStyle( options, type, atts ){

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

        if ( 'navigation' === type || 'pagination' === type ) {
            if ( 'undefined' !== typeof options.FontSize && '' !== options.FontSize ) {
                style += 'font-size: '+options.FontSize+';';
            }
            if ( 'undefined' !== typeof options.Color && '' !== options.Color ) {
                style += 'color: '+options.Color+';';
            }
            if ( 'undefined' !== typeof options.FontAppearance && 'undefined' !== typeof options.FontAppearance.fontWeight && '' !== options.FontAppearance.fontWeight ) {
                style += 'font-weight: '+options.FontAppearance.fontWeight+';';
            }
        }

        if ( 'pagination' === type ) {
            if ( 'undefined' !== typeof options.background && '' !== options.background ) {
                style += 'background: '+options.background+';';
            }
            if ( 'undefined' !== typeof options.width && '' !== options.width && 'progressbar' !== atts.PaginationType ) {
                style += 'width: '+options.width+';';
            }
            if ( 'undefined' !== typeof options.height && '' !== options.height && 'progressbar' !== atts.PaginationType ) {
                style += 'height: '+options.height+';';
            }
        }

        if ( 'progressbar' === type || 'size' === type ) {
            if ( 'undefined' !== typeof options.width && '' !== options.width ) {
                style += 'width: '+options.width+';';
            }
            if ( 'undefined' !== typeof options.height && '' !== options.height ) {
                style += 'height: '+options.height+';';
            }
        }

        if ( 'border' === type ) {
            if ( 'undefined' !== typeof options.border.width && '' !== options.border.width ) {
                let str = options.border.width;

                if ( 'undefined' !== typeof options.border.style && '' !== options.border.style ) {
                    str += ' '+options.border.style;
                }else{
                    str += ' solid';
                }

                if ( 'undefined' !== typeof options.border.color && '' !== options.border.color ) {
                    str += ' '+options.border.color;
                }
                style += 'border: '+str+';';
            }

            if ( 'undefined' !== typeof options.border.top && '' !== options.border.top ) {
                for (const border in options.border) {
                    for (const borderItem in options.border[border]) {
                        style += 'border-'+border+'-'+borderItem+': '+options.border[border][borderItem]+';';
                    }
                }
            }

            if ( 'undefined' !== typeof options.borderRadius && '' !== options.borderRadius ) {
                if ( 'undefined' !== typeof options.borderRadius.topLeft && '' !== options.borderRadius.topLeft ) {
                    style += 'border-top-left-radius: '+options.borderRadius.topLeft+';';
                }
                if ( 'undefined' !== typeof options.borderRadius.topRight && '' !== options.borderRadius.topRight ) {
                    style += 'border-top-right-radius: '+options.borderRadius.topRight+';';
                }
                if ( 'undefined' !== typeof options.borderRadius.bottomLeft && '' !== options.borderRadius.bottomLeft ) {
                    style += 'border-bottom-left-radius: '+options.borderRadius.bottomLeft+';';
                }
                if ( 'undefined' !== typeof options.borderRadius.bottomRight && '' !== options.borderRadius.bottomRight ) {
                    style += 'border-bottom-right-radius: '+options.borderRadius.bottomRight+';';
                }

                if ( 'undefined' == typeof options.borderRadius.topLeft ) {
                    style += 'border-radius: '+options.borderRadius+';';
                }
            }
        }

        if ( 'dimensions' === type ) {

            if ( 'undefined' !== typeof options.padding && '' !== options.padding && ( 
                'undefined' !== typeof options.padding.top || 
                'undefined' !== typeof options.padding.right || 
                'undefined' !== typeof options.padding.bottom || 
                'undefined' !== typeof options.padding.left ) ) {
                let spacing = convetVarStyle(options.padding);
                style += 'padding: '+spacing.top+' '+spacing.right+' '+spacing.bottom+' '+spacing.left+';';
            }

            if ( 'undefined' !== typeof options.margin && '' !== options.margin && ( 
                'undefined' !== typeof options.margin.top || 
                'undefined' !== typeof options.margin.right || 
                'undefined' !== typeof options.margin.bottom || 
                'undefined' !== typeof options.margin.left ) ) {
                let spacing = convetVarStyle(options.margin);
                style += 'margin: '+spacing.top+' '+spacing.right+' '+spacing.bottom+' '+spacing.left+';';
            }

            if ( 'undefined' !== typeof options.position && '' !== options.position && ( 
                'undefined' !== typeof options.position.top || 
                'undefined' !== typeof options.position.right || 
                'undefined' !== typeof options.position.bottom || 
                'undefined' !== typeof options.position.left ) ) {
                let spacing = convetVarStyle(options.position);
                for (const position in options.position) {
                    style += position+': '+spacing[position]+';';
                }
            }

        }

        return style;

    }

} )(jQuery);