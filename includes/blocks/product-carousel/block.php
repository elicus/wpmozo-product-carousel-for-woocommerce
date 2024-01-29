<?php
/**
 * Render callback woo product carousel file
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes/blocks/product-carousel
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

global $wpmozo_product_carousel_args;
require_once WPMOZO_PRODUCT_CAROUSEL_BLOCKS_DIR_PATH . 'product-carousel/functions.php';

/**
 * Render product carousel markup.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 */
function wpmozo_product_carousel_render_callback( $args ) {

	global $wpmozo_product_carousel_args;
	$wpmozo_product_carousel_args     = $args;
	$qu_args                          = wpmozo_product_carousel_prepare_query_args( $args );
	$pro_query                        = new WP_Query( $qu_args );
	$admin_class                      = ' loading';
	$addi_classes                     = isset( $args['className'] ) ? ' ' . $args['className'] : '';
	$equal_height                     = ( isset( $args['EqualSlideHeight'] ) && $args['EqualSlideHeight'] ) ? ' equal-slide-height' : '';
	$is_display_products              = wpmozo_product_carousel_is_display_products( $args );
	$wpmozo_product_carousel_is_admin = ( isset( $_GET['context'] ) && 'edit' === $_GET['context'] ) // phpcs:ignore
	? true : false;

	if ( ! $is_display_products ) {
		ob_start();
		?>
		<?php if ( $wpmozo_product_carousel_is_admin ) { ?>
			<?php do_action( 'wpmozo_product_carousel_before_noelements', $args ); ?>
				<div class="wpmozo-products-wrap wpmozo-products-noelements-wrap">
					<p class="wpmozo-products-noelements"><?php echo esc_html( apply_filters( 'wpmozo_product_carousel_noelements_text', __( 'All product components have been deactivated through the display settings.', 'wpmozo-products-for-woocommerce' ) ) ); ?></p>
				</div>
			<?php do_action( 'wpmozo_product_carousel_after_noelements', $args ); ?>
		<?php } ?>
		<?php
		return ob_get_clean();
	}

	if ( $wpmozo_product_carousel_is_admin ) {
		$admin_class = '';
		wpmozo_product_carousel_add_hooks_admin_preview( $args );
	}

	ob_start();
	?>
	<?php if ( $pro_query->have_posts() ) { ?>

		<?php wpmozo_product_carousel_before_hooks( $args ); ?>
		<?php do_action( 'wpmozo_product_carousel_before_wraper', $args ); ?>

		<div class="wpmozo-product-carousel-wrap woocommerce swiper <?php echo esc_attr( $args['Layout'] ); ?><?php echo esc_attr( $admin_class ); ?><?php echo esc_attr( $addi_classes ); ?><?php echo esc_attr( $equal_height ); ?>" data-atts='<?php echo esc_attr( wp_json_encode( $args ) ); ?>' id="wpmozo_<?php echo esc_attr( $args['clientId'] ); ?>">

			<?php wpmozo_product_carousel_display_loader( $args ); ?>

			<?php do_action( 'wpmozo_product_carousel_before_ul', $args ); ?>
				<ul class="products swiper-wrapper">
					<?php while ( $pro_query->have_posts() ) { ?>
						<?php
						$pro_query->the_post();
						$product    = wc_get_product( get_the_ID() );
						$visibility = $product->get_catalog_visibility();
						?>
						<?php do_action( 'wpmozo_product_carousel_before_li', $args ); ?>
						<?php if ( 'hidden' !== $visibility ) { ?>
							<?php wc_get_template_part( 'content', 'product' ); ?>
						<?php } ?>
						<?php do_action( 'wpmozo_product_carousel_after_li', $args ); ?>
					<?php } ?>
				</ul>
			<?php do_action( 'wpmozo_product_carousel_after_ul', $args ); ?>
			<?php if ( $args['ShowNavigation'] ) { ?>
				<?php do_action( 'wpmozo_product_carousel_before_navigation', $args ); ?>
					<div class="swiper-navigation swiper-button-next"></div>
					<div class="swiper-navigation swiper-button-prev"></div>
				<?php do_action( 'wpmozo_product_carousel_after_navigation', $args ); ?>
			<?php } ?>
			<?php if ( $args['ShowPagination'] ) { ?>
				<?php do_action( 'wpmozo_product_carousel_before_pagination', $args ); ?>
					<div class="swiper-pagination"></div>
				<?php do_action( 'wpmozo_product_carousel_after_pagination', $args ); ?>
			<?php } ?>
		</div>
		
		<?php wpmozo_product_carousel_after_hooks( $args ); ?>
		<?php do_action( 'wpmozo_product_carousel_after_wraper', $args ); ?>

	<?php } else { ?>
		<?php do_action( 'wpmozo_product_carousel_before_nofound', $args ); ?>
			<div class="wpmozo-product-carousel-nofound-wrap">
				<p class="wpmozo-product-carousel-nofound"><?php echo esc_html( apply_filters( 'wpmozo_product_carousel_nofound_text', __( 'No products found.', 'wpmozo-product-carousel-for-woocommerce' ) ) ); ?></p>
			</div>
		<?php do_action( 'wpmozo_product_carousel_after_nofound', $args ); ?>
	<?php } ?>
	<?php

	wc_reset_loop();
	wp_reset_query();

	return ob_get_clean();

}
