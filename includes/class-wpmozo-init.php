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
		
		require_once WPMOZO_BLOCKS_DIR_PATH . 'product-carousel/block.php';
		register_block_type( 'wpmozo/product-carousel', array(
			'editor_script' => 'wpmozo-block-product-carousel-script',
			'attributes' => array(
			),
			'render_callback' => 'wpmozo_product_carousel_render_callback',
		));


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