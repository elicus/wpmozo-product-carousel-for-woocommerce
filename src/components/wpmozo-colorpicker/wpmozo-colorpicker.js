
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const { __experimentalUseMultipleOriginColorsAndGradients} = window.wp.blockEditor;
const { __experimentalToolsPanel, __experimentalToolsPanelItem, Dropdown, Button, ColorIndicator, ColorPalette } = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;

const WpmozoColorPicker = function(args){
	
    const { ColorKey, ColorTypes, values, props } = args;
    const AllColors = __experimentalUseMultipleOriginColorsAndGradients();
    let _color = values;

    let depth = args.hasOwnProperty('depth') ? args.depth : [],
        AttrKey = args.hasOwnProperty('AttrKey') ? args.AttrKey : 'StyleAtts',
        theAtts = Object.assign({}, props.attributes[AttrKey]);

    const colorSetValue = function( styleType, value = null ) {
       
        let _color = setValue(styleType, value);
        props.setAttributes( {[AttrKey]: theAtts} );

        if ( args.hasOwnProperty('afterOnChange') ) {
            args.afterOnChange( props );
        }

    };

    const setValue = function(styleType, value){

        let _color = null;
        if ( null === value && depth.length < 1 && 'undefined' !== typeof preAttributes[AttrKey][ColorKey][styleType].default ) {
            value = preAttributes[AttrKey][ColorKey][styleType].default;
        }

        if ( Array.isArray(depth) && depth.length ) {
           var lastEl = null,
                lastPreEl = null;
            for (var i = 0; i < depth.length; i++) {
                if ( null === lastEl ) {
                    lastEl = theAtts[depth[i]];
                }else{
                    if ( lastEl.hasOwnProperty(depth[i]) ) {
                        lastEl = lastEl[depth[i]];
                    }
                }
                if ( null === lastPreEl ) {
                    lastPreEl = preAttributes[AttrKey][depth[i]];
                }else{
                    if ( lastPreEl.hasOwnProperty(depth[i]) ) {
                        lastPreEl = lastPreEl[depth[i]];
                    }
                }
            }
            _color = lastEl[ColorKey];
            if ( null == value && 'undefined' !== typeof lastPreEl[ColorKey][styleType] ) {
                value = lastPreEl[ColorKey][styleType].default;
            }
            _color[styleType] = ( null !== value ) ? value : '';
        }else{
            _color = theAtts[ColorKey];
            _color[styleType] = ( null !== value ) ? value : '';
        }

        return _color;

    }

    const onChange = args.hasOwnProperty('onChange') ? args.onChange : colorSetValue;

    const colorDropdown = function( colorType, label ) {

        if ( '' === _color[colorType] && args.hasOwnProperty('default') ) {
            _color[colorType] = args.default[colorType];
        }

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
                    value: values[colorType],
                    onChange: (NewColor) => onChange(colorType, NewColor), 
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
                    ColorTypes.map(type => setValue(type.key, null));
                    props.setAttributes( {[AttrKey]: theAtts} );

                    if ( args.hasOwnProperty('afterOnChange') ) {
                        args.afterOnChange( props );
                    }
                }
            },
            Panels,
        ),
	];

}

export default WpmozoColorPicker;