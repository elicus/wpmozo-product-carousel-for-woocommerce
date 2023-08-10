const { compose } = wp.compose;
const { ComboboxControl } = wp.components;
const el = wp.element.createElement;

const options = wpmozo_block_carousel_object.icons;

const WpmozoIconpicker = function(args){

    const props = args.props;
    const attributes = args.attributes
    const label = args.label;

    return [
        el('div', 
            {
                className: 'wpmozo-icon-picker'
            }, 
            el( ComboboxControl, 
                {
                    label: label,
                    value: attributes.QuickViewLinkIcon,
                    allowReset: false,
                    onChange: function(icon){
                        props.setAttributes({
                            QuickViewLinkIcon: icon
                        });
                    },
                    options: options,
                    __experimentalRenderItem: function(option){
                        let iconClass =  option.item.value;
                        return el("span", {
                          children: [
                            el("i", {
                              class: iconClass,
                            }),
                            " ",
                            option.item.label
                          ]
                        });
                    },
                },
            ),
            attributes.QuickViewLinkIcon &&
                el('div', {className: 'wpmozo-icon-wraper'}, 
                    el('i', {
                        class: attributes.QuickViewLinkIcon
                    }),
                ),
        )
    ];
    
}

export default WpmozoIconpicker;
