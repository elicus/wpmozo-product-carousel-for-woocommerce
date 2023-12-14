const el                                    = window.wp.element.createElement;
const __                                    = wp.i18n.__;
const { __experimentalBorderRadiusControl } = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem, __experimentalBorderBoxControl } = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;

const WpmozoBorder = function(args){

	const { BorderKey, props } = args;
	let BorderTypes                    = args.hasOwnProperty( 'BorderTypes' ) ? args.BorderTypes : null;

	const borderSetValue = function( styleType, value = '' ) {

		value = setValue( styleType, value );
		props.setAttributes( {[ BorderKey+styleType ]: value} );

		if ( args.hasOwnProperty( 'afterOnChange' ) ) {
			args.afterOnChange( props );
		}

	};

	const setValue = function(styleType, value){

		if ( null === value && 'undefined' !== typeof preAttributes[ BorderKey+styleType ].default ) {
			value = preAttributes[ BorderKey+styleType ].default;
		}
		value = ( null !== value ) ? value : '';

		return value;

	}

	const onChange = args.hasOwnProperty( 'onChange' ) ? args.onChange : borderSetValue;

	return [
		el(
			__experimentalToolsPanel,
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
						let value = setValue( type, null );
						props.setAttributes( {[ BorderKey+type ]: value} );
					}

					if ( args.hasOwnProperty( 'afterOnChange' ) ) {
						args.afterOnChange( props );
					}

				}
			},
			( null == BorderTypes || BorderTypes.hasOwnProperty( 'border' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						label: __( 'Border', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						onDeselect: () => borderSetValue( 'border' ),
					},
					el(
						__experimentalBorderBoxControl,
						{
							label: 'Border',
							value: props.attributes[ BorderKey+'border' ],
							onChange: ( NewBorder ) => onChange( 'border', NewBorder ),
						}
					),
				),
			( null == BorderTypes || BorderTypes.hasOwnProperty( 'radius' ) ) &&
				el(
					__experimentalToolsPanelItem,
					{
						label: __( 'Radius', 'wpmozo-product-carousel-for-woocommerce' ),
						hasValue: () => true,
						isShownByDefault: true,
						onDeselect: () => borderSetValue( 'borderRadius' ),
					},
					el(
						__experimentalBorderRadiusControl,
						{
							label: 'Radius',
							values: props.attributes[ BorderKey+'borderRadius' ],
							onChange: ( NewRadius ) => onChange( 'borderRadius', NewRadius ),
						}
					),
				),
		),
	];

}

export default WpmozoBorder;
