/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import { clearPreviewUrl } from 'state/ui/preview/actions';
import { getSelectedSite, getSelectedSiteId } from 'state/ui/selectors';
import { getPreviewUrl } from 'state/ui/preview/selectors';
import { getSiteOption } from 'state/sites/selectors';
import addQueryArgs from 'lib/route/add-query-args';
import { setLayoutFocus } from 'state/ui/layout-focus/actions';

const debug = debugFactory( 'calypso:design-preview' );

export default function urlPreview( WebPreview ) {
	class UrlPreview extends React.Component {
		constructor( props ) {
			super( props );
			this.previewCounter = 0;
			this.onClosePreview = this.onClosePreview.bind( this );
			this.getPreviewUrl = this.getPreviewUrl.bind( this );
			this.getBasePreviewUrl = this.getBasePreviewUrl.bind( this );
		}

		getInitialState() {
			return {
				previewCount: 0
			};
		}

		componentWillReceiveProps( nextProps ) {
			if ( this.props.selectedSiteId && this.props.selectedSiteId !== nextProps.selectedSiteId ) {
				this.previewCounter = 0;
			}

			if ( ! this.props.showPreview && nextProps.showPreview ) {
				debug( 'forcing refresh' );
				this.previewCounter > 0 && this.setState( { previewCount: this.previewCounter } );
				this.previewCounter += 1;
			}
		}

		onClosePreview() {
			this.props.clearPreviewUrl( this.props.selectedSiteId );
			this.props.setLayoutFocus( 'sidebar' );
		}

		getPreviewUrl() {
			if ( ! this.props.selectedSiteUrl && ! this.props.previewUrl ) {
				debug( 'no preview url and no site url were found for this site' );
				return null;
			}
			const previewUrl = addQueryArgs( {
				iframe: true,
				theme_preview: true,
				'frame-nonce': this.props.selectedSiteNonce,
				cachebust: this.state.previewCount,
			}, this.getBasePreviewUrl() );
			debug( 'using this preview url', previewUrl );
			return previewUrl;
		}

		getBasePreviewUrl() {
			return this.props.previewUrl || this.props.selectedSiteUrl;
		}

		render() {
			if ( ! this.props.selectedSite || ! this.props.selectedSite.is_previewable ) {
				debug( 'a preview is not available for this site' );
				return null;
			}

			return (
				<WebPreview
					className={ this.props.className }
					previewUrl={ this.getPreviewUrl() }
					externalUrl={ this.getBasePreviewUrl() }
					showExternal={ true }
					showClose={ true }
					showPreview={ this.props.showPreview }
					onClose={ this.onClosePreview }
				/>
			);
		}
	}

	function mapStateToProps( state ) {
		const selectedSiteId = getSelectedSiteId( state );
		return {
			selectedSite: getSelectedSite( state ),
			selectedSiteId,
			selectedSiteUrl: getSiteOption( state, selectedSiteId, 'unmapped_url' ),
			selectedSiteNonce: getSiteOption( state, selectedSiteId, 'frame_nonce' ),
			previewUrl: getPreviewUrl( state ),
		};
	}

	return connect(
		mapStateToProps,
		{ clearPreviewUrl, setLayoutFocus }
	)( UrlPreview );
}
