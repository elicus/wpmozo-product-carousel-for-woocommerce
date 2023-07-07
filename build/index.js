/******/ (() => { // webpackBootstrap
/******/  "use strict";
/******/  var __webpack_modules__ = ({

/***/ "./src/components/wpmozo-border/wpmozo-border.js":
/*!*******************************************************!*\
  !*** ./src/components/wpmozo-border/wpmozo-border.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const {
  __experimentalBorderRadiusControl
} = window.wp.blockEditor;
const {
  __experimentalToolsPanel,
  __experimentalToolsPanelItem,
  __experimentalBorderBoxControl
} = window.wp.components;
const WpmozoBorder = function (args) {
  const {
    BorderKey,
    attributes,
    props
  } = args;
  const _border = attributes[BorderKey];
  const BorderTypes = args.hasOwnProperty('BorderTypes') ? args.BorderTypes : null;
  const borderSetValue = function (Type) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let _border = Object.assign({}, attributes[BorderKey]);
    _border[Type] = null !== value ? value : '';
    props.setAttributes({
      [BorderKey]: _border
    });
  };
  return [el(__experimentalToolsPanel, {
    label: __('Border', 'wpmozo-product-carousel-for-woocommerce'),
    resetAll: () => {
      let _Border = Object.assign({}, attributes[BorderKey]);
      if (null === BorderTypes) {
        _Border.border = '';
        _Border.borderRadius = '';
      } else {
        Object.keys(BorderTypes).map(type => _Border[type] = '');
      }
      props.setAttributes({
        [BorderKey]: _Border
      });
    }
  }, (null == BorderTypes || BorderTypes.hasOwnProperty('border')) && el(__experimentalToolsPanelItem, {
    label: __('Border', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => borderSetValue('border')
  }, el(__experimentalBorderBoxControl, {
    label: 'Border',
    value: attributes[BorderKey].border,
    onChange: function (NewBorder) {
      borderSetValue('border', NewBorder);
    }
  })), (null == BorderTypes || BorderTypes.hasOwnProperty('radius')) && el(__experimentalToolsPanelItem, {
    label: __('Radius', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => borderSetValue('borderRadius')
  }, el(__experimentalBorderRadiusControl, {
    label: 'Radius',
    values: attributes[BorderKey].borderRadius,
    onChange: function (NewRadius) {
      borderSetValue('borderRadius', NewRadius);
    }
  })))];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WpmozoBorder);

/***/ }),

/***/ "./src/components/wpmozo-colorpicker/wpmozo-colorpicker.js":
/*!*****************************************************************!*\
  !*** ./src/components/wpmozo-colorpicker/wpmozo-colorpicker.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const {
  __experimentalUseMultipleOriginColorsAndGradients
} = window.wp.blockEditor;
const {
  __experimentalToolsPanel,
  __experimentalToolsPanelItem,
  Dropdown,
  Button,
  ColorIndicator,
  ColorPalette
} = window.wp.components;
const WpmozoColorPicker = function (args) {
  const {
    ColorKey,
    ColorTypes,
    attributes,
    props
  } = args;
  const AllColors = __experimentalUseMultipleOriginColorsAndGradients();
  const _color = attributes[ColorKey];
  const colorSetValue = function (styleType) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let colors = Object.assign({}, _color);
    colors[styleType] = null !== value ? value : '';
    props.setAttributes({
      [ColorKey]: colors
    });
  };
  const colorDropdown = function (colorType, label) {
    if ('' === _color[colorType] && args.hasOwnProperty('default')) {
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
      renderToggle: _ref => {
        let {
          isOpen,
          onToggle
        } = _ref;
        return el(Button, {
          onClick: onToggle,
          "aria-expanded": isOpen,
          children: [el(ColorIndicator, {
            colorValue: _color[colorType]
          }), label]
        });
      },
      renderContent: () => el(ColorPalette, {
        colors: AllColors.colors,
        value: _color[colorType],
        onChange: function (NewColor) {
          colorSetValue(colorType, NewColor);
        }
      })
    });
  };
  const Panels = [];
  for (var i = 0; i < ColorTypes.length; i++) {
    let ct = ColorTypes[i];
    let Panel = el(__experimentalToolsPanelItem, {
      label: ct.label,
      hasValue: () => true,
      isShownByDefault: true,
      onDeselect: () => colorSetValue(ct.key)
    }, colorDropdown(ct.key, ct.label));
    Panels.push(Panel);
  }
  return [el(__experimentalToolsPanel, {
    label: __('Color', 'wpmozo-product-carousel-for-woocommerce'),
    resetAll: () => {
      let colors = Object.assign({}, attributes[ColorKey]);
      ColorTypes.map(type => colors[type.key] = '');
      props.setAttributes({
        [ColorKey]: colors
      });
    }
  }, Panels)];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WpmozoColorPicker);

/***/ }),

/***/ "./src/components/wpmozo-dimensions/wpmozo-dimensions.js":
/*!***************************************************************!*\
  !*** ./src/components/wpmozo-dimensions/wpmozo-dimensions.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const {
  __experimentalSpacingSizesControl
} = window.wp.blockEditor;
const {
  __experimentalToolsPanel,
  __experimentalToolsPanelItem
} = window.wp.components;
const preAttributes = wpmozo_block_carousel_object.attributes;
const WpmozoDimensions = function (args) {
  const {
    DimensionKey,
    attributes,
    props
  } = args;
  const _dimensions = attributes[DimensionKey];
  const DimensionsTypes = args.hasOwnProperty('DimensionsTypes') ? args.DimensionsTypes : null;
  const label = args.hasOwnProperty('label') ? args.label : __('Dimensions', 'wpmozo-product-carousel-for-woocommerce');
  const dimensionsSetValue = function (styleType) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let _dimensions = Object.assign({}, attributes[DimensionKey]);
    if (null == value && 'undefined' !== typeof preAttributes[DimensionKey].default[styleType]) {
      value = preAttributes[DimensionKey].default[styleType];
    }
    _dimensions[styleType] = null !== value ? value : '';
    props.setAttributes({
      [DimensionKey]: _dimensions
    });
  };
  return [el(__experimentalToolsPanel, {
    label: label,
    resetAll: () => {
      let dimensions = preAttributes[DimensionKey].default;
      props.setAttributes({
        [DimensionKey]: dimensions
      });
    }
  }, (null == DimensionsTypes || DimensionsTypes.hasOwnProperty('padding')) && el(__experimentalToolsPanelItem, {
    label: __('Padding', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    className: 'tools-panel-item-spacing',
    onDeselect: () => dimensionsSetValue('padding')
  }, el(__experimentalSpacingSizesControl, {
    label: 'Padding',
    values: attributes[DimensionKey].padding,
    onChange: function (NewPadding) {
      dimensionsSetValue('padding', NewPadding);
    }
  })), (null == DimensionsTypes || DimensionsTypes.hasOwnProperty('margin')) && el(__experimentalToolsPanelItem, {
    label: __('Margin', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    className: 'tools-panel-item-spacing',
    onDeselect: () => dimensionsSetValue('margin')
  }, el(__experimentalSpacingSizesControl, {
    label: 'Margin',
    values: attributes[DimensionKey].margin,
    onChange: function (NewMargin) {
      dimensionsSetValue('margin', NewMargin);
    }
  })), (null == DimensionsTypes || DimensionsTypes.hasOwnProperty('position')) && el(__experimentalToolsPanelItem, {
    label: __('Position', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    className: 'tools-panel-item-spacing',
    onDeselect: () => dimensionsSetValue('position')
  }, el(__experimentalSpacingSizesControl, {
    label: 'Position',
    values: attributes[DimensionKey].position,
    onChange: function (NewPosition) {
      dimensionsSetValue('position', NewPosition);
    }
  })))];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WpmozoDimensions);

/***/ }),

