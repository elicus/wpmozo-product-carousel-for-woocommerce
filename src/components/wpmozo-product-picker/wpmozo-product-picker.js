const el = window.wp.element.createElement;
const { useState } = window.wp.element;
const { useSelect } = window.wp.data;
const { useDebounce } = window.wp.compose;
const { FormTokenField } = window.wp.components;

// Product names aren't unique, so every token carries its ID, e.g. "Red Hooded Sweatshirt (#649)".
// The ID in brackets is what gets saved.
const tokenFor = function( product ) {
	return ( product.title.raw || product.title.rendered ) + ' (#' + product.id + ')';
};

const idFromToken = function( token ) {
	const match = String( token ).match( /#(\d+)\)?$/ );
	return match ? parseInt( match[1], 10 ) : 0;
};

const WpmozoProductPicker = function( args ) {

	const { label, help, value, onChange } = args;
	const [ search, setSearch ] = useState( '' );
	const debouncedSearch       = useDebounce( setSearch, 300 );
	const ids                   = Array.isArray( value ) ? value.map( Number ).filter( Boolean ) : [];

	const { found, chosen } = useSelect(
		function( select ) {
			const core = select( 'core' );
			return {
				found: search.length > 1 ? core.getEntityRecords( 'postType', 'product', { search: search, per_page: 20, status: 'publish' } ) : null,
				chosen: ids.length ? core.getEntityRecords( 'postType', 'product', { include: ids, per_page: ids.length, status: 'publish' } ) : null,
			};
		},
		[ search, ids.join( ',' ) ]
	);

	// Until the names load, a saved product shows as its bare ID.
	const tokens = ids.map( function( id ) {
		const product = ( chosen || [] ).find( ( item ) => item.id === id );
		return product ? tokenFor( product ) : '#' + id;
	} );

	return el(
		'div',
		{ className: 'wpmozo-product-picker' },
		el(
			FormTokenField,
			{
				label: label,
				value: tokens,
				suggestions: ( found || [] ).map( tokenFor ),
				maxSuggestions: 20,
				onInputChange: debouncedSearch,
				onChange: function( newTokens ) {
					onChange( newTokens.map( idFromToken ).filter( Boolean ) );
				},
			}
		),
		help && el( 'p', { className: 'components-form-token-field__help' }, help )
	);

};

export default WpmozoProductPicker;
