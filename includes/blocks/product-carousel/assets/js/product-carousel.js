(function($) {

	"use strict";

	var ProductTypes = wpmozo_carousel_object.products_types;

	var swiper = [];

	$('.wpmozo-product-carousel-wrap').each(function(){

		var $this = $(this),
		 	atts = $(this).data('atts'),
            StyleAtts = atts.StyleAtts;

        let options = StyleAtts.CarouContStyle;
        let style = '';
        if ( 'undefined' !== typeof options.padding && '' !== options.padding && ( 
            'undefined' !== typeof options.padding.top || 
            'undefined' !== typeof options.padding.right || 
            'undefined' !== typeof options.padding.bottom || 
            'undefined' !== typeof options.padding.left ) ) {
            let spacing = convetVarStyle(options.padding);
            style += 'padding: '+spacing.top+' '+spacing.right+' '+spacing.bottom+' '+spacing.left+' !important;';
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

                     let main = Object.assign({}, StyleAtts.CarouNavigation, StyleAtts.CarouNavigationLeft, StyleAtts.CarouNavigationRight),
                        left = Object.assign({}, StyleAtts.CarouNavigation, StyleAtts.CarouNavigationLeft),
                        right = Object.assign({}, StyleAtts.CarouNavigation, StyleAtts.CarouNavigationRight);

                    let wraper = jQuery($this);
                    let styles = [
                        {attKey: 'TitleStyle', selector: '.woocommerce-loop-product__title'},
                        {attKey: 'PriceStyle', selector: '.price'},
                        {attKey: 'AddToCartStyle', selector: add_to_cart_selector},
                        {attKey: 'QuickViewStyle', selector: '.wpmozo-quick-view-button'},
                        {attKey: 'SaleLabelStyle', selector: '.onsale'},
                        {attKey: 'StockLabelStyle', selector: '.stock.out-of-stock'},
                        {attKey: 'CarouNavigation', selector: '.swiper-navigation', values: main},
                        {attKey: 'CarouNavigationLeft', selector: '.swiper-button-prev', values: left},
                        {attKey: 'CarouNavigationRight', selector: '.swiper-button-next', values: right},
                    ];

                    styles.map(
                        function(item) { appendInlineStyle(item, wraper, false, StyleAtts); }
                    );

                },
                afterInit: function(swiper){

                    let wraper = jQuery($this),
                        PaginationSelector = ( 'fraction' === atts.PaginationType ) ? '.swiper-pagination' : '.swiper-pagination span';

                    let styles = [
                        {attKey: 'CarouPagination', selector: PaginationSelector},
                    ];

                    if ( 'progressbar' === atts.PaginationType ) {
                        let barAtts = { background: StyleAtts.CarouPagination.background},
                            progAtts = {
                                width: StyleAtts.CarouPagination.width,
                                height: StyleAtts.CarouPagination.height,
                            };
                        styles = [
                            {selector: PaginationSelector, values: barAtts},
                            {selector: '.swiper-pagination', values: progAtts},
                        ];
                    }

                    styles.map(
                        function(item) { appendInlineStyle(item, wraper, false, StyleAtts); }
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
        var main = $(this).closest('.wpmozo-product-carousel-wrap'),
            atts = main.data('atts'),
            wraper = 'body .mfp-content',
            StyleAtts = atts.StyleAtts,
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
                    if ( StyleAtts.QuickViewPopupStyle.SameAsCarousel ) {
                        styles = [
                            {attKey: 'TitleStyle', selector: '.product_title'},
                            {attKey: 'PriceStyle', selector: '.price'},
                            {attKey: 'AddToCartStyle', selector: add_to_cart_selector},
                            {attKey: 'SaleLabelStyle', selector: '.onsale'},
                            {attKey: 'StockLabelStyle', selector: '.stock.out-of-stock'},
                        ];
                    }else{
                        styles = [
                            {attKey: 'QuickViewTitleStyle', selector: '.product_title'},
                            {attKey: 'QuickViewPriceStyle', selector: '.price'},
                            {attKey: 'QuickViewAddToCartStyle', selector: add_to_cart_selector},
                            {attKey: 'QuickViewSaleLabelStyle', selector: '.onsale'},
                            {attKey: 'QuickViewStockLabelStyle', selector: '.stock.out-of-stock'},
                        ];
                    }

                    var popup_styles = [
                        {attKey: 'QuickViewPopupStyle', selector: '.wpmozo-product-quick-view'},
                        {attKey: 'QuickViewCloseStyle', selector: '.mfp-close'},
                    ];

                    popup_styles.map(function(item) {
                        appendInlineStyle(item, wraper, false, StyleAtts); 
                    });

                    styles.map(
                        function(item) { appendInlineStyle(item, wraper, false, StyleAtts); }
                    );
                }
            },
        });

	});

	 function appendInlineStyle( item, wraper, values = false, atts = false ){

        let attKey = ( values === false ) ? item.attKey : '',
            selector = item.selector,
            _values = ( values === false ) ? atts[attKey] : values,
            __values = ( item.hasOwnProperty('values') ) ? item.values : _values,
            inlineStyle = convetInlineStyle( __values, atts );
        
        jQuery(wraper).find(selector).attr('style', inlineStyle);

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

	function convetInlineStyle( options, atts ){

        let style = '';

        if ( 'undefined' !== typeof options.FontSize && '' !== options.FontSize ) {
            style += 'font-size: '+options.FontSize+' !important;';
        }
        if ( 'undefined' !== typeof options.FontAppearance ) {
            if ( 'undefined' !== typeof options.FontAppearance.fontStyle && '' !== options.FontAppearance.fontStyle ) {
                style += 'font-style: '+options.FontAppearance.fontStyle+' !important;';
            }
            if ( 'undefined' !== typeof options.FontAppearance.fontWeight && '' !== options.FontAppearance.fontWeight ) {
                style += 'font-weight: '+options.FontAppearance.fontWeight+' !important;';
            }
        }
        if ( 'undefined' !== typeof options.LetterSpacing && '' !== options.LetterSpacing ) {
            style += 'letter-spacing: '+options.LetterSpacing+' !important;';
        }
        if ( 'undefined' !== typeof options.Decoration && '' !== options.Decoration ) {
            style += 'text-decoration: '+options.Decoration+' !important;';
        }
        if ( 'undefined' !== typeof options.LetterCase && '' !== options.LetterCase ) {
            style += 'text-transform: '+options.LetterCase+' !important;';
        }
        if ( 'undefined' !== typeof options.LineHeight && '' !== options.LineHeight ) {
            style += 'line-height: '+options.LineHeight+' !important;';
        }
    

        if ( 'undefined' !== typeof options.text && '' !== options.text ) {
            style += 'color: '+options.text+' !important;';
        }
        if ( 'undefined' !== typeof options.background && '' !== options.background ) {
            style += 'background: '+options.background+' !important;';
        }

        if ( 'undefined' !== typeof options.width && '' !== options.width ) {
            style += 'width: '+options.width+' !important;';
        }
        if ( 'undefined' !== typeof options.height && '' !== options.height ) {
            style += 'height: '+options.height+' !important;';
        }


        if ( 'undefined' !== typeof options.border ) {
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
                style += 'border: '+str+' !important;';
            }

            if ( 'undefined' !== typeof options.border.top && '' !== options.border.top ) {
                for (const border in options.border) {
                    for (const borderItem in options.border[border]) {
                        style += 'border-'+border+'-'+borderItem+': '+options.border[border][borderItem]+' !important;';
                    }
                }
            }
        }


        if ( 'undefined' !== typeof options.borderRadius && '' !== options.borderRadius ) {
            if ( 'undefined' !== typeof options.borderRadius.topLeft && '' !== options.borderRadius.topLeft ) {
                style += 'border-top-left-radius: '+options.borderRadius.topLeft+' !important;';
            }
            if ( 'undefined' !== typeof options.borderRadius.topRight && '' !== options.borderRadius.topRight ) {
                style += 'border-top-right-radius: '+options.borderRadius.topRight+' !important;';
            }
            if ( 'undefined' !== typeof options.borderRadius.bottomLeft && '' !== options.borderRadius.bottomLeft ) {
                style += 'border-bottom-left-radius: '+options.borderRadius.bottomLeft+' !important;';
            }
            if ( 'undefined' !== typeof options.borderRadius.bottomRight && '' !== options.borderRadius.bottomRight ) {
                style += 'border-bottom-right-radius: '+options.borderRadius.bottomRight+' !important;';
            }

            if ( 'undefined' == typeof options.borderRadius.topLeft ) {
                style += 'border-radius: '+options.borderRadius+' !important;';
            }
        }


        if ( 'undefined' !== typeof options.padding && '' !== options.padding && ( 
            'undefined' !== typeof options.padding.top || 
            'undefined' !== typeof options.padding.right || 
            'undefined' !== typeof options.padding.bottom || 
            'undefined' !== typeof options.padding.left ) ) {
            let spacing = convetVarStyle(options.padding);
            style += 'padding: '+spacing.top+' '+spacing.right+' '+spacing.bottom+' '+spacing.left+' !important;';
        }
        if ( 'undefined' !== typeof options.margin && '' !== options.margin && ( 
            'undefined' !== typeof options.margin.top || 
            'undefined' !== typeof options.margin.right || 
            'undefined' !== typeof options.margin.bottom || 
            'undefined' !== typeof options.margin.left ) ) {
            let spacing = convetVarStyle(options.margin);
            style += 'margin: '+spacing.top+' '+spacing.right+' '+spacing.bottom+' '+spacing.left+' !important;';
        }
        if ( 'undefined' !== typeof options.position && '' !== options.position && ( 
            'undefined' !== typeof options.position.top || 
            'undefined' !== typeof options.position.right || 
            'undefined' !== typeof options.position.bottom || 
            'undefined' !== typeof options.position.left ) ) {
            let spacing = convetVarStyle(options.position);
            for (const position in options.position) {
                style += position+': '+spacing[position]+' !important;';
            }
            if ( 'undefined' !== typeof spacing['top'] && '' !== spacing.top && 'undefined' === typeof spacing['bottom'] ) {
                style += 'bottom: auto !important;';
            }
            if ( 'undefined' !== typeof spacing['bottom'] && '' !== spacing.bottom && 'undefined' === typeof spacing['top'] ) {
                style += 'top: auto !important;';
            }
            if ( 'undefined' !== typeof spacing['right'] && '' !== spacing.right && 'undefined' === typeof spacing['left'] ) {
                style += 'left: auto !important;';
            }
            if ( 'undefined' !== typeof spacing['left'] && '' !== spacing.left && 'undefined' === typeof spacing['right'] ) {
                style += 'right: auto !important;';
            }
            style += 'position: absolute !important;';
        }

        return style;

    }

} )(jQuery);