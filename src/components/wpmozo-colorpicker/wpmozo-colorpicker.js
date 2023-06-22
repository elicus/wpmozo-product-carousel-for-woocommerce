
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalUseMultipleOriginColorsAndGradients} = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem, Dropdown, Button, ColorIndicator, ColorPalette } = window.wp.components;


const WpmozoColorPicker = function(args){
	
    const { ColorKey, ColorTypes, attributes, props } = args;
    const AllColors = __experimentalUseMultipleOriginColorsAndGradients();
    const _color = attributes[ColorKey];

    const colorSetValue = function( styleType, value = null ) {
        let colors = Object.assign({}, _color);
        colors[styleType] = ( null !== value ) ? value : '';
        props.setAttributes( {[ColorKey]: colors} );
    };

    const colorDropdown = function( colorType, label ) {

        return el(Dropdown, {
            className: "wpmozo-color-dropdown-container",
            contentClassName: "wpmozo-color-popover-content",
            popoverProps: {
                placement: 'left-start',
                offset: 36,
                shift: true
            },
            renderToggle: ({ isOpen, onToggle }) =>
                el(Button, {
                    onClick: onToggle,
                    "aria-expanded": isOpen,
                    children: [
                        el(ColorIndicator, {
                            colorValue: _color[colorType],
                        }),
                        label
                    ],
                }),
            renderContent: () =>
                el( ColorPalette, { 
                    colors: AllColors.colors,
                    value: _color[colorType],
                    onChange: function(NewColor) {
                        colorSetValue(colorType, NewColor);
                    }, 
                } ),
        });

    }

    const Panels = [];
    for (var i = 0; i < ColorTypes.length; i++) {
        let ct = ColorTypes[i];
        let Panel = el( __experimentalToolsPanelItem, 
            {
                label: ct.label,
                hasValue: () => true,
                isShownByDefault: true, 
                onDeselect: () => colorSetValue(ct.key),                                    
            }, 
            colorDropdown(
                ct.key,
                ct.label
            ),
        );
        Panels.push(Panel);
    }

	return [
        el( __experimentalToolsPanel,
            { 
                label: __( 'Color', 'wpmozo-product-carousel-for-woocommerce' ),
                resetAll: () => {
                    let colors = {
                        text: '',
                    }
                    props.setAttributes( {[ColorKey]: colors} );
                }
            },
            Panels,
        ),
	];

}

export default WpmozoColorPicker;