/***/ "./src/components/wpmozo-iconpicker/wpmozo-iconpicker.js":
/*!***************************************************************!*\
  !*** ./src/components/wpmozo-iconpicker/wpmozo-iconpicker.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const {
  compose
} = wp.compose;
const {
  ComboboxControl
} = wp.components;
const el = wp.element.createElement;
const options = wpmozo_block_carousel_object.icons;
const WpmozoIconpicker = function (args) {
  const props = args.props;
  const attributes = args.attributes;
  const label = args.label;
  return [el('div', {
    className: 'wpmozo-icon-picker'
  }, el(ComboboxControl, {
    label: label,
    value: attributes.QuickViewLinkIcon,
    onChange: function (icon) {
      props.setAttributes({
        QuickViewLinkIcon: icon
      });
    },
    options: options,
    __experimentalRenderItem: function (option) {
      let iconClass = option.item.value;
      return el("span", {
        children: [el("i", {
          class: iconClass
        }), " ", option.item.label]
      });
    }
  }), attributes.QuickViewLinkIcon && el('div', {
    className: 'wpmozo-icon-wraper'
  }, el('i', {
    class: attributes.QuickViewLinkIcon
  })))];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WpmozoIconpicker);

/***/ }),

/***/ "./src/components/wpmozo-loader/wpmozo-loader.js":
/*!*******************************************************!*\
  !*** ./src/components/wpmozo-loader/wpmozo-loader.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

const {
  Component
} = wp.element;
const {
  compose
} = wp.compose;
const {
  hooks
} = wp;
class WpmozoLoader extends Component {
  render() {
    const {
      column,
      margin
    } = this.props;
    let loader = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-item",
        style: {
          marginRight: margin
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-col-12"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-picture"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-row"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-col-8"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-col-4 empty"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-col-4"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-col-8 empty"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-col-12 empty"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-col-6 big"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "ph-col-6 empty"
      })))),
      html = [];
    for (var i = 0; i < column; i++) {
      html.push(loader);
    }
    return html;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (compose()(WpmozoLoader));

/***/ }),

/***/ "./src/components/wpmozo-size/wpmozo-size.js":
/*!***************************************************!*\
  !*** ./src/components/wpmozo-size/wpmozo-size.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const {
  __experimentalToolsPanel,
  __experimentalToolsPanelItem,
  __experimentalUnitControl
} = window.wp.components;
const WpmozoSize = function (args) {
  const {
    SizeKey,
    attributes,
    props
  } = args;
  const _size = attributes[SizeKey];
  const SizeTypes = args.hasOwnProperty('SizeTypes') ? args.SizeTypes : null;
  const sizeSetValue = function (Type) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let _size = Object.assign({}, attributes[SizeKey]);
    _size[Type] = null !== value ? value : '';
    props.setAttributes({
      [SizeKey]: _size
    });
  };
  return [el(__experimentalToolsPanel, {
    label: __('Size', 'wpmozo-product-carousel-for-woocommerce'),
    resetAll: () => {
      let _Size = Object.assign({}, attributes[SizeKey]);
      if (null === SizeTypes) {
        _Size.width = '';
        _Size.height = '';
      } else {
        Object.keys(SizeTypes).map(type => _Size[type] = '');
      }
      props.setAttributes({
        [SizeKey]: _Size
      });
    }
  }, (null == SizeTypes || SizeTypes.hasOwnProperty('width')) && el(__experimentalToolsPanelItem, {
    label: __('Width', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => sizeSetValue('width')
  }, el(__experimentalUnitControl, {
    label: 'Width',
    labelPosition: 'side',
    value: attributes[SizeKey].width,
    onChange: function (NewWidth) {
      sizeSetValue('width', NewWidth);
    }
  })), (null == SizeTypes || SizeTypes.hasOwnProperty('height')) && el(__experimentalToolsPanelItem, {
    label: __('Height', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => sizeSetValue('height')
  }, el(__experimentalUnitControl, {
    label: 'Height',
    labelPosition: 'side',
    value: attributes[SizeKey].height,
    onChange: function (NewHeight) {
      sizeSetValue('height', NewHeight);
    }
  })))];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WpmozoSize);

/***/ }),

