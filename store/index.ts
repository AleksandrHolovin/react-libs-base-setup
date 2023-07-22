import createStore from './createStore';
const { store, persistor } = createStore();

export type RootStore = ReturnType<typeof store.getState>;

export { store, persistor };
