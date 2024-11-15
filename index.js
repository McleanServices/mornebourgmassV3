import { registerRootComponent } from 'expo';

import App from './App';
import logo from './assets/images/logo.png';

// Add passive event listener for 'wheel' event
if (typeof window !== 'undefined') {
  window.addEventListener('wheel', (event) => {}, { passive: true });
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
