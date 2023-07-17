
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalSpacingSizesControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem } = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;


const WpmozoDimensions = function(args){
	
    const { DimensionKey, props, values } = args;
    let DimensionsTypes = args.hasOwnProperty('DimensionsTypes') ? args.DimensionsTypes : null;
    const label = args.hasOwnProperty('label') ? args.label : __( 'Dimensions', 'wpmozo-product-carousel-for-woocommerce' );
    let depth = args.hasOwnProperty('depth') ? args.depth : [],
        AttrKey = args.hasOwnProperty('AttrKey') ? args.AttrKey : 'StyleAtts',
        theAtts = Object.assign({}, props.attributes[AttrKey]);

    const dimensionsSetValue = function( styleType, value = null ) {
       
        let _dimensions = setValue(styleType, value);
        props.setAttributes( {[AttrKey]: theAtts} );

        if ( args.hasOwnProperty('afterOnChange') ) {
            args.afterOnChange( props );
        }

    };

    const setValue = function(styleType, value){

        let _dimensions = null;
        if ( null === value && depth.length < 1 && 'undefined' !== typeof preAttributes[AttrKey][DimensionKey][styleType].default ) {
            value = preAttributes[AttrKey][DimensionKey][styleType].default;
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
            _dimensions = lastEl[DimensionKey];
            if ( null == value && 'undefined' !== typeof lastPreEl[DimensionKey][styleType] ) {
                value = lastPreEl[DimensionKey][styleType].default;
            }
            _dimensions[styleType] = ( null !== value ) ? value : '';
        }else{
            _dimensions = theAtts[DimensionKey];
            _dimensions[styleType] = ( null !== value ) ? value : '';
        }

        return _dimensions;

    }

    const onChange = args.hasOwnProperty('onChange') ? args.onChange : dimensionsSetValue;

	return [
        el( __experimentalToolsPanel,
            { 
                label: label,
                resetAll: () => {
                    let theAtts = Object.assign({}, props.attributes[AttrKey]);
                    if ( null === DimensionsTypes ) {
                        DimensionsTypes = {
                            'padding': '',
                            'margin': '',
                            'position': '',
                        }
                    }
                    for (const type in DimensionsTypes) {

                        setValue(type, null);
                    }
                    props.setAttributes( {[AttrKey]: theAtts} );

                    if ( args.hasOwnProperty('afterOnChange') ) {
                        args.afterOnChange( props );
                    }
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
                        values: values.padding,
                        onChange: ( NewPadding ) => onChange('padding', NewPadding),
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
                        values: values.margin,
                        onChange: ( NewMargin ) => onChange('margin', NewMargin),
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
                        values: values.position,
                        onChange: ( NewPosition ) => onChange('position', NewPosition),
                    }),
                ),
        ),
	];

}

export default WpmozoDimensions;