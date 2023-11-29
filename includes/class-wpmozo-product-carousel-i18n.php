<?php
/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes
 * @author     Elicus <hello@elicus.com>
 */
class WPMozo_Product_Carousel_I18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'wpmozo-product-carousel-for-woocommerce',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
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

		$loader->add_action( 'plugins_loaded', $instance, 'load_plugin_textdomain' );

	}

}
