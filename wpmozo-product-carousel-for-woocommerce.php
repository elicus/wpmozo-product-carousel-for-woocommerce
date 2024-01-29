<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://elicus.com
 * @since             1.0.0
 * @package           WPMozo_Product_Carousel_For_Woocommerce
 *
 * @wordpress-plugin
 * Plugin Name:       WPMozo Product Carousel For WooCommerce
 * Plugin URI:        https://wpmozo.com/product/wpmozo-product-carousel-for-woocommerce
 * Description:       This plugin will create gutenberg block for woocommerce product carousel.
 * Version:           1.0.0
 * Author:            Elicus
 * Author URI:        https://elicus.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wpmozo-product-carousel-for-woocommerce
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Current plugin version.
define( 'WPMOZO_PRODUCT_CAROUSEL_VERSION', '1.0.0' );

// Plugin main file.
define( 'WPMOZO_PRODUCT_CAROUSEL_FILE', __FILE__ );

// Plugin dir path.
define( 'WPMOZO_PRODUCT_CAROUSEL_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );

// Plugin dir url.
define( 'WPMOZO_PRODUCT_CAROUSEL_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );

// Includes dir path.
define( 'WPMOZO_PRODUCT_CAROUSEL_INC_DIR_PATH', WPMOZO_PRODUCT_CAROUSEL_PLUGIN_DIR_PATH . 'includes/' );

// Includes dir url.
define( 'WPMOZO_PRODUCT_CAROUSEL_INC_DIR_URL', WPMOZO_PRODUCT_CAROUSEL_PLUGIN_DIR_URL . 'includes/' );

// Blocks dir path.
define( 'WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_PATH', WPMOZO_PRODUCT_CAROUSEL_INC_DIR_PATH . 'blocks/' );

// Blocks dir url.
define( 'WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_URL', WPMOZO_PRODUCT_CAROUSEL_INC_DIR_URL . 'blocks/' );

// Assets dir url.
define( 'WPMOZO_PRODUCT_CAROUSEL_ASSE_DIR_URL', WPMOZO_PRODUCT_CAROUSEL_PLUGIN_DIR_URL . 'assets/' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-wpmozo-product-carousel-for-woocommerce.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function wpmozo_product_run_carousel_for_woocommerce() {

	$wpmozo = new WPMozo_Product_Carousel_For_Woocommerce();
	if ( ! class_exists( 'WooCommerce' ) ) {
		$wpmozo->deactivate();
	} else {
		$wpmozo->run();
	}

}
add_action( 'plugins_loaded', 'wpmozo_product_run_carousel_for_woocommerce' );
