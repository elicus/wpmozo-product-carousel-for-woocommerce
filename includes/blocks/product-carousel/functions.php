<?php
/**
 * Functions for product carousel file
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    Wpmozo_Product_Carousel_For_Woocommerce
 * @subpackage Wpmozo_Product_Carousel_For_Woocommerce/includes/blocks/product-carousel
 */

/**
 * Get query args.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 * @return array $qu_args The query args.
 */
function wpmozo_product_carousel_prepare_query_args( $args ){

    $qu_args = array(
        'post_type'      => 'product',
        'post_status'    => 'publish',
    );

    if ( isset( $args['NumberOfProducts'] ) ) {
        $qu_args['posts_per_page'] = intval( $args['NumberOfProducts']  );
    }

    $tax_query = array();
    $tax_args = array();
    $meta_query = array();

    if ( isset( $args['ProductViewType'] ) && ! empty( $args['ProductViewType'] ) ) {
       
        switch ( $args['ProductViewType'] ) {
            case 'featured':
                $tax_query[] = array(
                    'taxonomy' => 'product_visibility',
                    'field'    => 'name',
                    'terms'    => 'featured',
                    'operator' => 'IN',
                );
                break;
            case 'sale':
                $sale_ids = wc_get_product_ids_on_sale(); 
                $qu_args['post__in'] = $sale_ids;
                break;
            case 'best_selling':
                $qu_args['meta_key'] = 'total_sales';
                $qu_args['order']    = 'DESC';
                $qu_args['orderby']  = 'meta_value_num';
                break;
            case 'top_rated':
                $qu_args['meta_key'] = '_wc_average_rating';
                $qu_args['order']    = 'DESC';
                $qu_args['orderby']  = 'meta_value_num';
                break;
        }
    }

    if ( isset( $args['IncludeCategories'] ) && ! empty( $args['IncludeCategories'] ) ) {
        $tax_args[] = array(
            'taxonomy' => 'product_cat',
            'field'    => 'name',
            'terms'    => $args['IncludeCategories'],
            'operator' => 'IN',
        );
    }

    if ( isset( $args['IncludeTags'] ) && ! empty( $args['IncludeTags'] ) ) {
        $tax_args[] = array(
            'taxonomy' => 'product_tag',
            'field'    => 'name',
            'terms'    => $args['IncludeTags'],
            'operator' => 'IN',
        );
    }

    if ( ! empty( $tax_args ) && isset( $args['TaxonomiesRelation'] ) && ! empty( $args['TaxonomiesRelation'] ) ) {
        $tax_args['relation'] = $args['TaxonomiesRelation'];
    }

    if ( isset( $args['OutOfStock'] ) && $args['OutOfStock'] ) {
        $meta_query[] = array(
            'key'       => '_stock_status',
            'value'     => 'outofstock',
            'compare'   => 'NOT IN'
        );
    }
    
    if ( 'price' === $args['OrderBy'] ) {
        $qu_args['orderby'] = 'meta_value_num';
        $qu_args['meta_key'] = '_price';
    }

    if ( 'stock_status' === $args['OrderBy'] ) {
        $qu_args['orderby'] = 'meta_value';
        $qu_args['meta_key'] = '_stock_status';
    }

    if ( ! isset( $qu_args['order'] ) ) {
        $qu_args['order'] = $args['Order'];
    }

    if ( ! isset( $qu_args['orderby'] ) ) {
        $qu_args['orderby'] = $args['OrderBy'];
    }

    if ( ! empty( $tax_query ) ) {
        if ( ! empty( $tax_args ) ) {
            $tax_query['relation'] = 'AND';
            $tax_query[] = $tax_args;
        }
        $qu_args['tax_query'] = $tax_query;
    }else if ( ! empty( $tax_args ) ){
        $qu_args['tax_query'] = $tax_args;
    }

    if ( ! empty( $meta_query )  ) {
        $qu_args['meta_query'] = $meta_query;
    }

    return $qu_args;

}

/**
 * Before carousel hooks as per display settings.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 */
