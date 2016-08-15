/**
 * External dependencies
 */
import { flow } from 'lodash';

/**
 * Internal dependencies
 */
import reactTestEnvSetup from 'react-test-env';

const useFakeDom = flow( [ reactTestEnvSetup.useFakeDom, () => {
	after( () => delete require.cache[ require.resolve( 'page' ) ] );
} ] );

useFakeDom.withContainer = reactTestEnvSetup.useFakeDom.withContainer;
useFakeDom.getContainer = reactTestEnvSetup.useFakeDom.getContainer;

export default useFakeDom;
