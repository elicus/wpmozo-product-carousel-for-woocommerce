<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://elicus.com
 * @since      1.0.0
 *
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    WPMozo_Product_Carousel_For_Woocommerce
 * @subpackage WPMozo_Product_Carousel_For_Woocommerce/includes
 * @author     Elicus <hello@elicus.com>
 */
class WPMozo_Product_Carousel_For_Woocommerce {

	/**
	 * The instances of classes.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @var    array    $classes    The instances of all classes.
	 */
	protected $classes;

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      WPMozo_Product_Carousel_For_Woocommerce_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'WPMOZO_PRODUCT_CAROUSEL_VERSION' ) ) {
			$this->version = WPMOZO_PRODUCT_CAROUSEL_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'wpmozo-product-carousel-for-woocommerce';

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - WPMozo_Product_Carousel_Loader. Orchestrates the hooks of the plugin.
	 * - WPMozo_Product_Carousel_i18n. Defines internationalization functionality.
	 * - WPMozo_Product_Carousel_Init. Define the hooks for WP initialization.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once WPMOZO_PRODUCT_CAROUSEL_INC_DIR_PATH . 'class-wpmozo-product-carousel-loader.php';
		$this->loader = new WPMozo_Product_Carousel_Loader();

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once WPMOZO_PRODUCT_CAROUSEL_INC_DIR_PATH . 'class-wpmozo-product-carousel-i18n.php';

		/**
		 * The class responsible for defining all actions for WP initialization of the plugin.
		 */
		include_once WPMOZO_PRODUCT_CAROUSEL_INC_DIR_PATH . 'class-wpmozo-product-carousel-init.php';

		$wpmozo_i18n = new WPMozo_Product_Carousel_I18n();
		$wpmozo_init = new WPMozo_Product_Carousel_Init();

		$this->classes['i18n'] = $wpmozo_i18n;
		$this->classes['init'] = $wpmozo_init;

	}

	/**
	 * Register all of the hooks of the plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function define_hooks() {

		if ( ! empty( $this->classes ) ) {
			foreach ( $this->classes as $key => $instance ) {
				if ( method_exists( $instance, 'add_hooks' ) ) {
					// Call method for register all hooks of plugin.
					$instance->add_hooks( $this->loader, $instance );
				}
			}
		}

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {

		$this->load_dependencies();
		$this->define_hooks();
		$this->loader->run();

	}

	/**
	 * Deactivate this plugin if WooCmmerce is not activate.
	 *
	 * @since    1.0.0
	 */
	public function deactivate() {

		if ( ! function_exists( 'deactivate_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if ( isset( $_GET['activate'] ) ) { // phpcs:ignore 
			unset( $_GET['activate'] ); // phpcs:ignore 
			$_GET['deactivate'] = true;
		}
		add_action( 'admin_notices', array( $this, 'deactivation_notice' ) );
		deactivate_plugins( WPMOZO_PRODUCT_CAROUSEL_FILE );

	}

	/**
	 * Display notice if WooCmmerce is not activate.
	 *
	 * @since    1.0.0
	 */
	public function deactivation_notice() {

		$plugin_name = sprintf( '<strong>%s</strong>', esc_html( 'WPMozo Product Carousel For WooCommerce' ) );
		$message     = esc_html( 'plugin requires WooCommerce in order to work. So please ensure that WooCommerce is installed and activated.' );
		$notice      = sprintf( '%s %s', $plugin_name, $message );

		?>
		<div class="error notice is-dismissible">
			<p>
			<?php
			echo wp_kses(
				$notice,
				array(
					'strong' => array(),
				)
			);
			?>
			</p>
		</div>
		<?php
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    WPMozo_Product_Carousel_For_Woocommerce_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
