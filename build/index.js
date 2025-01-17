
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
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps,  BlockControls, AlignmentControl} = editor;
    const { PanelBody, RangeControl, SelectControl, TextControl, FormTokenField, ToggleControl, Button} = components;
    const { Fragment, useEffect } = element;
    const { dispatch } = wp.data;
    const { serverSideRender: ServerSideRender, hooks } = wp;

    let textColorObject =  [
            {
                key: 'text',
                label: __( 'Text', 'wpmozo-product-carousel-for-woocommerce' ),
            },
        ],
        twoColorObject =  [
            {
                key: 'text',
                label: __( 'Text', 'wpmozo-product-carousel-for-woocommerce' ),
            },
            {
                key: 'background',
                label: __( 'Background', 'wpmozo-product-carousel-for-woocommerce' ),
            },
        ], 
        backgroundColorObject =  [
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
                    if ( ! options.border[border].hasOwnProperty('style') ) {
                        style += 'border-'+border+'-style: solid !important;';
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
            for (const padding in options.padding) {
                if ( 'undefined' !== typeof spacing[padding] && '' !== spacing[padding] ) {
                    style += 'padding-'+padding+': '+spacing[padding]+' !important;';
                }
            }
        }
        if ( 'undefined' !== typeof options.margin && '' !== options.margin && ( 
            'undefined' !== typeof options.margin.top || 
            'undefined' !== typeof options.margin.right || 
            'undefined' !== typeof options.margin.bottom || 
            'undefined' !== typeof options.margin.left ) ) {
            let spacing = convetVarStyle(options.margin);
            for (const margin in options.margin) {
                if ( 'undefined' !== typeof spacing[margin] && '' !== spacing[margin] ) {
                    style += 'margin-'+margin+': '+spacing[margin]+' !important;';
                }
            }
        }
        if ( 'undefined' !== typeof options.position && '' !== options.position && ( 
            'undefined' !== typeof options.position.top || 
            'undefined' !== typeof options.position.right || 
            'undefined' !== typeof options.position.bottom || 
            'undefined' !== typeof options.position.left ) ) {
            let spacing = convetVarStyle(options.position);
            for (const position in options.position) {
                if ( 'undefined' !== typeof spacing[position] && '' !== spacing[position] ) {
                    style += position+': '+spacing[position]+' !important;';
                }
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

    function appendInlineStyle( item, wraper, values = false, attributes = false ){

        let attKey = values === false  ? item.attKey : '',
            selector = item.selector,
            _values = values === false ? attributes[attKey] : values,
            __values = item.hasOwnProperty('values') ? item.values : _values,
            inlineStyle = convetInlineStyle( __values, attributes ),
            CarouAlign = '',
            hasAlign = item.hasOwnProperty('hasAlign') ? item.hasAlign : true,
            defaultInlineStyle = jQuery(wraper).find(selector).attr('style');

        if ( attributes.hasOwnProperty('CAlign') ) {
            CarouAlign = attributes.CAlign;
        }
        
        if ( hasAlign && '' !== CarouAlign && 'undefined' !== typeof CarouAlign && null !== CarouAlign ) {
            let { Nstyle, NNstyle } = getAlignStyle(CarouAlign),
                parent = jQuery(wraper).find(selector).parent();

            if ( parent.hasClass('product') ) {
                inlineStyle = inlineStyle += NNstyle;
            }
            if ( parent.hasClass('woocommerce-LoopProduct-link') ) {
                inlineStyle = inlineStyle += Nstyle;
            }
        }

        if ( '' !== defaultInlineStyle && 'undefined' !== typeof defaultInlineStyle ) {
            inlineStyle = defaultInlineStyle + inlineStyle;
        }

        jQuery(wraper).find(selector).attr('style', inlineStyle);

    }

    function getAlignStyle( Align ){

        let style = '',
            Nstyle = '';
        style += 'text-align: '+Align+' !important;';
        if ( 'left' === Align ) {
            Nstyle += 'margin-right: auto !important;';
            Nstyle += 'margin-left: 0px !important;';
        }else if ( 'right' === Align ) {
            Nstyle += 'margin-right: 0px !important;';
            Nstyle += 'margin-left: auto !important;';
        }else if ( 'center' === Align ) {
            Nstyle += 'margin-right: auto !important;';
            Nstyle += 'margin-left: auto !important;';
        }
        let NNstyle = Nstyle += 'text-align: '+Align+' !important;';

        return {style: style, Nstyle: Nstyle, NNstyle: NNstyle};

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


    function wpmozo_get_styleAtts( attributes ){

        let StyleAtts = {},
            stylesKeys = [
                'CarouContStyle',
                'CarouPagination',
                'CarouNavigationStyle',
                'CarouNavigationLeft',
                'CarouNavigationRight',
                'TitleStyle',
                'PriceStyle',
                'SaleLabelStyle',
                'StockLabelStyle',
                'AddToCartStyle',
                'QuickViewStyle',
                'QuickViewPopupStyle',
                'QuickViewTitleStyle',
                'QuickViewPriceStyle',
                'QuickViewSaleLabelStyle',
                'QuickViewStockLabelStyle',
                'QuickViewAddToCartStyle',
                'QuickViewCloseStyle',
            ],
            stylesTypes = {
                'FontSize' : '',
                'FontAppearance' : {'fontStyle' : '', 'fontWeight' : ''},
                'LetterSpacing' : '',
                'Decoration' : '',
                'LetterCase' : '',
                'LineHeight' : '',
                'text' : '',
                'background' : '',
                'borderRadius' : '',
                'border' : [],
                'padding' : '',
                'margin' : '',
                'position' : '',
                'width' : '',
                'height' : '',
            };
        
        for (var i = 0; i < stylesKeys.length; i++) {
            StyleAtts[ stylesKeys[i] ] = {};
            for (const styleType in stylesTypes) {

                if ( attributes.hasOwnProperty( stylesKeys[i]+styleType ) ) {
                    StyleAtts[ stylesKeys[i] ][ styleType ] = attributes[ stylesKeys[i]+styleType ];
                }

            }
        }

        let responsiveKeys = [
            'mobile',
            'tablet',
            ],
            responsiveTypes = {
                'Columns': '',
                'SlidesToScroll': '',
                'SpaceBetween': '',
            };

        for (var i = 0; i < responsiveKeys.length; i++) {
            StyleAtts[ responsiveKeys[i] ] = {};
            for (const responsiveType in responsiveTypes) {

                if ( attributes.hasOwnProperty( responsiveKeys[i]+responsiveType ) ) {
                    StyleAtts[ responsiveKeys[i] ][ responsiveType ] = attributes[ responsiveKeys[i]+responsiveType ];
                }

            }
        }

        return StyleAtts;
    }

    const initializeSwiper = ( attributes ) => {

        let StyleAtts = wpmozo_get_styleAtts( attributes ),
            clientId = attributes.clientId,
            selector = 'wpmozo_'+clientId,
            mobileSett = StyleAtts.mobile,
            tabletSett = StyleAtts.tablet,
            swiperEl = getWraperEl( clientId ),
            swiperWraper = swiperEl.find('.swiper');

        let _dimensions = StyleAtts.CarouContStyle,
            inlineStyle = convetInlineStyle( _dimensions );
        if ( '' !== inlineStyle ) {
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

                    let { style, Nstyle, NNstyle } = getAlignStyle(attributes.CAlign);
                    jQuery('#'+selector).find('ul.products li.product').attr('style', style);
                    let liChilds = jQuery('#'+selector).find('ul.products li.product').children();
                    let proLinkChilds = jQuery('#'+selector).find('ul.products li.product a.woocommerce-LoopProduct-link').children();
                    liChilds.each(function(key, value) {
                        jQuery(this).attr('style', NNstyle);
                    });
                    proLinkChilds.each(function(key, value) {
                        jQuery(this).attr('style', Nstyle);
                    });

                    let add_to_cart_selector = '.add_to_cart_button';
                    if ( ProductTypes.length ) {
                        jQuery.each(ProductTypes, function(key, type){
                            add_to_cart_selector += ', .button.product_type_'+type;
                        });
                    }

                    let main = Object.assign({}, StyleAtts.CarouNavigationStyle, StyleAtts.CarouNavigationLeft, StyleAtts.CarouNavigationRight),
                        left = Object.assign({}, StyleAtts.CarouNavigationStyle, StyleAtts.CarouNavigationLeft),
                        right = Object.assign({}, StyleAtts.CarouNavigationStyle, StyleAtts.CarouNavigationRight);

                    let wraper = jQuery('#'+selector);
                    let styles = [
                        {selector: '.woocommerce-loop-product__title', values: StyleAtts.TitleStyle},
                        {selector: '.price, .price > ins', values: StyleAtts.PriceStyle},
                        {selector: add_to_cart_selector, values: StyleAtts.AddToCartStyle},
                        {hasAlign: false,selector: '.wpmozo-quick-view-button', values: StyleAtts.QuickViewStyle},
                        {hasAlign: false,selector: '.onsale', values: StyleAtts.SaleLabelStyle},
                        {selector: '.stock.out-of-stock', values: StyleAtts.StockLabelStyle},
                        {hasAlign: false,selector: '.swiper-navigation', values: main},
                        {hasAlign: false,selector: '.swiper-button-prev', values: left},
                        {hasAlign: false,selector: '.swiper-button-next', values: right},
                    ];

                    styles.map(
                        function(item) { appendInlineStyle(item, wraper, item.values, attributes); }
                    );

                },
                afterInit: function(swiper){

                    let wraper = jQuery('#'+selector),
                        PaginationSelector = ( 'fraction' === attributes.PaginationType ) ? '.swiper-pagination' : '.swiper-pagination span';

                    let styles = [
                        {hasAlign: false,selector: PaginationSelector, values: StyleAtts.CarouPagination},
                    ];

                    if ( 'bullets' === attributes.PaginationType ) {
                        styles.push( {
                            selector: '.swiper-pagination span.swiper-pagination-bullet-active',
                            values: {
                                background: attributes.CarouPaginationActiveBackground
                            }
                        } )
                        styles.push( {
                            selector: '.swiper-pagination span:not(span.swiper-pagination-bullet-active)',
                            values: {
                                background: attributes.CarouPaginationInactiveBackground
                            }
                        } )
                    }

                    if ( 'progressbar' === attributes.PaginationType ) {
                        let barAtts = { background: attributes.CarouPaginationActiveBackground},
                            barBackAtts = { background: attributes.CarouPaginationInactiveBackground},
                            progAtts = {
                                width: StyleAtts.CarouPagination.width,
                                height: StyleAtts.CarouPagination.height,
                            };
                        styles = [
                            {hasAlign: false,selector: '.swiper-pagination-progressbar-fill', values: barAtts},
                            {hasAlign: false,selector: '.swiper-pagination-progressbar', values: barBackAtts},
                            {hasAlign: false,selector: '.swiper-pagination', values: progAtts},
                        ];
                    }

                    styles.map(
                        function(item) { appendInlineStyle(item, wraper, item.values, attributes); }
                    );

                },
                slideChange: function(swiper){

                    let wraper = jQuery('#'+selector),
                    styles = [];

                    if ( 'bullets' === attributes.PaginationType ) {
                        styles.push( {
                            selector: '.swiper-pagination span.swiper-pagination-bullet-active',
                            values: {
                                background: attributes.CarouPaginationActiveBackground
                            }
                        } )
                        styles.push( {
                            selector: '.swiper-pagination span:not(span.swiper-pagination-bullet-active)',
                            values: {
                                background: attributes.CarouPaginationInactiveBackground
                            }
                        } )
                    }

                    if ( 'progressbar' === attributes.PaginationType ) {
                        let barAtts = { background: attributes.CarouPaginationActiveBackground},
                            barBackAtts = { background: attributes.CarouPaginationInactiveBackground},
                            progAtts = {
                                width: StyleAtts.CarouPagination.width,
                                height: StyleAtts.CarouPagination.height,
                            };
                        styles = [
                            {hasAlign: false,selector: '.swiper-pagination-progressbar-fill', values: barAtts},
                            {hasAlign: false,selector: '.swiper-pagination-progressbar', values: barBackAtts},
                            {hasAlign: false,selector: '.swiper-pagination', values: progAtts},
                        ];
                    }

                    styles.map(
                        function(item) { appendInlineStyle(item, wraper, item.values, attributes); }
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

        if ( swiperWraper.length > 0 ) {
            let _swiper = new Swiper(swiperWraper[0], sw_obj);
        }

    };

    hooks.addAction( 'server-side-loading-finished', 'function_name', initializeSwiper );

    const TriggerWhenLoadingFinished = (args) => {

        let attributes = args.attributes;
        if( 'undefined' === typeof attributes.Columns ){
            attributes.Columns = parseInt(GetAttributes.Columns.default);
        }
        if( 'undefined' === typeof attributes.SpaceBetween ){
            attributes.SpaceBetween = parseInt(GetAttributes.SpaceBetween.default);
        }
        if( 'undefined' === typeof attributes.SlidesToScroll ){
            attributes.SlidesToScroll = parseInt(GetAttributes.SlidesToScroll.default);
        }

        useEffect(() => {
            return () => {
                hooks.doAction("server-side-loading-finished", attributes);
            };
        });

        return el( Fragment, {}, 
            el("div", {
                className: "wpmozo-loader backend",
                style: {
                    "display": "grid",
                    "gridAutoFlow": "column",
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

    function getWraperEl( clientId ){
        let editorIfram = jQuery('body').find('[name="editor-canvas"]').contents(),
        mainFromIfram = editorIfram.find('body').find('#block-' + clientId),
        mainFromBody = jQuery('body').find('#block-' + clientId),
        mainEl = mainFromIfram.length > 0 ? mainFromIfram : mainFromBody;

        return mainEl;
    }

    registerBlockType( 'wpmozo/product-carousel', {
        title: __( 'WPMozo Product Carousel', 'wpmozo-product-carousel-for-woocommerce' ),
        icon: 'products',
        apiVersion: 2,
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
                styleAtts = wpmozo_get_styleAtts( attributes );

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

            let paginationActiveColorLable = __( 'Active Icon Color', 'wpmozo-product-carousel-for-woocommerce' ), 
            paginationInactiveColorLable = __( 'Inactive Icon Color', 'wpmozo-product-carousel-for-woocommerce' );

            if ( 'fraction' === attributes.PaginationType ) {
                paginationActiveColorLable = __( 'Text Color', 'wpmozo-product-carousel-for-woocommerce' );
            }else if ( 'progressbar' === attributes.PaginationType ) {
                paginationActiveColorLable = __( 'Bar Color', 'wpmozo-product-carousel-for-woocommerce' );
                paginationInactiveColorLable = __( 'Bar Background Color', 'wpmozo-product-carousel-for-woocommerce' );
            }


            const setValue = function(args, value){

                let depth = args.hasOwnProperty('depth') ? args.depth : [],
                    AttrKey = args.hasOwnProperty('AttrKey') ? args.AttrKey : 'StyleAtts',
                    itemKey = args.itemKey,
                    itemType = args.itemType,
                    theAtts = Object.assign({}, props.attributes[AttrKey]),
                    _theAtts = null, 
                    preAttributes = GetAttributes;

                if ( null === value && depth.length < 1 && 'undefined' !== typeof preAttributes[AttrKey][itemKey][itemType].default ) {
                    value = preAttributes[AttrKey][itemKey][itemType].default;
                }

                if ( Array.isArray(depth) && depth.length ) {
                    var lastEl = null,
                        lastPreEl = null;
                    for (var i = 0; i < depth.length; i++) {
                        if ( null === lastEl ) {
                            lastEl = theAtts[depth[i]];
                        }else{
                            if ( lastEl.hasOwnProperty(depth[i]) ) {
                                lastEl = lastEl[depth[i]];
                            }
                        }
                        if ( null === lastPreEl ) {
                            lastPreEl = preAttributes[AttrKey][depth[i]];
                        }else{
                            if ( lastPreEl.hasOwnProperty(depth[i]) ) {
                                lastPreEl = lastPreEl[depth[i]];
                            }
                        }
                    }
                    _theAtts = lastEl[itemKey];
                    if ( null == value && 'undefined' !== typeof lastPreEl[itemKey][itemType].default ) {
                        value = lastPreEl[itemKey][itemType].default;
                    }
                    _theAtts[itemType] = ( null !== value ) ? value : '';
                }else{
                    _theAtts = theAtts;
                    _theAtts[itemKey][itemType] = ( null !== value ) ? value : '';
                }

                if ( args.hasOwnProperty('setState') ) {
                    args['setState']();
                }

                setAttributes( { [AttrKey]: _theAtts } );

            }

            const afterOnChangeNavigation = function( props ){
                let StyleAtts = wpmozo_get_styleAtts( props.attributes ),
                    main = Object.assign({}, StyleAtts.CarouNavigationStyle, StyleAtts.CarouNavigationLeft, StyleAtts.CarouNavigationRight),
                    left = Object.assign({}, StyleAtts.CarouNavigationStyle, StyleAtts.CarouNavigationLeft),
                    right = Object.assign({}, StyleAtts.CarouNavigationStyle, StyleAtts.CarouNavigationRight);
                appendInlineStyle(
                    {
                        selector: '.swiper-navigation'
                    },
                    wraper, main, attributes);
                appendInlineStyle(
                    {
                        selector: '.swiper-button-prev'
                    },
                    wraper, left, attributes);
                appendInlineStyle(
                    {
                        selector: '.swiper-button-next'
                    },
                    wraper, right, attributes);
            };

            const afterOnChange = function( selector, Atts, attributes ){
                appendInlineStyle(
                    {
                        selector: selector
                    },
                    wraper, Atts, attributes);
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
                            EmptyResponsePlaceholder: TriggerWhenLoadingFinished,
                            httpMethod: 'POST',
                        },
                    ),
                ),
                el(BlockControls, {},
                    el(AlignmentControl, {
                        value: attributes.CAlign,
                        label: __( 'Alignment', 'wpmozo-product-carousel-for-woocommerce' ),
                        onChange: function( NewAlign ){ 
                            setAttributes( {CAlign: NewAlign} );
                        }
                    }),
                ),  
                el( InspectorControls, {},
                    el( PanelBody, { title: __( 'Carousel Settings', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: true },
                        el(
                            RangeControl,
                            {
                                key: 'wpmozo-product-carousel-columns',
                                value: attributes.Columns,
                                allowReset: true,
                                initialPosition: parseInt(GetAttributes.Columns.default),
                                resetFallbackValue: parseInt(GetAttributes.Columns.default),
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
                                key: 'wpmozo-product-carousel-slidestoscroll',
                                value: attributes.SlidesToScroll,
                                allowReset: true,
                                initialPosition: parseInt(GetAttributes.SlidesToScroll.default),
                                resetFallbackValue: parseInt(GetAttributes.SlidesToScroll.default),
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
                                key: 'wpmozo-product-carousel-space-between',
                                value: attributes.SpaceBetween,
                                allowReset: true,
                                initialPosition: parseInt(GetAttributes.SpaceBetween.default),
                                resetFallbackValue: parseInt(GetAttributes.SpaceBetween.default),
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
                                    key: 'wpmozo-product-carousel-delay',
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
                                    key: 'wpmozo-product-carousel-paginationtype',
                                    label: __( 'Pagination Type', 'wpmozo-product-carousel-for-woocommerce'),
                                    value: attributes.PaginationType,
                                    options: [
                                        {
                                            label: __( 'Bullets', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'bullets'
                                        }, 
                                        {
                                            label: __( 'Fraction', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'fraction'
                                        },
                                        {
                                            label: __( 'Progressbar', 'wpmozo-product-carousel-for-woocommerce'),
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
                                    key: 'wpmozo-product-carousel-responsive-columns',
                                    value: styleAtts.mobile.Columns,
                                    allowReset: true,
                                    initialPosition: parseInt(GetAttributes.mobileColumns.default),
                                    resetFallbackValue: parseInt(GetAttributes.mobileColumns.default),
                                    max: 8,
                                    min: 1,
                                    label: __( 'Columns', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewColumns ) {
                                        setAttributes( { mobileColumns: NewColumns } );
                                    },
                                }
                            ),
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozo-product-carousel-responsive-slidestoscroll',
                                    value: styleAtts.mobile.SlidesToScroll,
                                    allowReset: true,
                                    initialPosition: parseInt(GetAttributes.mobileSlidesToScroll.default),
                                    resetFallbackValue: parseInt(GetAttributes.mobileSlidesToScroll.default),
                                    max: 8,
                                    min: 1,
                                    label: __( 'Slides To Scroll', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSlidesToScroll ) {
                                        setAttributes( { mobileSlidesToScroll: NewSlidesToScroll } );
                                    },
                                }
                            ),
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozo-product-carousel-responsive-space-between',
                                    value: styleAtts.mobile.SpaceBetween,
                                    allowReset: true,
                                    initialPosition: parseInt(GetAttributes.mobileSpaceBetween.default),
                                    resetFallbackValue: parseInt(GetAttributes.mobileSpaceBetween.default),
                                    label: __( 'Space Between', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSpaceBetween ) {
                                        setAttributes( { mobileSpaceBetween: NewSpaceBetween } );
                                    },
                                }
                            ),
                        ),
                        el( PanelBody, { title: __( 'Tablet', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: false },
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozo-product-carousel-tablet-columns',
                                    value: styleAtts.tablet.Columns,
                                    allowReset: true,
                                    initialPosition: parseInt(GetAttributes.tabletColumns.default),
                                    resetFallbackValue: parseInt(GetAttributes.tabletColumns.default),
                                    max: 8,
                                    min: 1,
                                    label: __( 'Columns', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewColumns ) {
                                        setAttributes( { tabletColumns: NewColumns } );
                                    },
                                }
                            ),
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozo-product-carousel-tablet-slidestoscroll',
                                    value: styleAtts.tablet.SlidesToScroll,
                                    allowReset: true,
                                    initialPosition: parseInt(GetAttributes.tabletSlidesToScroll.default),
                                    resetFallbackValue: parseInt(GetAttributes.tabletSlidesToScroll.default),
                                    max: 8,
                                    min: 1,
                                    label: __( 'Slides To Scroll', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSlidesToScroll ) {
                                        setAttributes( { tabletSlidesToScroll: NewSlidesToScroll } );
                                    },
                                }
                            ),
                            el(
                                RangeControl,
                                {
                                    key: 'wpmozo-product-carousel-tablet-space-between',
                                    value: styleAtts.tablet.SpaceBetween,
                                    allowReset: true,
                                    initialPosition: parseInt(GetAttributes.tabletSpaceBetween.default),
                                    resetFallbackValue: parseInt(GetAttributes.tabletSpaceBetween.default),
                                    label: __( 'Space Between', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSpaceBetween ) {
                                        setAttributes( { tabletSpaceBetween: NewSpaceBetween } );
                                    },
                                }
                            ),
                        ),
                    ),
                    el( PanelBody, { title: __( 'Query Settings', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: false },
                        el(
                            SelectControl,
                            {
                                key: 'wpmozo-product-carousel-viewtype',
                                label: __( 'Product View Type', 'wpmozo-product-carousel-for-woocommerce'),
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
                                key: 'wpmozo-product-carousel-products',
                                value: attributes.NumberOfProducts,
                                label: __( 'Number of Porducts', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewNumberOfProducts ) {
                                    setAttributes( { NumberOfProducts: NewNumberOfProducts } );
                                },
                                help: __( 'Enter -1 to show a list of all products.', 'wpmozo-product-carousel-for-woocommerce' ),
                            }
                        ),
                       'best_selling' !== attributes.ProductViewType && 'top_rated' !== attributes.ProductViewType &&
                            el(
                                SelectControl,
                                {
                                    key: 'wpmozo-product-carousel-orderby',
                                    label: __( 'Order By', 'wpmozo-product-carousel-for-woocommerce'),
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
                                    key: 'wpmozo-product-carousel-order',
                                    label: __( 'Order', 'wpmozo-product-carousel-for-woocommerce'),
                                    value: attributes.Order,
                                    options: [
                                        {
                                            label: __( 'Ascending', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'ASC'
                                        }, 
                                        {
                                            label: __( 'Descending', 'wpmozo-product-carousel-for-woocommerce'),
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
                                key: 'wpmozo-product-carousel-tax-relation',
                                label: __( 'Taxonomies Relation', 'wpmozo-product-carousel-for-woocommerce'),
                                value: attributes.TaxonomiesRelation,
                                options: [
                                    {
                                        label: __( 'OR', 'wpmozo-product-carousel-for-woocommerce'),
                                        value: 'OR'
                                    }, 
                                    {
                                        label: __( 'AND', 'wpmozo-product-carousel-for-woocommerce'),
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
                                key: 'wpmozo-product-carousel-layout',
                                label: __( 'Layout', 'wpmozo-product-carousel-for-woocommerce'),
                                value: attributes.Layout,
                                options: AllLayouts,
                                onChange: function( NewLayout ) {
                                    setAttributes( { Layout: NewLayout } );
                                    if ( 'layout-2' === NewLayout ) {
                                        setValue({itemKey: 'AddToCartStyle', itemType: 'borderRadius'}, '0px');
                                    }else{
                                        setValue({itemKey: 'AddToCartStyle', itemType: 'borderRadius'}, null);
                                    }
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
                                    key: 'wpmozo-product-outofstock-label',
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
                                label: __( 'Enable Quick View', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewEnableQuickViewLink ) {
                                    setAttributes( { EnableQuickViewLink: NewEnableQuickViewLink } );
                                },
                            }
                        ),
                        attributes.EnableQuickViewLink &&
                            el(
                                TextControl,
                                {
                                    key: 'wpmozo-product-carousel-quickviewlinktext',
                                    value: attributes.QuickViewLinkText,
                                    label: __( 'Quickview Button text', 'wpmozo-product-carousel-for-woocommerce' ),
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
                                label: __( 'Quickview Icon', 'wpmozo-product-carousel-for-woocommerce'),
                                props: props,
                                attributes: attributes
                            } ),
                        attributes.EnableQuickViewLink && attributes.QuickViewLinkIconEnabled &&
                            el(
                                ToggleControl,
                                {
                                    checked: attributes.QuickViewLinkCustomIcon, 
                                    label: __( 'Quickview Custom Icon', 'wpmozo-product-carousel-for-woocommerce' ),
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
                                checked: attributes.ShowTitle, 
                                label: __( 'Show Title', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowTitle ) {
                                    setAttributes( { ShowTitle: NewShowTitle } );
                                },
                            }
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
                                    key: 'wpmozo-product-carousel-featimasize',
                                    label: __( 'Featured Image Size', 'wpmozo-product-carousel-for-woocommerce'),
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
                                    key: 'wpmozo-product-carousel-salebadgetype',
                                    label: __( 'Sale Badge Type', 'wpmozo-product-carousel-for-woocommerce'),
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
                                    key: 'wpmozo-product-salebadge-label',
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
                            afterOnChange: ( props ) => {

                                let _dimensions = styleAtts.CarouContStyle,
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
                                ColorKey: 'CarouNavigationStyle',
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
                                TypographyKey: 'CarouNavigationStyle',
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
                                DimensionKey: 'CarouNavigationStyle',
                                DimensionsTypes: {
                                    padding: true,
                                    margin: true,
                                },
                                props: props,
                                afterOnChange: ( props ) => afterOnChangeNavigation(props),
                            } ),
                            el( WpmozoDimensions, {
                                label: __( 'Previous Position', 'wpmozo-product-carousel-for-woocommerce'),
                                DimensionKey: 'CarouNavigationLeft',
                                DimensionsTypes: {
                                    position: true,
                                },
                                props: props,
                                afterOnChange: ( props ) => afterOnChangeNavigation(props),
                            } ),
                            el( WpmozoDimensions, {
                                label: __( 'Next Position', 'wpmozo-product-carousel-for-woocommerce'),
                                DimensionKey: 'CarouNavigationRight',
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
                                    props: props,
                                    ColorTypes: [
                                        {
                                            key: 'ActiveBackground',
                                            label: paginationActiveColorLable,
                                        },
                                        {
                                            key: 'InactiveBackground',
                                            label: paginationInactiveColorLable,
                                        },
                                    ],
                                    afterOnChange: ( props ) => {
                                        appendInlineStyle(
                                            {
                                                selector: '.swiper-pagination span.swiper-pagination-bullet-active',
                                                values: {
                                                    background: props.attributes.CarouPaginationActiveBackground
                                                }
                                            },
                                            wraper, false, props.attributes);
                                    },
                                }),
                                el( WpmozoSize, {
                                    SizeKey: 'CarouPagination',
                                    props: props,
                                    afterOnChange: ( props ) => {
                                        let selector = 'progressbar' === attributes.PaginationType ? 
                                        '.swiper-pagination' : '.swiper-pagination span';
                                        appendInlineStyle(
                                            {
                                                selector: selector,
                                            },
                                            wraper, styleAtts.CarouPagination, props.attributes);
                                    },
                                })
                            ],
                            'fraction' === attributes.PaginationType && [
                                el( WpmozoColorPicker, {
                                    ColorKey: 'CarouPagination',
                                    props: props,
                                    ColorTypes: [
                                        {
                                            key: 'text',
                                            label: paginationActiveColorLable,
                                        },
                                    ],
                                    afterOnChange: ( props ) => {
                                        appendInlineStyle(
                                            {
                                                selector: '.swiper-pagination'
                                            },
                                            wraper, styleAtts.CarouPagination, props.attributes);
                                    },
                                }),
                                el( WpmozoTypography, {
                                    TypographyKey: 'CarouPagination',
                                    props: props,
                                    TypoTypes: {
                                        FontSize: true,
                                    },
                                    afterOnChange: ( props ) => {
                                        appendInlineStyle(
                                            {
                                                selector: '.swiper-pagination'
                                            },
                                            wraper, styleAtts.CarouPagination, props.attributes);
                                    },
                                } )
                            ],
                        ),
                    attributes.ShowTitle && 
                        el( PanelBody, 
                            { 
                                title: __( 'Title Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'TitleStyle',
                                props: props,
                                ColorTypes: textColorObject,
                                afterOnChange: ( props ) => afterOnChange('.woocommerce-loop-product__title', styleAtts.TitleStyle, props.attributes),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'TitleStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.woocommerce-loop-product__title', styleAtts.TitleStyle, props.attributes),
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
                                props: props,
                                ColorTypes: textColorObject,
                                afterOnChange: ( props ) => afterOnChange('.price, .price > ins', styleAtts.PriceStyle, props.attributes),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'PriceStyle',
                                props: props,
                                TypoTypes: {
                                    FontSize: true,
                                    LetterSpacing: true,
                                    Decoration: true,
                                    FontAppearance: true,
                                    LineHeight: true,
                                },
                                afterOnChange: ( props ) => afterOnChange('.price, .price > ins', styleAtts.PriceStyle, props.attributes),
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
                                props: props,
                                ColorTypes: twoColorObject,
                                afterOnChange: ( props ) => afterOnChange(add_to_cart_selector, styleAtts.AddToCartStyle, props.attributes),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'AddToCartStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange(add_to_cart_selector, styleAtts.AddToCartStyle, props.attributes),
                            }),
                            el( WpmozoDimensions, {
                                DimensionKey: 'AddToCartStyle',
                                DimensionsTypes: {
                                    padding: true,
                                },
                                props: props,
                                afterOnChange: ( props ) => afterOnChange(add_to_cart_selector, styleAtts.AddToCartStyle, props.attributes),
                            } ),  
                            el( WpmozoBorder, {
                                BorderKey: 'AddToCartStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange(add_to_cart_selector, styleAtts.AddToCartStyle, props.attributes),
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
                                props: props,
                                ColorTypes: twoColorObject,
                                afterOnChange: ( props ) => afterOnChange('.wpmozo-quick-view-button', styleAtts.QuickViewStyle, props.attributes),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'QuickViewStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.wpmozo-quick-view-button', styleAtts.QuickViewStyle, props.attributes),
                            } ),
                            el( WpmozoDimensions, {
                                DimensionKey: 'QuickViewStyle',
                                DimensionsTypes: {
                                    padding: true,
                                },
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.wpmozo-quick-view-button', styleAtts.QuickViewStyle, props.attributes),
                            } ),  
                            el( WpmozoBorder, {
                                BorderKey: 'QuickViewStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.wpmozo-quick-view-button', styleAtts.QuickViewStyle, props.attributes),
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
                                props: props,
                                ColorTypes: backgroundColorObject,
                            }),
                            el( WpmozoDimensions, {
                                DimensionKey: 'QuickViewPopupStyle',
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
                                    props: props,
                                    ColorTypes: twoColorObject
                                }),
                                el( WpmozoSize, {
                                    SizeKey: 'QuickViewCloseStyle',
                                    props: props,
                                }),
                                el( WpmozoTypography, {
                                    TypographyKey: 'QuickViewCloseStyle',
                                    props: props,
                                }),
                                el( WpmozoDimensions, {
                                    DimensionKey: 'QuickViewCloseStyle',
                                    props: props,
                                } ),  
                                el( WpmozoBorder, {
                                    BorderKey: 'QuickViewCloseStyle',
                                    props: props,
                                }),
                            ),
                            el( ToggleControl, {
                                checked: attributes.QuickViewPopupStyleSameAsCarousel, 
                                className: 'wpmozo-same-as-carousel',
                                label: __( 'Inner Elements Style Same As Carousel', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewSameAsCarousel ) {
                                    setAttributes( {QuickViewPopupStyleSameAsCarousel: NewSameAsCarousel} );
                                },
                            }),
                            ! attributes.QuickViewPopupStyleSameAsCarousel && [
                                el( PanelBody, 
                                    { 
                                        title: __( 'Title Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                        className: "wpmozo-typography-panel",
                                        initialOpen: false,
                                    },
                                    el( WpmozoColorPicker, {
                                        ColorKey: 'QuickViewTitleStyle',
                                        props: props,
                                        ColorTypes: textColorObject
                                    }),
                                    el( WpmozoTypography, {
                                        TypographyKey: 'QuickViewTitleStyle',
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
                                            props: props,
                                            ColorTypes: textColorObject
                                        }),
                                        el( WpmozoTypography, {
                                            TypographyKey: 'QuickViewPriceStyle',
                                            props: props,
                                            TypoTypes: {
                                                FontSize: true,
                                                LetterSpacing: true,
                                                Decoration: true,
                                                FontAppearance: true,
                                                LineHeight: true,
                                            },
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
                                            props: props,
                                            ColorTypes: twoColorObject
                                        }),
                                        el( WpmozoTypography, {
                                            TypographyKey: 'QuickViewAddToCartStyle',
                                            props: props,
                                        }),
                                        el( WpmozoDimensions, {
                                            DimensionKey: 'QuickViewAddToCartStyle',
                                            DimensionsTypes: {
                                                padding: true,
                                            },
                                            props: props,
                                        } ),  
                                        el( WpmozoBorder, {
                                            BorderKey: 'QuickViewAddToCartStyle',
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
                                            props: props,
                                            ColorTypes: twoColorObject
                                        }),
                                        el( WpmozoTypography, {
                                            TypographyKey: 'QuickViewSaleLabelStyle',
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
                                            props: props,
                                            ColorTypes: textColorObject,
                                        }),
                                        el( WpmozoTypography, {
                                            TypographyKey: 'QuickViewStockLabelStyle',
                                            props: props,
                                        } ),
                                        el( WpmozoDimensions, {
                                            DimensionKey: 'QuickViewStockLabelStyle',
                                            props: props,
                                        } ),  
                                        el( WpmozoBorder, {
                                            BorderKey: 'QuickViewStockLabelStyle',
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
                                props: props,
                                ColorTypes: twoColorObject,
                                afterOnChange: ( props ) => afterOnChange('.onsale', styleAtts.SaleLabelStyle, props.attributes),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'SaleLabelStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.onsale', styleAtts.SaleLabelStyle, props.attributes),
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
                                props: props,
                                ColorTypes: textColorObject,
                                afterOnChange: ( props ) => afterOnChange('.stock.out-of-stock', styleAtts.StockLabelStyle, props.attributes),
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'StockLabelStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.stock.out-of-stock', styleAtts.StockLabelStyle, props.attributes),
                            } ),
                            el( WpmozoDimensions, {
                                DimensionKey: 'StockLabelStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.stock.out-of-stock', styleAtts.StockLabelStyle, props.attributes),
                            } ),  
                            el( WpmozoBorder, {
                                BorderKey: 'StockLabelStyle',
                                props: props,
                                afterOnChange: ( props ) => afterOnChange('.stock.out-of-stock', styleAtts.StockLabelStyle, props.attributes),
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
