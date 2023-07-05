
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalBorderRadiusControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem, __experimentalBorderBoxControl } = window.wp.components;


const WpmozoBorder = function(args){
	
    const { BorderKey, attributes, props } = args;
    const _border = attributes[BorderKey];
    const BorderTypes = args.hasOwnProperty('BorderTypes') ? args.BorderTypes : null;

    const borderSetValue = function( Type, value = null ) {
        let _border = Object.assign({}, attributes[BorderKey]);
        _border[Type] = ( null !== value ) ? value : '';
        props.setAttributes( {[BorderKey]: _border} );
    };

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Border', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    let _Border = Object.assign({}, attributes[BorderKey]);
                    if ( null === BorderTypes ) {
                        _Border.border = '';
                        _Border.borderRadius = '';
                    }else{
                        Object.keys(BorderTypes).map(type => _Border[type] = '');
                    }
                    props.setAttributes( {[BorderKey]: _Border} );
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
                        value: attributes[BorderKey].border,
                        onChange: function( NewBorder ) {
                            borderSetValue('border', NewBorder);
                        },
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
                        values: attributes[BorderKey].borderRadius,
                        onChange: function( NewRadius ) {
                            borderSetValue('borderRadius', NewRadius);
                        },
                    }),
                ),
        ),
	];

}

export default WpmozoBorder;