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
	 */
	public static function wpmozo_add_theme_hooks() {

		add_action( 'woocommerce_before_shop_loop_item', 'astra_woo_shop_thumbnail_wrap_start', 6 );
		add_action( 'woocommerce_after_shop_loop_item', 'astra_woo_shop_thumbnail_wrap_end', 8 );

	}

	/**
	 * Add all hooks.
	 *
	 * @since 1.0.0
	 */
	public static function add_hooks() {
	
		add_action( 'enqueue_block_editor_assets', array( WPMozo_Product_Carousel_Support_Astra::class, 'wpmozo_add_editor_style' ), 20 );
		add_action( 'wpmozo_product_carousel_before_hooks', array( WPMozo_Product_Carousel_Support_Astra::class, 'wpmozo_add_theme_hooks' ) );

	}

}
