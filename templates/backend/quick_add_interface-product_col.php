<th class="title manage-column column-title sortable <?php echo $code === $_GET['order_by'] ? 'sorted' : ''; ?>
	<?php echo ($code === $_GET['order_by'] && isset( $_GET['order'] )) ? $_GET['order'] : 'desc'; ?>">
	<a href="<?php echo esc_url(
		add_query_arg( 'order', (isset( $_GET['order'] ) && $_GET['order'] === 'desc') ? 'asc' : 'desc',
		add_query_arg( 'order_by', $code, set_url_scheme( 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] ) ) ) ); ?>">
		<span><?php echo $name; ?></span>
		<span class="sorting-indicator"></span>
	</a>
</th>
