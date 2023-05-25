/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(function (blocks, editor, element, components) {
  const __ = wp.i18n.__;
  const el = element.createElement;
  const registerBlockType = blocks.registerBlockType;
  const {
    BlockControls,
    InspectorControls,
    AlignmentToolbar,
    PanelColorSettings
  } = editor;
  const {
    PanelBody,
    RangeControl,
    SelectControl,
    TextControl
  } = components;
  const {
    Fragment
  } = element;
  registerBlockType('wpmozo/product-carousel', {
    title: __('WP Mozo Product Carousel', 'wpmozo-product-carousel-for-woocommerce'),
    icon: '',
    category: 'woocommerce',
    keywords: ['wpmozo', 'woocommerce-product-carousel', 'woocommerce', 'carousel'],
    attributes: {},
    example: {
      attributes: {}
    },
    edit: function (props) {},
    save: function () {
      return null;
    }
  });
})(window.wp.blocks, window.wp.editor, window.wp.element, window.wp.components);
/******/ })()
;
//# sourceMappingURL=index.js.map