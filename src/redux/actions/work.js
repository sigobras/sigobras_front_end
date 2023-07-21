export const SET_SELECTED_WORK = 'SET_SELECTED_WORK';

export function setSelectedWork(work) {
	return {
		type: SET_SELECTED_WORK,
		work,
	};
}
