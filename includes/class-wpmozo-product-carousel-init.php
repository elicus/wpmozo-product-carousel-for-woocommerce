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
		wp_register_script( 'wpmozo-swiper-script', WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/swiper/js/swiper-bundle.min.js', array(), WPMOZO_PRODUCT_CAROUSEL_VERSION, true );

		wp_register_style( 'wpmozo-swiper-style', WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/swiper/css/swiper-bundle.min.css', array(), WPMOZO_PRODUCT_CAROUSEL_VERSION);

		// rgister fontawesome style.
		wp_register_style( 'wpmozo-fontawesome-style', WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/fontawesome/all.min.css', array(), WPMOZO_PRODUCT_CAROUSEL_VERSION );

		// register the swiper scripts.
		wp_register_script(
			'wpmozo-product-carousel-script',
			WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_URL . 'product-carousel/assets/js/product-carousel.min.js',
			array('jquery','wpmozo-swiper-script','wpmozo-magnific-script'),
			WPMOZO_PRODUCT_CAROUSEL_VERSION,
			true
		);
		wp_register_style(
			'wpmozo-block-product-carousel-style',
			WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_URL . 'product-carousel/assets/css/product-carousel-editor.css',
			array('wp-edit-blocks'),
			WPMOZO_PRODUCT_CAROUSEL_VERSION,
		);
		wp_register_style(
			'wpmozo-product-carousel-style',
			WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_URL . 'product-carousel/assets/css/product-carousel.css',
			array(),
			WPMOZO_PRODUCT_CAROUSEL_VERSION,
		);

		wp_register_style(
			'wpmozo-placeholder',
			WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'placeholder-loading.css',
			array(),
			WPMOZO_PRODUCT_CAROUSEL_VERSION
		);

		// register the magnific popup scripts.
		wp_register_script(
			'wpmozo-magnific-script',
			WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/magnific/js/jquery.magnific-popup.min.js',
			array('jquery'),
			WPMOZO_PRODUCT_CAROUSEL_VERSION,
			true
		);
		wp_register_style(
			'wpmozo-magnific-style',
			WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL . 'frontend/magnific/css/magnific-popup.css',
			array(),
			WPMOZO_PRODUCT_CAROUSEL_VERSION,
		);

		// register product carousel block script.
		wp_register_script( 'wpmozo-block-product-carousel-script',
			WPMOZO_PRODUCT_CAROUSEL_PLUGIN_DIR_URL . 'build/index.min.js',
			array( 'wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'wp-i18n', 'jquery' ),
			WPMOZO_PRODUCT_CAROUSEL_VERSION
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

		$attributes = array(
			'clientId'                               => array(
				'type' => 'string',
			),
			'CAlign'                                 => array(
				'type' => 'string',
			),
			'Columns'                                => array(
				'type'    => 'integer',
				'default' => 4,
			),
			'SlidesToScroll'                         => array(
				'type'    => 'integer',
				'default' => 4,
			),
			'SpaceBetween'                           => array(
				'type'    => 'integer',
				'default' => 20,
			),
			'AutoPlay'                               => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'Delay'                                  => array(
				'type'    => 'integer',
				'default' => 3000,
			),
			'Loop'                                   => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'ShowNavigation'                         => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'ShowPagination'                         => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'EqualSlideHeight'                       => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'PaginationType'                         => array(
				'type'    => 'string',
				'default' => 'bullets',
			),
			'mobileColumns'                          => array(
				'type'    => 'integer',
				'default' => 1,
			),
			'mobileSlidesToScroll'                   => array(
				'type'    => 'integer',
				'default' => 1,
			),
			'mobileSpaceBetween'                     => array(
				'type'    => 'integer',
				'default' => 20,
			),
			'tabletColumns'                          => array(
				'type'    => 'integer',
				'default' => 2,
			),
			'tabletSlidesToScroll'                   => array(
				'type'    => 'integer',
				'default' => 2,
			),
			'tabletSpaceBetween'                     => array(
				'type'    => 'integer',
				'default' => 20,
			),
			'ProductViewType'                        => array(
				'type'    => 'string',
				'default' => 'default',
			),
			'NumberOfProducts'                       => array(
				'type'    => 'string',
				'default' => '10',
			),
			'Offset'                                 => array(
				'type' => 'string',
			),
			'OrderBy'                                => array(
				'type'    => 'string',
				'default' => 'date',
			),
			'Order'                                  => array(
				'type'    => 'string',
				'default' => 'DESC',
			),
			'IncludeCategories'                      => array(
				'type' => 'array',
			),
			'IncludeTags'                            => array(
				'type' => 'array',
			),
			'TaxonomiesRelation'                     => array(
				'type'    => 'string',
				'default' => 'AND',
			),
			'OutOfStock'                             => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'Layout'                                 => array(
				'type'    => 'string',
				'default' => 'default',
			),
			'DisplayOutOfStockLabel'                 => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'OutOfStockLabel'                        => array(
				'type' => 'string',
			),
			'EnableQuickViewLink'                    => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'QuickViewLinkText'                      => array(
				'type'    => 'string',
				'default' => 'Quick View',
			),
			'QuickViewLinkIconEnabled'               => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'QuickViewLinkIcon'                      => array(
				'type'    => 'string',
				'default' => 'fas fa-eye',
			),
			'QuickViewLinkCustomIcon'                => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'QuickViewLinkImg'                       => array(
				'type'    => 'string',
				'default' => '',
			),
			'ShowTitle'                              => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'ShowFeaturedImage'                      => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'FeaturedImageSize'                      => array(
				'type'    => 'string',
				'default' => 'woocommerce_thumbnail',
			),
			'ShowRating'                             => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'ShowPrice'                              => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'ShowAddToCartButton'                    => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'ShowSaleBadge'                          => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'SaleBadgeType'                          => array(
				'type'    => 'string',
				'default' => 'sale_label',
			),
			'SaleLabelText'                          => array(
				'type'    => 'string',
				'default' => '',
			),
			'CarouContStylepadding'                  => array(
				'type'    => 'object',
				'default' => array(
					'bottom' => '20px',
					'left'   => '20px',
					'right'  => '20px',
					'top'    => '20px',
				),
			),
			'CarouNavigationStyleFontSize'           => array(
				'type' => 'string',
			),
			'CarouNavigationStyletext'               => array(
				'type' => 'string',
			),
			'CarouNavigationStylebackground'         => array(
				'type' => 'string',
			),
			'CarouNavigationStyleFontAppearance'     => array(
				'type'       => 'object',
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontWeight' => '',
				),
			),
			'CarouNavigationStylepadding'            => array(
				'type' => 'object',
			),
			'CarouNavigationStylemargin'             => array(
				'type' => 'object',
			),
			'CarouNavigationStyleposition'           => array(
				'type' => 'object',
			),
			'CarouNavigationLeftposition'            => array(
				'type' => 'object',
			),
			'CarouNavigationRightposition'           => array(
				'type' => 'object',
			),
			'CarouPaginationFontSize'                => array(
				'type' => 'string',
			),
			'CarouPaginationtext'                    => array(
				'type' => 'string',
			),
			'CarouPaginationbackground'              => array(
				'type' => 'string',
			),
			'CarouPaginationwidth'                   => array(
				'type' => 'string',
			),
			'CarouPaginationheight'                  => array(
				'type' => 'string',
			),
			'TitleStyleFontSize'                     => array(
				'type'    => 'string',
				'default' => '',
			),
			'TitleStyleFontAppearance'               => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'TitleStyleLetterSpacing'                => array(
				'type'    => 'string',
				'default' => '',
			),
			'TitleStyleDecoration'                   => array(
				'type'    => 'string',
				'default' => '',
			),
			'TitleStyleLetterCase'                   => array(
				'type'    => 'string',
				'default' => '',
			),
			'TitleStyleLineHeight'                   => array(
				'type'    => 'string',
				'default' => '',
			),
			'TitleStyletext'                         => array(
				'type'    => 'string',
				'default' => '',
			),
			'PriceStyleFontSize'                     => array(
				'type'    => 'string',
				'default' => '',
			),
			'PriceStyleFontAppearance'               => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'PriceStyleLetterSpacing'                => array(
				'type'    => 'string',
				'default' => '',
			),
			'PriceStyleDecoration'                   => array(
				'type'    => 'string',
				'default' => '',
			),
			'PriceStyleLetterCase'                   => array(
				'type'    => 'string',
				'default' => '',
			),
			'PriceStyleLineHeight'                   => array(
				'type'    => 'string',
				'default' => '',
			),
			'PriceStyletext'                         => array(
				'type'    => 'string',
				'default' => '',
			),
			'SaleLabelStyleFontSize'                 => array(
				'type'    => 'string',
				'default' => '',
			),
			'SaleLabelStyleFontAppearance'           => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'SaleLabelStyleLetterSpacing'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'SaleLabelStyleDecoration'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'SaleLabelStyleLetterCase'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'SaleLabelStyleLineHeight'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'SaleLabelStyletext'                     => array(
				'type'    => 'string',
				'default' => '',
			),
			'SaleLabelStylebackground'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'StockLabelStyleFontSize'                => array(
				'type'    => 'string',
				'default' => '14px',
			),
			'StockLabelStyleFontAppearance'          => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => 'normal',
					'fontWeight' => '500',
				),
			),
			'StockLabelStyleLetterSpacing'           => array(
				'type'    => 'string',
				'default' => '',
			),
			'StockLabelStyleDecoration'              => array(
				'type'    => 'string',
				'default' => '',
			),
			'StockLabelStyleLetterCase'              => array(
				'type'    => 'string',
				'default' => '',
			),
			'StockLabelStyleLineHeight'              => array(
				'type'    => 'string',
				'default' => '',
			),
			'StockLabelStyledefault'                 => array(
				'padding'  => '',
				'margin'   => '',
				'position' => '',
			),
			'StockLabelStyletext'                    => array(
				'type'    => 'string',
				'default' => '#ff0000',
			),
			'StockLabelStyleborderRadius'            => array(
				'type'    => 'string',
				'default' => '3px',
			),
			'StockLabelStyleborder'                  => array(
				'type'    => 'object',
				'default' => array(
					'width' => '1px',
					'style' => 'solid',
					'color' => '#ff0000',
				),
			),
			'StockLabelStylepadding'                 => array(
				'type'    => 'object',
				'default' => array(
					'bottom' => '5px',
					'left'   => '12px',
					'right'  => '12px',
					'top'    => '5px',
				),
			),
			'StockLabelStylemargin'                  => array(
				'type' => 'object',
			),
			'StockLabelStyleposition'                => array(
				'type' => 'object',
			),
			'AddToCartStyleFontSize'                 => array(
				'type'    => 'string',
				'default' => '',
			),
			'AddToCartStyleFontAppearance'           => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'AddToCartStyleLetterSpacing'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'AddToCartStyleDecoration'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'AddToCartStyleLetterCase'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'AddToCartStyleLineHeight'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'default'                                => array(
				'padding' => '',
			),
			'AddToCartStyletext'                     => array(
				'type'    => 'string',
				'default' => '',
			),
			'AddToCartStylebackground'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'AddToCartStyleborderRadius'             => array(
				'type'    => '',
				'default' => '',
			),
			'AddToCartStyleborder'                   => array(
				'type' => 'object',
			),
			'AddToCartStylepadding'                  => array(
				'type' => 'object',
			),
			'QuickViewStyleFontSize'                 => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStyleFontAppearance'           => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'QuickViewStyleLetterSpacing'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStyleDecoration'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStyleLetterCase'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStyleLineHeight'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStyletext'                     => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStylebackground'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStyleborderRadius'             => array(
				'type'    => '',
				'default' => '',
			),
			'QuickViewStyleborder'                   => array(
				'type' => 'object',
			),
			'QuickViewStylepadding'                  => array(
				'type' => 'object',
			),
			'QuickViewStylemargin'                   => array(
				'type' => 'object',
			),
			'QuickViewStyleposition'                 => array(
				'type' => 'object',
			),
			'QuickViewPopupStylebackground'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewPopupStylepadding'             => array(
				'type'    => 'object',
				'default' => array(
					'bottom' => '20px',
					'left'   => '20px',
					'right'  => '20px',
					'top'    => '20px',
				),
			),
			'QuickViewPopupStylemargin'              => array(
				'type' => 'object',
			),
			'QuickViewPopupStyleposition'            => array(
				'type' => 'object',
			),
			'QuickViewPopupStyleSameAsCarousel'      => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'QuickViewTitleStyleFontSize'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewTitleStyleFontAppearance'      => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'QuickViewTitleStyleLetterSpacing'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewTitleStyleDecoration'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewTitleStyleLetterCase'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewTitleStyleLineHeight'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewTitleStyletext'                => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewPriceStyleFontSize'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewPriceStyleFontAppearance'      => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'QuickViewPriceStyleLetterSpacing'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewPriceStyleDecoration'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewPriceStyleLetterCase'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewPriceStyleLineHeight'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewPriceStyledefault'             => array(
				'text' => '',
			),
			'QuickViewSaleLabelStyleFontSize'        => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewSaleLabelStyleFontAppearance'  => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'QuickViewSaleLabelStyleLetterSpacing'   => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewSaleLabelStyleDecoration'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewSaleLabelStyleLetterCase'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewSaleLabelStyleLineHeight'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewSaleLabelStyletext'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewSaleLabelStylebackground'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStockLabelStyleFontSize'       => array(
				'type'    => 'string',
				'default' => '14px',
			),
			'QuickViewStockLabelStyleFontAppearance' => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => 'normal',
					'fontWeight' => '500',
				),
			),
			'QuickViewStockLabelStyleLetterSpacing'  => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStockLabelStyleDecoration'     => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStockLabelStyleLetterCase'     => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStockLabelStyleLineHeight'     => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewStockLabelStyletext'           => array(
				'type'    => 'string',
				'default' => '#ff0000',
			),
			'QuickViewStockLabelStyleborderRadius'   => array(
				'type'    => 'string',
				'default' => '3px',
			),
			'QuickViewStockLabelStyleborder'         => array(
				'type'    => 'object',
				'default' => array(
					'width' => '1px',
					'style' => 'solid',
					'color' => '#ff0000',
				),
			),
			'QuickViewStockLabelStylepadding'        => array(
				'type'    => 'object',
				'default' => array(
					'bottom' => '5px',
					'left'   => '12px',
					'right'  => '12px',
					'top'    => '5px',
				),
			),
			'QuickViewStockLabelStylemargin'         => array(
				'type' => 'object',
			),
			'QuickViewStockLabelStyleposition'       => array(
				'type' => 'object',
			),
			'QuickViewAddToCartStyleFontSize'        => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewAddToCartStyleFontAppearance'  => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'QuickViewAddToCartStyleLetterSpacing'   => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewAddToCartStyleDecoration'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewAddToCartStyleLetterCase'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewAddToCartStyleLineHeight'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewAddToCartStyletext'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewAddToCartStylebackground'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewAddToCartStyleborderRadius'    => array(
				'type'    => '',
				'default' => '',
			),
			'QuickViewAddToCartStyleborder'          => array(
				'type' => 'object',
			),
			'QuickViewAddToCartStylepadding'         => array(
				'type' => 'object',
			),
			'QuickViewCloseStyleFontSize'            => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewCloseStyleFontAppearance'      => array(
				'type'       => 'object',
				'fontStyle'  => array(
					'type'    => 'string',
					'default' => '',
				),
				'fontWeight' => array(
					'type'    => 'string',
					'default' => '',
				),
				'default'    => array(
					'fontStyle'  => '',
					'fontWeight' => '',
				),
			),
			'QuickViewCloseStyleLetterSpacing'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewCloseStyleDecoration'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewCloseStyleLetterCase'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewCloseStyleLineHeight'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewCloseStyletext'                => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewCloseStylebackground'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'QuickViewCloseStyleborderRadius'        => array(
				'type'    => '',
				'default' => '',
			),
			'QuickViewCloseStyleborder'              => array(
				'type' => 'object',
			),
			'QuickViewCloseStylepadding'             => array(
				'type' => 'object',
			),
			'QuickViewCloseStylemargin'              => array(
				'type' => 'object',
			),
			'QuickViewCloseStyleposition'            => array(
				'type' => 'object',
			),
			'QuickViewCloseStylewidth'               => array(
				'type' => 'string',
			),
			'QuickViewCloseStyleheight'              => array(
				'type' => 'string',
			),
		);

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
