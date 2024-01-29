<?php
/**
 * Functions for product carousel file
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

/**
 * Get query args.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 * @return array $qu_args The query args.
 */
function wpmozo_product_carousel_prepare_query_args( $args ) {

	$qu_args = array(
		'post_type'   => 'product',
		'post_status' => 'publish',
	);

	if ( isset( $args['NumberOfProducts'] ) ) {
		$qu_args['posts_per_page'] = intval( $args['NumberOfProducts'] );
	}

	$tax_query  = array();
	$tax_args   = array();
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
				$sale_ids            = wc_get_product_ids_on_sale();
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
			'key'     => '_stock_status',
			'value'   => 'outofstock',
			'compare' => 'NOT IN',
		);
	}

	if ( 'price' === $args['OrderBy'] && ! isset( $qu_args['orderby'] ) ) {
		$qu_args['orderby']  = 'meta_value_num';
		$qu_args['meta_key'] = '_price';
	}

	if ( 'stock_status' === $args['OrderBy'] && ! isset( $qu_args['orderby'] ) ) {
		$qu_args['orderby']  = 'meta_value';
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
			$tax_query[]           = $tax_args;
		}
		$qu_args['tax_query'] = $tax_query;
	} elseif ( ! empty( $tax_args ) ) {
		$qu_args['tax_query'] = $tax_args;
	}

	if ( ! empty( $meta_query ) ) {
		$qu_args['meta_query'] = $meta_query;
	}

	$qu_args = apply_filters( 'wpmozo_product_carousel_query_args', $qu_args, $args );
	return $qu_args;

}

/**
 * Before carousel hooks as per display settings.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 */
