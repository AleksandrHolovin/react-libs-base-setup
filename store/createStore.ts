import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, Store } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    Persistor,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from './reducers/root.reducer';
import rootSaga from './sagas/root.saga';

type CreateStore = {
    readonly store: Store;
    readonly persistor: Persistor;
};

const SERIALIZABLE_IGNORED_ACTIONS = [
    'auth/addLicenseRequest'
];

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['session'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const createStore = (): CreateStore => {
    const sagaMiddleware = createSagaMiddleware();

    const store = configureStore({
        reducer: persistedReducer,
        middleware: getDefaultMiddleware => [
            sagaMiddleware,
            ...getDefaultMiddleware({
                thunk: false,
                serializableCheck: {
                    ignoredActions: [
                        FLUSH,
                        REHYDRATE,
                        PAUSE,
                        PERSIST,
                        PURGE,
                        REGISTER,
                        ...SERIALIZABLE_IGNORED_ACTIONS
                    ],
                },
            }),
        ],
    });

    sagaMiddleware.run(rootSaga);

    const persistor = persistStore(store);

    return {
        store,
        persistor,
    };
};

export default createStore;
