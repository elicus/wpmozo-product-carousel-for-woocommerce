<?php
/**
 * Define the hooks for WP initialization.
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes
 */

/**
 * This class responsible for defining all actions for WP initialization of the plugin.
 *
 * @since      1.0.0
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes
 * @author     Elicus <hello@elicus.com>
 */
class WPMozo_Product_Carousel_Init {

	/**
	 * The array of styles for editor by woocommerce.
	 *
	 * @since 1.0.0
	 * @access public
	 * @var array $wpmozo_wc_styles array of style handles.
	 */
	public $wpmozo_wc_styles = array();


	/**
	 * Register the blocks.
	 *
	 * @since 1.0.0
	 */
	public function wpmozo_register_blocks() {

		$this->wpmozo_set_wc_styles();

		// register the swiper script.
		wp_register_script( 'wpmozo-swiper-script', WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/swiper/js/swiper-bundle.min.js', array(), time(), true );
		wp_register_style( 'wpmozo-swiper-style', WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/swiper/css/swiper-bundle.css', array(), time() );
		// rgister fontawesome style.
		wp_register_style( 'wpmozo-fontawesome-style', WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/fontawesome/all.min.css', array(), time() );

		// register the swiper scripts.
		wp_register_script(
			'wpmozo-product-carousel-script',
			WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_URL . 'product-carousel/assets/js/product-carousel.js',
			array( 'jquery', 'wpmozo-swiper-script', 'wpmozo-magnific-script' ),
			time(),
			true
		);
		wp_register_style(
			'wpmozo-block-product-carousel-style',
			WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_URL . 'product-carousel/assets/css/product-carousel-editor.css',
			array( 'wp-edit-blocks' ),
			time(),
		);
		wp_register_style(
			'wpmozo-product-carousel-style',
			WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_URL . 'product-carousel/assets/css/product-carousel.css',
			array(),
			time(),
		);

		wp_register_style(
			'wpmozo-placeholder',
			WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'placeholder-loading.css',
			array(),
			time()
		);

		// register the magnific popup scripts.
		wp_register_script(
			'wpmozo-magnific-script',
			WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/magnific/js/jquery.magnific-popup.min.js',
			array( 'jquery' ),
			time(),
			true
		);
		wp_register_style(
			'wpmozo-magnific-style',
			WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/magnific/css/magnific-popup.css',
			array(),
			time(),
		);

		// register product carousel block script.
		wp_register_script(
			'wpmozo-block-product-carousel-script',
			WPMOZO_PRODUCT_CAROUSEL_PLUGIN_DIR_URL . 'build/index.js',
			array( 'wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'wp-i18n', 'jquery' ),
			time()
		);

		$all_options = $this->wpmozo_get_all_settings_options();
		$attributes  = $all_options['attributes'];

		$products_types                = wc_get_product_types();
		$products_type_keys            = array_keys( $products_types );
		$all_options['products_types'] = $products_type_keys;

		wp_localize_script( 'wpmozo-block-product-carousel-script', 'wpmozo_block_carousel_object', $all_options );

		$wpmozo_carousel_object = array(
			'ajax_url'       => admin_url( 'admin-ajax.php' ),
			'loading'        => esc_html__( 'Loading...', 'wpmozo-product-carousel-for-woocommerce' ),
			'nonce'          => wp_create_nonce( 'ajax-nonce' ),
			'products_types' => $products_type_keys,
		);

		wp_localize_script( 'wpmozo-product-carousel-script', 'wpmozo_carousel_object', $wpmozo_carousel_object );

		$wc_styles      = $this->wpmozo_wc_styles;
		$styles_handles = array(
			'wpmozo-swiper-style',
			'wpmozo-placeholder',
			'wpmozo-fontawesome-style',
			'wpmozo-product-carousel-style',
		);
		if ( ! is_admin() ) {
			$styles_handles[] = 'wpmozo-magnific-style';
		}
		if ( ! empty( $wc_styles ) ) {
			$wc_styles_handles = array_keys( $wc_styles );
			$styles_handles    = array_merge( $wc_styles_handles, $styles_handles );
		}

		require_once WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_PATH . 'product-carousel/block.php';

		$default_args = array(
			'editor_style'          => 'wpmozo-block-product-carousel-style',
			'editor_script_handles' => array(
				'wpmozo-swiper-script',
				'wpmozo-block-product-carousel-script',
			),
			'view_script_handles'   => array(
				'wpmozo-swiper-script',
				'wpmozo-product-carousel-script',
				'wpmozo-magnific-script',
				'wc-add-to-cart-variation',
				'zoom',
				'flexslider',
				'photoswipe-ui-default',
				'wc-single-product',
			),
			'style_handles'         => $styles_handles,
			'attributes'            => $attributes,
			'render_callback'       => 'wpmozo_product_carousel_render_callback',
		);

		$args = apply_filters( 'wpmozo_product_carousel_block_args', $default_args );

		do_action( 'wpmozo_before_product_carousel_block_register', $args );

		register_block_type( 'wpmozo/product-carousel', $args );

	}

	/**
	 * Enqueue editor style for block.
	 *
	 * @since 1.0.0
	 */
	public function wpmozo_add_editor_style() {

		$wc_styles = $this->wpmozo_wc_styles;
		if ( ! empty( $wc_styles ) ) {
			foreach ( $wc_styles as $handle => $args ) {
				if ( ! isset( $args['has_rtl'] ) ) {
					$args['has_rtl'] = false;
				}
				wp_register_style( $handle, $args['src'], $args['deps'], $args['version'], $args['media'], $args['has_rtl'] );
			}
		}

	}

	/**
	 * Set array of styles handles by woocommerce.
	 *
	 * @since 1.0.0
	 */
	public function wpmozo_set_wc_styles() {

		global $wp_filter;
		$wc_styles = WC_Frontend_Scripts::get_styles();

		if ( empty( $wc_styles ) ) {

			$all_hooks     = $wp_filter['woocommerce_enqueue_styles'];
			$all_callbacks = $all_hooks->callbacks;

			// Remove all filter for enqueue style.
			if ( ! empty( $all_callbacks ) ) {
				foreach ( $all_callbacks as $priority => $_callback ) {
					if ( is_array( $_callback ) ) {
						foreach ( $_callback as $funname => $__callback ) {
							remove_filter( 'woocommerce_enqueue_styles', $__callback['function'], $priority, $__callback['accepted_args'] );
						}
					} else {
						remove_filter( 'woocommerce_enqueue_styles', $_callback['function'], $priority, $_callback['accepted_args'] );
					}
				}
			}

			$wc_styles = WC_Frontend_Scripts::get_styles();

			// Add all filter for enqueue style.
			if ( ! empty( $all_callbacks ) ) {
				foreach ( $all_callbacks as $priority => $_callback ) {
					if ( is_array( $_callback ) ) {
						foreach ( $_callback as $funname => $__callback ) {
							add_filter( 'woocommerce_enqueue_styles', $__callback['function'], $priority, $__callback['accepted_args'] );
						}
					} else {
						add_filter( 'woocommerce_enqueue_styles', $_callback['function'], $priority, $_callback['accepted_args'] );
					}
				}
			}
		}

		$this->wpmozo_wc_styles = $wc_styles;

	}

	/**
	 * Register the blocks.
	 *
	 * @since 1.0.0
	 * @return array $all_options All settings options
	 */
	public function wpmozo_get_all_settings_options() {

		$attributes = [
    "clientId" => ["type" => "string"],
    "CAlign" => ["type" => "string"],
    "Columns" => ["type" => "integer", "default" => 4],
    "SlidesToScroll" => ["type" => "integer", "default" => 4],
    "SpaceBetween" => ["type" => "integer", "default" => 20],
    "AutoPlay" => ["type" => "boolean", "default" => false],
    "Delay" => ["type" => "integer", "default" => 3000],
    "Loop" => ["type" => "boolean", "default" => false],
    "ShowNavigation" => ["type" => "boolean", "default" => true],
    "ShowPagination" => ["type" => "boolean", "default" => true],
    "EqualSlideHeight" => ["type" => "boolean", "default" => false],
    "PaginationType" => ["type" => "string", "default" => "bullets"],
    "mobileColumns" => ["type" => "integer", "default" => 1],
    "mobileSlidesToScroll" => ["type" => "integer", "default" => 1],
    "mobileSpaceBetween" => ["type" => "integer", "default" => 20],
    "tabletColumns" => ["type" => "integer", "default" => 2],
    "tabletSlidesToScroll" => ["type" => "integer", "default" => 2],
    "tabletSpaceBetween" => ["type" => "integer", "default" => 20],
    "ProductViewType" => ["type" => "string", "default" => "default"],
    "NumberOfProducts" => ["type" => "string", "default" => "10"],
    "Offset" => ["type" => "string"],
    "OrderBy" => ["type" => "string", "default" => "date"],
    "Order" => ["type" => "string", "default" => "DESC"],
    "IncludeCategories" => ["type" => "array"],
    "IncludeTags" => ["type" => "array"],
    "TaxonomiesRelation" => ["type" => "string", "default" => "AND"],
    "OutOfStock" => ["type" => "boolean", "default" => false],
    "Layout" => ["type" => "string", "default" => "default"],
    "DisplayOutOfStockLabel" => ["type" => "boolean", "default" => false],
    "OutOfStockLabel" => ["type" => "string"],
    "EnableQuickViewLink" => ["type" => "boolean", "default" => false],
    "QuickViewLinkText" => ["type" => "string", "default" => "Quick View"],
    "QuickViewLinkIconEnabled" => ["type" => "boolean", "default" => false],
    "QuickViewLinkIcon" => ["type" => "string", "default" => "fas fa-eye"],
    "QuickViewLinkCustomIcon" => ["type" => "boolean", "default" => false],
    "QuickViewLinkImg" => ["type" => "string", "default" => ""],
    "ShowTitle" => ["type" => "boolean", "default" => true],
    "ShowFeaturedImage" => ["type" => "boolean", "default" => true],
    "FeaturedImageSize" => [
        "type" => "string",
        "default" => "woocommerce_thumbnail",
    ],
    "ShowRating" => ["type" => "boolean", "default" => true],
    "ShowPrice" => ["type" => "boolean", "default" => true],
    "ShowAddToCartButton" => ["type" => "boolean", "default" => true],
    "ShowSaleBadge" => ["type" => "boolean", "default" => true],
    "SaleBadgeType" => ["type" => "string", "default" => "sale_label"],
    "SaleLabelText" => ["type" => "string", "default" => ""],
    "CarouContStylepadding" => [
        "type" => "object",
        "default" => [
            "bottom" => "20px",
            "left" => "20px",
            "right" => "20px",
            "top" => "20px",
        ],
    ],
    "CarouNavigationStyleFontSize" => ["type" => "string"],
    "CarouNavigationStyletext" => ["type" => "string"],
    "CarouNavigationStylebackground" => ["type" => "string"],
    "CarouNavigationStyleFontAppearance" => [
        "type" => "object",
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontWeight" => ""],
    ],
    "CarouNavigationStylepadding" => ["type" => "object"],
    "CarouNavigationStylemargin" => ["type" => "object"],
    "CarouNavigationStyleposition" => ["type" => "object"],
    "CarouNavigationLeftposition" => ["type" => "object"],
    "CarouNavigationRightposition" => ["type" => "object"],
    "CarouPaginationFontSize" => ["type" => "string"],
    "CarouPaginationtext" => ["type" => "string"],
    "CarouPaginationbackground" => ["type" => "string"],
    "CarouPaginationwidth" => ["type" => "string"],
    "CarouPaginationheight" => ["type" => "string"],
    "TitleStyleFontSize" => ["type" => "string", "default" => ""],
    "TitleStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "TitleStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "TitleStyleDecoration" => ["type" => "string", "default" => ""],
    "TitleStyleLetterCase" => ["type" => "string", "default" => ""],
    "TitleStyleLineHeight" => ["type" => "string", "default" => ""],
    "TitleStyletext" => ["type" => "string", "default" => ""],
    "PriceStyleFontSize" => ["type" => "string", "default" => ""],
    "PriceStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "PriceStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "PriceStyleDecoration" => ["type" => "string", "default" => ""],
    "PriceStyleLetterCase" => ["type" => "string", "default" => ""],
    "PriceStyleLineHeight" => ["type" => "string", "default" => ""],
    "PriceStyletext" => ["type" => "string", "default" => ""],
    "SaleLabelStyleFontSize" => ["type" => "string", "default" => ""],
    "SaleLabelStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "SaleLabelStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "SaleLabelStyleDecoration" => ["type" => "string", "default" => ""],
    "SaleLabelStyleLetterCase" => ["type" => "string", "default" => ""],
    "SaleLabelStyleLineHeight" => ["type" => "string", "default" => ""],
    "SaleLabelStyletext" => ["type" => "string", "default" => ""],
    "SaleLabelStylebackground" => ["type" => "string", "default" => ""],
    "StockLabelStyleFontSize" => ["type" => "string", "default" => "14px"],
    "StockLabelStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "normal", "fontWeight" => "500"],
    ],
    "StockLabelStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "StockLabelStyleDecoration" => ["type" => "string", "default" => ""],
    "StockLabelStyleLetterCase" => ["type" => "string", "default" => ""],
    "StockLabelStyleLineHeight" => ["type" => "string", "default" => ""],
    "StockLabelStyledefault" => ["padding" => "", "margin" => "", "position" => ""],
    "StockLabelStyletext" => ["type" => "string", "default" => "#ff0000"],
    "StockLabelStyleborderRadius" => ["type" => "", "default" => "3px"],
    "StockLabelStyleborder" => [
        "type" => "object",
        "default" => [
            "width" => "1px",
            "style" => "solid",
            "color" => "#ff0000",
        ],
    ],
    "StockLabelStylepadding" => [
        "type" => "object",
        "default" => [
            "bottom" => "5px",
            "left" => "12px",
            "right" => "12px",
            "top" => "5px",
        ],
    ],
    "StockLabelStylemargin" => ["type" => "object"],
    "StockLabelStyleposition" => ["type" => "object"],
    "AddToCartStyleFontSize" => ["type" => "string", "default" => ""],
    "AddToCartStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "AddToCartStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "AddToCartStyleDecoration" => ["type" => "string", "default" => ""],
    "AddToCartStyleLetterCase" => ["type" => "string", "default" => ""],
    "AddToCartStyleLineHeight" => ["type" => "string", "default" => ""],
    "default" => ["padding" => ""],
    "AddToCartStyletext" => ["type" => "string", "default" => ""],
    "AddToCartStylebackground" => ["type" => "string", "default" => ""],
    "AddToCartStyleborderRadius" => ["type" => "", "default" => ""],
    "AddToCartStyleborder" => ["type" => "object"],
    "AddToCartStylepadding" => ["type" => "object"],
    "QuickViewStyleFontSize" => ["type" => "string", "default" => ""],
    "QuickViewStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "QuickViewStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "QuickViewStyleDecoration" => ["type" => "string", "default" => ""],
    "QuickViewStyleLetterCase" => ["type" => "string", "default" => ""],
    "QuickViewStyleLineHeight" => ["type" => "string", "default" => ""],
    "QuickViewStyletext" => ["type" => "string", "default" => ""],
    "QuickViewStylebackground" => ["type" => "string", "default" => ""],
    "QuickViewStyleborderRadius" => ["type" => "", "default" => ""],
    "QuickViewStyleborder" => ["type" => "object"],
    "QuickViewStylepadding" => ["type" => "object"],
    "QuickViewStylemargin" => ["type" => "object"],
    "QuickViewStyleposition" => ["type" => "object"],
    "QuickViewPopupStylebackground" => ["type" => "string", "default" => ""],
    "default" => ["SameAsCarousel" => true],
    "QuickViewPopupStylepadding" => [
        "type" => "object",
        "default" => [
            "bottom" => "20px",
            "left" => "20px",
            "right" => "20px",
            "top" => "20px",
        ],
    ],
    "QuickViewPopupStylemargin" => ["type" => "object"],
    "QuickViewPopupStyleposition" => ["type" => "object"],
    "QuickViewPopupStyleSameAsCarousel" => ["type" => "boolean"],
    "QuickViewTitleStyleFontSize" => ["type" => "string", "default" => ""],
    "QuickViewTitleStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "QuickViewTitleStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "QuickViewTitleStyleDecoration" => ["type" => "string", "default" => ""],
    "QuickViewTitleStyleLetterCase" => ["type" => "string", "default" => ""],
    "QuickViewTitleStyleLineHeight" => ["type" => "string", "default" => ""],
    "QuickViewTitleStyletext" => ["type" => "string", "default" => ""],
    "QuickViewPriceStyleFontSize" => ["type" => "string", "default" => ""],
    "QuickViewPriceStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "QuickViewPriceStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "QuickViewPriceStyleDecoration" => ["type" => "string", "default" => ""],
    "QuickViewPriceStyleLetterCase" => ["type" => "string", "default" => ""],
    "QuickViewPriceStyleLineHeight" => ["type" => "string", "default" => ""],
    "QuickViewPriceStyledefault" => ["text" => ""],
    "QuickViewSaleLabelStyleFontSize" => ["type" => "string", "default" => ""],
    "QuickViewSaleLabelStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "QuickViewSaleLabelStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "QuickViewSaleLabelStyleDecoration" => ["type" => "string", "default" => ""],
    "QuickViewSaleLabelStyleLetterCase" => ["type" => "string", "default" => ""],
    "QuickViewSaleLabelStyleLineHeight" => ["type" => "string", "default" => ""],
    "QuickViewSaleLabelStyletext" => ["type" => "string", "default" => ""],
    "QuickViewSaleLabelStylebackground" => ["type" => "string", "default" => ""],
    "QuickViewStockLabelStyleFontSize" => ["type" => "string", "default" => "14px"],
    "QuickViewStockLabelStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "normal", "fontWeight" => "500"],
    ],
    "QuickViewStockLabelStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "QuickViewStockLabelStyleDecoration" => ["type" => "string", "default" => ""],
    "QuickViewStockLabelStyleLetterCase" => ["type" => "string", "default" => ""],
    "QuickViewStockLabelStyleLineHeight" => ["type" => "string", "default" => ""],
    "QuickViewStockLabelStyletext" => ["type" => "string", "default" => "#ff0000"],
    "QuickViewStockLabelStyleborderRadius" => ["type" => "", "default" => "3px"],
    "QuickViewStockLabelStyleborder" => [
        "type" => "object",
        "default" => [
            "width" => "1px",
            "style" => "solid",
            "color" => "#ff0000",
        ],
    ],
    "QuickViewStockLabelStylepadding" => [
        "type" => "object",
        "default" => [
            "bottom" => "5px",
            "left" => "12px",
            "right" => "12px",
            "top" => "5px",
        ],
    ],
    "QuickViewStockLabelStylemargin" => ["type" => "object"],
    "QuickViewStockLabelStyleposition" => ["type" => "object"],
    "QuickViewAddToCartStyleFontSize" => ["type" => "string", "default" => ""],
    "QuickViewAddToCartStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "QuickViewAddToCartStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "QuickViewAddToCartStyleDecoration" => ["type" => "string", "default" => ""],
    "QuickViewAddToCartStyleLetterCase" => ["type" => "string", "default" => ""],
    "QuickViewAddToCartStyleLineHeight" => ["type" => "string", "default" => ""],
    "QuickViewAddToCartStyletext" => ["type" => "string", "default" => ""],
    "QuickViewAddToCartStylebackground" => ["type" => "string", "default" => ""],
    "QuickViewAddToCartStyleborderRadius" => ["type" => "", "default" => ""],
    "QuickViewAddToCartStyleborder" => ["type" => "object"],
    "QuickViewAddToCartStylepadding" => ["type" => "object"],
    "QuickViewCloseStyleFontSize" => ["type" => "string", "default" => ""],
    "QuickViewCloseStyleFontAppearance" => [
        "type" => "object",
        "fontStyle" => ["type" => "string", "default" => ""],
        "fontWeight" => ["type" => "string", "default" => ""],
        "default" => ["fontStyle" => "", "fontWeight" => ""],
    ],
    "QuickViewCloseStyleLetterSpacing" => ["type" => "string", "default" => ""],
    "QuickViewCloseStyleDecoration" => ["type" => "string", "default" => ""],
    "QuickViewCloseStyleLetterCase" => ["type" => "string", "default" => ""],
    "QuickViewCloseStyleLineHeight" => ["type" => "string", "default" => ""],
    "QuickViewCloseStyletext" => ["type" => "string", "default" => ""],
    "QuickViewCloseStylebackground" => ["type" => "string", "default" => ""],
    "QuickViewCloseStyleborderRadius" => ["type" => "", "default" => ""],
    "QuickViewCloseStyleborder" => ["type" => "object"],
    "QuickViewCloseStylepadding" => ["type" => "object"],
    "QuickViewCloseStylemargin" => ["type" => "object"],
    "QuickViewCloseStyleposition" => ["type" => "object"],
    "QuickViewCloseStylewidth" => ["type" => "string"],
    "QuickViewCloseStyleheight" => ["type" => "string"],
];

		$product_view_type_options = array(
			array(
				'label' => __( 'Default', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'default',
			),
			array(
				'label' => __( 'Featured Products', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'featured',
			),
			array(
				'label' => __( 'Sale Products', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'sale',
			),
			array(
				'label' => __( 'Best Selling Products', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'best_selling',
			),
			array(
				'label' => __( 'Top Rated Products', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'top_rated',
			),
		);

		$order_by_options = array(
			array(
				'label' => __( 'Date', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'date',
			),
			array(
				'label' => __( 'Modified Date', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'modified',
			),
			array(
				'label' => __( 'Menu Order', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'menu_order',
			),
			array(
				'label' => __( 'Title', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'title',
			),
			array(
				'label' => __( 'Slug', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'name',
			),
			array(
				'label' => __( 'Id', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'ID',
			),
			array(
				'label' => __( 'Random', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'rand',
			),
			array(
				'label' => __( 'Stock Status', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'stock_status',
			),
			array(
				'label' => __( 'Price', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'price',
			),
			array(
				'label' => __( 'None', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'none',
			),
		);

		$get_all_sizes = wp_get_registered_image_subsizes();
		$all_sizes     = array();

		if ( ! empty( $get_all_sizes ) ) {
			foreach ( $get_all_sizes as $key => $size ) {
				$all_sizes[] = array(
					'label' => $key,
					'value' => $key,
				);
			}
		}

		$all_badge_types = array(
			array(
				'label' => __( 'Sale Label', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'sale_label',
			),
			array(
				'label' => __( 'Sale Percentage', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'percentage',
			),
		);

		$all_layouts = array(
			array(
				'label' => __( 'Default', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'default',
			),
			array(
				'label' => __( 'Layout 1', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'layout-1',
			),
			array(
				'label' => __( 'Layout 2', 'wpmozo-product-carousel-for-woocommerce' ),
				'value' => 'layout-2',
			),
		);

		$icons = $this->wpmozo_get_icons();

		$defalut_all_options = array(
			'attributes'                => $attributes,
			'order_by_options'          => $order_by_options,
			'product_view_type_options' => $product_view_type_options,
			'all_sizes'                 => $all_sizes,
			'all_badge_types'           => $all_badge_types,
			'ajax_url'                  => admin_url( 'admin-ajax.php' ),
			'all_layouts'               => $all_layouts,
			'icons'                     => $icons,
		);

		$all_options = apply_filters( 'wpmozo_product_carousel_block_all_options', $defalut_all_options );

		return $all_options;
	}

	/**
	 * Get font awesome icons array.
	 *
	 * @since 1.0.0
	 * @return array $icons All icons.
	 */
	public function wpmozo_get_icons() {

		$json = file_get_contents( WPMOZO_PRODUCT_CAROUSEL_PLUGIN_DIR_PATH . 'assets/frontend/fontawesome/fonts.json' );
		if ( empty( $json ) ) {
			return array();
		}
		$default_icons = json_decode( $json );
		$icons         = apply_filters( 'wpmozo_product_carousel_block_icons', $default_icons );
		return $icons;
	}

	/**
	 * Add block category.
	 *
	 * @param array $categories The block categories.
	 * @return array The block categories.
	 */
	public function wpmozo_block_category( $categories ) {

		$found = array_search( 'wpmozo', array_column( $categories, 'slug' ) );

		if ( false !== $found ) {
			return $categories;
		}

		return array_merge(
			$categories,
			array(
				array(
					'slug'  => 'wpmozo',
					'title' => __( 'WPMozo', 'wpmozo-product-carousel-for-woocommerce' ),
				),
			)
		);
	}

	/**
	 * Add all hooks.
	 *
	 * @since 1.0.0
	 * @param array $loader The instance of loader class.
	 * @param array $instance The instance of this class.
	 */
	public function add_hooks( $loader, $instance ) {

		$loader->add_filter( 'block_categories_all', $instance, 'wpmozo_block_category', 10, 2 );
		$loader->add_action( 'init', $instance, 'wpmozo_register_blocks' );
		$loader->add_action( 'enqueue_block_editor_assets', $instance, 'wpmozo_add_editor_style' );

	}

}
