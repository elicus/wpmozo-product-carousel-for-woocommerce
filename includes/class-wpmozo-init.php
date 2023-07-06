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

		$wc_styles = $this->wpmozo_wc_styles;
		$styles_handles = array(
			'wpmozo-swiper-style',
			'wpmozo-magnific-style',
			'wpmozo-product-carousel-placeholder',
			'wpmozo-fontawesome-style',
			'wpmozo-product-carousel-style',
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
	public function wpmozo_set_wc_styles(){

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

		$this->wpmozo_wc_styles = $wc_styles;

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

		$text_color_atts = array(
			'type' => 'object',
			'text' => array( 
				'type' => 'string',
		    	'default' => '',
			),
			'default' => array(
				'text' => '',
			),
		);

		$two_color_atts = array(
			'type' => 'object',
			'text' => array( 
				'type' => 'string',
		    	'default' => '',
			),
			'background' => array( 
				'type' => 'string',
		    	'default' => '',
			),
			'default' => array(
				'text' => '',
				'background' => '',
			),
		);

		$background_color_atts = array(
			'type' => 'object',
			'background' => array( 
				'type' => 'string',
		    	'default' => '',
			),
			'default' => array(
				'background' => '',
			),
		);

		$border_atts = array(
			'type' => 'object',
			'borderRadius' => array(
		    	'type' => 'string',
		    	'default' => '',
		    ),
		    'border' => array(
		    	'type' => 'object',
		    ),
		    'default' => array(
		    	'borderRadius' => '',
		    	'border' => array(),
		    ),
		);

		$dimensions_atts = array(
			'type' => 'object',
			'padding' => array(
				'type' => 'object',
			),
			'margin' => array(
				'type' => 'object',
			),
			'position' => array(
				'type' => 'object',
			),
			'default' => array(
				'padding' => '',
				'margin' => '',
				'position' => '',
			),
		);

		$only_padding_atts = array(
			'type' => 'object',
			'padding' => array(
				'type' => 'object',
			),
			'default' => array(
				'padding' => '',
			),
		);

		$size_atts = array(
			'type' => 'object',
			'width' => array(
				'type' => 'string',
			),
			'height' => array(
				'type' => 'string',
			),
			'default' => array(
				'width' => '',
				'height' => '',
			),
		);

		$stocklabel_color_atts = $text_color_atts;
		$stocklabel_color_atts['default']['text'] = '#ff0000';

		$stocklabel_style_atts = $typography_atts;
		$stocklabel_style_atts['default']['FontSize'] = '14px';
		$stocklabel_style_atts['default']['FontAppearance']['fontWeight'] = '500';

		$stocklabel_border_atts = $border_atts;
		$stocklabel_border_atts['default']['border'] = array(
    		'width' => '1px',
    		'style' => 'solid',
    		'color' => 'red',
    	);
    	$stocklabel_border_atts['default']['borderRadius'] = '3px';

    	$stocklabel_dimensions_atts = $dimensions_atts; 
    	$stocklabel_dimensions_atts['default']['padding'] = array(
			'bottom' => '5px',
			'left' => '12px',
			'right' => '12px',
			'top' => '5px',
		);

    	$quickpopup_dimensions_atts = $dimensions_atts;
    	$quickpopup_dimensions_atts['default']['padding'] = array(
			'bottom' => '10px',
			'left' => '10px',
			'right' => '10px',
			'top' => '10px',
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
			'SlidesToScroll' => array(
			    'type' => 'integer',
			    'default' => 4,
			),
			'SpaceBetween' => array(
			    'type' => 'integer',
			    'default' => 20,
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
			'EqualSlideHeight' => array(
			    'type' => 'boolean',
			    'default' => false,
			),
			'PaginationType' => array(
			    'type' => 'string',
			    'default' => 'bullets',
			),
			// Responsive attributes
			'Responsive' => array(
			    'type' => 'object',
			    'mobile' => array(
			    	'type' => 'object',
			    ),
			    'tablet' => array(
			    	'type' => 'object',
			    ),
			    'default' => array(
			    	'mobile' => array(
			    		'Columns' =>  1,
						'SlidesToScroll' => 1,
						'SpaceBetween' => 20,
			    	),
			    	'tablet' => array(
			    		'Columns' => 2,
						'SlidesToScroll' => 2,
						'SpaceBetween' => 20,
			    	),
			    ),
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
			'CarouContStyle' => array(
				'type' => 'object',
				'padding' => array(
					'type' => 'object',
				),
				'default' => array(
					'padding' => array(
						'bottom' => '20px',
						'left' => '20px',
						'right' => '20px',
						'top' => '20px',
					),
				),
			),
			'CarouNavigation' => array(
				'type' => 'object',
				'FontSize' => array(
					'type' => 'string',
				),
				'Color' => array(
					'type' => 'string',
				),
				'background' => array(
					'type' => 'string',
				),
				'FontAppearance' => array(
			    	'type' => 'object',
				    'fontWeight' => array(
				    	'type' => 'string',
				    	'default' => '',
				    ),
			    	'default' => array(
			    		'fontWeight' => '',
			    	),
			    ),
			    'padding' => array(
					'type' => 'object',
				),
				'margin' => array(
					'type' => 'object',
				),
				'position' => array(
					'type' => 'object',
				),
				'default' => array(
					'FontSize' => '',
					'Color' => '',
					'background' => '',
					'FontAppearance' => array(
			    		'fontWeight' => '',
			    	),
			    	'padding' => '',
			    	'margin' => '',
				),
			),
			'CarouNavigationLeft' => array(
				'type' => 'object',
				'position' => array(
					'type' => 'object',
				),
				'default' => array(
					'position' => '',
				),
			),
			'CarouNavigationRight' => array(
				'type' => 'object',
				'position' => array(
					'type' => 'object',
				),
				'default' => array(
					'position' => '',
				),
			),
			'CarouPagination' => array(
				'type' => 'object',
				'FontSize' => array(
					'type' => 'string',
				),
				'Color' => array(
					'type' => 'string',
				),
				'background' => array(
					'type' => 'string',
				),
				'width' => array(
					'type' => 'string',
				),
				'height' => array(
					'type' => 'string',
				),
				'default' => array(
					'FontSize' => '',
					'Color' => '',
					'background' => '',
					'width' => '',
					'height' => '',
				),
			),
			'TitleStyle' => $typography_atts,
			'PriceStyle' => $typography_atts,
			'AddToCartStyle' => $typography_atts,
			'QuickViewStyle' => $typography_atts,
			'SaleLabelStyle' => $typography_atts,
			'StockLabelStyle' => $stocklabel_style_atts,
			'TitleColor' => $text_color_atts,
			'PriceColor' => $text_color_atts,
			'AddToCartColor' => $two_color_atts,
			'QuickViewColor' => $two_color_atts,
			'SaleLabelColor' => $two_color_atts,
			'StockLabelColor' => $stocklabel_color_atts,
			'AddToCartBorder' => $border_atts,
			'QuickViewBorder' => $border_atts,
			'AddToCartDimensions' => $only_padding_atts,
			'QuickViewDimensions' => $only_padding_atts,
			'SameAsCarousel' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'QuickViewPopupBackground' => $background_color_atts,
			'QuickViewPopupDimensions' => $quickpopup_dimensions_atts,
			'QuickViewTitleStyle' => $typography_atts,
			'QuickViewPriceStyle' => $typography_atts,
			'QuickViewAddToCartStyle' => $typography_atts,
			'QuickViewSaleLabelStyle' => $typography_atts,
			'QuickViewStockLabelStyle' => $stocklabel_style_atts,
			'QuickViewTitleColor' => $text_color_atts,
			'QuickViewPriceColor' => $text_color_atts,
			'QuickViewAddToCartColor' => $two_color_atts,
			'QuickViewSaleLabelColor' => $two_color_atts,
			'QuickViewStockLabelColor' => $stocklabel_color_atts,
			'QuickViewAddToCartBorder' => $border_atts,
			'QuickViewAddToCartDimensions' => $only_padding_atts,
			'StockLabelBorder' => $stocklabel_border_atts,
			'StockLabelDimensions' => $stocklabel_dimensions_atts,
			'QuickViewStockLabelBorder' => $stocklabel_border_atts,
			'QuickViewStockLabelDimensions' => $stocklabel_dimensions_atts,
			'QuickViewCloseStyle' =>  $typography_atts,
			'QuickViewCloseColor' => $two_color_atts,
			'QuickViewCloseBorder' => $border_atts,
			'QuickViewCloseDimensions' => $only_padding_atts,
			'QuickViewCloseSize' => $size_atts,
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
				'label' => __('Layout 2', 'wpmozo-product-carousel-for-woocommerce'),
				'value' => 'layout-2',
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

		$json = file_get_contents(WPMOZO_PLUGIN_DIR_PATH . 'assets/frontend/fontawesome/fonts.json');
		if ( empty( $json ) ) {
			return array();
		}
		$icons = json_decode( $json );
		return $icons;
	}

	/**
	 * Add block category
	 *
	 * @param array $categories The block categories.
	 * @return array The block categories.
	 */
	public function wpmozo_block_category( $categories ) {
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
	 * Add all hooks
	 *
	 * @since 1.0.0
	 * @param array $loader The instance of loader class.
	 * @param array $instance The instance of this class.
	 */
	public function add_hooks( $loader, $instance ) {

		$loader->add_filter( 'block_categories_all', $instance, 'wpmozo_block_category', 10, 2 );
		$loader->add_action( 'init', $instance, 'wpmozo_register_blocks' );
		$loader->add_action('enqueue_block_editor_assets', $instance, 'wpmozo_add_editor_style' );

	}

}