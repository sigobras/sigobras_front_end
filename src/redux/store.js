import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';

import workReducer from './reducers/work';

const store = configureStore({
	reducer: {
		auth: authReducer,
		work: workReducer,
	},
});
export default store;
