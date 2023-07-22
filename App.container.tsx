import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import { store, persistor } from './src/redux';
import { createSignalRContext } from './services';

const { useSignalREffect, Provider: SignalRProvider } = createSignalRContext();

const AppContainer: React.FC = () => {

    const { accessToken } = useSelector(
        (state: RootStore) => state.auth.state,
    );
    useSignalREffect('ReceiveMessage', message => { }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SignalRProvider
                    connectEnabled={!!accessToken}
                    accessTokenFactory={() => accessToken}
                    dependencies={[accessToken]}
                    url={CONFIG[CONFIG.ENV].SOCKET_HUB}
                >
                    <App />
                </SignalRProvider>
            </PersistGate>
        </Provider>
    );
};

export default AppContainer;

