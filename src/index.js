
import WpmozoTypography from '../src/components/wpmozo-typography/wpmozo-typography';
import WpmozoLoader from '../src/components/wpmozo-loader/wpmozo-loader';
import WpmozoIconpicker from '../src/components/wpmozo-iconpicker/wpmozo-iconpicker';
import WpmozoColorPicker from '../src/components/wpmozo-colorpicker/wpmozo-colorpicker';
import WpmozoDimensions from '../src/components/wpmozo-dimensions/wpmozo-dimensions';
import WpmozoSize from '../src/components/wpmozo-size/wpmozo-size';
import WpmozoBorder from '../src/components/wpmozo-border/wpmozo-border';

( function(blocks, editor, element, components) {

    const __ = wp.i18n.__;
    const el = element.createElement;
    const registerBlockType = blocks.registerBlockType;
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = editor;
    const { PanelBody, RangeControl, SelectControl, TextControl, FormTokenField, ToggleControl, Button  } = components;
    const { Fragment, useState, useEffect } = element;
    const { useSelect, useDispatch, dispatch } = wp.data;
    const { serverSideRender: ServerSideRender, hooks } = wp;

    let textColorObject =  [
        {
            key: 'text',
            label: __( 'Text', 'wpmozo-product-carousel-for-woocommerce' ),
        },
    ];
    let twoColorObject =  [
        {
            key: 'text',
            label: __( 'Text', 'wpmozo-product-carousel-for-woocommerce' ),
        },
        {
            key: 'background',
            label: __( 'Background', 'wpmozo-product-carousel-for-woocommerce' ),
        },
    ];
    let backgroundColorObject =  [
        {
            key: 'background',
            label: __( 'Background', 'wpmozo-product-carousel-for-woocommerce' ),
        },
    ];

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
            style += 'position: absolute !important;';
        }

        return style;

    }

    function appendInlineStyle( item, wraper, values = false, atts = false ){

        let attKey = ( values === false ) ? item.attKey : '',
            selector = item.selector,
            _values = ( values === false ) ? atts[attKey] : values,
            __values = ( item.hasOwnProperty('values') ) ? item.values : _values,
            inlineStyle = convetInlineStyle( __values, atts );
        
        jQuery(wraper).find(selector).attr('style', inlineStyle);

    }

    function convetVarStyle( options ){

        let spacing = Object.assign({}, options);

        for (const type in spacing) {
            let value = spacing[type];
            if ( 'undefined' !== typeof value && '' !== value && value.startsWith("var:") ) {
                let str = value.replace('var:', 'var(--wp--').replace(/\|/g, '--') + ')';
                spacing[type] = str;
            }
        }

        return spacing;

    }

    var GetOrderByOptions           = wpmozo_block_carousel_object.order_by_options,
        GetAttributes               = wpmozo_block_carousel_object.attributes,
        GetProductViewTypeOptions   = wpmozo_block_carousel_object.product_view_type_options,
        AllSizes                    = wpmozo_block_carousel_object.all_sizes,
        AllBadgeTypes               = wpmozo_block_carousel_object.all_badge_types,
        AllLayouts                  = wpmozo_block_carousel_object.all_layouts,
        ProductTypes                = wpmozo_block_carousel_object.products_types;

    const initializeSwiper = ( attributes ) => {

        let StyleAtts = attributes.StyleAtts,
            clientId = attributes.clientId,
            selector = 'wpmozo_'+clientId,
            mobileSett = attributes.Responsive.mobile,
            tabletSett = attributes.Responsive.tablet;

        let _dimensions = StyleAtts.CarouContStyle,
            inlineStyle = convetInlineStyle( _dimensions );
        if ( '' !== inlineStyle ) {
            jQuery('#'+selector).css('padding', '');
            var defaultStyle = jQuery('#'+selector).attr('style');
            if ( '' !== defaultStyle && 'undefined' !== typeof defaultStyle ) {
                inlineStyle += defaultStyle;
            }
            jQuery('#'+selector).attr('style', inlineStyle);
        }

        var sw_obj = {
            loop: attributes.Loop,
            swipeHandler: 'li.product',
            on: {
                tap: function(swiper, event){
                    dispatch( 'core/block-editor' ).selectBlock( clientId );
                },
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

                    let wraper = jQuery('#'+selector);
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

                    let wraper = jQuery('#'+selector),
                        PaginationSelector = ( 'fraction' === attributes.PaginationType ) ? '.swiper-pagination' : '.swiper-pagination span';

                    let styles = [
                        {attKey: 'CarouPagination', selector: PaginationSelector},
                    ];

                    if ( 'progressbar' === attributes.PaginationType ) {
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
                  slidesPerView: attributes.Columns,
                  spaceBetween: attributes.SpaceBetween,
                  slidesPerGroup: attributes.SlidesToScroll,
                },
            },
        }

        if ( attributes.AutoPlay ) {
            sw_obj.autoplay = {
               delay: attributes.Delay,
            };
        }

        if ( attributes.ShowNavigation ) {
            sw_obj.navigation = {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            };
        }

        if ( attributes.ShowPagination ) {
            sw_obj.pagination = {
                el: '.swiper-pagination',
                type: attributes.PaginationType,
            };
        }

        let _swiper = new Swiper('#'+selector, sw_obj);

    };

    hooks.addAction( 'server-side-loading-finished', 'function_name', initializeSwiper );

    const TriggerWhenLoadingFinished = (args) => {

        let attributes = args.attributes;
        useEffect(() => {
            return () => {
                hooks.doAction("server-side-loading-finished", attributes);
            };
        });

        return el( Fragment, {}, 
            el("div", {
                class: "wpmozo-loader backend",
                style: {
                    "display": "grid",
                    "grid-auto-flow": "column",
                },
                children: [
                    el(WpmozoLoader, {
                        attributes: attributes,
                        clientId: attributes.clientId,
                        column: attributes.Columns,
                        margin: attributes.SpaceBetween,
                    }),
                ], 
            }),
        );
   
    }



    registerBlockType( 'wpmozo/product-carousel', {
        title: __( 'WPMozo Product Carousel', 'wpmozo-product-carousel-for-woocommerce' ),
        icon: 'products',
        apiVersion: 3,
        category: 'wpmozo',
        keywords: [ 'wpmozo', 'woocommerce-product-carousel', 'woocommerce', 'carousel' ],
        attributes: GetAttributes,
        supports: {
            html: false,
        },
        edit: (function( props ) {  

            let attributes = props.attributes;
            attributes.clientId = props.clientId;

            let clientId = attributes.clientId,
                product_cats = wp.data.select('core').getEntityRecords( 'taxonomy', 'product_cat' ),
                product_cat_options = [],
                product_tags = wp.data.select('core').getEntityRecords( 'taxonomy', 'product_tag' ),
                product_tag_options = [],
                selector = 'wpmozo_'+clientId,
                wraper = '#'+selector,
                blockProps = useBlockProps(),
                styleAtts = attributes.StyleAtts;

            const { setAttributes } = props; 

            if( product_cats ) {
                product_cat_options = product_cats.map( value => value.name );
            }
            if( product_tags ) {
                product_tag_options = product_tags.map( value => value.name );
            }

            let add_to_cart_selector = '.add_to_cart_button';
            if ( ProductTypes.length ) {
                jQuery.each(ProductTypes, function(key, type){
                    add_to_cart_selector += ', .button.product_type_'+type;
                });
            }

            const afterOnChangeNavigation = function( props ){
                let StyleAtts = props.attributes.StyleAtts,
                    main = Object.assign({}, StyleAtts.CarouNavigation, StyleAtts.CarouNavigationLeft, StyleAtts.CarouNavigationRight),
                    left = Object.assign({}, StyleAtts.CarouNavigation, StyleAtts.CarouNavigationLeft),
                    right = Object.assign({}, StyleAtts.CarouNavigation, StyleAtts.CarouNavigationRight);
                appendInlineStyle(
                    {
                        selector: '.swiper-navigation'
                    },
                    wraper, main);
                appendInlineStyle(
                    {
                        selector: '.swiper-button-prev'
                    },
                    wraper, left);
                appendInlineStyle(
                    {
                        selector: '.swiper-button-next'
                    },
                    wraper, right);
            };

            const afterOnChange = function( selector, Atts ){
                appendInlineStyle(
                    {
                        selector: selector
                    },
                    wraper, Atts);
            };

            return [
                el(
                    'div',
                    blockProps,
                    el(
                        ServerSideRender,
                        {
                            block: 'wpmozo/product-carousel',
                            attributes: attributes,
                            LoadingResponsePlaceholder: TriggerWhenLoadingFinished,
                            httpMethod: 'POST',
                        },
                    ),
                ),
                el( InspectorControls, {},
                    el( PanelBody, { title: __( 'Carousel Settings', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: true },
                        el(
                            RangeControl,
                            {
                                key: 'wpmozp-product-carousel-columns',
                                value: attributes.Columns,
                                allowReset: false,
                                initialPosition: 4,
                                max: 8,
                                min: 1,
                                label: __( 'Columns', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewColumns ) {
                                    setAttributes( { Columns: NewColumns } );
                                },
                            }
                        ),
                        el(
                            RangeControl,
                            {
                                key: 'wpmozp-product-carousel-slidestoscroll',
                                value: attributes.SlidesToScroll,
                                allowReset: false,
                                initialPosition: 4,
                                max: 8,
                                min: 1,
                                label: __( 'Slides To Scroll', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewSlidesToScroll ) {
                                    setAttributes( { SlidesToScroll: NewSlidesToScroll } );
                                },
                            }
                        ),
                        el(
                            RangeControl,
                            {
                                key: 'wpmozp-product-carousel-space-between',
                                value: attributes.SpaceBetween,
                                allowReset: false,
                                initialPosition: 10,
                                label: __( 'Space Between', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewSpaceBetween ) {
                                    setAttributes( { SpaceBetween: NewSpaceBetween } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.AutoPlay, 
                                label: __( 'Auto Play', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewAutoPlay ) {
                                    setAttributes( { AutoPlay: NewAutoPlay } );
                                },
                            }
                        ),
                        attributes.AutoPlay &&
                            el(
                                TextControl,
                                {
                                    key: 'wpmozp-product-carousel-delay',
                                    value: attributes.Delay,
                                    label: __( 'Delay of Animation', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewDelay ) {
                                        setAttributes( { Delay: NewDelay } );
                                    },
                                }
                            ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.Loop, 
                                label: __( 'Loop', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewLoop ) {
                                    setAttributes( { Loop: NewLoop } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowNavigation, 
                                label: __( 'Show Navigation', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowNavigation ) {
                                    setAttributes( { ShowNavigation: NewShowNavigation } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowPagination, 
                                label: __( 'Show Pagination', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowPagination ) {
                                    setAttributes( { ShowPagination: NewShowPagination } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.EqualSlideHeight, 
                                label: __( 'Equalize Slide Height', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewEqualSlideHeight ) {
                                    setAttributes( { EqualSlideHeight: NewEqualSlideHeight } );
                                },
                            }
                        ),
                        attributes.ShowPagination &&
                            el(
                                SelectControl,
                                {
                                    key: 'wpmozp-product-carousel-paginationtype',
                                    label: __('Pagination Type', 'wpmozo-product-carousel-for-woocommerce'),
                                    value: attributes.PaginationType,
                                    options: [
                                        {
                                            label: __('Bullets', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'bullets'
                                        }, 
                                        {
                                            label: __('Fraction', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'fraction'
                                        },
                                        {
                                            label: __('Progressbar', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'progressbar'
                                        }
                                    ],
                                    onChange: function( NewPaginationType ) {
                                        styleAtts.CarouPagination.width = '';
                                        styleAtts.CarouPagination.height = '';
                                        if ( 'fraction' === NewPaginationType ) {
                                            styleAtts.CarouPagination.background = '';
                                        }else{
                                            styleAtts.CarouPagination.FontSize = '';
                                            styleAtts.CarouPagination.Color = '';
                                        }
                                        setAttributes( { PaginationType: NewPaginationType } );
                                    },
                                },
                            ),
                    ),
                    el( PanelBody, { title: __( 'Carousel Responsive Settings', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: false },
                        el( PanelBody, { title: __( 'Mobile', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: false },
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozp-product-carousel-columns',
                                    value: attributes.Responsive.mobile.Columns,
                                    allowReset: false,
                                    initialPosition: attributes.Responsive.mobile.Columns,
                                    max: 8,
                                    min: 1,
                                    label: __( 'Columns', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewColumns ) {
                                        let _Responsive = Object.assign({}, attributes.Responsive);
                                        _Responsive.mobile.Columns = NewColumns;
                                        setAttributes( { Responsive: _Responsive } );
                                    },
                                }
                            ),
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozp-product-carousel-slidestoscroll',
                                    value: attributes.Responsive.mobile.SlidesToScroll,
                                    allowReset: false,
                                    initialPosition: attributes.Responsive.mobile.SlidesToScroll,
                                    max: 8,
                                    min: 1,
                                    label: __( 'Slides To Scroll', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSlidesToScroll ) {
                                        let _Responsive = Object.assign({}, attributes.Responsive);
                                        _Responsive.mobile.SlidesToScroll = NewSlidesToScroll;
                                        setAttributes( { Responsive: _Responsive } );
                                    },
                                }
                            ),
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozp-product-carousel-space-between',
                                    value: attributes.Responsive.mobile.SpaceBetween,
                                    allowReset: false,
                                    initialPosition: attributes.Responsive.mobile.SpaceBetween,
                                    label: __( 'Space Between', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSpaceBetween ) {
                                        let _Responsive = Object.assign({}, attributes.Responsive);
                                        _Responsive.mobile.SpaceBetween = NewSpaceBetween;
                                        setAttributes( { Responsive: _Responsive } );
                                    },
                                }
                            ),
                        ),
                        el( PanelBody, { title: __( 'Tablet', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: false },
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozp-product-carousel-columns',
                                    value: attributes.Responsive.tablet.Columns,
                                    allowReset: false,
                                    initialPosition: attributes.Responsive.tablet.Columns,
                                    max: 8,
                                    min: 1,
                                    label: __( 'Columns', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewColumns ) {
                                        let _Responsive = Object.assign({}, attributes.Responsive);
                                        _Responsive.tablet.Columns = NewColumns;
                                        setAttributes( { Responsive: _Responsive } );
                                    },
                                }
                            ),
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozp-product-carousel-slidestoscroll',
                                    value: attributes.Responsive.tablet.SlidesToScroll,
                                    allowReset: false,
                                    initialPosition: attributes.Responsive.tablet.SlidesToScroll,
                                    max: 8,
                                    min: 1,
                                    label: __( 'Slides To Scroll', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSlidesToScroll ) {
                                        let _Responsive = Object.assign({}, attributes.Responsive);
                                        _Responsive.tablet.SlidesToScroll = NewSlidesToScroll;
                                        setAttributes( { Responsive: _Responsive } );
                                    },
                                }
                            ),
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozp-product-carousel-space-between',
                                    value: attributes.Responsive.tablet.SpaceBetween,
                                    allowReset: false,
                                    initialPosition: attributes.Responsive.tablet.SpaceBetween,
                                    label: __( 'Space Between', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSpaceBetween ) {
                                        let _Responsive = Object.assign({}, attributes.Responsive);
                                        _Responsive.tablet.SpaceBetween = NewSpaceBetween;
                                        setAttributes( { Responsive: _Responsive } );
                                    },
                                }
                            ),
                        ),
                    ),
                    el( PanelBody, { title: __( 'Query Settings', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: false },
                        el(
                            SelectControl,
                            {
                                key: 'wpmozp-product-carousel-viewtype',
                                label: __(' Product View Type', 'wpmozo-product-carousel-for-woocommerce'),
                                value: attributes.ProductViewType,
                                options: GetProductViewTypeOptions,
                                onChange: function( NewProductViewType ) {
                                    setAttributes( { ProductViewType: NewProductViewType } );
                                },
                            },
                        ),
                        el(
                            TextControl,
                            {
                                key: 'wpmozp-product-carousel-products',
                                value: attributes.NumberOfProducts,
                                label: __( 'Number of Porducts', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewNumberOfProducts ) {
                                    setAttributes( { NumberOfProducts: NewNumberOfProducts } );
                                },
                            }
                        ),
                       'best_selling' !== attributes.ProductViewType && 'top_rated' !== attributes.ProductViewType &&
                            el(
                                SelectControl,
                                {
                                    key: 'wpmozp-product-carousel-orderby',
                                    label: __('Order By', 'wpmozo-product-carousel-for-woocommerce'),
                                    value: attributes.OrderBy,
                                    options: GetOrderByOptions,
                                    onChange: function( NewOrderBy ) {
                                        setAttributes( { OrderBy: NewOrderBy } );
                                    },
                                },
                            ),
                        'best_selling' !== attributes.ProductViewType && 'top_rated' !== attributes.ProductViewType &&
                            el(
                                SelectControl,
                                {
                                    key: 'wpmozp-product-carousel-order',
                                    label: __('Order', 'wpmozo-product-carousel-for-woocommerce'),
                                    value: attributes.Order,
                                    options: [
                                        {
                                            label: __('Ascending', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'ASC'
                                        }, 
                                        {
                                            label: __('Descending', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'DESC'
                                        }
                                    ],
                                    onChange: function( NewOrder ) {
                                        setAttributes( { Order: NewOrder } );
                                    },
                                },
                            ),
                        el(
                            FormTokenField,
                            {
                                value: attributes.IncludeCategories,
                                suggestions: product_cat_options,
                                label: __( 'Include Categories', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewCats ) {
                                    setAttributes( { IncludeCategories: NewCats } );
                                },
                            }
                        ),
                        el(
                            FormTokenField,
                            {
                                value: attributes.IncludeTags,
                                suggestions: product_tag_options,
                                label: __( 'Include Tags', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewTags ) {
                                    setAttributes( { IncludeTags: NewTags } );
                                },
                            }
                        ),
                        el(
                            SelectControl,
                            {
                                key: 'wpmozp-product-carousel-tax-relation',
                                label: __('Taxonomies Relation', 'wpmozo-product-carousel-for-woocommerce'),
                                value: attributes.TaxonomiesRelation,
                                options: [
                                    {
                                        label: __('OR', 'wpmozo-product-carousel-for-woocommerce'),
                                        value: 'OR'
                                    }, 
                                    {
                                        label: __('AND', 'wpmozo-product-carousel-for-woocommerce'),
                                        value: 'AND'
                                    }
                                ],
                                onChange: function( NewTaxonomiesRelation ) {
                                    setAttributes( { TaxonomiesRelation: NewTaxonomiesRelation } );
                                },
                            },
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.OutOfStock, 
                                label: __( 'Hide Out of Stock Products', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewOutOfStock ) {
                                    setAttributes( { OutOfStock: NewOutOfStock } );
                                },
                            }
                        ),
                    ),
                    el( PanelBody, { title: __( 'Display Settings', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: false },
                        el(
                            SelectControl,
                            {
                                key: 'wpmozp-product-carousel-layout',
                                label: __('Layout', 'wpmozo-product-carousel-for-woocommerce'),
                                value: attributes.Layout,
                                options: AllLayouts,
                                onChange: function( NewLayout ) {
                                    setAttributes( { Layout: NewLayout } );
                                },
                            },
                        ),
                        ! attributes.OutOfStock &&
                            el(
                                ToggleControl,
                                {
                                    checked: attributes.DisplayOutOfStockLabel, 
                                    label: __( 'Display Out of Stock Label', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewDisplayOutOfStockLabel ) {
                                        setAttributes( { DisplayOutOfStockLabel: NewDisplayOutOfStockLabel } );
                                    },
                                }
                            ),
                        ! attributes.OutOfStock && attributes.DisplayOutOfStockLabel &&
                            el(
                                TextControl,
                                {
                                    key: 'wpmozp-product-outofstock-label',
                                    value: attributes.OutOfStockLabel,
                                    label: __( 'Out Of Stock Label', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewOutOfStockLabel ) {
                                        setAttributes( { OutOfStockLabel: NewOutOfStockLabel } );
                                    },
                                }
                            ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.EnableQuickViewLink, 
                                label: __( 'Enable Quick View Link', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewEnableQuickViewLink ) {
                                    setAttributes( { EnableQuickViewLink: NewEnableQuickViewLink } );
                                },
                            }
                        ),
                        attributes.EnableQuickViewLink &&
                            el(
                                TextControl,
                                {
                                    key: 'wpmozp-product-carousel-quickviewlinktext',
                                    value: attributes.QuickViewLinkText,
                                    label: __( 'Quickview link text', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewQuickViewLinkText ) {
                                        setAttributes( { QuickViewLinkText: NewQuickViewLinkText } );
                                    },
                                }
                            ),
                        attributes.EnableQuickViewLink && attributes.EnableQuickViewLink &&
                            el(
                                ToggleControl,
                                {
                                    checked: attributes.QuickViewLinkIconEnabled, 
                                    label: __( 'Quickview Display icon', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewQuickViewLinkIconEnabled ) {
                                        setAttributes( { QuickViewLinkIconEnabled: NewQuickViewLinkIconEnabled } );
                                    },
                                }
                            ),
                        attributes.EnableQuickViewLink && attributes.QuickViewLinkIconEnabled && ! attributes.QuickViewLinkCustomIcon &&
                            el( WpmozoIconpicker, { 
                                label: __('Quickview Icon', 'wpmozo-product-carousel-for-woocommerce'),
                                props: props,
                                attributes: attributes
                            } ),
                        attributes.EnableQuickViewLink && attributes.QuickViewLinkIconEnabled &&
                            el(
                                ToggleControl,
                                {
                                    checked: attributes.QuickViewLinkCustomIcon, 
                                    label: __( 'Quickview custom icon', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewQuickViewLinkCustomIcon ) {
                                        setAttributes( { QuickViewLinkCustomIcon: NewQuickViewLinkCustomIcon } );
                                    },
                                }
                            ),
                        attributes.EnableQuickViewLink && attributes.QuickViewLinkIconEnabled && attributes.QuickViewLinkCustomIcon &&
                            el(MediaUploadCheck, {}, 
                                el(MediaUpload, {
                                    onSelect: (media) => setAttributes( { QuickViewLinkImg: media.url } ),
                                    allowedTypes: ["image"],
                                    accept: "image/*",
                                    value: attributes.QuickViewLinkImg,
                                    render: ({ open }) => {
                                        return el(Fragment, {},
                                            el('div', {
                                                class: "components-base-control wpmozo-quvili-icon-wrap",
                                                children: [
                                                    attributes.QuickViewLinkImg &&
                                                    el('img',
                                                      {
                                                        class: "wpmozo-quvili-icon",
                                                        src: attributes.QuickViewLinkImg,
                                                      },
                                                    ),
                                                    el(Button, {
                                                      isPrimary: true,
                                                      onClick: (event) => {
                                                        event.stopPropagation();
                                                        open();
                                                      },
                                                      children:
                                                        attributes.QuickViewLinkImg
                                                          ? __("Edit Icon", "wpmozo-product-carousel-for-woocommerce")
                                                          : __("Select Icon", "wpmozo-product-carousel-for-woocommerce")
                                                    })
                                                ],
                                            })
                                        );
                                    }
                                })
                            ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowFeaturedImage, 
                                label: __( 'Show Featured Image', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowFeaturedImage ) {
                                    setAttributes( { ShowFeaturedImage: NewShowFeaturedImage } );
                                },
                            }
                        ),
                        attributes.ShowFeaturedImage &&
                            el(
                                SelectControl,
                                {
                                    key: 'wpmozp-product-carousel-featimasize',
                                    label: __('Featured Image Size', 'wpmozo-product-carousel-for-woocommerce'),
                                    value: attributes.FeaturedImageSize,
                                    options: AllSizes,
                                    onChange: function( NewFeaturedImageSize ) {
                                        setAttributes( { FeaturedImageSize: NewFeaturedImageSize } );
                                    },
                                },
                            ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowRating, 
                                label: __( 'Show Rating', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowRating ) {
                                    setAttributes( { ShowRating: NewShowRating } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowPrice, 
                                label: __( 'Show Price', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowPrice ) {
                                    setAttributes( { ShowPrice: NewShowPrice } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowAddToCartButton, 
                                label: __( 'Show Add to Cart button', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowAddToCartButton ) {
                                    setAttributes( { ShowAddToCartButton: NewShowAddToCartButton } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowSaleBadge, 
                                label: __( 'Show Sale Badge', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowSaleBadge ) {
                                    setAttributes( { ShowSaleBadge: NewShowSaleBadge } );
                                },
                            }
                        ),
                        attributes.ShowSaleBadge &&
                            el(
                                SelectControl,
                                {
                                    key: 'wpmozp-product-carousel-salebadgetype',
                                    label: __('Sale Badge Type', 'wpmozo-product-carousel-for-woocommerce'),
                                    value: attributes.SaleBadgeType,
                                    options: AllBadgeTypes,
                                    onChange: function( NewSaleBadgeType ) {
                                        setAttributes( { SaleBadgeType: NewSaleBadgeType } );
                                    },
                                },
                            ),
                        attributes.ShowSaleBadge && 'sale_label' === attributes.SaleBadgeType &&
                            el(
                                TextControl,
                                {
                                    key: 'wpmozp-product-salebadge-label',
                                    value: attributes.SaleLabelText,
                                    label: __( 'Sale Label Text', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSaleLabelText ) {
                                        setAttributes( { SaleLabelText: NewSaleLabelText } );
                                    },
                                }
                            ),
                    ),
                ),
                el( InspectorControls , { group: 'styles' },
                    el( PanelBody, 
                        { 
                            title: __( 'Carousel Container Style', 'wpmozo-product-carousel-for-woocommerce' ),
                            className: "wpmozo-typography-panel",
                            initialOpen: false,
                        },
                        el( WpmozoDimensions, {
                            DimensionKey: 'CarouContStyle',
                            DimensionsTypes: {
                                padding: true,
                            },
                            props: props,
                            values: styleAtts.CarouContStyle,
                            afterOnChange: ( props ) => {

                                let _dimensions = props.attributes.StyleAtts.CarouContStyle,
                                    inlineStyle = convetInlineStyle( _dimensions );
                                if ( '' !== inlineStyle ) {
                                    jQuery(wraper).css('padding', '');
                                    var defaultStyle = jQuery(wraper).attr('style');
                                    if ( '' !== defaultStyle && 'undefined' !== typeof defaultStyle ) {
                                        inlineStyle += defaultStyle;
                                    }
                                    jQuery(wraper).attr('style', inlineStyle);
                                }

                            },
                        } ),  
                    ),
                    attributes.ShowNavigation &&
                        el( PanelBody, 
                            { 
                                title: __( 'Carousel Navigation Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'CarouNavigation',
                                values: styleAtts.CarouNavigation,
                                props: props,
                                ColorTypes: [
                                    {
                                        key: 'text',
                                        label: __( 'Icon Color', 'wpmozo-product-carousel-for-woocommerce' ),
                                    },
                                    {
                                        key: 'background',
                                        label: __( 'Background', 'wpmozo-product-carousel-for-woocommerce' ),
                                    },
                                ],
                                afterOnChange: ( props ) => afterOnChangeNavigation(props),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'CarouNavigation',
                                values: styleAtts.CarouNavigation,
                                props: props,
                                TypoTypes: {
                                    FontSize: true,
                                    FontAppearance: true,
                                },
                                FontAppearance: {
                                    hasFontStyles: false,
                                },
                                afterOnChange: ( props ) => afterOnChangeNavigation(props),
                            } ),
                            el( WpmozoDimensions, {
                                DimensionKey: 'CarouNavigation',
                                values: styleAtts.CarouNavigation,
                                DimensionsTypes: {
                                    padding: true,
                                    margin: true,
                                },
                                props: props,
                                afterOnChange: ( props ) => afterOnChangeNavigation(props),
                            } ),
                            el( WpmozoDimensions, {
                                label: __('Previous Position', 'wpmozo-product-carousel-for-woocommerce'),
                                DimensionKey: 'CarouNavigationLeft',
                                values: styleAtts.CarouNavigationLeft,
                                DimensionsTypes: {
                                    position: true,
                                },
                                props: props,
                                afterOnChange: ( props ) => afterOnChangeNavigation(props),
                            } ),
                            el( WpmozoDimensions, {
                                label: __('Next Position', 'wpmozo-product-carousel-for-woocommerce'),
                                DimensionKey: 'CarouNavigationRight',
                                values: styleAtts.CarouNavigationRight,
                                DimensionsTypes: {
                                    position: true,
                                },
                                props: props,
                                afterOnChange: ( props ) => afterOnChangeNavigation(props),
                            } ), 
                        ),
                    attributes.ShowPagination &&
                        el( PanelBody, 
                            { 
                                title: __( 'Carousel Pagination Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            'fraction' !== attributes.PaginationType && [
                                el( WpmozoColorPicker, {
                                    ColorKey: 'CarouPagination',
                                    values: styleAtts.CarouPagination,
                                    props: props,
                                    ColorTypes: [
                                        {
                                            key: 'background',
                                            label: __( 'Icon Color', 'wpmozo-product-carousel-for-woocommerce' ),
                                        },
                                    ],
                                    afterOnChange: ( props ) => {
                                        appendInlineStyle(
                                            {
                                                selector: '.swiper-pagination span'
                                            },
                                            wraper, props.attributes.StyleAtts.CarouPagination);
                                    },
                                }),
                                el( WpmozoSize, {
                                    SizeKey: 'CarouPagination',
                                    values: styleAtts.CarouPagination,
                                    props: props,
                                    afterOnChange: ( props ) => {
                                        let selector = 'progressbar' === attributes.PaginationType ? 
                                        '.swiper-pagination' : '.swiper-pagination span';
                                        appendInlineStyle(
                                            {
                                                selector: selector,
                                            },
                                            wraper, props.attributes.StyleAtts.CarouPagination);
                                    },
                                })
                            ],
                            'fraction' === attributes.PaginationType && [
                                el( WpmozoColorPicker, {
                                    ColorKey: 'CarouPagination',
                                    values: styleAtts.CarouPagination,
                                    props: props,
                                    ColorTypes: [
                                        {
                                            key: 'text',
                                            label: __( 'Icon Color', 'wpmozo-product-carousel-for-woocommerce' ),
                                        },
                                    ],
                                    afterOnChange: ( props ) => {
                                        appendInlineStyle(
                                            {
                                                selector: '.swiper-pagination'
                                            },
                                            wraper, props.attributes.StyleAtts.CarouPagination);
                                    },
                                }),
                                el( WpmozoTypography, {
                                    TypographyKey: 'CarouPagination',
                                    values: styleAtts.CarouPagination,
                                    props: props,
                                    TypoTypes: {
                                        FontSize: true,
                                    },
                                    afterOnChange: ( props ) => {
                                        appendInlineStyle(
                                            {
                                                selector: '.swiper-pagination'
                                            },
                                            wraper, props.attributes.StyleAtts.CarouPagination);
                                    },
                                } )
                            ],
                        ),
                    el( PanelBody, 
                        { 
                            title: __( 'Title Style', 'wpmozo-product-carousel-for-woocommerce' ),
                            className: "wpmozo-typography-panel",
                            initialOpen: false,
                        },
                        el( WpmozoColorPicker, {
                            ColorKey: 'TitleStyle',
                            values: styleAtts.TitleStyle,
                            props: props,
                            ColorTypes: textColorObject,
                            afterOnChange: ( props ) => afterOnChange('.woocommerce-loop-product__title', props.attributes.StyleAtts.TitleStyle),
                        }),
                        el( WpmozoTypography, {
                            TypographyKey: 'TitleStyle',
                            values: styleAtts.TitleStyle,
                            props: props,
                            afterOnChange: ( props ) => afterOnChange('.woocommerce-loop-product__title', props.attributes.StyleAtts.TitleStyle),
                        } ),
                    ),
                    attributes.ShowPrice &&
                        el( PanelBody, 
                            { 
                                title: __( 'Price Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'PriceStyle',
                                values: styleAtts.PriceStyle,
                                props: props,
                                ColorTypes: textColorObject,
                                afterOnChange: ( props ) => afterOnChange('.price', props.attributes.StyleAtts.PriceStyle),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'PriceStyle',
                                values: styleAtts.PriceStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.price', props.attributes.StyleAtts.PriceStyle),
                            } ),
                        ),
                    attributes.ShowAddToCartButton &&
                        el( PanelBody, 
                            { 
                                title: __( 'Add to Cart Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'AddToCartStyle',
                                values: styleAtts.AddToCartStyle,
                                props: props,
                                ColorTypes: twoColorObject,
                                afterOnChange: ( props ) => afterOnChange(add_to_cart_selector, props.attributes.StyleAtts.AddToCartStyle),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'AddToCartStyle',
                                values: styleAtts.AddToCartStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange(add_to_cart_selector, props.attributes.StyleAtts.AddToCartStyle),
                            }),
                            el( WpmozoDimensions, {
                                DimensionKey: 'AddToCartStyle',
                                DimensionsTypes: {
                                    padding: true,
                                },
                                values: styleAtts.AddToCartStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange(add_to_cart_selector, props.attributes.StyleAtts.AddToCartStyle),
                            } ),  
                            el( WpmozoBorder, {
                                BorderKey: 'AddToCartStyle',
                                values: styleAtts.AddToCartStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange(add_to_cart_selector, props.attributes.StyleAtts.AddToCartStyle),
                            }),
                        ),
                    attributes.EnableQuickViewLink &&
                        el( PanelBody, 
                            { 
                                title: __( 'Quick View Button Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'QuickViewStyle',
                                values: styleAtts.QuickViewStyle,
                                props: props,
                                ColorTypes: twoColorObject,
                                afterOnChange: ( props ) => afterOnChange('.wpmozo-quick-view-button', props.attributes.StyleAtts.QuickViewStyle),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'QuickViewStyle',
                                values: styleAtts.QuickViewStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.wpmozo-quick-view-button', props.attributes.StyleAtts.QuickViewStyle),
                            } ),
                            el( WpmozoDimensions, {
                                DimensionKey: 'QuickViewStyle',
                                DimensionsTypes: {
                                    padding: true,
                                },
                                values: styleAtts.QuickViewStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.wpmozo-quick-view-button', props.attributes.StyleAtts.QuickViewStyle),
                            } ),  
                            el( WpmozoBorder, {
                                BorderKey: 'QuickViewStyle',
                                values: styleAtts.QuickViewStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.wpmozo-quick-view-button', props.attributes.StyleAtts.QuickViewStyle),
                            }),
                        ),
                    attributes.EnableQuickViewLink &&
                        el( PanelBody, 
                            { 
                                title: __( 'Quick View Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'QuickViewPopupStyle',
                                values: styleAtts.QuickViewPopupStyle,
                                props: props,
                                ColorTypes: backgroundColorObject,
                            }),
                            el( WpmozoDimensions, {
                                DimensionKey: 'QuickViewPopupStyle',
                                values: styleAtts.QuickViewPopupStyle,
                                DimensionsTypes: {
                                    padding: true,
                                },
                                props: props,
                            } ),
                            el( PanelBody, 
                                { 
                                    title: __( 'Close Button Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                    className: "wpmozo-typography-panel",
                                    initialOpen: false,
                                },
                                el( WpmozoColorPicker, {
                                    ColorKey: 'QuickViewCloseStyle',
                                    values: styleAtts.QuickViewCloseStyle,
                                    props: props,
                                    ColorTypes: twoColorObject
                                }),
                                el( WpmozoSize, {
                                    SizeKey: 'QuickViewCloseStyle',
                                    values: styleAtts.QuickViewCloseStyle,
                                    props: props,
                                }),
                                el( WpmozoTypography, {
                                    TypographyKey: 'QuickViewCloseStyle',
                                    values: styleAtts.QuickViewCloseStyle,
                                    props: props,
                                }),
                                el( WpmozoDimensions, {
                                    DimensionKey: 'QuickViewCloseStyle',
                                    values: styleAtts.QuickViewCloseStyle,
                                    props: props,
                                } ),  
                                el( WpmozoBorder, {
                                    BorderKey: 'QuickViewCloseStyle',
                                    values: styleAtts.QuickViewCloseStyle,
                                    props: props,
                                }),
                            ),
                            el( ToggleControl, {
                                checked: styleAtts.QuickViewPopupStyle.SameAsCarousel, 
                                className: 'wpmozo-same-as-carousel',
                                label: __( 'Inner Elements Style Same As Carousel', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewSameAsCarousel ) {
                                    let theAtts = Object.assign({}, attributes.StyleAtts);
                                    theAtts.QuickViewPopupStyle.SameAsCarousel = NewSameAsCarousel;
                                    setAttributes( {StyleAtts: theAtts} );
                                },
                            }),
                            ! styleAtts.QuickViewPopupStyle.SameAsCarousel && [
                                el( PanelBody, 
                                    { 
                                        title: __( 'Title Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                        className: "wpmozo-typography-panel",
                                        initialOpen: false,
                                    },
                                    el( WpmozoColorPicker, {
                                        ColorKey: 'QuickViewTitleStyle',
                                        values: styleAtts.QuickViewTitleStyle,
                                        props: props,
                                        ColorTypes: textColorObject
                                    }),
                                    el( WpmozoTypography, {
                                        TypographyKey: 'QuickViewTitleStyle',
                                        values: styleAtts.QuickViewTitleStyle,
                                        props: props,
                                    } ),
                                ),
                                attributes.ShowPrice &&
                                    el( PanelBody, 
                                        { 
                                            title: __( 'Price Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                            className: "wpmozo-typography-panel",
                                            initialOpen: false,
                                        },
                                        el( WpmozoColorPicker, {
                                            ColorKey: 'QuickViewPriceStyle',
                                            values: styleAtts.QuickViewPriceStyle,
                                            props: props,
                                            ColorTypes: textColorObject
                                        }),
                                        el( WpmozoTypography, {
                                            TypographyKey: 'QuickViewPriceStyle',
                                            values: styleAtts.QuickViewPriceStyle,
                                            props: props,
                                        } ),
                                    ),
                                attributes.ShowAddToCartButton &&
                                    el( PanelBody, 
                                        { 
                                            title: __( 'Add to Cart Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                            className: "wpmozo-typography-panel",
                                            initialOpen: false,
                                        },
                                        el( WpmozoColorPicker, {
                                            ColorKey: 'QuickViewAddToCartStyle',
                                            values: styleAtts.QuickViewAddToCartStyle,
                                            props: props,
                                            ColorTypes: twoColorObject
                                        }),
                                        el( WpmozoTypography, {
                                            TypographyKey: 'QuickViewAddToCartStyle',
                                            values: styleAtts.QuickViewAddToCartStyle,
                                            props: props,
                                        }),
                                        el( WpmozoDimensions, {
                                            DimensionKey: 'QuickViewAddToCartStyle',
                                            DimensionsTypes: {
                                                padding: true,
                                            },
                                            values: styleAtts.QuickViewAddToCartStyle,
                                            props: props,
                                        } ),  
                                        el( WpmozoBorder, {
                                            BorderKey: 'QuickViewAddToCartStyle',
                                            values: styleAtts.QuickViewAddToCartStyle,
                                            props: props,
                                        }),
                                    ),
                                attributes.ShowSaleBadge &&
                                    el( PanelBody, 
                                        { 
                                            title: __( 'Sale Label Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                            className: "wpmozo-typography-panel",
                                            initialOpen: false,
                                        },
                                        el( WpmozoColorPicker, {
                                            ColorKey: 'QuickViewSaleLabelStyle',
                                            values: styleAtts.QuickViewSaleLabelStyle,
                                            props: props,
                                            ColorTypes: twoColorObject
                                        }),
                                        el( WpmozoTypography, {
                                            TypographyKey: 'QuickViewSaleLabelStyle',
                                            values: styleAtts.QuickViewSaleLabelStyle,
                                            props: props,
                                        } ),
                                    ),
                                ! attributes.OutOfStock && attributes.DisplayOutOfStockLabel &&
                                    el( PanelBody, 
                                        { 
                                            title: __( 'Out Of Stock Label Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                            className: "wpmozo-typography-panel",
                                            initialOpen: false,
                                        },
                                        el( WpmozoColorPicker, {
                                            ColorKey: 'QuickViewStockLabelStyle',
                                            values: styleAtts.QuickViewStockLabelStyle,
                                            props: props,
                                            ColorTypes: textColorObject,
                                        }),
                                        el( WpmozoTypography, {
                                            TypographyKey: 'QuickViewStockLabelStyle',
                                            values: styleAtts.QuickViewStockLabelStyle,
                                            props: props,
                                        } ),
                                        el( WpmozoDimensions, {
                                            DimensionKey: 'QuickViewStockLabelStyle',
                                            values: styleAtts.QuickViewStockLabelStyle,
                                            props: props,
                                        } ),  
                                        el( WpmozoBorder, {
                                            BorderKey: 'QuickViewStockLabelStyle',
                                            values: styleAtts.QuickViewStockLabelStyle,
                                            props: props,
                                        }),
                                    ),
                            ],
                            
                        ),
                    attributes.ShowSaleBadge &&
                        el( PanelBody, 
                            { 
                                title: __( 'Sale Label Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'SaleLabelStyle',
                                values: styleAtts.SaleLabelStyle,
                                props: props,
                                ColorTypes: twoColorObject,
                                afterOnChange: ( props ) => afterOnChange('.onsale', props.attributes.StyleAtts.SaleLabelStyle),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'SaleLabelStyle',
                                values: styleAtts.SaleLabelStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.onsale', props.attributes.StyleAtts.SaleLabelStyle),
                            } ),
                        ),
                    ! attributes.OutOfStock && attributes.DisplayOutOfStockLabel &&
                        el( PanelBody, 
                            { 
                                title: __( 'Out Of Stock Label Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'StockLabelStyle',
                                values: styleAtts.StockLabelStyle,
                                props: props,
                                ColorTypes: textColorObject,
                                afterOnChange: ( props ) => afterOnChange('.stock.out-of-stock', props.attributes.StyleAtts.StockLabelStyle),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'StockLabelStyle',
                                values: styleAtts.StockLabelStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.stock.out-of-stock', props.attributes.StyleAtts.StockLabelStyle),
                            } ),
                            el( WpmozoDimensions, {
                                DimensionKey: 'StockLabelStyle',
                                values: styleAtts.StockLabelStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.stock.out-of-stock', props.attributes.StyleAtts.StockLabelStyle),
                            } ),  
                            el( WpmozoBorder, {
                                BorderKey: 'StockLabelStyle',
                                values: styleAtts.StockLabelStyle,
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.stock.out-of-stock', props.attributes.StyleAtts.StockLabelStyle),
                            }),
                        ),
                ),
            ];
        }),
        save: function() {
            return null
        },
    });
})(
    window.wp.blocks,
    window.wp.blockEditor,
    window.wp.element,
    window.wp.components,
);
