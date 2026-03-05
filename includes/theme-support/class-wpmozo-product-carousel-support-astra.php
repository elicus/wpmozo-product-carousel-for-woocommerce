<?php
/**
 * Define the hooks for Astra theme support.
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes/theme-support
 */

/**
 * This class responsible for Astra theme support.
 *
 * @since      1.0.0
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes/theme-support
 * @author     Elicus <hello@elicus.com>
 */
class WPMozo_Product_Carousel_Support_Astra {

	/**
	 * The array of product itme to display.
	 *
	 * @since 1.0.0
	 * @access public
	 * @var array $product_structure array of product itme.
	 */
	public static $product_structure = array();

	/**
	 * Enqueue editor style for block.
	 *
	 * @since 1.0.0
	 */
	public static function wpmozo_add_editor_style() {

		wp_enqueue_style( 'astra-theme-css', ASTRA_THEME_URI . 'assets/css/minified/main.min.css' );

		$Astra_Woocommerce = Astra_Woocommerce::get_instance();
		add_filter('astra_get_option_woo_support_global_settings', '__return_false');
		$Astra_Woocommerce->add_scripts_styles();
		remove_filter('astra_get_option_woo_support_global_settings', '__return_false');

	}

	/**
	 * Add theme's custom hooks.
	 *
	 * @since 1.0.0
	 * @param array $args The arguments of carousel.
	 */
	public static function wpmozo_add_theme_before_hooks( $args ) {

		if ( 
			( 'layout-1' === $args['Layout'] || 'layout-2' === $args['Layout'] ) ||
			'default' === $args['Layout']
		) {

			$is_remove = ( 'default' === $args['Layout'] ) ? true : false;

			if ( $args['ShowRating'] && ! has_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating' ) && ! $is_remove ) {
				add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
			}else if ( ! $args['ShowRating'] ){
				self::$product_structure[] = 'ratings';
				remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
			}

			if ( $args['ShowTitle'] && ! has_action( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title' ) && ! $is_remove ) {
				add_action( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10 );
			}else if ( ! $args['ShowTitle'] ) {
				self::$product_structure[] = 'title';
				remove_action( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 5 );
			}

			if ( $args['ShowPrice'] && ! has_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price' ) && ! $is_remove ) {
				add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
			}else if ( ! $args['ShowPrice'] ) {
				self::$product_structure[] = 'price';
				remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
			}

			if ( $args['ShowAddToCartButton'] && ! has_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart' ) && ! $is_remove ) {
				add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
			}else if ( ! $args['ShowAddToCartButton'] ) {
				self::$product_structure[] = 'add_cart';
				remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
			}

			if ( $args['ShowSaleBadge'] && ! has_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash' ) && ! $is_remove ) {
				add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
			}else if ( ! $args['ShowSaleBadge'] ) {
				if ( astra_is_shop_page_modern_style() ) {
					$Astra_Woocommerce = Astra_Woocommerce::get_instance();
					remove_filter( 'woocommerce_sale_flash', array( $Astra_Woocommerce, 'sale_flash' ), 10, 3 );
					remove_action( 'woocommerce_after_shop_loop_item', array( $Astra_Woocommerce, 'add_modern_triggers_on_image' ), 5 );
				}
			}
		}

	}

	/**
	 * Add theme's custom hooks.
	 *
	 * @since 1.0.0
	 * @param array $args The arguments of carousel.
	 */
	public static function wpmozo_add_theme_after_hooks( $args ) {

		if ( 'layout-1' === $args['Layout'] || 'layout-2' === $args['Layout'] ) {
			remove_action( 'woocommerce_before_shop_loop_item', 'astra_woo_shop_thumbnail_wrap_start', 6 );
			remove_action( 'woocommerce_after_shop_loop_item', 'astra_woo_shop_thumbnail_wrap_end', 8 );
			remove_action( 'woocommerce_shop_loop_item_title', 'astra_woo_shop_out_of_stock', 8 );
			remove_action( 'woocommerce_after_shop_loop_item', 'astra_woo_woocommerce_shop_product_content' );
		}else{
			add_action( 'woocommerce_before_shop_loop_item', 'astra_woo_shop_thumbnail_wrap_start', 6 );
			add_action( 'woocommerce_after_shop_loop_item', 'astra_woo_shop_thumbnail_wrap_end', 8 );
		}

	}

	/**
	 * Display product items.
	 *
	 * @since 1.0.0
	 * @param array $product_structure The arguments of carousel.
	 */
	public static function wpmozo_product_structure( $product_structure ) {

		$new_structure = array();
		foreach ($product_structure as $key => $value) {
			if ( ! in_array( $value , self::$product_structure ) ) {
				$new_structure[] = $value;
			}
		}

		return $new_structure;

	}

	/**
	 * Add all hooks.
	 *
	 * @since 1.0.0
	 */
	public static function add_hooks() {

		if ( astra_is_shop_page_modern_style() ) {
			add_action( 'enqueue_block_editor_assets', array( WPMozo_Product_Carousel_Support_Astra::class, 'wpmozo_add_editor_style' ), 20 );
		}

		add_action( 'wpmozo_product_carousel_before_hooks_before', array( WPMozo_Product_Carousel_Support_Astra::class, 'wpmozo_add_theme_before_hooks' ) );
		add_action( 'wpmozo_product_carousel_before_hooks_after', array( WPMozo_Product_Carousel_Support_Astra::class, 'wpmozo_add_theme_after_hooks' ) );
		add_filter( 'astra_woo_shop_product_structure', array( WPMozo_Product_Carousel_Support_Astra::class, 'wpmozo_product_structure' ) );

	}

}
