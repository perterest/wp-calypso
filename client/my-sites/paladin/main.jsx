/**
 * External Dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal Dependencies
 */
import { showPreviewSidebar, hidePreviewSidebar } from 'state/ui/actions';
import { setLayoutFocus } from 'state/ui/layout-focus/actions';

const NativeCustomizer = React.createClass( {
	propTypes: {
		showPreviewSidebar: React.PropTypes.func.isRequired,
		hidePreviewSidebar: React.PropTypes.func.isRequired,
	},

	componentWillMount() {
		this.props.showPreviewSidebar();
		this.props.setLayoutFocus( 'preview' );
	},

	componentWillUnmount() {
		this.props.hidePreviewSidebar();
		this.props.setLayoutFocus( 'content' );
	},

	render() {
		return (
			<div className="paladin__native-customizer">
			</div>
		);
	}
} );

export default connect( null, { showPreviewSidebar, hidePreviewSidebar, setLayoutFocus } )( NativeCustomizer );
