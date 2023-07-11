
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalFontAppearanceControl, FontSizePicker, __experimentalLetterSpacingControl, __experimentalTextTransformControl, __experimentalTextDecorationControl, LineHeightControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem } = window.wp.components;
const { compose } = wp.compose;
const preAttributes = wpmozo_block_carousel_object.attributes;


const WpmozoTypography = function(args){
	
    const { TypographyKey, props, values } = args;
    let TypoTypes = args.hasOwnProperty('TypoTypes') ? args.TypoTypes : null;
    let depth = args.hasOwnProperty('depth') ? args.depth : [],
        AttrKey = args.hasOwnProperty('AttrKey') ? args.AttrKey : 'StyleAtts',
        theAtts = Object.assign({}, props.attributes[AttrKey]);

    const typoSetValue = function( styleType, value = null ) {
       
        let _typo = setValue(styleType, value);
        props.setAttributes( {[AttrKey]: theAtts} );

        if ( args.hasOwnProperty('afterOnChange') ) {
            args.afterOnChange( props );
        }

    };

    const setValue = function(styleType, value){

        let _typo = null;
        if ( null === value && depth.length < 1 && 'undefined' !== typeof preAttributes[AttrKey][TypographyKey][styleType].default ) {
            value = preAttributes[AttrKey][TypographyKey][styleType].default;
        }

        if ( Array.isArray(depth) && depth.length ) {
            let lastEl = null,
                lastPreEl = null;
            for (var i = 0; i < depth.length; i++) {
                lastEl = theAtts[depth[i]];
                lastPreEl = preAttributes[AttrKey][depth[i]];
            }
            _typo = lastEl[TypographyKey];
            if ( null == value && 'undefined' !== typeof lastPreEl[TypographyKey][styleType] ) {
                value = lastPreEl[TypographyKey][styleType].default;
            }
            _typo[styleType] = ( null !== value ) ? value : '';
        }else{
            _typo = theAtts[TypographyKey];
            _typo[styleType] = ( null !== value ) ? value : '';
        }

        return _typo;

    }

    const onChange = args.hasOwnProperty('onChange') ? args.onChange : typoSetValue;

    if ( null == TypoTypes || TypoTypes.hasOwnProperty('FontAppearance') ) {

        var hasFontStyles = ( args.hasOwnProperty('FontAppearance') && 
        args.FontAppearance.hasOwnProperty('hasFontStyles') ) ? args.FontAppearance.hasFontStyles : true;
        var hasFontWeights = ( args.hasOwnProperty('FontAppearance') && 
        args.FontAppearance.hasOwnProperty('hasFontWeights') ) ? args.FontAppearance.hasFontWeights : true;

        var _FontAppearanceValues = {};
        if ( hasFontStyles ) {
            _FontAppearanceValues['fontStyle'] = values.FontAppearance.fontStyle;
        }
        if ( hasFontWeights ) {
            _FontAppearanceValues['fontWeight'] = values.FontAppearance.fontWeight;
        }

    }
    

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Typography', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    let theAtts = Object.assign({}, props.attributes[AttrKey]);
                    if ( null === TypoTypes ) {
                        TypoTypes = {
                            'FontSize': '',
                            'LetterSpacing': '',
                            'Decoration': '',
                            'FontAppearance': {
                                'fontStyle': '',
                                'fontWeight': '',
                            },
                            'LetterCase': '',
                            'LineHeight': '',
                        };
                    }
                    for (const type in TypoTypes) {

                        let _typo = setValue(type, null);
                    }
                    props.setAttributes( {[AttrKey]: theAtts} );
                    if ( args.hasOwnProperty('afterOnChange') ) {
                        args.afterOnChange( props );
                    }
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
                            value: values.FontSize,
                            onChange: (NewFontSize) => onChange('FontSize', NewFontSize),
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
                            onChange: (NewFontAppearance) => onChange('FontAppearance', NewFontAppearance),
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
                            value: values.LetterSpacing,
                            onChange: (NewLetterSpacing) => onChange('LetterSpacing', NewLetterSpacing),
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
                            value: values.Decoration,
                            onChange: (NewDecoration) => onChange('Decoration', NewDecoration),
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
                            value: values.LetterCase,
                            onChange: (NewLetterCase) => onChange('LetterCase', NewLetterCase),
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
                            value: values.LineHeight,
                            onChange: (NewLineHeight) => onChange('LineHeight', NewLineHeight),
                            __nextHasNoMarginBottom: true,
                        }
                    ),
                ),
        ),
	];

}

export default compose()( WpmozoTypography );