/***/ "./src/components/wpmozo-typography/wpmozo-typography.js":
/*!***************************************************************!*\
  !*** ./src/components/wpmozo-typography/wpmozo-typography.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const el = window.wp.element.createElement;
const __ = wp.i18n.__;
const {
  __experimentalFontAppearanceControl,
  FontSizePicker,
  __experimentalLetterSpacingControl,
  __experimentalTextTransformControl,
  __experimentalTextDecorationControl,
  LineHeightControl
} = window.wp.blockEditor;
const {
  __experimentalToolsPanel,
  __experimentalToolsPanelItem
} = window.wp.components;
const {
  compose
} = wp.compose;
const WpmozoTypography = function (args) {
  const {
    TypographyKey,
    attributes,
    props
  } = args;
  const TypoTypes = args.hasOwnProperty('TypoTypes') ? args.TypoTypes : null;
  const typoSetValue = function (styleType) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let _Typography = Object.assign({}, attributes[TypographyKey]);
    _Typography[styleType] = null !== value ? value : '';
    props.setAttributes({
      [TypographyKey]: _Typography
    });
  };
  if (null == TypoTypes || TypoTypes.hasOwnProperty('FontAppearance')) {
    var hasFontStyles = args.hasOwnProperty('FontAppearance') && args.FontAppearance.hasOwnProperty('hasFontStyles') ? args.FontAppearance.hasFontStyles : true;
    var hasFontWeights = args.hasOwnProperty('FontAppearance') && args.FontAppearance.hasOwnProperty('hasFontWeights') ? args.FontAppearance.hasFontWeights : true;
    var _FontAppearanceValues = {};
    if (hasFontStyles) {
      _FontAppearanceValues['fontStyle'] = attributes[TypographyKey].FontAppearance.fontStyle;
    }
    if (hasFontWeights) {
      _FontAppearanceValues['fontWeight'] = attributes[TypographyKey].FontAppearance.fontWeight;
    }
  }
  return [el(__experimentalToolsPanel, {
    label: __('Typography', 'wpmozo-product-carousel-for-woocommerce'),
    resetAll: () => {
      let _Typography = Object.assign({}, attributes[TypographyKey]);
      if (null === TypoTypes) {
        let TypographyTypes = {
          FontSize: '',
          LetterSpacing: '',
          Decoration: '',
          FontAppearance: {
            fontStyle: '',
            fontWeight: ''
          },
          LetterCase: '',
          LineHeight: ''
        };
        Object.keys(TypographyTypes).map(type => _Typography[type] = '');
      } else {
        Object.keys(TypoTypes).map(type => _Typography[type] = '');
      }
      props.setAttributes({
        [TypographyKey]: _Typography
      });
    }
  }, (null == TypoTypes || TypoTypes.hasOwnProperty('FontSize')) && el(__experimentalToolsPanelItem, {
    label: __('Font Size', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => typoSetValue('FontSize')
  }, el(FontSizePicker, {
    value: attributes[TypographyKey].FontSize,
    onChange: NewFontSize => {
      typoSetValue('FontSize', NewFontSize);
    },
    __nextHasNoMarginBottom: true
  })), (null == TypoTypes || TypoTypes.hasOwnProperty('FontAppearance')) && el(__experimentalToolsPanelItem, {
    className: "single-column",
    label: __('Appearance', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => typoSetValue('FontAppearance', {
      fontStyle: '',
      fontWeight: ''
    })
  }, el(__experimentalFontAppearanceControl, {
    key: 'wpmozp-product-carousel-titleapp',
    hasFontStyles: hasFontStyles,
    hasFontWeights: hasFontWeights,
    value: _FontAppearanceValues,
    onChange: NewFontAppearance => {
      typoSetValue('FontAppearance', NewFontAppearance);
    }
  })), (null == TypoTypes || TypoTypes.hasOwnProperty('LetterSpacing')) && el(__experimentalToolsPanelItem, {
    className: "single-column",
    label: __('Letter spacing', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => typoSetValue('LetterSpacing')
  }, el(__experimentalLetterSpacingControl, {
    value: attributes[TypographyKey].LetterSpacing,
    onChange: NewLetterSpacing => {
      typoSetValue('LetterSpacing', NewLetterSpacing);
    }
  })), (null == TypoTypes || TypoTypes.hasOwnProperty('Decoration')) && el(__experimentalToolsPanelItem, {
    label: __('Decoration', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => typoSetValue('Decoration')
  }, el(__experimentalTextDecorationControl, {
    value: attributes[TypographyKey].Decoration,
    onChange: NewDecoration => {
      typoSetValue('Decoration', NewDecoration);
    }
  })), (null == TypoTypes || TypoTypes.hasOwnProperty('LetterCase')) && el(__experimentalToolsPanelItem, {
    label: __('Letter case', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => typoSetValue('LetterCase')
  }, el(__experimentalTextTransformControl, {
    value: attributes[TypographyKey].LetterCase,
    onChange: NewLetterCase => {
      typoSetValue('LetterCase', NewLetterCase);
    }
  })), (null == TypoTypes || TypoTypes.hasOwnProperty('LineHeight')) && el(__experimentalToolsPanelItem, {
    className: "single-column",
    label: __('Line Height', 'wpmozo-product-carousel-for-woocommerce'),
    hasValue: () => true,
    isShownByDefault: true,
    onDeselect: () => typoSetValue('LineHeight')
  }, el(LineHeightControl, {
    value: attributes[TypographyKey].LineHeight,
    onChange: NewLineHeight => {
      typoSetValue('LineHeight', NewLineHeight);
    },
    __nextHasNoMarginBottom: true
  })))];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (compose()(WpmozoTypography));

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ })

/******/  });
/************************************************************************/
/******/  // The module cache
/******/  var __webpack_module_cache__ = {};
/******/  
/******/  // The require function
/******/  function __webpack_require__(moduleId) {
/******/    // Check if module is in cache
/******/    var cachedModule = __webpack_module_cache__[moduleId];
/******/    if (cachedModule !== undefined) {
/******/      return cachedModule.exports;
/******/    }
/******/    // Create a new module (and put it into the cache)
/******/    var module = __webpack_module_cache__[moduleId] = {
/******/      // no module.id needed
/******/      // no module.loaded needed
/******/      exports: {}
/******/    };
/******/  
/******/    // Execute the module function
/******/    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/  
/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }
/******/  
/************************************************************************/
/******/  /* webpack/runtime/compat get default export */
/******/  (() => {
/******/    // getDefaultExport function for compatibility with non-harmony modules
/******/    __webpack_require__.n = (module) => {
/******/      var getter = module && module.__esModule ?
/******/        () => (module['default']) :
/******/        () => (module);
/******/      __webpack_require__.d(getter, { a: getter });
/******/      return getter;
/******/    };
/******/  })();
/******/  
/******/  /* webpack/runtime/define property getters */
/******/  (() => {
/******/    // define getter functions for harmony exports
/******/    __webpack_require__.d = (exports, definition) => {
/******/      for(var key in definition) {
/******/        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/          Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/        }
/******/      }
/******/    };
/******/  })();
/******/  
/******/  /* webpack/runtime/hasOwnProperty shorthand */
/******/  (() => {
/******/    __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/  })();
/******/  
/******/  /* webpack/runtime/make namespace object */
/******/  (() => {
/******/    // define __esModule on exports
/******/    __webpack_require__.r = (exports) => {
/******/      if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/      }
/******/      Object.defineProperty(exports, '__esModule', { value: true });
/******/    };
/******/  })();
/******/  
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/components/wpmozo-typography/wpmozo-typography */ "./src/components/wpmozo-typography/wpmozo-typography.js");
/* harmony import */ var _src_components_wpmozo_loader_wpmozo_loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/components/wpmozo-loader/wpmozo-loader */ "./src/components/wpmozo-loader/wpmozo-loader.js");
/* harmony import */ var _src_components_wpmozo_iconpicker_wpmozo_iconpicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/components/wpmozo-iconpicker/wpmozo-iconpicker */ "./src/components/wpmozo-iconpicker/wpmozo-iconpicker.js");
/* harmony import */ var _src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/components/wpmozo-colorpicker/wpmozo-colorpicker */ "./src/components/wpmozo-colorpicker/wpmozo-colorpicker.js");
/* harmony import */ var _src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/components/wpmozo-dimensions/wpmozo-dimensions */ "./src/components/wpmozo-dimensions/wpmozo-dimensions.js");
/* harmony import */ var _src_components_wpmozo_size_wpmozo_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/components/wpmozo-size/wpmozo-size */ "./src/components/wpmozo-size/wpmozo-size.js");
/* harmony import */ var _src_components_wpmozo_border_wpmozo_border__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/components/wpmozo-border/wpmozo-border */ "./src/components/wpmozo-border/wpmozo-border.js");







