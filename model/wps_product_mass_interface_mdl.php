<?php if ( ! defined( 'ABSPATH' ) ) { exit;
}
/**
 * Model file for product mass modification module
 *
 * @author Eoxia development team <dev@eoxia.com>
 * @version 1.0
 */

/**
 * Model class for product mass modification module
 *
 * @author Eoxia development team <dev@eoxia.com>
 * @version 1.0
 */
class wps_product_mass_interface_mdl extends wps_product_mdl {


	/**
	 * Returns Products with post data and its attributes configuration
	 *
	 * @param integer $limit
	 * @param integer $count_products
	 * @return array
	 */
	function get_quick_interface_products( $attribute_set_id, $start_limit = 0, $nb_product_per_page = 20, $order_by = 'ID', $order = 'DESC' ) {

		global $wpdb;
		$query_order_by = '';
		switch ( $order_by ) {
			case 'ID':
			case 'post_title':
			case 'post_content':
			case 'post_date':
				$query_order_by = 'ORDER BY ' . $order_by . ' ' . $order;
				break;
		}

		$products_data = array();
		$post_types = '("' . implode( '","', array( WPSHOP_NEWTYPE_IDENTIFIER_PRODUCT, WPSHOP_NEWTYPE_IDENTIFIER_PRODUCT_VARIATION ) ) . '")';
		// Get products in queried limits
		$query = $wpdb->prepare( "SELECT *
			FROM {$wpdb->posts}, {$wpdb->postmeta}
			WHERE post_type IN {$post_types}
				AND post_status IN ( 'publish', 'draft' )
				AND ID = post_id
				AND meta_key = %s
				AND meta_value = %s
			{$query_order_by}
			LIMIT " . $start_limit * $nb_product_per_page . ', ' . $nb_product_per_page . ''
		, '_wpshop_product_attribute_set_id', $attribute_set_id );
		$products = $wpdb->get_results( $query );
		if ( ! empty( $products ) ) {
			foreach ( $products as $product ) {
				// For each product stock Post Datas and attributes definition
				$tmp = array();
				$tmp['post_datas'] = $product;
				$tmp['attributes_datas'] = $this->get_product_atts_def( $product->ID );
				if ( empty( $query_order_by ) ) {
					foreach ( $tmp['attributes_datas'][ $product->ID ] as $attribute_set_name => $attribute_set ) {
						foreach ( $attribute_set['attributes'] as $attr_id => $attr ) {
							if ( $attr['code'] == $order_by ) {
								while ( isset( $products_data[ $attr['value'] ] ) ) {
									$attr['value'] = '-' . $attr['value'];
								}
								$products_data[ $attr['value'] ] = $tmp;
							}
						}
					}
				} else {
					$products_data[] = $tmp;
				}
			}
		}
		if ( empty( $query_order_by ) ) {
			if ( $order == 'ASC' ) {
				ksort( $products_data );
			} elseif ( $order == 'DESC' ) {
				krsort( $products_data );
			}
			return $products_data;
		} else {
			return $products_data;
		}
	}


	function get_product_attributes_sets() {

		global $wpdb;
		$product_entity_id = wpshop_entities::get_entity_identifier_from_code( WPSHOP_NEWTYPE_IDENTIFIER_PRODUCT );
		$query = $wpdb->prepare( 'SELECT * FROM ' . WPSHOP_DBT_ATTRIBUTE_SET . ' WHERE entity_id = %d AND status = %s', $product_entity_id, 'valid' );
		$attributes_groups = $wpdb->get_results( $query );
		return $attributes_groups;
	}


	function get_attributes_quick_add_form() {

		global $wpdb;
		$product_entity_id = wpshop_entities::get_entity_identifier_from_code( WPSHOP_NEWTYPE_IDENTIFIER_PRODUCT );
		$query = $wpdb->prepare( 'SELECT * FROM ' . WPSHOP_DBT_ATTRIBUTE . ' WHERE entity_id = %d AND is_used_in_quick_add_form = %s AND status = %s', $product_entity_id, 'yes', 'valid' );
		$attributes = $wpdb->get_results( $query, ARRAY_A );
		return $attributes;
	}

}
