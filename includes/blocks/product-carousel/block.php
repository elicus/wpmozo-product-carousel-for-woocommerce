<?php
/**
 * Render callback woo product carousel file
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    Wpmozo_Product_Carousel_For_Woocommerce
 * @subpackage Wpmozo_Product_Carousel_For_Woocommerce/includes/blocks/product-carousel
 */

global $wpmozo_product_carousel_args;
require_once WPMOZO_BLOCKS_DIR_PATH . 'product-carousel/functions.php';

/**
 * Render product carousel markup.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 */
function wpmozo_product_carousel_render_callback( $args ){

    global $wpmozo_product_carousel_args;
    $wpmozo_product_carousel_args = $args;
    $qu_args = wpmozo_product_carousel_prepare_query_args( $args );
    $pro_query = new WP_Query( $qu_args );
    ob_start();

    if ( isset( $_GET['context'] ) && 'edit' === $_GET['context'] ) {
        wpmozo_product_carousel_add_hooks_admin_preview( $args );
    }

    ?>
    <?php if ( $pro_query->have_posts() ) { ?>
        <?php wpmozo_product_carousel_before_hooks( $args ); ?>
        <div class="wpmozo-product-carousel-wrap swiper" data-atts='<?php echo json_encode($args); ?>'>
            <div class="swiper-wrapper">
                <?php while ( $pro_query->have_posts() ) { ?>
                    <?php
                    $pro_query->the_post();
                    $product = wc_get_product( get_the_ID() );
                    $visibility = $product->get_catalog_visibility();
                    ?>
                    <?php if ( 'hidden' !== $visibility ) { ?>
                        <div class="swiper-slide woocommerce">
                            <ul class="products">
                                <?php wc_get_template_part( 'content', 'product' ); ?>
                            </ul>
                        </div>
                    <?php } ?>
                <?php } ?>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
        <?php } ?>
        <?php wpmozo_product_carousel_after_hooks( $args ); ?>
    <?php 

    wp_reset_postdata();

    return ob_get_clean();

}
