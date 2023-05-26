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
	 * Add scripts for front.
	 *
	 * @since 1.0.0
	 */
	public function wpmozo_enqueue_scripts() {

		// register the swiper script.
		wp_register_script( 'wpmozo-swiper-script', WPMOZO_ASSE_DIR_URL . 'frontend/swiper/js/swiper-bundle.min.js', array(), time(), true );
		wp_register_style( 'wpmozo-swiper-style', WPMOZO_ASSE_DIR_URL . 'frontend/swiper/css/swiper-bundle.css', array(), time());

		wp_enqueue_script('wpmozo-swiper-script');
		wp_enqueue_style('wpmozo-swiper-style');


	}

	/**
	 * Register the blocks.
	 *
	 * @since 1.0.0
	 */
	public function wpmozo_register_blocks() {

		// register product carousel block script.
		wp_register_script( 'wpmozo-block-product-carousel-script',
			WPMOZO_PLUGIN_DIR_URL . 'build/index.js',
			array( 'wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'wp-i18n', 'jquery' ),
			time()
		);

		$all_options = $this->wpmozo_get_all_settings_options();
		$attributes = $all_options['attributes'];

		wp_localize_script( 'wpmozo-block-product-carousel-script', 'wpmozo_block_carousel_object', $all_options);
		
		require_once WPMOZO_BLOCKS_DIR_PATH . 'product-carousel/block.php';
		register_block_type( 'wpmozo/product-carousel', array(
			'editor_script' => 'wpmozo-block-product-carousel-script',
			'attributes' => $attributes,
			'render_callback' => 'wpmozo_product_carousel_render_callback',
		));


	}

	/**
	 * Register the blocks.
	 *
	 * @since 1.0.0
	 * @return array $all_options All settings options
	 */
	public function wpmozo_get_all_settings_options() {

		$attributes = array(
		 	// Carousel attributes
			'Columns' => array(
			    'type' => 'integer',
			    'default' => 4,
			),
			'Speed' => array(
			    'type' => 'integer',
			    'default' => 1000,
			),
			'SpaceBetween' => array(
			    'type' => 'integer',
			    'default' => 10,
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
			    'default' => 'desc',
			),
			'IncludeCategories' => array(
			    'type' => 'string',
			),
			'IncludeTags' => array(
			    'type' => 'string',
			),
			'TaxonomiesRelation' => array(
			    'type' => 'string',
			    'default' => 'and',
			),
			// Design attributes
			'OutOfStock' => array(
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
			'QuickViewLinkIcon' => array(
			    'type' => 'string',
			    'default' => '',
			),
			'ShowFeaturedImage' => array(
			    'type' => 'boolean',
			    'default' => true,
			),
			'FeaturedImageSize' => array(
			    'type' => 'string',
			    'default' => 'thumbnail',
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
		);

		$product_view_type_options = array(
			array(
			    'label' => __('Default', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'default'
			),
			array(
			    'label' => __('Featured Products', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'featured_products'
			),
			array(
			    'label' => __('Sale Products', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'sale_products'
			),
			array(
			    'label' => __('Best Selling Products', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'best_selling_products'
			),
			array(
			    'label' => __('Top Rated Products', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'top_rated_products'
			),
		);

		$order_by_options = array(
			array(
			    'label' => __('Date', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'date'
			), 
			array(
			    'label' => __('Modified Date', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'modified_date'
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
			    'value' => 'slug'
			),
			array(
			    'label' => __('Id', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'id'
			),
			array(
			    'label' => __('Random', 'wpmozo-product-carousel-for-woocommerce'),
			    'value' => 'random'
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

		$all_options = array( 
			'attributes' => $attributes,
			'order_by_options' => $order_by_options,
			'product_view_type_options' => $product_view_type_options,
		);

		return $all_options;
	}

	/**
	 * Add all hooks
	 *
	 * @since 1.0.0
	 * @param array $loader The instance of loader class.
	 * @param array $instance The instance of this class.
	 */
	public function add_hooks( $loader, $instance ) {

		$loader->add_action( 'wp_enqueue_scripts', $instance, 'wpmozo_enqueue_scripts' );
		$loader->add_action( 'init', $instance, 'wpmozo_register_blocks' );

	}

}