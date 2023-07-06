
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalSpacingSizesControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem } = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;


const WpmozoDimensions = function(args){
	
    const { DimensionKey, attributes, props } = args;
    const _dimensions = attributes[DimensionKey];
    const DimensionsTypes = args.hasOwnProperty('DimensionsTypes') ? args.DimensionsTypes : null;
    const label = ( args.hasOwnProperty('label') ) ? args.label : __( 'Dimensions', 'wpmozo-product-carousel-for-woocommerce' );

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
                label: label,
                resetAll: () => {
                    let dimensions = preAttributes[DimensionKey].default;
                    props.setAttributes( {[DimensionKey]: dimensions} );
                }
            },
            ( null == DimensionsTypes || DimensionsTypes.hasOwnProperty('padding') ) &&
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
            ( null == DimensionsTypes || DimensionsTypes.hasOwnProperty('margin') ) &&
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
            ( null == DimensionsTypes || DimensionsTypes.hasOwnProperty('position') ) &&
                el( __experimentalToolsPanelItem, 
                    {
                        label: __('Position', 'wpmozo-product-carousel-for-woocommerce'),
                        hasValue: () => true,
                        isShownByDefault: true,
                        className: 'tools-panel-item-spacing', 
                        onDeselect: () => dimensionsSetValue('position'),                                    
                    }, 
                    el(__experimentalSpacingSizesControl, {
                        label: 'Position',
                        values: attributes[DimensionKey].position,
                        onChange: function( NewPosition ) {
                            dimensionsSetValue('position', NewPosition);
                        },
                    }),
                ),
        ),
	];

}

export default WpmozoDimensions;