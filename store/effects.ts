import { createAction } from "@reduxjs/toolkit";
import { appStorage } from "./storage";

export const setEncryptedItem = createAction<any>("redux/setEncryptedItem");
export const fetchRates = createAction<any>("redux/fetchRates");

export const storeEffects = (startListening: any) => {
	startListening({
		actionCreator: setEncryptedItem,
		effect: async (action) => {
			const { key, value } = action.payload;
			console.log(key, value);
			await appStorage.setItem(key, value);
		},
	});
};
