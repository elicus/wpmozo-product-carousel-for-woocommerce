<?php
/**
 * Define the hooks for Divi theme support.
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes/theme-support
 */

/**
 * This class responsible for Divi theme support.
 *
 * @since      1.0.0
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes/theme-support
 * @author     Elicus <hello@elicus.com>
 */
class WPMozo_Product_Carousel_Support_Divi {

	/**
	 * Enqueue editor style for block.
	 *
	 * @since 1.0.0
	 * @param string $tag    The link tag for the enqueued style.
	 * @param string $handle The style's registered handle.
	 * @param string $href   The stylesheet's source URL.
	 * @param string $media  The stylesheet's media attribute.
	 */
	public static function wpmozo_add_divi_style( $tag, $handle, $href, $media ) {

		if ( 'wp-components' === $handle ) {
			
			$divi_tag = sprintf(
				"<link rel='%s' id='%s-css'%s href='%s'%s media='%s' />\n",
				'stylesheet',
				'wpmozo-block-product-carousel-divi-theme',
				'',
				get_template_directory_uri() . '/style-static.min.css',
				'',
				'all'
			);
			$tag = $divi_tag . $tag;
		}

		return $tag;

	}

	/**
	 * Enqueue editor style for block.
	 *
	 * @since 1.0.0
	 */
	public static function wpmozo_add_editor_style() {

		$custom_css = "
        body{
            font-family: inherit;
		    font-size: inherit;
		    color: inherit;
		    background-color: inherit;
		    line-height: inherit;
		    font-weight: inherit;
        }";
        wp_add_inline_style( 'wp-components', $custom_css );

    }

	/**
	 * Add all hooks.
	 *
	 * @since 1.0.0
	 */
	public static function add_hooks() {

		add_filter('style_loader_tag', array( WPMozo_Product_Carousel_Support_Divi::class, 'wpmozo_add_divi_style' ), 10, 4);
		add_action( 'enqueue_block_editor_assets', array( WPMozo_Product_Carousel_Support_Divi::class, 'wpmozo_add_editor_style' ), 20 );

	}

}
