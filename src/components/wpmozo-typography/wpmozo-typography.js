
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalFontAppearanceControl, FontSizePicker, __experimentalLetterSpacingControl, __experimentalTextTransformControl, __experimentalTextDecorationControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem } = window.wp.components;
const { compose } = wp.compose;


const WpmozoTypography = function(args){
	
    const { TypographyKey, attributes, props } = args;

    const typoSetValue = function( styleType, value = null ) {
        let _Typography = Object.assign({}, attributes[TypographyKey]);
        _Typography[styleType] = ( null !== value ) ? value : '';
        props.setAttributes( {[TypographyKey]: _Typography} );
    };

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Typography', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    let _Typography = {
                        FontSize: '',
                        LetterSpacing: '',
                        Decoration: '',
                        FontAppearance: {
                            fontStyle: '',
                            fontWeight: '',
                        }
                    }
                    props.setAttributes( {[TypographyKey]: _Typography} );
                }
            },
            el( __experimentalToolsPanelItem, 
                {
                    label: __( 'Font Size', 'wpmozo-product-carousel-for-woocommerce' ),
                    hasValue: () => true,
                    isShownByDefault: true, 
                    onDeselect: () => typoSetValue('FontSize'),                                    
                }, 
                el( FontSizePicker,
                    {
                        value: attributes[TypographyKey].FontSize,
                        onChange: (NewFontSize) => { typoSetValue('FontSize', NewFontSize) },
                    }
                ),
            ),
            el( __experimentalToolsPanelItem, 
                { 
                    className: "single-column",
                    label: __( 'Appearance', 'wpmozo-product-carousel-for-woocommerce' ),
                    hasValue: () => true,
                    isShownByDefault: true,
                    onDeselect: () => typoSetValue('FontAppearance', {fontStyle: '', fontWeight: ''}),                                        
                },
                el( __experimentalFontAppearanceControl, 
                    {
                        key: 'wpmozp-product-carousel-titleapp',
                        value: {
                          fontStyle: attributes[TypographyKey].FontAppearance.fontStyle,
                          fontWeight: attributes[TypographyKey].FontAppearance.fontWeight
                        },
                        onChange: (NewFontAppearance) => { typoSetValue('FontAppearance', NewFontAppearance) },
                    } 
                ),
            ),
            el( __experimentalToolsPanelItem, 
                { 
                    className: "single-column",
                    label: __( 'Letter spacing', 'wpmozo-product-carousel-for-woocommerce' ),
                    hasValue: () => true,
                    isShownByDefault: true,
                    onDeselect: () => typoSetValue('LetterSpacing'),                                       
                },
                el( __experimentalLetterSpacingControl, 
                    {
                        value: attributes[TypographyKey].LetterSpacing,
                        onChange: (NewLetterSpacing) => { typoSetValue('LetterSpacing', NewLetterSpacing) },
                    } 
                ),
            ),
            el( __experimentalToolsPanelItem,
                { 
                    label: __( 'Decoration', 'wpmozo-product-carousel-for-woocommerce' ),
                    hasValue: () => true,
                    isShownByDefault: true,
                    onDeselect: () => typoSetValue('Decoration'),                                    
                }, 
                el( __experimentalTextDecorationControl,
                    {
                        value: attributes[TypographyKey].Decoration,
                        onChange: (NewDecoration) => { typoSetValue('Decoration', NewDecoration) },
                    }
                ),
            ),
            el( __experimentalToolsPanelItem,
                { 
                    label: __( 'Letter case', 'wpmozo-product-carousel-for-woocommerce' ),
                    hasValue: () => true,
                    isShownByDefault: true,
                    onDeselect: () => typoSetValue('LetterCase'),                                       
                }, 
                el( __experimentalTextTransformControl,
                    {
                        value: attributes[TypographyKey].LetterCase,
                        onChange: (NewLetterCase) => { typoSetValue('LetterCase', NewLetterCase) },
                    }
                ),
            ),
        ),
	];

}

export default compose()( WpmozoTypography );