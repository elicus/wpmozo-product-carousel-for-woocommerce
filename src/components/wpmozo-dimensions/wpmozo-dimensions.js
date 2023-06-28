
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalSpacingSizesControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem } = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;


const WpmozoDimensions = function(args){
	
    const { DimensionKey, DimensionsTypes, attributes, props } = args;
    const _dimensions = attributes[DimensionKey];

    const dimensionsSetValue = function( styleType, value = null ) {
        let _dimensions = Object.assign({}, attributes[DimensionKey]);
        if ( null == value && 'undefined' !== typeof preAttributes[DimensionKey].default[styleType] ) {
            value = preAttributes[DimensionKey].default[styleType];
        }
        _dimensions[styleType] = ( null !== value ) ? value : '';
        props.setAttributes( {[DimensionKey]: _dimensions} );
    };

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Dimensions', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    let dimensions = preAttributes[DimensionKey].default;
                    props.setAttributes( {[DimensionKey]: dimensions} );
                }
            },
            DimensionsTypes.padding &&
                el( __experimentalToolsPanelItem, 
                    {
                        label: __('Padding', 'wpmozo-product-carousel-for-woocommerce'),
                        hasValue: () => true,
                        isShownByDefault: true,
                        className: 'tools-panel-item-spacing', 
                        onDeselect: () => dimensionsSetValue('padding'),                                    
                    }, 
                    el(__experimentalSpacingSizesControl, {
                        label: 'Padding',
                        values: attributes[DimensionKey].padding,
                        onChange: function( NewPadding ) {
                            dimensionsSetValue('padding', NewPadding);
                        },
                    }),
                ),
            DimensionsTypes.margin &&
                el( __experimentalToolsPanelItem, 
                    {
                        label: __('Margin', 'wpmozo-product-carousel-for-woocommerce'),
                        hasValue: () => true,
                        isShownByDefault: true,
                        className: 'tools-panel-item-spacing', 
                        onDeselect: () => dimensionsSetValue('margin'),                                    
                    }, 
                    el(__experimentalSpacingSizesControl, {
                        label: 'Margin',
                        values: attributes[DimensionKey].margin,
                        onChange: function( NewMargin ) {
                            dimensionsSetValue('margin', NewMargin);
                        },
                    }),
                ),
        ),
	];

}

export default WpmozoDimensions;