function wpmozo_product_carousel_before_hooks( $args ){

    add_filter('is_woocommerce', 'wpmozo_product_carousel_set_is_woocommerce');

    if ( ! $args['OutOfStock'] && $args['DisplayOutOfStockLabel'] ) {
        if ( 'layout-3' === $args['Layout'] ) {
            add_action( 'woocommerce_shop_loop_item_title', 'wpmozo_product_carousel_outofstock_badge', 9);
        }else{
            add_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_product_carousel_outofstock_badge', 10);
        }
    }
    if ( ! $args['ShowFeaturedImage'] ) {
        remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
    }
    if ( ! $args['ShowRating'] ) {
        remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
    }
    if ( ! $args['ShowPrice'] ) {
        remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
    }
    if ( ! $args['ShowAddToCartButton'] ) {
        remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
    }
    if ( ! $args['ShowSaleBadge'] ) {
        remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
    }
    if ( ! empty( $args['FeaturedImageSize'] ) ) {
        add_filter( 'single_product_archive_thumbnail_size', 'wpmozo_product_carousel_image_size', 10 );
    }
    if ( $args['ShowSaleBadge'] && ( ( 'sale_label' === $args['SaleBadgeType'] && ! empty( $args['SaleLabelText'] ) ) || 'percentage' === $args['SaleBadgeType'] ) ) {
        add_filter( 'woocommerce_sale_flash', 'wpmozo_product_carousel_sale_badge', 10, 3);
    }
    if ( $args['EnableQuickViewLink'] ) {
        add_filter( 'woocommerce_product_get_image', 'wpmozo_product_carousel_quick_view_button', 10, 2 );
    }

    if ( 'layout-1' === $args['Layout'] && $args['ShowPrice'] && $args['ShowAddToCartButton'] ) {
        remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
        remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
        add_action( 'woocommerce_after_shop_loop_item', 'wpmozo_product_carousel_layout_1_bottom', 10 );
    }

    if ( 'layout-3' === $args['Layout'] && $args['ShowFeaturedImage'] && $args['ShowAddToCartButton'] ) {
        //remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
        add_action( 'woocommerce_before_shop_loop_item', 'add_div_to_top', 0 );
        remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
        add_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_woocommerce_template_loop_product_thumbnail', 10 );
    }

    add_filter('woocommerce_post_class', 'wpmozo_product_carousel_add_class', 10, 2);

}

/**
 * After carousel hooks as per display settings.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 */
function wpmozo_product_carousel_after_hooks( $args ){
    
    remove_filter('is_woocommerce', 'wpmozo_product_carousel_set_is_woocommerce');

    if ( ! $args['ShowFeaturedImage'] ) {
        add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
    }
    if ( ! $args['ShowRating'] ) {
        add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
    }
    if ( ! $args['ShowPrice'] ) {
        add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
    }
    if ( ! $args['ShowAddToCartButton'] ) {
        add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
    }
    if ( ! $args['ShowSaleBadge'] ) {
        add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
    }
    if ( ! empty( $args['FeaturedImageSize'] ) ) {
        remove_filter( 'single_product_archive_thumbnail_size', 'wpmozo_product_carousel_image_size', 10 );
    }
    if ( $args['ShowSaleBadge'] && ( ( 'sale_label' === $args['SaleBadgeType'] && ! empty( $args['SaleLabelText'] ) ) || 'percentage' === $args['SaleBadgeType'] ) ) {
        remove_filter( 'woocommerce_sale_flash', 'wpmozo_product_carousel_sale_badge', 10, 3);
    }
    if ( ! $args['OutOfStock'] && $args['DisplayOutOfStockLabel'] ) {
        if ( 'layout-3' === $args['Layout'] ) {
            remove_action( 'woocommerce_shop_loop_item_title', 'wpmozo_product_carousel_outofstock_badge', 9);
        }else{
            remove_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_product_carousel_outofstock_badge', 10);
        }
    }
    if ( $args['EnableQuickViewLink'] ) {
        remove_filter( 'woocommerce_product_get_image', 'wpmozo_product_carousel_quick_view_button', 10, 2 );
    }

    // Layout 1 hooks
    if ( 'layout-1' === $args['Layout'] && $args['ShowPrice'] && $args['ShowAddToCartButton'] ) {
        add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
        add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
        remove_action( 'woocommerce_after_shop_loop_item', 'wpmozo_product_carousel_layout_1_bottom', 10 );
    }

    // Layout 3 hooks
    if ( 'layout-3' === $args['Layout'] && $args['ShowFeaturedImage'] && $args['ShowAddToCartButton'] ) {
        //add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
        remove_action( 'woocommerce_before_shop_loop_item', 'add_div_to_top', 0 );
        add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
        remove_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_woocommerce_template_loop_product_thumbnail', 10 );
    }
    
    remove_filter('woocommerce_post_class', 'wpmozo_product_carousel_add_class', 10, 2);
}

/**
 * Add hooks as per display settings for admin preview.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 */
