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
    InspectorControls,
    MediaUpload,
    MediaUploadCheck
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
    useState
  } = element;
  const {
    useSelect,
    useDispatch
  } = wp.data;
  var GetOrderByOptions = wpmozo_block_carousel_object.order_by_options,
    GetAttributes = wpmozo_block_carousel_object.attributes,
    GetProductViewTypeOptions = wpmozo_block_carousel_object.product_view_type_options,
    AllSizes = wpmozo_block_carousel_object.all_sizes,
    AllBadgeTypes = wpmozo_block_carousel_object.all_badge_types;
  registerBlockType('wpmozo/product-carousel', {
    title: __('WP Mozo Product Carousel', 'wpmozo-product-carousel-for-woocommerce'),
    icon: 'products',
    category: 'woocommerce',
    keywords: ['wpmozo', 'woocommerce-product-carousel', 'woocommerce', 'carousel'],
    attributes: GetAttributes,
    edit: function (props) {
      let attributes = props.attributes;
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
      return [el(Fragment, {}, el(InspectorControls, {}, el(PanelBody, {
        title: __('Carousel Settings', 'wpmozo-product-carousel-for-woocommerce'),
        initialOpen: true
      }, el(RangeControl, {
        key: 'wpmozp-product-carousel-columns',
        value: attributes.Columns,
        allowReset: false,
        initialPosition: 4,
        max: 8,
        label: __('Columns', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewColumns) {
          props.setAttributes({
            Columns: NewColumns
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
      }), el(TextControl, {
        key: 'wpmozp-product-carousel-speed',
        value: attributes.Speed,
        label: __('Speed of Animation', 'wpmozo-product-carousel-for-woocommerce'),
        onChange: function (NewSpeed) {
          props.setAttributes({
            Speed: NewSpeed
          });
        }
      })), el(PanelBody, {
        title: __('Query Settings', 'wpmozo-product-carousel-for-woocommerce'),
        initialOpen: true
      }, el(SelectControl, {
        key: 'wpmozp-product-carousel-orderby',
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
      }), el(SelectControl, {
        key: 'wpmozp-product-carousel-orderby',
        label: __('Order By', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.OrderBy,
        options: GetOrderByOptions,
        onChange: function (NewOrderBy) {
          props.setAttributes({
            OrderBy: NewOrderBy
          });
        }
      }), el(SelectControl, {
        key: 'wpmozp-product-carousel-order',
        label: __('Order', 'wpmozo-product-carousel-for-woocommerce'),
        value: attributes.Order,
        options: [{
          label: __('Ascending', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'asc'
        }, {
          label: __('Descending', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'desc'
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
          console.log(NewCats);
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
          value: 'or'
        }, {
          label: __('AND', 'wpmozo-product-carousel-for-woocommerce'),
          value: 'and'
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
        initialOpen: true
      }, !attributes.OutOfStock && el(ToggleControl, {
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
      }), attributes.EnableQuickViewLink && el(MediaUploadCheck, {}, el(MediaUpload, {
        onSelect: media => props.setAttributes({
          QuickViewLinkIcon: media.url
        }),
        allowedTypes: ["image"],
        accept: "image/*",
        value: attributes.QuickViewLinkIcon,
        render: _ref => {
          let {
            open
          } = _ref;
          return el(Fragment, {}, el('div', {
            children: [attributes.QuickViewLinkIcon && el('img', {
              class: "wpmozo-quvili-icon",
              src: attributes.QuickViewLinkIcon
            }), el(Button, {
              isPrimary: true,
              onClick: event => {
                event.stopPropagation();
                open();
              },
              children: attributes.QuickViewLinkIcon ? __("Edit Icon", "wpmozo-product-carousel-for-woocommerce") : __("Select Icon", "wpmozo-product-carousel-for-woocommerce")
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
      }))))];
    },
    save: function () {
      return null;
    }
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components);
/******/ })()
;
//# sourceMappingURL=index.js.map