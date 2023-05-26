( function(blocks, editor, element, components) {

    const __ = wp.i18n.__;
    const el = element.createElement;
    const registerBlockType = blocks.registerBlockType;
    const { InspectorControls } = editor;
    const { PanelBody, RangeControl, SelectControl, TextControl, FormTokenField } = components;
    const { Fragment, useState } = element;
    const { useSelect } = wp.data;

    var GetOrderByOptions           = wpmozo_block_carousel_object.order_by_options,
        GetAttributes               = wpmozo_block_carousel_object.attributes,
        GetProductViewTypeOptions   = wpmozo_block_carousel_object.product_view_type_options;

    registerBlockType( 'wpmozo/product-carousel', {
        title: __( 'WP Mozo Product Carousel', 'wpmozo-product-carousel-for-woocommerce' ),
        icon: 'products',
        category: 'woocommerce',
        keywords: [ 'wpmozo', 'woocommerce-product-carousel', 'woocommerce', 'carousel' ],
        attributes: GetAttributes,
        edit: (function( props ) {  

            let attributes = props.attributes;

            const { product_cats } = useSelect( ( select ) => {
                const { getEntityRecords } = select( 'core' )
                return {
                    product_cats: getEntityRecords( 'taxonomy', 'product_cat' ),
                }
            } );

            let product_cat_options = [];
            if( product_cats ) {
                product_cat_options = product_cats.map( value => value.name );
            }
            console.log(product_cat_options);

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
                                TextControl,
                                {
                                    key: 'wpmozp-product-carousel-speed',
                                    value: attributes.Speed,
                                    label: __( 'Speed of Animation', 'wpmozo-product-carousel-for-woocommerce' ),
                                    onChange: function( NewSpeed ) {
                                        props.setAttributes( { Speed: NewSpeed } );
                                    },
                                }
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
                            el(
                                SelectControl,
                                {
                                    key: 'wpmozp-product-carousel-order',
                                    label: __('Order', 'wpmozo-product-carousel-for-woocommerce'),
                                    value: attributes.Order,
                                    options: [
                                        {
                                            label: __('Ascending', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'asc'
                                        }, 
                                        {
                                            label: __('Descending', 'wpmozo-product-carousel-for-woocommerce'),
                                            value: 'desc'
                                        }
                                    ],
                                    onChange: function( NewOrder ) {
                                        props.setAttributes( { Order: NewOrder } );
                                    },
                                },
                            ),
                            // el(
                            //     FormTokenField,
                            //     {
                            //         value: selectedTags,
                            //         suggestions: product_cat_options,
                            //         //label: __( 'Columns', 'wpmozo-product-carousel-for-woocommerce' ),
                            //         onChange: ( tokens ) => setSelectedTags( tokens ),
                            //     }
                            // ),
                        ),
                    ),
                )
            ];
        }),
        save: function() {
            return null
        },
    });
})(
    window.wp.blocks,
    window.wp.editor,
    window.wp.element,
    window.wp.components,
);
