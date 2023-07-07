
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalFontAppearanceControl, FontSizePicker, __experimentalLetterSpacingControl, __experimentalTextTransformControl, __experimentalTextDecorationControl, LineHeightControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem } = window.wp.components;
const { compose } = wp.compose;


const WpmozoTypography = function(args){
	
    const { TypographyKey, attributes, props } = args;
    const TypoTypes = args.hasOwnProperty('TypoTypes') ? args.TypoTypes : null;

    const typoSetValue = function( styleType, value = null ) {
        let _Typography = Object.assign({}, attributes[TypographyKey]);
        _Typography[styleType] = ( null !== value ) ? value : '';
        props.setAttributes( {[TypographyKey]: _Typography} );
    };

    if ( null == TypoTypes || TypoTypes.hasOwnProperty('FontAppearance') ) {

        var hasFontStyles = ( args.hasOwnProperty('FontAppearance') && 
        args.FontAppearance.hasOwnProperty('hasFontStyles') ) ? args.FontAppearance.hasFontStyles : true;
        var hasFontWeights = ( args.hasOwnProperty('FontAppearance') && 
        args.FontAppearance.hasOwnProperty('hasFontWeights') ) ? args.FontAppearance.hasFontWeights : true;

        var _FontAppearanceValues = {};
        if ( hasFontStyles ) {
            _FontAppearanceValues['fontStyle'] = attributes[TypographyKey].FontAppearance.fontStyle;
        }
        if ( hasFontWeights ) {
            _FontAppearanceValues['fontWeight'] = attributes[TypographyKey].FontAppearance.fontWeight;
        }

    }
    

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Typography', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    let _Typography = Object.assign({}, attributes[TypographyKey]);
                    if ( null === TypoTypes ) {
                        let TypographyTypes = {
                            FontSize: '',
                            LetterSpacing: '',
                            Decoration: '',
                            FontAppearance: {
                                fontStyle: '',
                                fontWeight: '',
                            },
                            LetterCase: '',
                            LineHeight: '',
                        }
                        Object.keys(TypographyTypes).map(type => _Typography[type] = '');
                    }else{
                        Object.keys(TypoTypes).map(type => _Typography[type] = '');
                    }
                    props.setAttributes( {[TypographyKey]: _Typography} );
                }
            },
            ( null == TypoTypes || TypoTypes.hasOwnProperty('FontSize') ) &&
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
                            __nextHasNoMarginBottom: true,
                        }
                    ),
                ),
            ( null == TypoTypes || TypoTypes.hasOwnProperty('FontAppearance') ) &&
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
                            hasFontStyles: hasFontStyles,
                            hasFontWeights: hasFontWeights,
                            value: _FontAppearanceValues,
                            onChange: (NewFontAppearance) => { typoSetValue('FontAppearance', NewFontAppearance) },
                        } 
                    ),
                ),
            ( null == TypoTypes || TypoTypes.hasOwnProperty('LetterSpacing') ) &&
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
            ( null == TypoTypes || TypoTypes.hasOwnProperty('Decoration') ) &&
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
            ( null == TypoTypes || TypoTypes.hasOwnProperty('LetterCase') ) &&
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
            ( null == TypoTypes || TypoTypes.hasOwnProperty('LineHeight') ) &&
                el( __experimentalToolsPanelItem, 
                    { 
                        className: "single-column",
                        label: __( 'Line Height', 'wpmozo-product-carousel-for-woocommerce' ),
                        hasValue: () => true,
                        isShownByDefault: true,
                        onDeselect: () => typoSetValue('LineHeight'),                                       
                    },
                    el( LineHeightControl, 
                        {
                            value: attributes[TypographyKey].LineHeight,
                            onChange: (NewLineHeight) => { typoSetValue('LineHeight', NewLineHeight) },
                            __nextHasNoMarginBottom: true,
                        }
                    ),
                ),
        ),
	];

}

export default compose()( WpmozoTypography );