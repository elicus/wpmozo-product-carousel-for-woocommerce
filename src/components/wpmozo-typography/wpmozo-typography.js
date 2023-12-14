const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalFontAppearanceControl, FontSizePicker, __experimentalLetterSpacingControl, __experimentalTextTransformControl, __experimentalTextDecorationControl, LineHeightControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem } = window.wp.components;
const { compose }   = wp.compose;
const preAttributes = wpmozo_block_carousel_object.attributes;


const WpmozoTypography = function(args){

	const { TypographyKey, props } = args;
	let TypoTypes                          = args.hasOwnProperty( 'TypoTypes' ) ? args.TypoTypes : null;

	const typoSetValue = function( styleType, value = null ) {

		value = setValue( styleType, value );
		props.setAttributes( {[ TypographyKey+styleType ]: value} );

		if ( args.hasOwnProperty( 'afterOnChange' ) ) {
			args.afterOnChange( props );
		}

	};

	const setValue = function(styleType, value){

		if ( null === value && 'undefined' !== typeof preAttributes[ TypographyKey+styleType ].default ) {
			value = preAttributes[ TypographyKey+styleType ].default;
		}
		value = ( null !== value ) ? value : '';

		return value;

	}

	const onChange = args.hasOwnProperty( 'onChange' ) ? args.onChange : typoSetValue;

	if ( null == TypoTypes || TypoTypes.hasOwnProperty( 'FontAppearance' ) ) {

		var hasFontStyles  = ( args.hasOwnProperty( 'FontAppearance' ) &&
		args.FontAppearance.hasOwnProperty( 'hasFontStyles' ) ) ? args.FontAppearance.hasFontStyles : true;
		var hasFontWeights = ( args.hasOwnProperty( 'FontAppearance' ) &&
		args.FontAppearance.hasOwnProperty( 'hasFontWeights' ) ) ? args.FontAppearance.hasFontWeights : true;

		var _FontAppearanceValues = {};
		if ( hasFontStyles ) {
			_FontAppearanceValues['fontStyle'] = props.attributes[ TypographyKey+'FontAppearance' ].fontStyle;
		}
		if ( hasFontWeights ) {
			_FontAppearanceValues['fontWeight'] = props.attributes[ TypographyKey+'FontAppearance' ].fontWeight;
		}

	}

	return [
		el(
			__experimentalToolsPanel,
			{
				label: __( 'Typography', 'wpmozo-product-carousel-for-woocommerce' ),
				resetAll: () => {
					
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

						let _typo = setValue( type, null );
						props.setAttributes( {[ TypographyKey+type ]: _typo} );
					}
					
					if ( args.hasOwnProperty( 'afterOnChange' ) ) {
						args.afterOnChange( props );
					}
				}
			},
			( null == TypoTypes || TypoTypes.hasOwnProperty( 'FontSize' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						label: __( 'Font Size', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						onDeselect: () => typoSetValue( 'FontSize' ),
					},
					el(
						FontSizePicker,
						{
							value: props.attributes[ TypographyKey+'FontSize' ],
							onChange: (NewFontSize) => onChange( 'FontSize', NewFontSize ),
							__nextHasNoMarginBottom: true,
						}
					),
				),
			( null == TypoTypes || TypoTypes.hasOwnProperty( 'FontAppearance' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						className: "single-column",
						label: __( 'Appearance', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						onDeselect: () => typoSetValue( 'FontAppearance' ),
					},
					el(
						__experimentalFontAppearanceControl,
						{
							key: 'wpmozo-product-carousel-titleapp',
							hasFontStyles: hasFontStyles,
							hasFontWeights: hasFontWeights,
							value: _FontAppearanceValues,
							onChange: (NewFontAppearance) => onChange( 'FontAppearance', NewFontAppearance ),
						}
					),
				),
			( null == TypoTypes || TypoTypes.hasOwnProperty( 'LetterSpacing' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						className: "single-column",
						label: __( 'Letter spacing', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						onDeselect: () => typoSetValue( 'LetterSpacing' ),
					},
					el(
						__experimentalLetterSpacingControl,
						{
							value: props.attributes[ TypographyKey+'LetterSpacing' ],
							onChange: (NewLetterSpacing) => onChange( 'LetterSpacing', NewLetterSpacing ),
						}
					),
				),
			( null == TypoTypes || TypoTypes.hasOwnProperty( 'Decoration' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						label: __( 'Decoration', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						onDeselect: () => typoSetValue( 'Decoration' ),
					},
					el(
						__experimentalTextDecorationControl,
						{
							value: props.attributes[ TypographyKey+'Decoration' ],
							onChange: (NewDecoration) => onChange( 'Decoration', NewDecoration ),
						}
					),
				),
			( null == TypoTypes || TypoTypes.hasOwnProperty( 'LetterCase' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						label: __( 'Letter case', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						onDeselect: () => typoSetValue( 'LetterCase' ),
					},
					el(
						__experimentalTextTransformControl,
						{
							value: props.attributes[ TypographyKey+'LetterCase' ],
							onChange: (NewLetterCase) => onChange( 'LetterCase', NewLetterCase ),
						}
					),
				),
			( null == TypoTypes || TypoTypes.hasOwnProperty( 'LineHeight' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						className: "single-column",
						label: __( 'Line Height', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						onDeselect: () => typoSetValue( 'LineHeight' ),
					},
					el(
						LineHeightControl,
						{
							value: props.attributes[ TypographyKey+'LineHeight' ],
							onChange: (NewLineHeight) => onChange( 'LineHeight', NewLineHeight ),
							__nextHasNoMarginBottom: true,
						}
					),
				),
		),
	];

}

export default compose()( WpmozoTypography );