function wpmozo_product_carousel_add_hooks_admin_preview( $args ){

    add_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
    add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );
    add_action( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10 );

    if ( $args['ShowFeaturedImage'] ) {
        add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
    }
    if ( $args['ShowRating'] ) {
        add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
    }
    if ( $args['ShowPrice'] ) {
        add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
    }
    if ( $args['ShowAddToCartButton'] ) {
        add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
    }
    if ( $args['ShowSaleBadge'] ) {
        add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
    }

    if ( ! empty( $args['FeaturedImageSize'] ) ) {
        add_filter( 'single_product_archive_thumbnail_size', 'wpmozo_product_carousel_image_size', 10 );
    }
    if ( $args['ShowSaleBadge'] && ( ( 'sale_label' === $args['SaleBadgeType'] && ! empty( $args['SaleLabelText'] ) ) || 'percentage' === $args['SaleBadgeType'] ) ) {
        add_filter( 'woocommerce_sale_flash', 'wpmozo_product_carousel_sale_badge', 10, 3);
    }

    // Layout 1 hooks
    if ( 'layout-1' === $args['Layout'] && $args['ShowPrice'] && $args['ShowAddToCartButton'] ) {
        add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
        add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
        remove_action( 'woocommerce_after_shop_loop_item', 'wpmozo_product_carousel_layout_1_bottom', 10 );
    }

    // Layout 3 hooks
    if ( 'layout-3' === $args['Layout'] && $args['ShowFeaturedImage'] && $args['ShowAddToCartButton'] ) {
        add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
        add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
        remove_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_woocommerce_template_loop_product_thumbnail', 10 );
    }

    add_filter('woocommerce_post_class', 'wpmozo_product_carousel_add_class', 10, 2);

}

/**
 * Filter is woocommerce set to true.
 *
 * @since 1.0.0
 * @param boolean $return Is woocommerce.
 * @return boolean Is woocommerce.
 */
function wpmozo_product_carousel_set_is_woocommerce( $return ){
    return true;
}

/**
 * Filter product image size.
 *
 * @since 1.0.0
 * @param string $size (default: 'woocommerce_thumbnail').
 * @return string The size of product image.
 */
function wpmozo_product_carousel_image_size( $size ){
    global $wpmozo_product_carousel_args;
    return $wpmozo_product_carousel_args['FeaturedImageSize'];
}

/**
 * Display custom label or percentage to sale badge.
 *
 * @since 1.0.0
 * @param string $html The markup of sale bage.
 * @param object $post The post object.
 * @param object $product The product object.
 * @return string $html The html markup of sale badge.
 */
function wpmozo_product_carousel_sale_badge( $html, $post, $product ){

    global $wpmozo_product_carousel_args;
    $sale_text = esc_html__( 'Sale!', 'woocommerce' );

    if ( 'percentage' === $wpmozo_product_carousel_args['SaleBadgeType'] ) {
        $percentages = array();
        $percentage = '';
        if( $product->is_type('variable') ){
            $prices = $product->get_variation_prices();

            foreach( $prices['price'] as $key => $price ){
                if( $prices['regular_price'][$key] !== $price ){
                    $percentages[] = round(100 - ($prices['sale_price'][$key] / $prices['regular_price'][$key] * 100));
                }
            }
            
        } elseif ( $product->is_type('grouped') ) {
            $percentages = array();
            $children = array_filter( array_map( 'wc_get_product', $product->get_children() ), 'wc_products_array_filter_visible_grouped' );

            foreach ( $children as $child ) {
                if ( $child->is_purchasable() && ! $child->is_type( 'grouped' ) && $child->is_on_sale() ) {
                    $regular_price = (float) $child->get_regular_price();
                    $sale_price    = (float) $child->get_sale_price();

                    $percentages[]    = round(100 - ($sale_price / $regular_price * 100));
                }
            }
        } else {
            $regular_price = (float) $product->get_regular_price();
            $sale_price    = (float) $product->get_sale_price();

            $percentage    = round(100 - ($sale_price / $regular_price * 100)) . '%';
        }

        if ( empty( $percentage ) && ! empty( $percentages ) ) {
            
            $max_percentage = max($percentages);
            $min_percentage = min($percentages);
            $percentage = ( $max_percentage > $min_percentage ) ? sprintf( 
                    '%s%% %s %s%%',
                    $min_percentage,
                    __('to', 'wpmozo-product-carousel-for-woocommerce'),
                    $max_percentage
                ) : $max_percentage . '%';

        }

        $html = str_replace($sale_text, $percentage, $html);
    }else{
        $new_text = esc_html__( $wpmozo_product_carousel_args['SaleLabelText'], 'wpmozo-product-carousel-for-woocommerce' );
        $html = str_replace($sale_text, $new_text, $html);
    }

    return $html;

}