(function (blocks, editor, element, components) {
  const __ = wp.i18n.__;
  const el = element.createElement;
  const registerBlockType = blocks.registerBlockType;
  const {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    useBlockProps
  } = editor;
  const {
    PanelBody,
    RangeControl,
    SelectControl,
    TextControl,
    FormTokenField,
    ToggleControl,
    Button
  } = components;
  const {
    Fragment,
    useState,
    useEffect
  } = element;
  const {
    useSelect,
    useDispatch,
    dispatch
  } = wp.data;
  const {
    serverSideRender: ServerSideRender,
    hooks
  } = wp;
  let textColorObject = [{
    key: 'text',
    label: __('Text', 'wpmozo-product-carousel-for-woocommerce')
  }];
  let twoColorObject = [{
    key: 'text',
    label: __('Text', 'wpmozo-product-carousel-for-woocommerce')
  }, {
    key: 'background',
    label: __('Background', 'wpmozo-product-carousel-for-woocommerce')
  }];
  let backgroundColorObject = [{
    key: 'background',
    label: __('Background', 'wpmozo-product-carousel-for-woocommerce')
  }];
  function convetInlineStyle(options, type, atts) {
    let style = '';
    if ('style' === type) {
      if ('undefined' !== typeof options.FontSize && '' !== options.FontSize) {
        style += 'font-size: ' + options.FontSize + ' !important;';
      }
      if ('undefined' !== typeof options.FontAppearance.fontStyle && '' !== options.FontAppearance.fontStyle) {
        style += 'font-style: ' + options.FontAppearance.fontStyle + ' !important;';
      }
      if ('undefined' !== typeof options.FontAppearance.fontWeight && '' !== options.FontAppearance.fontWeight) {
        style += 'font-weight: ' + options.FontAppearance.fontWeight + ' !important;';
      }
      if ('undefined' !== typeof options.LetterSpacing && '' !== options.LetterSpacing) {
        style += 'letter-spacing: ' + options.LetterSpacing + ' !important;';
      }
      if ('undefined' !== typeof options.Decoration && '' !== options.Decoration) {
        style += 'text-decoration: ' + options.Decoration + ' !important;';
      }
      if ('undefined' !== typeof options.LetterCase && '' !== options.LetterCase) {
        style += 'text-transform: ' + options.LetterCase + ' !important;';
      }
      if ('undefined' !== typeof options.LineHeight && '' !== options.LineHeight) {
        style += 'line-height: ' + options.LineHeight + ' !important;';
      }
    }
    if ('color' === type) {
      if ('undefined' !== typeof options.text && '' !== options.text) {
        style += 'color: ' + options.text + ' !important;';
      }
      if ('undefined' !== typeof options.background && '' !== options.background) {
        style += 'background: ' + options.background + ' !important;';
      }
    }
    if ('navigation' === type || 'pagination' === type) {
      if ('undefined' !== typeof options.FontSize && '' !== options.FontSize) {
        style += 'font-size: ' + options.FontSize + ' !important;';
      }
      if ('undefined' !== typeof options.Color && '' !== options.Color) {
        style += 'color: ' + options.Color + ' !important;';
      }
      if ('undefined' !== typeof options.FontAppearance && 'undefined' !== typeof options.FontAppearance.fontWeight && '' !== options.FontAppearance.fontWeight) {
        style += 'font-weight: ' + options.FontAppearance.fontWeight + ' !important;';
      }
    }
    if ('pagination' === type) {
      if ('undefined' !== typeof options.background && '' !== options.background) {
        style += 'background: ' + options.background + ' !important;';
      }
      if ('undefined' !== typeof options.width && '' !== options.width && 'progressbar' !== atts.PaginationType) {
        style += 'width: ' + options.width + ' !important;';
      }
      if ('undefined' !== typeof options.height && '' !== options.height && 'progressbar' !== atts.PaginationType) {
        style += 'height: ' + options.height + ' !important;';
      }
    }
    if ('progressbar' === type) {
      if ('undefined' !== typeof options.width && '' !== options.width) {
        style += 'width: ' + options.width + ' !important;';
      }
      if ('undefined' !== typeof options.height && '' !== options.height) {
        style += 'height: ' + options.height + ' !important;';
      }
    }
    if ('border' === type) {
      if ('undefined' !== typeof options.border.width && '' !== options.border.width) {
        let str = options.border.width;
        if ('undefined' !== typeof options.border.style && '' !== options.border.style) {
          str += ' ' + options.border.style;
        } else {
          str += ' solid';
        }
        if ('undefined' !== typeof options.border.color && '' !== options.border.color) {
          str += ' ' + options.border.color;
        }
        style += 'border: ' + str + ' !important;';
      }
      if ('undefined' !== typeof options.border.top && '' !== options.border.top) {
        for (const border in options.border) {
          for (const borderItem in options.border[border]) {
            style += 'border-' + border + '-' + borderItem + ': ' + options.border[border][borderItem] + ' !important;';
          }
        }
      }
      if ('undefined' !== typeof options.borderRadius && '' !== options.borderRadius) {
        if ('undefined' !== typeof options.borderRadius.topLeft && '' !== options.borderRadius.topLeft) {
          style += 'border-top-left-radius: ' + options.borderRadius.topLeft + ' !important;';
        }
        if ('undefined' !== typeof options.borderRadius.topRight && '' !== options.borderRadius.topRight) {
          style += 'border-top-right-radius: ' + options.borderRadius.topRight + ' !important;';
        }
        if ('undefined' !== typeof options.borderRadius.bottomLeft && '' !== options.borderRadius.bottomLeft) {
          style += 'border-bottom-left-radius: ' + options.borderRadius.bottomLeft + ' !important;';
        }
        if ('undefined' !== typeof options.borderRadius.bottomRight && '' !== options.borderRadius.bottomRight) {
          style += 'border-bottom-right-radius: ' + options.borderRadius.bottomRight + ' !important;';
        }
        if ('undefined' == typeof options.borderRadius.topLeft) {
          style += 'border-radius: ' + options.borderRadius + ' !important;';
        }
      }
    }
    if ('dimensions' === type) {
      if ('undefined' !== typeof options.padding && '' !== options.padding && ('undefined' !== typeof options.padding.top || 'undefined' !== typeof options.padding.right || 'undefined' !== typeof options.padding.bottom || 'undefined' !== typeof options.padding.left)) {
        let spacing = convetVarStyle(options.padding);
        style += 'padding: ' + spacing.top + ' ' + spacing.right + ' ' + spacing.bottom + ' ' + spacing.left + ' !important;';
      }
      if ('undefined' !== typeof options.margin && '' !== options.margin && ('undefined' !== typeof options.margin.top || 'undefined' !== typeof options.margin.right || 'undefined' !== typeof options.margin.bottom || 'undefined' !== typeof options.margin.left)) {
        let spacing = convetVarStyle(options.margin);
        style += 'margin: ' + spacing.top + ' ' + spacing.right + ' ' + spacing.bottom + ' ' + spacing.left + ' !important;';
      }
      if ('undefined' !== typeof options.position && '' !== options.position && ('undefined' !== typeof options.position.top || 'undefined' !== typeof options.position.right || 'undefined' !== typeof options.position.bottom || 'undefined' !== typeof options.position.left)) {
        let spacing = convetVarStyle(options.position);
        for (const position in options.position) {
          style += position + ': ' + spacing[position] + ' !important;';
        }
        style += 'position: absolute !important;';
      }
    }
    return style;
  }
  function appendInlineStyle(item, wraper, atts) {
    let attKey = item.attKey,
      selector = item.selector,
      type = item.type,
      inlineStyle = convetInlineStyle(atts[attKey], type, atts);
    if ('' !== inlineStyle) {
      var defaultStyle = wraper.find(selector).attr('style');
      if ('' !== defaultStyle && 'undefined' !== typeof defaultStyle) {
        inlineStyle += defaultStyle;
      }
      wraper.find(selector).attr('style', inlineStyle);
    }
  }
  function convetVarStyle(options) {
    let spacing = Object.assign({}, options);
    for (const type in spacing) {
      let value = spacing[type];
      if ('undefined' !== typeof value && '' !== value && value.startsWith("var:")) {
        let str = value.replace('var:', 'var(--wp--').replace(/\|/g, '--') + ')';
        spacing[type] = str;
      }
    }
    return spacing;
  }
  var GetOrderByOptions = wpmozo_block_carousel_object.order_by_options,
    GetAttributes = wpmozo_block_carousel_object.attributes,
    GetProductViewTypeOptions = wpmozo_block_carousel_object.product_view_type_options,
    AllSizes = wpmozo_block_carousel_object.all_sizes,
    AllBadgeTypes = wpmozo_block_carousel_object.all_badge_types,
    AllLayouts = wpmozo_block_carousel_object.all_layouts,
    ProductTypes = wpmozo_block_carousel_object.products_types;
  const initializeSwiper = attributes => {
    let clientId = attributes.clientId,
      selector = 'wpmozo_' + clientId;
    let options = attributes.CarouContStyle;
    let style = '';
    if ('undefined' !== typeof options.padding && '' !== options.padding && ('undefined' !== typeof options.padding.top || 'undefined' !== typeof options.padding.right || 'undefined' !== typeof options.padding.bottom || 'undefined' !== typeof options.padding.left)) {
      let spacing = convetVarStyle(options.padding);
      style += 'padding: ' + spacing.top + ' ' + spacing.right + ' ' + spacing.bottom + ' ' + spacing.left + ' !important;';
    }
    jQuery('#' + selector).attr('style', style);
    let mobileSett = attributes.Responsive.mobile;
    let tabletSett = attributes.Responsive.tablet;
    var sw_obj = {
      loop: attributes.Loop,
      swipeHandler: 'li.product',
      on: {
        tap: function (swiper, event) {
          dispatch('core/block-editor').selectBlock(clientId);
        },
        beforeInit: function (swiper) {
          let add_to_cart_selector = '.add_to_cart_button';
          if (ProductTypes.length) {
            jQuery.each(ProductTypes, function (key, type) {
              add_to_cart_selector += ', .button.product_type_' + type;
            });
          }
          let wraper = jQuery('#' + selector);
          let styles = [{
            attKey: 'TitleStyle',
            type: 'style',
            selector: '.woocommerce-loop-product__title'
          }, {
            attKey: 'PriceStyle',
            type: 'style',
            selector: '.price'
          }, {
            attKey: 'AddToCartStyle',
            type: 'style',
            selector: add_to_cart_selector
          }, {
            attKey: 'QuickViewStyle',
            type: 'style',
            selector: '.wpmozo-quick-view-button'
          }, {
            attKey: 'SaleLabelStyle',
            type: 'style',
            selector: '.onsale'
          }, {
            attKey: 'StockLabelStyle',
            type: 'style',
            selector: '.stock.out-of-stock'
          }, {
            attKey: 'TitleColor',
            type: 'color',
            selector: '.woocommerce-loop-product__title'
          }, {
            attKey: 'PriceColor',
            type: 'color',
            selector: '.price'
          }, {
            attKey: 'AddToCartColor',
            type: 'color',
            selector: add_to_cart_selector
          }, {
            attKey: 'QuickViewColor',
            type: 'color',
            selector: '.wpmozo-quick-view-button'
          }, {
            attKey: 'SaleLabelColor',
            type: 'color',
            selector: '.onsale'
          }, {
            attKey: 'StockLabelColor',
            type: 'color',
            selector: '.stock.out-of-stock'
          }, {
            attKey: 'StockLabelBorder',
            type: 'border',
            selector: '.stock.out-of-stock'
          }, {
            attKey: 'StockLabelDimensions',
            type: 'dimensions',
            selector: '.stock.out-of-stock'
          }, {
            attKey: 'CarouNavigation',
            type: 'navigation',
            selector: '.swiper-navigation'
          }, {
            attKey: 'CarouNavigation',
            type: 'color',
            selector: '.swiper-navigation'
          }, {
            attKey: 'CarouNavigation',
            type: 'dimensions',
            selector: '.swiper-navigation'
          }, {
            attKey: 'CarouNavigationLeft',
            type: 'dimensions',
            selector: '.swiper-button-prev'
          }, {
            attKey: 'CarouNavigationRight',
            type: 'dimensions',
            selector: '.swiper-button-next'
          }, {
            attKey: 'AddToCartBorder',
            type: 'border',
            selector: add_to_cart_selector
          }, {
            attKey: 'QuickViewBorder',
            type: 'border',
            selector: '.wpmozo-quick-view-button'
          }, {
            attKey: 'AddToCartDimensions',
            type: 'dimensions',
            selector: add_to_cart_selector
          }, {
            attKey: 'QuickViewDimensions',
            type: 'dimensions',
            selector: '.wpmozo-quick-view-button'
          }];
          styles.map(function (item) {
            appendInlineStyle(item, wraper, attributes);
          });
        },
        afterInit: function (swiper) {
          let wraper = jQuery('#' + selector),
            PaginationSelector = 'fraction' !== attributes.PaginationType ? '.swiper-pagination span' : '.swiper-pagination';
          let styles = [{
            attKey: 'CarouPagination',
            type: 'pagination',
            selector: PaginationSelector
          }];
          if ('progressbar' === attributes.PaginationType) {
            let pagi = {
              attKey: 'CarouPagination',
              type: 'progressbar',
              selector: '.swiper-pagination'
            };
            styles.push(pagi);
          }
          styles.map(function (item) {
            appendInlineStyle(item, wraper, attributes);
          });
        }
      },
      breakpoints: {
        0: {
          slidesPerView: mobileSett.Columns,
          spaceBetween: mobileSett.SpaceBetween,
          slidesPerGroup: mobileSett.SlidesToScroll
        },
        480: {
          slidesPerView: tabletSett.Columns,
          spaceBetween: tabletSett.SpaceBetween,
          slidesPerGroup: tabletSett.SlidesToScroll
        },
        1025: {
          slidesPerView: attributes.Columns,
          spaceBetween: attributes.SpaceBetween,
          slidesPerGroup: attributes.SlidesToScroll
        }
      }
    };
    if (attributes.AutoPlay) {
      sw_obj.autoplay = {
        delay: attributes.Delay
      };
    }
    if (attributes.ShowNavigation) {
      sw_obj.navigation = {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      };
    }
    if (attributes.ShowPagination) {
      sw_obj.pagination = {
        el: '.swiper-pagination',
        type: attributes.PaginationType
      };
    }
    let _swiper = new Swiper('#' + selector, sw_obj);
  };
  hooks.addAction('server-side-loading-finished', 'function_name', initializeSwiper);
  const TriggerWhenLoadingFinished = args => {
    let attributes = args.attributes;
    useEffect(() => {
      return () => {
        hooks.doAction("server-side-loading-finished", attributes);
      };
    });
    return el(Fragment, {}, el("div", {
      class: "wpmozo-loader backend",
      style: {
        "display": "grid",
        "grid-auto-flow": "column"
      },
      children: [el(_src_components_wpmozo_loader_wpmozo_loader__WEBPACK_IMPORTED_MODULE_1__["default"], {
        attributes: attributes,
        clientId: attributes.clientId,
        column: attributes.Columns,
        margin: attributes.SpaceBetween
      })]
    }));
  };
  function wpmozoGetRand() {
    return (Math.random() + 1).toString(36).substring(2);
  }
  registerBlockType('wpmozo/product-carousel', {
    title: __('WPMozo Product Carousel', 'wpmozo-product-carousel-for-woocommerce'),
    icon: 'products',
    apiVersion: 3,
    category: 'wpmozo',
    keywords: ['wpmozo', 'woocommerce-product-carousel', 'woocommerce', 'carousel'],
    attributes: GetAttributes,
    supports: {
      html: false
    },
    edit: function (props) {
      let attributes = props.attributes;
      attributes.clientId = props.clientId;
      let clientId = attributes.clientId;
      if (!attributes.hasOwnProperty('UID')) {
        attributes.UID = wpmozoGetRand();
      }
      let product_cats = wp.data.select('core').getEntityRecords('taxonomy', 'product_cat');
      let product_cat_options = [];
      if (product_cats) {
        product_cat_options = product_cats.map(value => value.name);
      }
      let product_tags = wp.data.select('core').getEntityRecords('taxonomy', 'product_tag');
      let product_tag_options = [];
      if (product_tags) {
        product_tag_options = product_tags.map(value => value.name);
      }
      let blockProps = useBlockProps();
      return [el('div', blockProps, el(ServerSideRender, {
        block: 'wpmozo/product-carousel',
        attributes: attributes,
        LoadingResponsePlaceholder: TriggerWhenLoadingFinished,
        httpMethod: 'POST'
      })), el(InspectorControls, {}, el(PanelBody, {
        title: __('Carousel Settings', 'wpmozo-product-carousel-for-woocommerce'),
        initialOpen: true
      }, el(RangeControl, {
        key: 'wpmozp-product-carousel-columns',
        value: attributes.Columns,
        allowReset: false,
        initialPosition: 4,
        max: 8,
        min: 1,
        label: __('Columns', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewColumns) {
          props.setAttributes({
            Columns: NewColumns
          });
        }
      }), el(RangeControl, {
        key: 'wpmozp-product-carousel-slidestoscroll',
        value: attributes.SlidesToScroll,
        allowReset: false,
        initialPosition: 4,
        max: 8,
        min: 1,
        label: __('Slides To Scroll', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSlidesToScroll) {
          props.setAttributes({
            SlidesToScroll: NewSlidesToScroll
          });
        }
      }), el(RangeControl, {
        key: 'wpmozp-product-carousel-space-between',
        value: attributes.SpaceBetween,
        allowReset: false,
        initialPosition: 10,
        label: __('Space Between', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSpaceBetween) {
          props.setAttributes({
            SpaceBetween: NewSpaceBetween
          });
        }
      }), el(ToggleControl, {
        checked: attributes.AutoPlay,
        label: __('Auto Play', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewAutoPlay) {
          props.setAttributes({
            AutoPlay: NewAutoPlay
          });
        }
      }), attributes.AutoPlay && el(TextControl, {
        key: 'wpmozp-product-carousel-delay',
        value: attributes.Delay,
        label: __('Delay of Animation', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewDelay) {
          props.setAttributes({
            Delay: NewDelay
          });
        }
      }), el(ToggleControl, {
        checked: attributes.Loop,
        label: __('Loop', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewLoop) {
          props.setAttributes({
            Loop: NewLoop
          });
        }
      }), el(ToggleControl, {
        checked: attributes.ShowNavigation,
        label: __('Show Navigation', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewShowNavigation) {
          props.setAttributes({
            ShowNavigation: NewShowNavigation
          });
        }
      }), el(ToggleControl, {
        checked: attributes.ShowPagination,
        label: __('Show Pagination', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewShowPagination) {
          props.setAttributes({
            ShowPagination: NewShowPagination
          });
        }
      }), el(ToggleControl, {
        checked: attributes.EqualSlideHeight,
        label: __('Equalize Slide Height', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewEqualSlideHeight) {
          props.setAttributes({
            EqualSlideHeight: NewEqualSlideHeight
          });
        }
      }), attributes.ShowPagination && el(SelectControl, {
        key: 'wpmozp-product-carousel-paginationtype',
        label: __('Pagination Type', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.PaginationType,
        options: [{
          label: __('Bullets', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'bullets'
        }, {
          label: __('Fraction', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'fraction'
        }, {
          label: __('Progressbar', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'progressbar'
        }],
        onChange: function (NewPaginationType) {
          attributes.CarouPagination.width = '';
          attributes.CarouPagination.height = '';
          if ('fraction' === NewPaginationType) {
            attributes.CarouPagination.background = '';
          } else {
            attributes.CarouPagination.FontSize = '';
            attributes.CarouPagination.Color = '';
          }
          props.setAttributes({
            PaginationType: NewPaginationType
          });
        }
      })), el(PanelBody, {
        title: __('Carousel Responsive Settings', 'wpmozo-product-carousel-for-woocommerce'),
        initialOpen: false
      }, el(PanelBody, {
        title: __('Mobile', 'wpmozo-product-carousel-for-woocommerce'),
        initialOpen: false
      }, el(RangeControl, {
        key: 'wpmozp-product-carousel-columns',
        value: attributes.Responsive.mobile.Columns,
        allowReset: false,
        initialPosition: attributes.Responsive.mobile.Columns,
        max: 8,
        min: 1,
        label: __('Columns', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewColumns) {
          let _Responsive = Object.assign({}, attributes.Responsive);
          _Responsive.mobile.Columns = NewColumns;
          props.setAttributes({
            Responsive: _Responsive
          });
        }
      }), el(RangeControl, {
        key: 'wpmozp-product-carousel-slidestoscroll',
        value: attributes.Responsive.mobile.SlidesToScroll,
        allowReset: false,
        initialPosition: attributes.Responsive.mobile.SlidesToScroll,
        max: 8,
        min: 1,
        label: __('Slides To Scroll', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSlidesToScroll) {
          let _Responsive = Object.assign({}, attributes.Responsive);
          _Responsive.mobile.SlidesToScroll = NewSlidesToScroll;
          props.setAttributes({
            Responsive: _Responsive
          });
        }
      }), el(RangeControl, {
        key: 'wpmozp-product-carousel-space-between',
        value: attributes.Responsive.mobile.SpaceBetween,
        allowReset: false,
        initialPosition: attributes.Responsive.mobile.SpaceBetween,
        label: __('Space Between', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSpaceBetween) {
          let _Responsive = Object.assign({}, attributes.Responsive);
          _Responsive.mobile.SpaceBetween = NewSpaceBetween;
          props.setAttributes({
            Responsive: _Responsive
          });
        }
      })), el(PanelBody, {
        title: __('Tablet', 'wpmozo-product-carousel-for-woocommerce'),
        initialOpen: false
      }, el(RangeControl, {
        key: 'wpmozp-product-carousel-columns',
        value: attributes.Responsive.tablet.Columns,
        allowReset: false,
        initialPosition: attributes.Responsive.tablet.Columns,
        max: 8,
        min: 1,
        label: __('Columns', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewColumns) {
          let _Responsive = Object.assign({}, attributes.Responsive);
          _Responsive.tablet.Columns = NewColumns;
          props.setAttributes({
            Responsive: _Responsive
          });
        }
      }), el(RangeControl, {
        key: 'wpmozp-product-carousel-slidestoscroll',
        value: attributes.Responsive.tablet.SlidesToScroll,
        allowReset: false,
        initialPosition: attributes.Responsive.tablet.SlidesToScroll,
        max: 8,
        min: 1,
        label: __('Slides To Scroll', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSlidesToScroll) {
          let _Responsive = Object.assign({}, attributes.Responsive);
          _Responsive.tablet.SlidesToScroll = NewSlidesToScroll;
          props.setAttributes({
            Responsive: _Responsive
          });
        }
      }), el(RangeControl, {
        key: 'wpmozp-product-carousel-space-between',
        value: attributes.Responsive.tablet.SpaceBetween,
        allowReset: false,
        initialPosition: attributes.Responsive.tablet.SpaceBetween,
        label: __('Space Between', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSpaceBetween) {
          let _Responsive = Object.assign({}, attributes.Responsive);
          _Responsive.tablet.SpaceBetween = NewSpaceBetween;
          props.setAttributes({
            Responsive: _Responsive
          });
        }
      }))), el(PanelBody, {
        title: __('Query Settings', 'wpmozo-product-carousel-for-woocommerce'),
        initialOpen: false
      }, el(SelectControl, {
        key: 'wpmozp-product-carousel-viewtype',
        label: __(' Product View Type', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.ProductViewType,
        options: GetProductViewTypeOptions,
        onChange: function (NewProductViewType) {
          props.setAttributes({
            ProductViewType: NewProductViewType
          });
        }
      }), el(TextControl, {
        key: 'wpmozp-product-carousel-products',
        value: attributes.NumberOfProducts,
        label: __('Number of Porducts', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewNumberOfProducts) {
          props.setAttributes({
            NumberOfProducts: NewNumberOfProducts
          });
        }
      }), 'best_selling' !== attributes.ProductViewType && 'top_rated' !== attributes.ProductViewType && el(SelectControl, {
        key: 'wpmozp-product-carousel-orderby',
        label: __('Order By', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.OrderBy,
        options: GetOrderByOptions,
        onChange: function (NewOrderBy) {
          props.setAttributes({
            OrderBy: NewOrderBy
          });
        }
      }), 'best_selling' !== attributes.ProductViewType && 'top_rated' !== attributes.ProductViewType && el(SelectControl, {
        key: 'wpmozp-product-carousel-order',
        label: __('Order', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.Order,
        options: [{
          label: __('Ascending', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'ASC'
        }, {
          label: __('Descending', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'DESC'
        }],
        onChange: function (NewOrder) {
          props.setAttributes({
            Order: NewOrder
          });
        }
      }), el(FormTokenField, {
        value: attributes.IncludeCategories,
        suggestions: product_cat_options,
        label: __('Include Categories', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewCats) {
          props.setAttributes({
            IncludeCategories: NewCats
          });
        }
      }), el(FormTokenField, {
        value: attributes.IncludeTags,
        suggestions: product_tag_options,
        label: __('Include Tags', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewTags) {
          props.setAttributes({
            IncludeTags: NewTags
          });
        }
      }), el(SelectControl, {
        key: 'wpmozp-product-carousel-tax-relation',
        label: __('Taxonomies Relation', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.TaxonomiesRelation,
        options: [{
          label: __('OR', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'OR'
        }, {
          label: __('AND', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'AND'
        }],
        onChange: function (NewTaxonomiesRelation) {
          props.setAttributes({
            TaxonomiesRelation: NewTaxonomiesRelation
          });
        }
      }), el(ToggleControl, {
        checked: attributes.OutOfStock,
        label: __('Hide Out of Stock Products', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewOutOfStock) {
          props.setAttributes({
            OutOfStock: NewOutOfStock
          });
        }
      })), el(PanelBody, {
        title: __('Display Settings', 'wpmozo-product-carousel-for-woocommerce'),
        initialOpen: false
      }, el(SelectControl, {
        key: 'wpmozp-product-carousel-layout',
        label: __('Layout', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.Layout,
        options: AllLayouts,
        onChange: function (NewLayout) {
          props.setAttributes({
            Layout: NewLayout
          });
        }
      }), !attributes.OutOfStock && el(ToggleControl, {
        checked: attributes.DisplayOutOfStockLabel,
        label: __('Display Out of Stock Label', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewDisplayOutOfStockLabel) {
          props.setAttributes({
            DisplayOutOfStockLabel: NewDisplayOutOfStockLabel
          });
        }
      }), !attributes.OutOfStock && attributes.DisplayOutOfStockLabel && el(TextControl, {
        key: 'wpmozp-product-outofstock-label',
        value: attributes.OutOfStockLabel,
        label: __('Out Of Stock Label', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewOutOfStockLabel) {
          props.setAttributes({
            OutOfStockLabel: NewOutOfStockLabel
          });
        }
      }), el(ToggleControl, {
        checked: attributes.EnableQuickViewLink,
        label: __('Enable Quick View Link', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewEnableQuickViewLink) {
          props.setAttributes({
            EnableQuickViewLink: NewEnableQuickViewLink
          });
        }
      }), attributes.EnableQuickViewLink && el(TextControl, {
        key: 'wpmozp-product-carousel-quickviewlinktext',
        value: attributes.QuickViewLinkText,
        label: __('Quickview link text', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewQuickViewLinkText) {
          props.setAttributes({
            QuickViewLinkText: NewQuickViewLinkText
          });
        }
      }), attributes.EnableQuickViewLink && attributes.EnableQuickViewLink && el(ToggleControl, {
        checked: attributes.QuickViewLinkIconEnabled,
        label: __('Quickview Display icon', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewQuickViewLinkIconEnabled) {
          props.setAttributes({
            QuickViewLinkIconEnabled: NewQuickViewLinkIconEnabled
          });
        }
      }), attributes.EnableQuickViewLink && attributes.QuickViewLinkIconEnabled && !attributes.QuickViewLinkCustomIcon && el(_src_components_wpmozo_iconpicker_wpmozo_iconpicker__WEBPACK_IMPORTED_MODULE_2__["default"], {
        label: __('Quickview Icon', 'wpmozo-product-carousel-for-woocommerce'),
        props: props,
        attributes: attributes
      }), attributes.EnableQuickViewLink && attributes.QuickViewLinkIconEnabled && el(ToggleControl, {
        checked: attributes.QuickViewLinkCustomIcon,
        label: __('Quickview custom icon', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewQuickViewLinkCustomIcon) {
          props.setAttributes({
            QuickViewLinkCustomIcon: NewQuickViewLinkCustomIcon
          });
        }
      }), attributes.EnableQuickViewLink && attributes.QuickViewLinkIconEnabled && attributes.QuickViewLinkCustomIcon && el(MediaUploadCheck, {}, el(MediaUpload, {
        onSelect: media => props.setAttributes({
          QuickViewLinkImg: media.url
        }),
        allowedTypes: ["image"],
        accept: "image/*",
        value: attributes.QuickViewLinkImg,
        render: _ref => {
          let {
            open
          } = _ref;
          return el(Fragment, {}, el('div', {
            class: "components-base-control wpmozo-quvili-icon-wrap",
            children: [attributes.QuickViewLinkImg && el('img', {
              class: "wpmozo-quvili-icon",
              src: attributes.QuickViewLinkImg
            }), el(Button, {
              isPrimary: true,
              onClick: event => {
                event.stopPropagation();
                open();
              },
              children: attributes.QuickViewLinkImg ? __("Edit Icon", "wpmozo-product-carousel-for-woocommerce") : __("Select Icon", "wpmozo-product-carousel-for-woocommerce")
            })]
          }));
        }
      })), el(ToggleControl, {
        checked: attributes.ShowFeaturedImage,
        label: __('Show Featured Image', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewShowFeaturedImage) {
          props.setAttributes({
            ShowFeaturedImage: NewShowFeaturedImage
          });
        }
      }), attributes.ShowFeaturedImage && el(SelectControl, {
        key: 'wpmozp-product-carousel-featimasize',
        label: __('Featured Image Size', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.FeaturedImageSize,
        options: AllSizes,
        onChange: function (NewFeaturedImageSize) {
          props.setAttributes({
            FeaturedImageSize: NewFeaturedImageSize
          });
        }
      }), el(ToggleControl, {
        checked: attributes.ShowRating,
        label: __('Show Rating', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewShowRating) {
          props.setAttributes({
            ShowRating: NewShowRating
          });
        }
      }), el(ToggleControl, {
        checked: attributes.ShowPrice,
        label: __('Show Price', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewShowPrice) {
          props.setAttributes({
            ShowPrice: NewShowPrice
          });
        }
      }), el(ToggleControl, {
        checked: attributes.ShowAddToCartButton,
        label: __('Show Add to Cart button', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewShowAddToCartButton) {
          props.setAttributes({
            ShowAddToCartButton: NewShowAddToCartButton
          });
        }
      }), el(ToggleControl, {
        checked: attributes.ShowSaleBadge,
        label: __('Show Sale Badge', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewShowSaleBadge) {
          props.setAttributes({
            ShowSaleBadge: NewShowSaleBadge
          });
        }
      }), attributes.ShowSaleBadge && el(SelectControl, {
        key: 'wpmozp-product-carousel-salebadgetype',
        label: __('Sale Badge Type', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.SaleBadgeType,
        options: AllBadgeTypes,
        onChange: function (NewSaleBadgeType) {
          props.setAttributes({
            SaleBadgeType: NewSaleBadgeType
          });
        }
      }), attributes.ShowSaleBadge && 'sale_label' === attributes.SaleBadgeType && el(TextControl, {
        key: 'wpmozp-product-salebadge-label',
        value: attributes.SaleLabelText,
        label: __('Sale Label Text', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSaleLabelText) {
          props.setAttributes({
            SaleLabelText: NewSaleLabelText
          });
        }
      }))), el(InspectorControls, {
        group: 'styles'
      }, el(PanelBody, {
        title: __('Carousel Container Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'CarouContStyle',
        DimensionsTypes: {
          padding: true
        },
        attributes: attributes,
        props: props
      })), attributes.ShowNavigation && el(PanelBody, {
        title: __('Carousel Navigation Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'CarouNavigation',
        attributes: attributes,
        props: props,
        ColorTypes: [{
          key: 'Color',
          label: __('Icon Color', 'wpmozo-product-carousel-for-woocommerce')
        }, {
          key: 'background',
          label: __('Background', 'wpmozo-product-carousel-for-woocommerce')
        }]
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'CarouNavigation',
        attributes: attributes,
        props: props,
        TypoTypes: {
          FontSize: true,
          FontAppearance: true
        },
        FontAppearance: {
          hasFontStyles: false
        }
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'CarouNavigation',
        attributes: attributes,
        DimensionsTypes: {
          padding: true,
          margin: true
        },
        props: props
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: __('Previous Position', 'wpmozo-product-carousel-for-woocommerce'),
        DimensionKey: 'CarouNavigationLeft',
        attributes: attributes,
        DimensionsTypes: {
          position: true
        },
        props: props
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: __('Next Position', 'wpmozo-product-carousel-for-woocommerce'),
        DimensionKey: 'CarouNavigationRight',
        attributes: attributes,
        DimensionsTypes: {
          position: true
        },
        props: props
      })), attributes.ShowPagination && el(PanelBody, {
        title: __('Carousel Pagination Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, 'fraction' !== attributes.PaginationType && [el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'CarouPagination',
        attributes: attributes,
        props: props,
        ColorTypes: [{
          key: 'background',
          label: __('Icon Color', 'wpmozo-product-carousel-for-woocommerce')
        }]
      }), el(_src_components_wpmozo_size_wpmozo_size__WEBPACK_IMPORTED_MODULE_5__["default"], {
        SizeKey: 'CarouPagination',
        attributes: attributes,
        props: props
      })], 'fraction' === attributes.PaginationType && [el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'CarouPagination',
        attributes: attributes,
        props: props,
        ColorTypes: [{
          key: 'Color',
          label: __('Icon Color', 'wpmozo-product-carousel-for-woocommerce')
        }]
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'CarouPagination',
        attributes: attributes,
        props: props,
        TypoTypes: {
          FontSize: true
        }
      })]), el(PanelBody, {
        title: __('Title Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'TitleColor',
        attributes: attributes,
        props: props,
        ColorTypes: textColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'TitleStyle',
        attributes: attributes,
        props: props
      })), attributes.ShowPrice && el(PanelBody, {
        title: __('Price Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'PriceColor',
        attributes: attributes,
        props: props,
        ColorTypes: textColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'PriceStyle',
        attributes: attributes,
        props: props
      })), attributes.ShowAddToCartButton && el(PanelBody, {
        title: __('Add to Cart Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'AddToCartColor',
        attributes: attributes,
        props: props,
        ColorTypes: twoColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'AddToCartStyle',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'AddToCartDimensions',
        DimensionsTypes: {
          padding: true
        },
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_border_wpmozo_border__WEBPACK_IMPORTED_MODULE_6__["default"], {
        BorderKey: 'AddToCartBorder',
        attributes: attributes,
        props: props
      })), attributes.EnableQuickViewLink && el(PanelBody, {
        title: __('Quick View Button Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'QuickViewColor',
        attributes: attributes,
        props: props,
        ColorTypes: twoColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'QuickViewStyle',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'QuickViewDimensions',
        DimensionsTypes: {
          padding: true
        },
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_border_wpmozo_border__WEBPACK_IMPORTED_MODULE_6__["default"], {
        BorderKey: 'QuickViewBorder',
        attributes: attributes,
        props: props
      })), attributes.EnableQuickViewLink && el(PanelBody, {
        title: __('Quick View Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'QuickViewPopupBackground',
        attributes: attributes,
        props: props,
        ColorTypes: backgroundColorObject
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'QuickViewPopupDimensions',
        attributes: attributes,
        DimensionsTypes: {
          padding: true
        },
        props: props
      }), el(PanelBody, {
        title: __('Close Button Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'QuickViewCloseColor',
        attributes: attributes,
        props: props,
        ColorTypes: twoColorObject
      }), el(_src_components_wpmozo_size_wpmozo_size__WEBPACK_IMPORTED_MODULE_5__["default"], {
        SizeKey: 'QuickViewCloseSize',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'QuickViewCloseStyle',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'QuickViewCloseDimensions',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_border_wpmozo_border__WEBPACK_IMPORTED_MODULE_6__["default"], {
        BorderKey: 'QuickViewCloseBorder',
        attributes: attributes,
        props: props
      })), el(ToggleControl, {
        checked: attributes.SameAsCarousel,
        className: 'wpmozo-same-as-carousel',
        label: __('Inner Elements Style Same As Carousel', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSameAsCarousel) {
          props.setAttributes({
            SameAsCarousel: NewSameAsCarousel
          });
        }
      }), !attributes.SameAsCarousel && [el(PanelBody, {
        title: __('Title Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'QuickViewTitleColor',
        attributes: attributes,
        props: props,
        ColorTypes: textColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'QuickViewTitleStyle',
        attributes: attributes,
        props: props
      })), attributes.ShowPrice && el(PanelBody, {
        title: __('Price Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'QuickViewPriceColor',
        attributes: attributes,
        props: props,
        ColorTypes: textColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'QuickViewPriceStyle',
        attributes: attributes,
        props: props
      })), attributes.ShowAddToCartButton && el(PanelBody, {
        title: __('Add to Cart Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'QuickViewAddToCartColor',
        attributes: attributes,
        props: props,
        ColorTypes: twoColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'QuickViewAddToCartStyle',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'QuickViewAddToCartDimensions',
        DimensionsTypes: {
          padding: true
        },
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_border_wpmozo_border__WEBPACK_IMPORTED_MODULE_6__["default"], {
        BorderKey: 'QuickViewAddToCartBorder',
        attributes: attributes,
        props: props
      })), attributes.ShowSaleBadge && el(PanelBody, {
        title: __('Sale Label Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'QuickViewSaleLabelColor',
        attributes: attributes,
        props: props,
        ColorTypes: twoColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'QuickViewSaleLabelStyle',
        attributes: attributes,
        props: props
      })), !attributes.OutOfStock && attributes.DisplayOutOfStockLabel && el(PanelBody, {
        title: __('Out Of Stock Label Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'QuickViewStockLabelColor',
        attributes: attributes,
        props: props,
        ColorTypes: textColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'QuickViewStockLabelStyle',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'QuickViewStockLabelDimensions',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_border_wpmozo_border__WEBPACK_IMPORTED_MODULE_6__["default"], {
        BorderKey: 'QuickViewStockLabelBorder',
        attributes: attributes,
        props: props
      }))]), attributes.ShowSaleBadge && el(PanelBody, {
        title: __('Sale Label Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'SaleLabelColor',
        attributes: attributes,
        props: props,
        ColorTypes: twoColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'SaleLabelStyle',
        attributes: attributes,
        props: props
      })), !attributes.OutOfStock && attributes.DisplayOutOfStockLabel && el(PanelBody, {
        title: __('Out Of Stock Label Style', 'wpmozo-product-carousel-for-woocommerce'),
        className: "wpmozo-typography-panel",
        initialOpen: false
      }, el(_src_components_wpmozo_colorpicker_wpmozo_colorpicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ColorKey: 'StockLabelColor',
        attributes: attributes,
        props: props,
        ColorTypes: textColorObject
      }), el(_src_components_wpmozo_typography_wpmozo_typography__WEBPACK_IMPORTED_MODULE_0__["default"], {
        TypographyKey: 'StockLabelStyle',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_dimensions_wpmozo_dimensions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        DimensionKey: 'StockLabelDimensions',
        attributes: attributes,
        props: props
      }), el(_src_components_wpmozo_border_wpmozo_border__WEBPACK_IMPORTED_MODULE_6__["default"], {
        BorderKey: 'StockLabelBorder',
        attributes: attributes,
        props: props
      })))];
    },
    save: function () {
      return null;
    }
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components);
})();

/******/ })()
;
//# sourceMappingURL=index.js.map