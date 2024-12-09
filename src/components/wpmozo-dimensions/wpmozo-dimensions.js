const el                                    = window.wp.element.createElement;
const __                                    = wp.i18n.__;
const { __experimentalSpacingSizesControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem } = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;


const WpmozoDimensions = function(args){

	const { DimensionKey, props } = args;
	let DimensionsTypes           = args.hasOwnProperty( 'DimensionsTypes' ) ? args.DimensionsTypes : null;
	const label                   = args.hasOwnProperty( 'label' ) ? args.label : __( 'Dimensions', 'wpmozo-product-carousel-for-woocommerce' );

	const dimensionsSetValue = function( styleType, value = null ) {

		value = setValue( styleType, value );
		props.setAttributes( {[ DimensionKey + styleType ]: value} );

		if ( args.hasOwnProperty( 'afterOnChange' ) ) {
			args.afterOnChange( props );
		}

	};

	const setValue = function(styleType, value){

		if ( null === value && 'undefined' !== typeof preAttributes[ DimensionKey + styleType ].default ) {
			value = preAttributes[ DimensionKey + styleType ].default;
		}
		value = ( null !== value ) ? value : '';

		return value;

	}

	const onChange = args.hasOwnProperty( 'onChange' ) ? args.onChange : dimensionsSetValue;

	return [
		el(
			__experimentalToolsPanel,
			{
				label: label,
				resetAll: () => {
					if ( null === DimensionsTypes ) {
						DimensionsTypes = {
							'padding': '',
							'margin': '',
							'position': '',
						}
					}
					for (const type in DimensionsTypes) {
						let value = setValue( type, null );
						props.setAttributes( {[ DimensionKey + type ]: value} );
					}

					if ( args.hasOwnProperty( 'afterOnChange' ) ) {
						args.afterOnChange( props );
					}
				}
			},
			( null == DimensionsTypes || DimensionsTypes.hasOwnProperty( 'padding' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						label: __( 'Padding', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						className: 'tools-panel-item-spacing',
						onDeselect: () => dimensionsSetValue( 'padding' ),
					},
					el(
						__experimentalSpacingSizesControl,
						{
							label: 'Padding',
							values: props.attributes[ DimensionKey + 'padding' ],
							onChange: ( NewPadding ) => onChange( 'padding', NewPadding ),
						}
					),
				),
			( null == DimensionsTypes || DimensionsTypes.hasOwnProperty( 'margin' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						label: __( 'Margin', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						className: 'tools-panel-item-spacing',
						onDeselect: () => dimensionsSetValue( 'margin' ),
					},
					el(
						__experimentalSpacingSizesControl,
						{
							label: 'Margin',
							values: props.attributes[ DimensionKey + 'margin' ],
							onChange: ( NewMargin ) => onChange( 'margin', NewMargin ),
						}
					),
				),
			( null == DimensionsTypes || DimensionsTypes.hasOwnProperty( 'position' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						label: __( 'Position', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						className: 'tools-panel-item-spacing',
						onDeselect: () => dimensionsSetValue( 'position' ),
					},
					el(
						__experimentalSpacingSizesControl,
						{
							label: 'Position',
							values: props.attributes[ DimensionKey + 'position' ],
							onChange: ( NewPosition ) => onChange( 'position', NewPosition ),
						}
					),
				),
		),
	];

}

export default WpmozoDimensions;
