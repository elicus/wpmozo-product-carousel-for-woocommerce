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
    
    $admin_class = ' loading';
    $addi_classes = isset( $args['className'] ) ? ' '.$args['className'] : '';
    $equal_height = ( isset( $args['EqualSlideHeight'] ) && $args['EqualSlideHeight'] ) ? ' equal-slide-height' : '';

    if ( isset( $_GET['context'] ) && 'edit' === $_GET['context'] ) {
        $admin_class = '';
        wpmozo_product_carousel_add_hooks_admin_preview( $args );
    }
    
    ob_start();
    ?>
    <?php if ( $pro_query->have_posts() ) { ?>
        <?php wpmozo_product_carousel_before_hooks( $args ); ?>
        <div class="wpmozo-product-carousel-wrap woocommerce swiper <?php echo esc_attr( $args['Layout'] ); ?><?php echo esc_attr( $admin_class ); ?><?php echo esc_attr( $addi_classes ); ?><?php echo esc_attr( $equal_height ); ?>" data-atts='<?php echo json_encode($args); ?>' id="wpmozo_<?php echo esc_attr( $args['clientId'] ); ?>">
            <?php if ( ! isset( $_GET['context'] ) ) { ?>
                <div class="wpmozo-loader frontend">
                    <?php for ($i=0; $i < $args['Columns']; $i++) { ?>
                        <div class="ph-item" style="margin-right: <?php echo esc_attr( $args['SpaceBetween'] ); ?>px;">
                            <div class="ph-col-12">
                                <div class="ph-picture"></div>
                                <div class="ph-row">
                                    <div class="ph-col-8"></div>
                                    <div class="ph-col-4 empty"></div>
                                    <div class="ph-col-4"></div>
                                    <div class="ph-col-8 empty"></div>
                                    <div class="ph-col-12 empty"></div>
                                    <div class="ph-col-6 big"></div>
                                    <div class="ph-col-6 empty"></div>
                                </div>
                            </div>
                        </div>
                    <?php } ?>
                </div>  
            <?php } ?>   
            <ul class="products swiper-wrapper">
                <?php while ( $pro_query->have_posts() ) { ?>
                    <?php
                    $pro_query->the_post();
                    $product = wc_get_product( get_the_ID() );
                    $visibility = $product->get_catalog_visibility();
                    ?>
                    <?php if ( 'hidden' !== $visibility ) { ?>
                        <?php wc_get_template_part( 'content', 'product' ); ?>
                    <?php } ?>
                <?php } ?>
            </ul>
            <?php if ( $args['ShowNavigation'] ) { ?>
                <div class="swiper-navigation swiper-button-next"></div>
                <div class="swiper-navigation swiper-button-prev"></div>
            <?php } ?>
            <?php if ( $args['ShowPagination'] ) { ?>
                <div class="swiper-pagination"></div>
            <?php } ?>
        </div>
        <?php wpmozo_product_carousel_after_hooks( $args ); ?>
    <?php }else{ ?>
        <div class="wpmozo-product-carousel-nofound-wrap">
            <p class="wpmozo-product-carousel-nofound"><?php echo esc_html__('No products found.', 'wpmozo-product-carousel-for-woocommerce'); ?></p>
        </div>
    <?php } ?>
    <?php 

    wp_reset_postdata();

    return ob_get_clean();

}
