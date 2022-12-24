import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import Home from './screens/home';

const store = ConfigureStore();

export default function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
