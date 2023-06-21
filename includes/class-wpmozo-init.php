<?php
/**
 * Define the hooks for WP initialization.
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    Wpmozo_Product_Carousel_For_Woocommerce
 * @subpackage Wpmozo_Product_Carousel_For_Woocommerce/includes
 */

/**
 * This class responsible for defining all actions for WP initialization of the plugin.
 *
 * @since      1.0.0
 * @package    Wpmozo_Product_Carousel_For_Woocommerce
 * @subpackage Wpmozo_Product_Carousel_For_Woocommerce/includes
 * @author     Elicus <hello@elicus.com>
 */
class Wpmozo_Init {


	/**
	 * Register the blocks.
	 *
	 * @since 1.0.0
	 */
	public function wpmozo_register_blocks() {
		
		// register the swiper script.
		wp_register_script( 'wpmozo-swiper-script', WPMOZO_ASSE_DIR_URL . 'frontend/swiper/js/swiper-bundle.min.js', array(), time(), true );
		wp_register_style( 'wpmozo-swiper-style', WPMOZO_ASSE_DIR_URL . 'frontend/swiper/css/swiper-bundle.css', array(), time());
		// rgister fontawesome style.
		wp_register_style( 'wpmozo-fontawesome-style', WPMOZO_ASSE_DIR_URL . 'frontend/fontawesome/all.min.css', array(), time());

		// register the swiper scripts.
		wp_register_script( 
			'wpmozo-product-carousel-script',
			WPMOZO_BLOCKS_DIR_URL . 'product-carousel/assets/js/product-carousel.js',
			array('jquery','wpmozo-swiper-script','wpmozo-magnific-script'),
			time(),
			true
		);
		wp_register_style( 
			'wpmozo-block-product-carousel-style',
			WPMOZO_BLOCKS_DIR_URL . 'product-carousel/assets/css/product-carousel-editor.css',
			array('wp-edit-blocks'),
			time(),
		);
		wp_register_style( 
			'wpmozo-product-carousel-style',
			WPMOZO_BLOCKS_DIR_URL . 'product-carousel/assets/css/product-carousel.css',
			array(),
			time(),
		);

		wp_register_style( 'wpmozo-product-carousel-placeholder', 
			WPMOZO_ASSE_DIR_URL . 'placeholder-loading.css',
			array(),
			time()
		);

		// register the magnific popup scripts.
		wp_register_script( 
			'wpmozo-magnific-script',
			WPMOZO_ASSE_DIR_URL . 'frontend/magnific/js/jquery.magnific-popup.min.js',
			array('jquery'),
			time(),
			true
		);
		wp_register_style( 
			'wpmozo-magnific-style',
			WPMOZO_ASSE_DIR_URL . 'frontend/magnific/css/magnific-popup.css',
			array(),
			time(),
		);

		// register product carousel block script.
		wp_register_script( 'wpmozo-block-product-carousel-script',
			WPMOZO_PLUGIN_DIR_URL . 'build/index.js',
			array( 'wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'wp-i18n', 'jquery' ),
			time()
		);

		$all_options = $this->wpmozo_get_all_settings_options();
		$attributes = $all_options['attributes'];

		$products_types = wc_get_product_types();
		$products_type_keys = array_keys( $products_types );
		$all_options['products_types'] = $products_type_keys;

		wp_localize_script( 'wpmozo-block-product-carousel-script', 'wpmozo_block_carousel_object', $all_options);

		$wpmozo_carousel_object = array(
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'loading' => esc_html__('Loading...', 'wpmozo-product-carousel-for-woocommerce'),
			'nonce' => wp_create_nonce('ajax-nonce'),
			'products_types' => $products_type_keys,
		);

		wp_localize_script( 'wpmozo-product-carousel-script', 'wpmozo_carousel_object', $wpmozo_carousel_object);

		$wc_styles = WC_Frontend_Scripts::get_styles();
		$styles_handles = array(
			'wpmozo-swiper-style',
			'wpmozo-product-carousel-style',
			'wpmozo-magnific-style',
			'wpmozo-product-carousel-placeholder',
			'wpmozo-fontawesome-style',
		);
		if ( ! empty( $wc_styles ) ) {
			$wc_styles_handles = array_keys( $wc_styles );
			$styles_handles = array_merge($wc_styles_handles, $styles_handles);
		}
		
		require_once WPMOZO_BLOCKS_DIR_PATH . 'product-carousel/block.php';
		register_block_type( 'wpmozo/product-carousel', array(
			'editor_script' => 'wpmozo-block-product-carousel-script',
			'editor_style' => 'wpmozo-block-product-carousel-style',
			'script_handles' => array(
				'wpmozo-swiper-script',
				'wpmozo-product-carousel-script',
				'wpmozo-magnific-script',
				'wc-add-to-cart-variation',
				'zoom',
				'flexslider',
				'photoswipe-ui-default',
				'wc-single-product',
			),
			'style_handles' => $styles_handles,
			'attributes' => $attributes,
			'render_callback' => 'wpmozo_product_carousel_render_callback',
		));


	}

	/**
	 * Enqueue editor style for block.
	 *
	 * @since 1.0.0
	 */
	public function wpmozo_add_editor_style(){

		if ( has_block( 'wpmozo/product-carousel' ) ) {

			global $wp_filter;
			$wc_styles = WC_Frontend_Scripts::get_styles();

			if ( empty( $wc_styles ) ) {
				
				$all_hooks = $wp_filter['woocommerce_enqueue_styles'];
				$all_callbacks = $all_hooks->callbacks;

				// Remove all filter for enqueue style.
				if ( ! empty( $all_callbacks ) ) {
					foreach ($all_callbacks as $priority => $_callback) {
						if ( is_array( $_callback ) ) {
							foreach ($_callback as $funname => $__callback) {
								remove_filter( 'woocommerce_enqueue_styles', $__callback['function'], $priority, $__callback['accepted_args'] );
							}
						}else{
							remove_filter( 'woocommerce_enqueue_styles', $_callback['function'], $priority, $_callback['accepted_args'] );
						}
					}
				}

				$wc_styles = WC_Frontend_Scripts::get_styles();
				if ( $wc_styles ) {
					foreach ( $wc_styles as $handle => $args ) {
						if ( ! isset( $args['has_rtl'] ) ) {
							$args['has_rtl'] = false;
						}
						wp_enqueue_style( $handle, $args['src'], $args['deps'], $args['version'], $args['media'], $args['has_rtl'] );
					}
				}

				// Add all filter for enqueue style.
				if ( ! empty( $all_callbacks ) ) {
					foreach ($all_callbacks as $priority => $_callback) {
						if ( is_array( $_callback ) ) {
							foreach ($_callback as $funname => $__callback) {
								add_filter( 'woocommerce_enqueue_styles', $__callback['function'], $priority, $__callback['accepted_args'] );
							}
						}else{
							add_filter( 'woocommerce_enqueue_styles', $_callback['function'], $priority, $_callback['accepted_args'] );
						}
					}
				}

			}

		}
			
	}

	/**
	 * Register the blocks.
	 *
	 * @since 1.0.0
	 * @return array $all_options All settings options
	 */
	public function wpmozo_get_all_settings_options() {

		$typography_atts = array(
			'type' => 'object',
			'FontSize' => array(
		    	'type' => 'string',
		    	'default' => '',
		    ),
		    'FontAppearance' => array(
		    	'type' => 'object',
			    'fontStyle' => array(
			    	'type' => 'string',
			    	'default' => '',
			    ),
			    'fontWeight' => array(
			    	'type' => 'string',
			    	'default' => '',
			    ),
		    	'default' => array(
		    		'fontStyle' => '',
		    		'fontWeight' => '',
		    	),
		    ),
		    'LetterSpacing' => array(
		    	'type' => 'string',
		    	'default' => '',
		    ),
		    'Decoration' => array(
		    	'type' => 'string',
		    	'default' => '',
		    ),
		    'LetterCase' => array(
		    	'type' => 'string',
		    	'default' => '',
		    ),
		    'default' => array(
		    	'FontSize' => '',
		    	'FontAppearance' => array(
		    		'fontStyle' => '',
		    		'fontWeight' => '',
		    	),
		    	'LetterSpacing' => '',
		    	'Decoration' => '',
		    	'LetterCase' => '',
		    ),
		);

		$attributes = array(
			'clientId' => array(
			    'type' => 'string',
			),
		 	// Carousel attributes
			'Columns' => array(
			    'type' => 'integer',
			    'default' => 4,
			),
			'SpaceBetween' => array(
			    'type' => 'integer',
			    'default' => 10,
			),
			'AutoPlay' => array(
			    'type' => 'boolean',
			    'default' => false,
			),
			'Delay' => array(
			    'type' => 'integer',
			    'default' => 3000,
			),
			'Loop' => array(
			    'type' => 'boolean',
			    'default' => false,
			),
			'ShowNavigation' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'ShowPagination' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'PaginationType' => array(
			    'type' => 'string',
			    'default' => 'bullets',
			),
			// Query attributes
			'ProductViewType' => array(
			    'type' => 'string',
			    'default' => 'default',
			),
			'NumberOfProducts' => array(
			    'type' => 'string',
			    'default' => '10',
			),
			'Offset' => array(
			    'type' => 'string',
			),
			'OrderBy' => array(
			    'type' => 'string',
			    'default' => 'date',
			),
			'Order' => array(
			    'type' => 'string',
			    'default' => 'DESC',
			),
			'IncludeCategories' => array(
			    'type' => 'array',
			),
			'IncludeTags' => array(
			    'type' => 'array',
			),
			'TaxonomiesRelation' => array(
			    'type' => 'string',
			    'default' => 'AND',
			),
			'OutOfStock' => array(
			    'type' => 'boolean',
			    'default' => false,
			),
			// Display attributes
			'Layout' => array(
			    'type' => 'string',
			    'default' => 'default',
			),
			'DisplayOutOfStockLabel' => array(
			    'type' => 'boolean',
			    'default' => false,
			),
			'OutOfStockLabel' => array(
			    'type' => 'string',
			),
			'EnableQuickViewLink' => array(
			    'type' => 'boolean',
			    'default' => false,
			),
			'QuickViewLinkText' => array(
			    'type' => 'string',
			    'default' => '',
			),
			'QuickViewLinkIconEnabled' => array(
			    'type' => 'boolean',
			    'default' => false,
			),
			'QuickViewLinkIcon' => array(
			    'type' => 'string',
			    'default' => 'fas fa-eye',
			),
			'QuickViewLinkCustomIcon' => array(
			    'type' => 'boolean',
			    'default' => false,
			),
			'QuickViewLinkImg' => array(
			    'type' => 'string',
			    'default' => '',
			),
			'ShowFeaturedImage' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'FeaturedImageSize' => array(
			    'type' => 'string',
			    'default' => 'woocommerce_thumbnail',
			),
			'ShowRating' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'ShowPrice' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'ShowAddToCartButton' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'ShowSaleBadge' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'SaleBadgeType' => array(
			    'type' => 'string',
			    'default' => 'sale_label',
			),
			'SaleLabelText' => array(
			    'type' => 'string',
			    'default' => '',
			),
			// Styles attributes
			'TitleStyle' => $typography_atts,
			'PriceStyle' => $typography_atts,
			'AddToCartStyle' => $typography_atts,
			'QuickViewStyle' => $typography_atts,
			'SaleLabelStyle' => $typography_atts,
			'StockLabelStyle' => $typography_atts,
		);

		$product_view_type_options = array(
			array(
			    'label' => __('Default', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'default'
			),
			array(
			    'label' => __('Featured Products', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'featured'
			),
			array(
			    'label' => __('Sale Products', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'sale'
			),
			array(
			    'label' => __('Best Selling Products', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'best_selling'
			),
			array(
			    'label' => __('Top Rated Products', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'top_rated'
			),
		);

		$order_by_options = array(
			array(
			    'label' => __('Date', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'date'
			), 
			array(
			    'label' => __('Modified Date', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'modified'
			),
			array(
			    'label' => __('Menu Order', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'menu_order'
			),
			array(
			    'label' => __('Title', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'title'
			),
			array(
			    'label' => __('Slug', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'name'
			),
			array(
			    'label' => __('Id', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'ID'
			),
			array(
			    'label' => __('Random', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'rand'
			),
			array(
			    'label' => __('Stock Status', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'stock_status'
			),
			array(
			    'label' => __('Price', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'price'
			),
			array(
			    'label' => __('None', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'none'
			),
		);

		$get_all_sizes = wp_get_registered_image_subsizes();
		$all_sizes = array();

		if ( ! empty( $get_all_sizes ) ) {
			foreach ($get_all_sizes as $key => $size) {
				$all_sizes[] = array(
					'label' => $key,
					'value' => $key
				);
			}
		}

		$all_badge_types = array(
			array(
				'label' => __('Sale Label', 'wpmozo-product-carousel-for-woocommerce'),
				'value' => 'sale_label',
			),
			array(
				'label' => __('Sale Percentage', 'wpmozo-product-carousel-for-woocommerce'),
				'value' => 'percentage',
			),
		);

		$all_layouts = array(
			array(
				'label' => __('Default', 'wpmozo-product-carousel-for-woocommerce'),
				'value' => 'default',
			),
			array(
				'label' => __('Layout 1', 'wpmozo-product-carousel-for-woocommerce'),
				'value' => 'layout-1',
			),
			array(
				'label' => __('Layout 3', 'wpmozo-product-carousel-for-woocommerce'),
				'value' => 'layout-3',
			),
		);

		$icons = $this->wpmozo_get_icons();

		$all_options = array( 
			'attributes' => $attributes,
			'order_by_options' => $order_by_options,
			'product_view_type_options' => $product_view_type_options,
			'all_sizes' => $all_sizes,
			'all_badge_types' => $all_badge_types,
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'all_layouts' => $all_layouts,
			'icons' => $icons,
		);

		return $all_options;
	}

	/**
	 * Get font awesome icons array
	 *
	 * @since 1.0.0
	 * @return array $icons All icons.
	 */
	public function wpmozo_get_icons(){

		$json = file_get_contents(WPMOZO_ASSE_DIR_URL . 'frontend/fontawesome/fonts.json');
		$icons = json_decode( $json );
		return $icons;
	}

	/**
	 * Add all hooks
	 *
	 * @since 1.0.0
	 * @param array $loader The instance of loader class.
	 * @param array $instance The instance of this class.
	 */
	public function add_hooks( $loader, $instance ) {

		$loader->add_action( 'init', $instance, 'wpmozo_register_blocks' );
		$loader->add_action('enqueue_block_editor_assets', $instance, 'wpmozo_add_editor_style' );

	}

}