/**
 * Display custom out of stock badge.
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_outofstock_badge(){

    global $product,$wpmozo_product_carousel_args;
    if ( ! $product->is_in_stock() ) {
        if ( ! empty( $wpmozo_product_carousel_args['OutOfStockLabel'] ) ) {
            $out_text = esc_html__( $wpmozo_product_carousel_args['OutOfStockLabel'], 'wpmozo-product-carousel-for-woocommerce' );
        }else{
            $all_status_text = wc_get_product_stock_status_options();
            $out_text = $all_status_text['outofstock'];
        }
        
        echo sprintf('<span class="soldout-text">%s</span>', $out_text);
    }

}

/**
 * Display quick view link.
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_quick_view_button( $image, $product ){

    global $wpmozo_product_carousel_args;
    $pro_id = $product->get_id();
    $button_text = esc_html__( $wpmozo_product_carousel_args['QuickViewLinkText'], 'wpmozo-product-carousel-for-woocommerce' );
    $icon = $wpmozo_product_carousel_args['QuickViewLinkIcon'];
    $inline = '';
    $has_icon = '';
    if ( ! empty( $icon ) ) {
        $has_icon = ' has-icon';
        $inline = 'background-image: url('.$icon.');background-size: 0;';
    }

    ob_start();
    ?>
    <?php if ( ! empty( $button_text ) || ! empty( $icon ) ) { ?>
        <?php if ( 'layout-3' !== $wpmozo_product_carousel_args['Layout'] ) { ?>
            <div class="wpmozo-product__overlay">
        <?php } ?>
                <button class="button wpmozo-quick-view-button<?php echo esc_attr( $has_icon ); ?>" data-pro-id="<?php echo esc_attr( $pro_id ); ?>" style="<?php echo esc_attr( $inline ); ?>"><?php echo $button_text; ?></button>
        <?php if ( 'layout-3' !== $wpmozo_product_carousel_args['Layout'] ) { ?>
            </div>
        <?php } ?>
    <?php } ?>
    <?php
    $html = ob_get_clean();

    $image .= $html;
    return $image;

}

/**
 * Display quick view content.
 *
 * @since 1.0.0
 */
function wpmozo_quick_view_content(){

    check_ajax_referer( 'ajax-nonce' );
    if ( isset( $_GET['pro_id'] ) ) {

        if ( post_password_required() ) {
            echo get_the_password_form(); // WPCS: XSS ok.
            return;
        }

        global $product,$post;
        $pro_id = sanitize_text_field( $_GET['pro_id'] );
        $post = get_post( $pro_id );
        $product = wc_get_product( $pro_id );

        ?>
        <div class="wpmozo-product-quick-view woocommerce single-product">
            <div id="product-<?php echo $pro_id; ?>" <?php wc_product_class( '', $product ); ?>>

                <?php
                /**
                 * Hook: woocommerce_before_single_product_summary.
                 *
                 * @hooked woocommerce_show_product_sale_flash - 10
                 * @hooked woocommerce_show_product_images - 20
                 */
                do_action( 'woocommerce_before_single_product_summary' );
                ?>

                <div class="summary entry-summary">
                    <?php
                    /**
                     * Hook: woocommerce_single_product_summary.
                     *
                     * @hooked woocommerce_template_single_title - 5
                     * @hooked woocommerce_template_single_rating - 10
                     * @hooked woocommerce_template_single_price - 10
                     * @hooked woocommerce_template_single_excerpt - 20
                     * @hooked woocommerce_template_single_add_to_cart - 30
                     * @hooked woocommerce_template_single_meta - 40
                     * @hooked woocommerce_template_single_sharing - 50
                     * @hooked WC_Structured_Data::generate_product_data() - 60
                     */
                    do_action( 'woocommerce_single_product_summary' );
                    ?>
                </div>

            </div>
        </div>
        <?php
        wp_reset_postdata();
    }
    wp_die();

}
add_action('wp_ajax_wpmozo_quick_view_content', 'wpmozo_quick_view_content');
add_action('wp_ajax_nopriv_wpmozo_quick_view_content', 'wpmozo_quick_view_content');

/**
 * Display product carousel layout 1
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_layout_1_bottom(){

    ?>
    <span class="wpmozo-product-bottom">
        <span class="wpmozo-product-bottom-price">
            <?php woocommerce_template_loop_price(); ?>
        </span>
        <span class="wpmozo-product-bottom-add-to-cart">
            <?php woocommerce_template_loop_add_to_cart(); ?>
        </span>
    </span>
    <?php

}

/**
 * Remove unnecessary class of product loop.
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_add_class( $classes, $product ){

    $classes[] = 'swiper-slide';
    $last_key = array_search('last', $classes);
    if ( false !== $last_key ) {
        unset($classes[$last_key]);
    }
    $first_key = array_search('first', $classes);
    if ( false !== $first_key ) {
        unset($classes[$first_key]);
    }
    return $classes;

}

/**
 * Display product carousel layout 3.
 *
 * @since 1.0.0
 */
function wpmozo_woocommerce_template_loop_product_thumbnail(){

    echo '</a>';
    woocommerce_template_loop_add_to_cart();
    echo '</span>';
    woocommerce_template_loop_product_link_open();

}

/**
 * Display wraper for layout 3.
 *
 * @since 1.0.0
 */
function add_div_to_top(){

    echo '<span class="wpmozo-layout-wraper">';

}