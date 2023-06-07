
( function(blocks, editor, element, components) {

    const __ = wp.i18n.__;
    const el = element.createElement;
    const registerBlockType = blocks.registerBlockType;
    const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = editor;
    const { PanelBody, RangeControl, SelectControl, TextControl, FormTokenField, ToggleControl, Button, Spinner } = components;
    const { Fragment, useState, useEffect } = element;
    const { useSelect, useDispatch, dispatch } = wp.data;
    const { serverSideRender: ServerSideRender, hooks } = wp;

    var GetOrderByOptions           = wpmozo_block_carousel_object.order_by_options,
        GetAttributes               = wpmozo_block_carousel_object.attributes,
        GetProductViewTypeOptions   = wpmozo_block_carousel_object.product_view_type_options,
        AllSizes                    = wpmozo_block_carousel_object.all_sizes,
        AllBadgeTypes               = wpmozo_block_carousel_object.all_badge_types,
        AllLayouts                  = wpmozo_block_carousel_object.all_layouts;

    const initializeSwiper = ( attributes ) => {
        var sw_obj = {
            slidesPerView: attributes.Columns,
            spaceBetween: attributes.SpaceBetween,
            loop: attributes.Loop,
            swipeHandler: 'li.product',
            on: {
                tap: function(swiper, event){
                    dispatch( 'core/block-editor' ).selectBlock( attributes.clientId );
                }
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

        let selector = 'wpmozo_'+attributes.clientId;

        let _swiper = new Swiper('#'+selector, sw_obj);
    };

    hooks.addAction( 'server-side-loading-finished', 'function_name', initializeSwiper );

    const TriggerWhenLoadingFinished = (attributes) => {
        return ({ children, showLoader }) => {
            useEffect(() => {
              return () => {
                hooks.doAction("server-side-loading-finished", attributes);
              };
            });
            return el( Fragment, {}, 
                el("div", {
                        style: {
                            position: "relative",
                        },
                    },
                    showLoader &&
                        el("div", {
                            style: {
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                marginTop: "-9px",
                                marginLeft: "-9px"
                            },
                        },
                        el(Spinner, {})
                        ),
                    el("div", {
                            style: {
                                opacity: showLoader ? "0.3" : 1
                            },
                        },
                        children
                    ),
                ),
            );
        };
    };

    registerBlockType( 'wpmozo/product-carousel', {
        title: __( 'WPMozo Product Carousel', 'wpmozo-product-carousel-for-woocommerce' ),
        icon: 'products',
        category: 'woocommerce',
        keywords: [ 'wpmozo', 'woocommerce-product-carousel', 'woocommerce', 'carousel' ],
        attributes: GetAttributes,
        example: {},
        edit: (function( props ) {  

            let attributes = props.attributes;
            props.setAttributes( { clientId: props.clientId } );

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
            
            return [
                el( Fragment, {},
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
                        el( PanelBody, { title: __( 'Query Settings', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: true },
                            el(
                                SelectControl,
                                {
                                    key: 'wpmozp-product-carousel-orderby',
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
                            'sale' !== attributes.ProductViewType && 'best_selling' !== attributes.ProductViewType && 'top_rated' !== attributes.ProductViewType &&
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
                            'sale' !== attributes.ProductViewType && 'best_selling' !== attributes.ProductViewType && 'top_rated' !== attributes.ProductViewType &&
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
                        el( PanelBody, { title: __( 'Display Settings', 'wpmozo-product-carousel-for-woocommerce' ), initialOpen: true },
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
                            attributes.EnableQuickViewLink &&
                            el(MediaUploadCheck, {}, 
                                el(MediaUpload, {
                                    onSelect: (media) => props.setAttributes( { QuickViewLinkIcon: media.url } ),
                                    allowedTypes: ["image"],
                                    accept: "image/*",
                                    value: attributes.QuickViewLinkIcon,
                                    render: ({ open }) => {
                                        return el(Fragment, {},
                                            el('div', {
                                                class: "components-base-control wpmozo-quvili-icon-wrap",
                                                children: [
                                                    attributes.QuickViewLinkIcon &&
                                                    el('img',
                                                      {
                                                        class: "wpmozo-quvili-icon",
                                                        src: attributes.QuickViewLinkIcon,
                                                      },
                                                    ),
                                                    el(Button, {
                                                      isPrimary: true,
                                                      onClick: (event) => {
                                                        event.stopPropagation();
                                                        open();
                                                      },
                                                      children:
                                                        attributes.QuickViewLinkIcon
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
                ),
                el(
                    ServerSideRender,
                    {
                        block: 'wpmozo/product-carousel',
                        attributes: attributes,
                        LoadingResponsePlaceholder: TriggerWhenLoadingFinished( attributes ),
                    },
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
