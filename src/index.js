
import WpmozoTypography from '../src/components/wpmozo-typography/wpmozo-typography';
import WpmozoLoader from '../src/components/wpmozo-loader/wpmozo-loader';
import WpmozoIconpicker from '../src/components/wpmozo-iconpicker/wpmozo-iconpicker';
import WpmozoColorPicker from '../src/components/wpmozo-colorpicker/wpmozo-colorpicker';
import WpmozoDimensions from '../src/components/wpmozo-dimensions/wpmozo-dimensions';

( function(blocks, editor, element, components) {

    const __ = wp.i18n.__;
    const el = element.createElement;
    const registerBlockType = blocks.registerBlockType;
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps, useSetting, ColorPaletteControl, __experimentalUseMultipleOriginColorsAndGradients, __experimentalSpacingSizesControl } = editor;
    const { PanelBody, RangeControl, SelectControl, TextControl, FormTokenField, ToggleControl, Button, ColorPalette, Dropdown, ColorIndicator, Popover, TabPanel, Spinner  } = components;
    const { Fragment, useState, useEffect } = element;
    const { useSelect, useDispatch, dispatch } = wp.data;
    const { serverSideRender: ServerSideRender, hooks } = wp;
    window.WpmozoSwipers = {};

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

    function convetVarStyle( options ){

        let spacing = Object.assign({}, options);

        for (const type in spacing) {
            let value = spacing[type];
            if ( value.startsWith("var:") ) {
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

        let clientId = attributes.clientId,
            selector = 'wpmozo_'+clientId;

        let options = attributes.CarContStyle;
        let style = '';
        if ( 'undefined' !== typeof options.padding && '' !== options.padding && ( 
            'undefined' !== typeof options.padding.top || 
            'undefined' !== typeof options.padding.right || 
            'undefined' !== typeof options.padding.bottom || 
            'undefined' !== typeof options.padding.left ) ) {
            let spacing = convetVarStyle(options.padding);
            style += 'padding: '+spacing.top+' '+spacing.right+' '+spacing.bottom+' '+spacing.left+';';
        }
        jQuery('#'+selector).attr('style', style);
        let mobileSett = attributes.Responsive.mobile;
        let tabletSett = attributes.Responsive.tablet;

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

                    let wraper = jQuery('#'+selector);
                    let styles = [
                        {attKey: 'TitleStyle', type: 'style', selector: '.woocommerce-loop-product__title'},
                        {attKey: 'PriceStyle', type: 'style', selector: '.price'},
                        {attKey: 'AddToCartStyle', type: 'style', selector: add_to_cart_selector},
                        {attKey: 'QuickViewStyle', type: 'style', selector: '.wpmozo-quick-view-button'},
                        {attKey: 'SaleLabelStyle', type: 'style', selector: '.onsale'},
                        {attKey: 'StockLabelStyle', type: 'style', selector: '.soldout-text'},
                        {attKey: 'TitleColor', type: 'color', selector: '.woocommerce-loop-product__title'},
                        {attKey: 'PriceColor', type: 'color', selector: '.price'},
                        {attKey: 'AddToCartColor', type: 'color', selector: add_to_cart_selector},
                        {attKey: 'QuickViewColor', type: 'color', selector: '.wpmozo-quick-view-button'},
                        {attKey: 'SaleLabelColor', type: 'color', selector: '.onsale'},
                        {attKey: 'StockLabelColor', type: 'color', selector: '.soldout-text'},
                    ];

                    styles.map(
                        function(item) { appendInlineStyle(item, wraper, attributes); }
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
        window.WpmozoSwipers[clientId] = _swiper;

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

    function wpmozoGetRand(){

        return (Math.random() + 1).toString(36).substring(2);

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
            let clientId = attributes.clientId;

            if ( ! attributes.hasOwnProperty('UID') ) {
                attributes.UID = wpmozoGetRand();
            }

            let product_cats = wp.data.select('core').getEntityRecords( 'taxonomy', 'product_cat' );
            let product_cat_options = [];
            if( product_cats ) {
                product_cat_options = product_cats.map( value => value.name );
            }

            let product_tags = wp.data.select('core').getEntityRecords( 'taxonomy', 'product_tag' );
            let product_tag_options = [];
            if( product_tags ) {
                product_tag_options = product_tags.map( value => value.name );
            }

            let blockProps = useBlockProps();

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
                                    props.setAttributes( { Columns: NewColumns } );
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
                                    props.setAttributes( { SlidesToScroll: NewSlidesToScroll } );
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
                                    props.setAttributes( { SpaceBetween: NewSpaceBetween } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.AutoPlay, 
                                label: __( 'Auto Play', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewAutoPlay ) {
                                    props.setAttributes( { AutoPlay: NewAutoPlay } );
                                },
                            }
                        ),
                        el(
                            TextControl,
                            {
                                key: 'wpmozp-product-carousel-delay',
                                value: attributes.Delay,
                                label: __( 'Delay of Animation', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewDelay ) {
                                    props.setAttributes( { Delay: NewDelay } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.Loop, 
                                label: __( 'Loop', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewLoop ) {
                                    props.setAttributes( { Loop: NewLoop } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowNavigation, 
                                label: __( 'Show Navigation', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowNavigation ) {
                                    props.setAttributes( { ShowNavigation: NewShowNavigation } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowPagination, 
                                label: __( 'Show Pagination', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowPagination ) {
                                    props.setAttributes( { ShowPagination: NewShowPagination } );
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
                                        props.setAttributes( { PaginationType: NewPaginationType } );
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
                                        props.setAttributes( { Responsive: _Responsive } );
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
                                        props.setAttributes( { Responsive: _Responsive } );
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
                                        props.setAttributes( { Responsive: _Responsive } );
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
                                        props.setAttributes( { Responsive: _Responsive } );
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
                                        props.setAttributes( { Responsive: _Responsive } );
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
                                        props.setAttributes( { Responsive: _Responsive } );
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
                                    props.setAttributes( { ProductViewType: NewProductViewType } );
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
                                    props.setAttributes( { NumberOfProducts: NewNumberOfProducts } );
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
                                        props.setAttributes( { OrderBy: NewOrderBy } );
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
                                        props.setAttributes( { Order: NewOrder } );
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
                                    props.setAttributes( { IncludeCategories: NewCats } );
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
                                    props.setAttributes( { IncludeTags: NewTags } );
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
                                    props.setAttributes( { TaxonomiesRelation: NewTaxonomiesRelation } );
                                },
                            },
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.OutOfStock, 
                                label: __( 'Hide Out of Stock Products', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewOutOfStock ) {
                                    props.setAttributes( { OutOfStock: NewOutOfStock } );
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
                                    props.setAttributes( { Layout: NewLayout } );
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
                                        props.setAttributes( { DisplayOutOfStockLabel: NewDisplayOutOfStockLabel } );
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
                                        props.setAttributes( { OutOfStockLabel: NewOutOfStockLabel } );
                                    },
                                }
                            ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.EnableQuickViewLink, 
                                label: __( 'Enable Quick View Link', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewEnableQuickViewLink ) {
                                    props.setAttributes( { EnableQuickViewLink: NewEnableQuickViewLink } );
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
                                        props.setAttributes( { QuickViewLinkText: NewQuickViewLinkText } );
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
                                        props.setAttributes( { QuickViewLinkIconEnabled: NewQuickViewLinkIconEnabled } );
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
                                        props.setAttributes( { QuickViewLinkCustomIcon: NewQuickViewLinkCustomIcon } );
                                    },
                                }
                            ),
                        attributes.EnableQuickViewLink && attributes.QuickViewLinkIconEnabled && attributes.QuickViewLinkCustomIcon &&
                            el(MediaUploadCheck, {}, 
                                el(MediaUpload, {
                                    onSelect: (media) => props.setAttributes( { QuickViewLinkImg: media.url } ),
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
                                    props.setAttributes( { ShowFeaturedImage: NewShowFeaturedImage } );
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
                                        props.setAttributes( { FeaturedImageSize: NewFeaturedImageSize } );
                                    },
                                },
                            ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowRating, 
                                label: __( 'Show Rating', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowRating ) {
                                    props.setAttributes( { ShowRating: NewShowRating } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowPrice, 
                                label: __( 'Show Price', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowPrice ) {
                                    props.setAttributes( { ShowPrice: NewShowPrice } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowAddToCartButton, 
                                label: __( 'Show Add to Cart button', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowAddToCartButton ) {
                                    props.setAttributes( { ShowAddToCartButton: NewShowAddToCartButton } );
                                },
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                checked: attributes.ShowSaleBadge, 
                                label: __( 'Show Sale Badge', 'wpmozo-product-carousel-for-woocommerce' ),
                                onChange: function( NewShowSaleBadge ) {
                                    props.setAttributes( { ShowSaleBadge: NewShowSaleBadge } );
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
                                        props.setAttributes( { SaleBadgeType: NewSaleBadgeType } );
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
                                        props.setAttributes( { SaleLabelText: NewSaleLabelText } );
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
                            DimensionKey: 'CarContStyle',
                            DimensionsTypes: {
                                padding: true,
                            },
                            attributes: attributes,
                            props: props,
                        } ),  
                    ),
                    el( PanelBody, 
                        { 
                            title: __( 'Title Style', 'wpmozo-product-carousel-for-woocommerce' ),
                            className: "wpmozo-typography-panel",
                            initialOpen: false,
                        },
                        el( WpmozoColorPicker, {
                            ColorKey: 'TitleColor',
                            attributes: attributes,
                            props: props,
                            ColorTypes: textColorObject
                        }),
                        el( WpmozoTypography, {
                            TypographyKey: 'TitleStyle',
                            attributes: attributes,
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
                                ColorKey: 'PriceColor',
                                attributes: attributes,
                                props: props,
                                ColorTypes: textColorObject
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'PriceStyle',
                                attributes: attributes,
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
                                ColorKey: 'AddToCartColor',
                                attributes: attributes,
                                props: props,
                                ColorTypes: twoColorObject
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'AddToCartStyle',
                                attributes: attributes,
                                props: props,
                            } ),
                        ),
                    attributes.EnableQuickViewLink &&
                        el( PanelBody, 
                            { 
                                title: __( 'Quick View Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'QuickViewColor',
                                attributes: attributes,
                                props: props,
                                ColorTypes: twoColorObject
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'QuickViewStyle',
                                attributes: attributes,
                                props: props,
                            } ),
                        ),
                    attributes.ShowSaleBadge &&
                        el( PanelBody, 
                            { 
                                title: __( 'Sale Label Style', 'wpmozo-product-carousel-for-woocommerce' ),
                                className: "wpmozo-typography-panel",
                                initialOpen: false,
                            },
                            el( WpmozoColorPicker, {
                                ColorKey: 'SaleLabelColor',
                                attributes: attributes,
                                props: props,
                                ColorTypes: twoColorObject
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'SaleLabelStyle',
                                attributes: attributes,
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
                                ColorKey: 'StockLabelColor',
                                attributes: attributes,
                                props: props,
                                ColorTypes: textColorObject
                            }),
                            el( WpmozoTypography, {
                                TypographyKey: 'StockLabelStyle',
                                attributes: attributes,
                                props: props,
                            } ),
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
