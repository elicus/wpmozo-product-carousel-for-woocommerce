
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalBorderRadiusControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem, __experimentalBorderBoxControl } = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;

const WpmozoBorder = function(args){
	
    const { BorderKey, values, props } = args;
    let BorderTypes = args.hasOwnProperty('BorderTypes') ? args.BorderTypes : null;

    let depth = args.hasOwnProperty('depth') ? args.depth : [],
        AttrKey = args.hasOwnProperty('AttrKey') ? args.AttrKey : 'StyleAtts',
        theAtts = Object.assign({}, props.attributes[AttrKey]);

    const borderSetValue = function( styleType, value = null ) {
       
        let _border = setValue(styleType, value);
        props.setAttributes( {[AttrKey]: theAtts} );

        if ( args.hasOwnProperty('afterOnChange') ) {
            args.afterOnChange( props );
        }

    };

    const setValue = function(styleType, value){

        let _border = null;
        if ( null === value && depth.length < 1 && 'undefined' !== typeof preAttributes[AttrKey][BorderKey][styleType].default ) {
            value = preAttributes[AttrKey][BorderKey][styleType].default;
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
            _border = lastEl[BorderKey];
            if ( null == value && 'undefined' !== typeof lastPreEl[BorderKey][styleType] ) {
                value = lastPreEl[BorderKey][styleType].default;
            }
            _border[styleType] = ( null !== value ) ? value : '';
        }else{
            _border = theAtts[BorderKey];
            _border[styleType] = ( null !== value ) ? value : '';
        }

        return _border;

    }

    const onChange = args.hasOwnProperty('onChange') ? args.onChange : borderSetValue;

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Border', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    
                    if ( null === BorderTypes ) {
                        BorderTypes = {
                            'border': '',
                            'borderRadius': '',
                        }
                    }
                    for (const type in BorderTypes) {
                        setValue(type, null);
                    }
                    props.setAttributes( {[AttrKey]: theAtts} );

                    if ( args.hasOwnProperty('afterOnChange') ) {
                        args.afterOnChange( props );
                    }

                }
            },
            ( null == BorderTypes || BorderTypes.hasOwnProperty('border') ) &&
                el( __experimentalToolsPanelItem, 
                    {
                        label: __('Border', 'wpmozo-product-carousel-for-woocommerce'),
                        hasValue: () => true,
                        isShownByDefault: true,
                        onDeselect: () => borderSetValue('border'),                                    
                    }, 
                    el(__experimentalBorderBoxControl, {
                        label: 'Border',
                        value: values.border,
                        onChange: ( NewBorder ) => onChange('border', NewBorder),
                    }),
                ),
            ( null == BorderTypes || BorderTypes.hasOwnProperty('radius') ) &&
                el( __experimentalToolsPanelItem, 
                    {
                        label: __('Radius', 'wpmozo-product-carousel-for-woocommerce'),
                        hasValue: () => true,
                        isShownByDefault: true,
                        onDeselect: () => borderSetValue('borderRadius'),                                    
                    }, 
                    el(__experimentalBorderRadiusControl, {
                        label: 'Radius',
                        values: values.borderRadius,
                        onChange: ( NewRadius ) => onChange('borderRadius', NewRadius),
                    }),
                ),
        ),
	];

}

export default WpmozoBorder;