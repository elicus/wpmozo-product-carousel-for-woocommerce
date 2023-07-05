
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalToolsPanel, __experimentalToolsPanelItem, __experimentalUnitControl } = window.wp.components;


const WpmozoSize = function(args){
	
    const { SizeKey, attributes, props } = args;
    const _size = attributes[SizeKey];
    const SizeTypes = args.hasOwnProperty('SizeTypes') ? args.SizeTypes : null;

    const sizeSetValue = function( Type, value = null ) {
        let _size = Object.assign({}, attributes[SizeKey]);
        _size[Type] = ( null !== value ) ? value : '';
        props.setAttributes( {[SizeKey]: _size} );
    };

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Size', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    let _Size = Object.assign({}, attributes[SizeKey]);
                    if ( null === SizeTypes ) {
                        _Size.width = '';
                        _Size.height = '';
                    }else{
                        Object.keys(SizeTypes).map(type => _Size[type] = '');
                    }
                    props.setAttributes( {[SizeKey]: _Size} );
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
                        value: attributes[SizeKey].width,
                        onChange: function( NewWidth ) {
                            sizeSetValue('width', NewWidth);
                        },
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
                        value: attributes[SizeKey].height,
                        onChange: function( NewHeight ) {
                            sizeSetValue('height', NewHeight);
                        },
                    }),
                ),
        ),
	];

}

export default WpmozoSize;