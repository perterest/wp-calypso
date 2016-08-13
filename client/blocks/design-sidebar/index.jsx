/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import RootChild from 'components/root-child';

class DesignSidebar extends Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const className = 'design-sidebar' + ( this.props.isVisible ? ' is-visible' : '' );
		return (
			<RootChild>
				<div className={ className }>
				</div>
			</RootChild>
		);
	}
}

DesignSidebar.propTypes = {
	isVisible: PropTypes.bool,
};

DesignSidebar.defaultProps = {
	isVisible: false,
};

export default DesignSidebar;