function wpmozo_product_carousel_before_hooks( $args ) {

	add_filter( 'is_woocommerce', 'wpmozo_product_carousel_set_is_woocommerce', 99 );

	if ( ! $args['OutOfStock'] && $args['DisplayOutOfStockLabel'] ) {
		if ( 'layout-2' === $args['Layout'] ) {
			add_action( 'woocommerce_shop_loop_item_title', 'wpmozo_product_carousel_outofstock_badge', 9 );
		} else {
			add_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_product_carousel_outofstock_badge', 10 );
		}
	}
	if ( ! $args['ShowTitle'] ) {
		wpmozo_product_carousel_remove_hooks( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10 );
	}
	if ( ! $args['ShowFeaturedImage'] ) {
		wpmozo_product_carousel_remove_hooks( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail' );
	}
	if ( ! $args['ShowRating'] ) {
		wpmozo_product_carousel_remove_hooks( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating' );
	}
	if ( ! $args['ShowPrice'] ) {
		wpmozo_product_carousel_remove_hooks( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price' );
	}
	if ( ! $args['ShowAddToCartButton'] ) {
		wpmozo_product_carousel_remove_hooks( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart' );
	}
	if ( ! $args['ShowSaleBadge'] ) {
		wpmozo_product_carousel_remove_hooks( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash' );
	}
	if ( ! empty( $args['FeaturedImageSize'] ) ) {
		add_filter( 'single_product_archive_thumbnail_size', 'wpmozo_product_carousel_image_size', 10 );
	}
	if ( $args['ShowSaleBadge'] && ( ( 'sale_label' === $args['SaleBadgeType'] && ! empty( $args['SaleLabelText'] ) ) || 'percentage' === $args['SaleBadgeType'] ) ) {
		add_filter( 'woocommerce_sale_flash', 'wpmozo_product_carousel_sale_badge', 10, 3 );
	}
	if ( $args['EnableQuickViewLink'] ) {
		add_filter( 'woocommerce_product_get_image', 'wpmozo_product_carousel_quick_view_button', 10, 2 );
	}

	if ( 'layout-1' === $args['Layout'] && $args['ShowPrice'] && $args['ShowAddToCartButton'] ) {
		wpmozo_product_carousel_remove_hooks( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price' );
		wpmozo_product_carousel_remove_hooks( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart' );
		add_action( 'woocommerce_after_shop_loop_item', 'wpmozo_product_carousel_layout_1_bottom', 10 );
	}

	if ( 'layout-2' === $args['Layout'] && $args['ShowFeaturedImage'] && $args['ShowAddToCartButton'] ) {
		add_action( 'woocommerce_before_shop_loop_item', 'wpmozo_product_carousel_add_div_to_top', 0 );
		wpmozo_product_carousel_remove_hooks( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart' );
		add_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_woocommerce_template_loop_product_thumbnail', 10 );
	}

	if ( $args['EqualSlideHeight'] ) {
		add_filter( 'woocommerce_loop_add_to_cart_link', 'wpmozo_product_carousel_add_wrap_for_addtocart', 999, 3 );
	}

	add_filter( 'woocommerce_post_class', 'wpmozo_product_carousel_add_class', 10, 2 );

}

/**
 * After carousel hooks as per display settings.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 */
function wpmozo_product_carousel_after_hooks( $args ) {

	wpmozo_product_carousel_add_hooks();
	remove_filter( 'is_woocommerce', 'wpmozo_product_carousel_set_is_woocommerce', 99 );

	if ( ! empty( $args['FeaturedImageSize'] ) ) {
		remove_filter( 'single_product_archive_thumbnail_size', 'wpmozo_product_carousel_image_size', 10 );
	}
	if ( $args['ShowSaleBadge'] && ( ( 'sale_label' === $args['SaleBadgeType'] && ! empty( $args['SaleLabelText'] ) ) || 'percentage' === $args['SaleBadgeType'] ) ) {
		remove_filter( 'woocommerce_sale_flash', 'wpmozo_product_carousel_sale_badge', 10, 3 );
	}
	if ( ! $args['OutOfStock'] && $args['DisplayOutOfStockLabel'] ) {
		if ( 'layout-2' === $args['Layout'] ) {
			remove_action( 'woocommerce_shop_loop_item_title', 'wpmozo_product_carousel_outofstock_badge', 9 );
		} else {
			remove_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_product_carousel_outofstock_badge', 10 );
		}
	}
	if ( $args['EnableQuickViewLink'] ) {
		remove_filter( 'woocommerce_product_get_image', 'wpmozo_product_carousel_quick_view_button', 10, 2 );
	}

	// Layout 1 hooks.
	if ( 'layout-1' === $args['Layout'] && $args['ShowPrice'] && $args['ShowAddToCartButton'] ) {
		remove_action( 'woocommerce_after_shop_loop_item', 'wpmozo_product_carousel_layout_1_bottom', 10 );
	}

	// Layout 2 hooks.
	if ( 'layout-2' === $args['Layout'] && $args['ShowFeaturedImage'] && $args['ShowAddToCartButton'] ) {
		remove_action( 'woocommerce_before_shop_loop_item', 'wpmozo_product_carousel_add_div_to_top', 0 );
		remove_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_woocommerce_template_loop_product_thumbnail', 10 );
	}

	if ( $args['EqualSlideHeight'] ) {
		remove_filter( 'woocommerce_loop_add_to_cart_link', 'wpmozo_product_carousel_add_wrap_for_addtocart', 999, 3 );
	}

	remove_filter( 'woocommerce_post_class', 'wpmozo_product_carousel_add_class', 10, 2 );
}

/**
 * Add hooks as per display settings for admin preview.
 *
 * @since 1.0.0
 * @param array $args The arguments of carousel.
 */
function wpmozo_product_carousel_add_hooks_admin_preview( $args ) {

	add_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
	add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );

	if ( $args['ShowTitle'] ) {
		add_action( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10 );
	}
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
		add_filter( 'woocommerce_sale_flash', 'wpmozo_product_carousel_sale_badge', 10, 3 );
	}

	// Layout 1 hooks.
	if ( 'layout-1' === $args['Layout'] && $args['ShowPrice'] && $args['ShowAddToCartButton'] ) {
		add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
		add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
		remove_action( 'woocommerce_after_shop_loop_item', 'wpmozo_product_carousel_layout_1_bottom', 10 );
	}

	// Layout 2 hooks.
	if ( 'layout-2' === $args['Layout'] && $args['ShowFeaturedImage'] && $args['ShowAddToCartButton'] ) {
		add_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
		add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
		remove_action( 'woocommerce_before_shop_loop_item_title', 'wpmozo_woocommerce_template_loop_product_thumbnail', 10 );
	}

	if ( $args['EqualSlideHeight'] ) {
		add_filter( 'woocommerce_loop_add_to_cart_link', 'wpmozo_product_carousel_add_wrap_for_addtocart', 999, 3 );
	}

	add_filter( 'woocommerce_post_class', 'wpmozo_product_carousel_add_class', 10, 2 );

}

/**
 * Filter is woocommerce set to true.
 *
 * @since 1.0.0
 * @param boolean $return Is woocommerce.
 * @return boolean Is woocommerce.
 */
function wpmozo_product_carousel_set_is_woocommerce( $return ) {
	return apply_filters( 'wpmozo_product_carousel_is_woocommerce', true );
}

/**
 * Filter product image size.
 *
 * @since 1.0.0
 * @param string $size (default: 'woocommerce_thumbnail').
 * @return string The size of product image.
 */
function wpmozo_product_carousel_image_size( $size ) {
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
function wpmozo_product_carousel_sale_badge( $html, $post, $product ) {

	global $wpmozo_product_carousel_args;
	$sale_text = esc_html__( 'Sale!', 'woocommerce' );

	if ( 'percentage' === $wpmozo_product_carousel_args['SaleBadgeType'] ) {
		$percentages = array();
		$percentage  = '';
		if ( $product->is_type( 'variable' ) ) {
			$prices = $product->get_variation_prices();

			foreach ( $prices['price'] as $key => $price ) {
				if ( $prices['regular_price'][ $key ] !== $price ) {
					if ( $prices['sale_price'][ $key ] >= 0 ) {
						$percentages[] = round( 100 - ( $prices['sale_price'][ $key ] / $prices['regular_price'][ $key ] * 100 ) );
					} else {
						$percentages[] = 100;
					}
				}
			}
		} elseif ( $product->is_type( 'grouped' ) ) {
			$percentages = array();
			$children    = array_filter( array_map( 'wc_get_product', $product->get_children() ), 'wc_products_array_filter_visible_grouped' );

			foreach ( $children as $child ) {
				if ( $child->is_purchasable() && ! $child->is_type( 'grouped' ) && $child->is_on_sale() ) {
					$regular_price = (float) $child->get_regular_price();
					$sale_price    = (float) $child->get_sale_price();

					if ( $sale_price >= 0 ) {
						$percentages[] = round( 100 - ( $sale_price / $regular_price * 100 ) );
					} else {
						$percentages[] = 100;
					}
				}
			}
		} else {
			$regular_price = (float) $product->get_regular_price();
			$sale_price    = (float) $product->get_sale_price();

			if ( $sale_price >= 0 ) {
				$percentage = round( 100 - ( $sale_price / $regular_price * 100 ) ) . '%';
			} else {
				$percentage = '100%';
			}
		}

		if ( empty( $percentage ) && ! empty( $percentages ) ) {

			$max_percentage = max( $percentages );
			$min_percentage = min( $percentages );
			$percentage     = sprintf( '%s%%', $max_percentage );

		}

		$html = str_replace( $sale_text, $percentage, $html );
	} else {
		$new_text = esc_html( $wpmozo_product_carousel_args['SaleLabelText'] );
		$html     = str_replace( $sale_text, $new_text, $html );
	}

	$html = apply_filters( 'wpmozo_product_carousel_sale_badge', $html, $post, $product, $wpmozo_product_carousel_args );

	return $html;

}

/**
 * Display custom out of stock badge.
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_outofstock_badge() {

	global $product,$wpmozo_product_carousel_args;
	if ( ! $product->is_in_stock() ) {

		$availability = $product->get_availability();
		$class        = esc_attr( $availability['class'] );

		if ( ! empty( $wpmozo_product_carousel_args['OutOfStockLabel'] ) ) {
			$out_text = esc_html( $wpmozo_product_carousel_args['OutOfStockLabel'] );
		} else {
			$all_status_text = wc_get_product_stock_status_options();
			$out_text        = $all_status_text['outofstock'];
		}

		$html      = sprintf( '<div class="wpmozo-products-soldout-wrap"><span class="soldout-text stock %s">%s</span></div>', $class, $out_text );
		$finalhtml = apply_filters( 'woocommerce_get_stock_html', $html, $product );
		$finalhtml = apply_filters( 'wpmozo_product_carousel_outofstock_badge', $finalhtml, $product, $wpmozo_product_carousel_args );
		echo wp_kses_post( $finalhtml );
	}

}

/**
 * Display quick view link.
 *
 * @since 1.0.0
 * @param string $image Image html.
 * @param object $product The product object.
 * @return string The html markup of image.
 */
function wpmozo_product_carousel_quick_view_button( $image, $product ) {

	$icon     = '';
	$has_icon = '';
	global $wpmozo_product_carousel_args;
	$pro_id      = $product->get_id();
	$button_text = esc_html( $wpmozo_product_carousel_args['QuickViewLinkText'] );

	if ( $wpmozo_product_carousel_args['QuickViewLinkIconEnabled'] ) {
		$icon = ( $wpmozo_product_carousel_args['QuickViewLinkCustomIcon'] ) ? $wpmozo_product_carousel_args['QuickViewLinkImg'] : $wpmozo_product_carousel_args['QuickViewLinkIcon'];
	}

	$has_text = ! empty( $button_text ) ? ' has-text' : '';

	ob_start();
	?>
	<?php if ( ! empty( $button_text ) || ! empty( $icon ) ) { ?>
		<?php do_action( 'wpmozo_product_carousel_before_quick_view_button_wraper', $image, $product, $wpmozo_product_carousel_args ); ?>
		<?php if ( 'layout-2' !== $wpmozo_product_carousel_args['Layout'] ) { ?>
			<div class="wpmozo-product__overlay">
		<?php } ?>
			<?php do_action( 'wpmozo_product_carousel_before_quick_view_button', $image, $product, $wpmozo_product_carousel_args ); ?>
				<button class="button wp-element-button wpmozo-quick-view-button
				<?php
				echo esc_attr( $has_icon );
				echo esc_attr( $has_text );
				?>
				" data-pro-id="<?php echo esc_attr( $pro_id ); ?>">
					<?php do_action( 'wpmozo_product_carousel_before_quick_view_icon', $image, $product, $wpmozo_product_carousel_args ); ?>
					<?php if ( ! empty( $icon ) && ! $wpmozo_product_carousel_args['QuickViewLinkCustomIcon'] ) { ?>
						<i class="<?php echo esc_attr( $icon ); ?>"></i>
					<?php } ?>
					<?php if ( ! empty( $icon ) && $wpmozo_product_carousel_args['QuickViewLinkCustomIcon'] ) { ?>
						<img class="wpmozo-quick-view-img" src="<?php echo esc_attr( $icon ); ?>" />
					<?php } ?>
					<?php echo esc_html( $button_text ); ?>
					<?php do_action( 'wpmozo_product_carousel_after_quick_view_icon', $image, $product, $wpmozo_product_carousel_args ); ?>       
				</button>
			<?php do_action( 'wpmozo_product_carousel_after_quick_view_button', $image, $product, $wpmozo_product_carousel_args ); ?>
		<?php if ( 'layout-2' !== $wpmozo_product_carousel_args['Layout'] ) { ?>
			</div>
		<?php } ?>
		<?php do_action( 'wpmozo_product_carousel_after_quick_view_button_wraper', $image, $product, $wpmozo_product_carousel_args ); ?>
	<?php } ?>
	<?php
	$html = ob_get_clean();
	$html = apply_filters( 'wpmozo_product_carousel_quick_view_button', $html, $image, $product, $wpmozo_product_carousel_args );

	$image .= $html;
	return $image;

}

/**
 * Display quick view content.
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_quick_view_content() {

	check_ajax_referer( 'ajax-nonce' );
	if ( isset( $_GET['pro_id'] ) ) {

		if ( post_password_required() ) {
			echo wp_kses_post( get_the_password_form() );
			return;
		}

		global $product,$post;
		$pro_id  = sanitize_text_field( wp_unslash( $_GET['pro_id'] ) );
		$post    = get_post( $pro_id ); // phpcs:ignore
		$product = wc_get_product( $pro_id );

		?>
		<?php do_action( 'wpmozo_product_carousel_before_quick_view_popup', $product ); ?>
		<div class="wpmozo-product-quick-view woocommerce single-product">
			<?php do_action( 'wpmozo_product_carousel_before_quick_view_product', $product ); ?>
			<div id="product-<?php echo esc_attr( $pro_id ); ?>" <?php wc_product_class( '', $product ); ?>>

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
			<?php do_action( 'wpmozo_product_carousel_after_quick_view_product', $product ); ?>
		</div>
		<?php do_action( 'wpmozo_product_carousel_after_quick_view_popup', $product ); ?>
		<?php
		wp_reset_postdata();
	}
	wp_die();

}
add_action( 'wp_ajax_wpmozo_product_carousel_quick_view_content', 'wpmozo_product_carousel_quick_view_content' );
add_action( 'wp_ajax_nopriv_wpmozo_product_carousel_quick_view_content', 'wpmozo_product_carousel_quick_view_content' );

/**
 * Display product carousel layout 1
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_layout_1_bottom() {

	?>
	<?php do_action( 'wpmozo_product_carousel_before_layout_1_bottom' ); ?>
	<span class="wpmozo-product-bottom">
		<?php do_action( 'wpmozo_product_carousel_before_layout_1_bottom_price' ); ?>
		<span class="wpmozo-product-bottom-price">
			<?php woocommerce_template_loop_price(); ?>
		</span>
		<span class="wpmozo-product-bottom-add-to-cart">
			<?php woocommerce_template_loop_add_to_cart(); ?>
		</span>
		<?php do_action( 'wpmozo_product_carousel_after_layout_1_bottom_addtocart' ); ?>
	</span>
	<?php do_action( 'wpmozo_product_carousel_after_layout_1_bottom' ); ?>
	<?php

}

/**
 * Remove unnecessary class of product loop.
 *
 * @since 1.0.0
 * @param array      $classes Array of CSS classes.
 * @param WC_Product $product Product object.
 * @return array $classes Array of CSS classes.
 */
function wpmozo_product_carousel_add_class( $classes, $product ) {

	$classes[] = 'swiper-slide';
	$last_key  = array_search( 'last', $classes );
	if ( false !== $last_key ) {
		unset( $classes[ $last_key ] );
	}
	$first_key = array_search( 'first', $classes );
	if ( false !== $first_key ) {
		unset( $classes[ $first_key ] );
	}
	return $classes;

}

/**
 * Display product carousel layout 2.
 *
 * @since 1.0.0
 */
function wpmozo_woocommerce_template_loop_product_thumbnail() {

	do_action( 'wpmozo_product_carousel_before_layout_2_closing_a' );
	echo '</a>';
	do_action( 'wpmozo_product_carousel_before_layout_2_addtocart' );
		woocommerce_template_loop_add_to_cart();
	do_action( 'wpmozo_product_carousel_after_layout_2_addtocart' );
	echo '</span>';
	do_action( 'wpmozo_product_carousel_after_layout_2_closing_span' );
	woocommerce_template_loop_product_link_open();

}

/**
 * Display wraper for layout 2.
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_add_div_to_top() {

	do_action( 'wpmozo_product_carousel_before_layout_2_top' );
	echo '<span class="wpmozo-layout-wraper">';
	do_action( 'wpmozo_product_carousel_after_layout_2_top' );

}

/**
 * Remove hooks.
 *
 * It will remove default and custom hooks for woocommerce.
 *
 * @since 1.0.0
 * @param string  $hook_name The name of hook.
 * @param string  $callback The name of callback function.
 * @param boolean $to_add Add after or not.
 */
function wpmozo_product_carousel_remove_hooks( $hook_name, $callback, $to_add = true ) {

	global $wp_filter;
	$check_hooks   = array(
		'woocommerce_before_shop_loop_item',
		'woocommerce_before_shop_loop_item_title',
		'woocommerce_shop_loop_item_title',
		'woocommerce_after_shop_loop_item_title',
		'woocommerce_after_shop_loop_item',
	);
	$removed_hooks = wp_cache_get( 'wpmozo_removed_hooks' );
	if ( empty( $removed_hooks ) ) {
		$removed_hooks = array();
	}
	$hook_data  = array(
		'hook'     => $hook_name,
		'callback' => $callback,
	);
	$has_action = has_action( $hook_name, $callback );

	if ( false !== $has_action ) {

		$hook_data['priority']      = $has_action;
		$hook_data['accepted_args'] = 1;
		$removed                    = remove_action( $hook_name, $callback, $has_action );

		if ( $removed && $to_add ) {
			$removed_hooks[] = $hook_data;
		}
	} else {

		foreach ( $check_hooks as $key => $hook ) {

			$hook_data['hook'] = $hook;
			$get_hook          = isset( $wp_filter[ $hook ] ) ? $wp_filter[ $hook ] : array();

			if ( ! empty( $get_hook ) ) {

				$callbacks = $get_hook->callbacks;

				foreach ( $callbacks as $priority => $_callback ) {

					if ( isset( $_callback[ $callback ]['function'] ) && $_callback[ $callback ]['function'] === $callback ) {

						$accepted_args              = isset( $_callback[ $callback ]['accepted_args'] ) ? $_callback[ $callback ]['accepted_args'] : 1;
						$removed                    = remove_action( $hook, $callback, $priority, $accepted_args );
						$hook_data['priority']      = $priority;
						$hook_data['accepted_args'] = $accepted_args;

						if ( $removed && $to_add ) {
							$removed_hooks[] = $hook_data;
						}
					}
				}
			}
		}
	}

	wp_cache_set( 'wpmozo_removed_hooks', $removed_hooks );

}

/**
 * Add before removed hooks.
 *
 * It will add default and custom hooks for woocommerce.
 *
 * @since 1.0.0
 */
function wpmozo_product_carousel_add_hooks() {

	$removed_hooks = wp_cache_get( 'wpmozo_removed_hooks' );

	if ( ! empty( $removed_hooks ) ) {

		foreach ( $removed_hooks as $key => $hookdata ) {

			add_action( $hookdata['hook'], $hookdata['callback'], $hookdata['priority'], $hookdata['accepted_args'] );

		}

		wp_cache_delete( 'wpmozo_removed_hooks' );
	}

}

/**
 * Add wraper to add to cart button for equal height.
 *
 * @since 1.0.0
 * @param string $button The html markup of add to cart button.
 * @param object $product The product object.
 * @param array  $args The add to cart button arguments.
 */
function wpmozo_product_carousel_add_wrap_for_addtocart( $button, $product, $args ) {

	do_action( 'wpmozo_product_carousel_before_euheight_addtocart_wrap' );
	echo '<div class="wpmozo-add-to-cart-wrap">';
		do_action( 'wpmozo_product_carousel_before_euheight_addtocart' );
			echo wp_kses_post( $button );
		do_action( 'wpmozo_product_carousel_after_euheight_addtocart' );
	echo '</div>';
	do_action( 'wpmozo_product_carousel_after_euheight_addtocart_wrap' );

}

/**
 * Check if display products or not.
 *
 * @since 1.0.0
 * @param array $args The arguments of products.
 * @return boolean $show_products Display products or not.
 */
function wpmozo_product_carousel_is_display_products( $args ) {

	$show_products = false;

	if ( true === $args['ShowTitle'] ||
		true === $args['ShowFeaturedImage'] ||
		true === $args['ShowRating'] ||
		true === $args['ShowPrice'] ||
		true === $args['ShowAddToCartButton'] ||
		true === $args['ShowSaleBadge']
	) {
		$show_products = true;
	}

	return $show_products;

}

/**
 * Display loader to the fornt side.
 *
 * @since 1.0.0
 * @param array $args The arguments of products.
 */
function wpmozo_product_carousel_display_loader( $args ) {

	$columns       = intval( $args['Columns'] );
	$space_between = $args['SpaceBetween'];
	?>
	<?php if ( ! isset( $_GET['context'] ) ) { // phpcs:ignore ?>
		<div class="wpmozo-loader frontend">
			<?php for ( $i = 0; $i < $columns; $i++ ) { ?>
				<div class="ph-item" style="margin-right: <?php echo esc_attr( $space_between ); ?>px;">
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
	<?php

}
