
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalToolsPanel, __experimentalToolsPanelItem, __experimentalUnitControl } = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;

const WpmozoSize = function(args){
	
    const { SizeKey, values, props } = args;
    let SizeTypes = args.hasOwnProperty('SizeTypes') ? args.SizeTypes : null;

    let depth = args.hasOwnProperty('depth') ? args.depth : [],
        AttrKey = args.hasOwnProperty('AttrKey') ? args.AttrKey : 'StyleAtts',
        theAtts = Object.assign({}, props.attributes[AttrKey]);

    const sizeSetValue = function( styleType, value = null ) {
       
        let _size = setValue(styleType, value);
        props.setAttributes( {[AttrKey]: theAtts} );

        if ( args.hasOwnProperty('afterOnChange') ) {
            args.afterOnChange( props );
        }

    };

    const setValue = function(styleType, value){

        let _size = null;
        if ( null === value && depth.length < 1 && 'undefined' !== typeof preAttributes[AttrKey][SizeKey][styleType].default ) {
            value = preAttributes[AttrKey][SizeKey][styleType].default;
        }

        if ( Array.isArray(depth) && depth.length ) {
            let lastEl = null,
                lastPreEl = null;
            for (var i = 0; i < depth.length; i++) {
                lastEl = theAtts[depth[i]];
                lastPreEl = preAttributes[AttrKey][depth[i]];
            }
            _size = lastEl[SizeKey];
            if ( null == value && 'undefined' !== typeof lastPreEl[SizeKey][styleType] ) {
                value = lastPreEl[SizeKey][styleType].default;
            }
            _size[styleType] = ( null !== value ) ? value : '';
        }else{
            _size = theAtts[SizeKey];
            _size[styleType] = ( null !== value ) ? value : '';
        }

        return _size;

    }

    const onChange = args.hasOwnProperty('onChange') ? args.onChange : sizeSetValue;

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Size', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    
                    if ( null === SizeTypes ) {
                        SizeTypes = {
                            'width': '',
                            'height': '',
                        }
                    }
                    for (const type in SizeTypes) {
                        setValue(type, null);
                    }
                    props.setAttributes( {[AttrKey]: theAtts} );

                    if ( args.hasOwnProperty('afterOnChange') ) {
                        args.afterOnChange( props );
                    }
                }
            },
            ( null == SizeTypes || SizeTypes.hasOwnProperty('width') ) &&
                el( __experimentalToolsPanelItem, 
                    {
                        label: __('Width', 'wpmozo-product-carousel-for-woocommerce'),
                        hasValue: () => true,
                        isShownByDefault: true,
                        onDeselect: () => sizeSetValue('width'),                                    
                    }, 
                    el(__experimentalUnitControl, {
                        label: 'Width',
                        labelPosition: 'side',
                        value: values.width,
                        onChange: ( NewWidth ) => onChange('width', NewWidth),
                    }),
                ),
            ( null == SizeTypes || SizeTypes.hasOwnProperty('height') ) &&
                el( __experimentalToolsPanelItem, 
                    {
                        label: __('Height', 'wpmozo-product-carousel-for-woocommerce'),
                        hasValue: () => true,
                        isShownByDefault: true,
                        onDeselect: () => sizeSetValue('height'),                                    
                    }, 
                    el(__experimentalUnitControl, {
                        label: 'Height',
                        labelPosition: 'side',
                        value: values.height,
                        onChange: ( NewHeight ) => onChange('height', NewHeight),
                    }),
                ),
        ),
	];

}

export default WpmozoSize;