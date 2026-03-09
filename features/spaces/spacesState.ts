import { zustandMmkvStorage } from "@/store/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AppState {
	spaceTxs: {
		spaceId: string;
		txs: string[];
	}[];
	setSpaceTxs: (spaceId: string, txHash: string) => void;
	clearSpaceTxs: (spaceId: string) => void;
	getSpaceTxs: (spaceId: string) => string[];
}

const initialAppState = {
	spaceTxs: [],
};

export const useSpacesState = create<AppState>()(
	persist(
		(set, get) => ({
			...initialAppState,
			setSpaceTxs: (spaceId, txHash) => {
				const spaceTxs = get().spaceTxs;
				const existingSpace = spaceTxs.find((tx) => tx.spaceId === spaceId);
				if (existingSpace) {
					if (!existingSpace.txs.includes(txHash)) {
						// Create new arrays to ensure proper state updates
						const updatedTxs = [...existingSpace.txs, txHash];
						const updatedSpaceTxs = spaceTxs.map((space) =>
							space.spaceId === spaceId ? { ...space, txs: updatedTxs } : space,
						);
						set({ spaceTxs: updatedSpaceTxs });
					}
					return;
				}
				// If spaceId does not exist, create a new entry
				const updatedSpaceTxs = [...spaceTxs, { spaceId, txs: [txHash] }];
				set({ spaceTxs: updatedSpaceTxs });
			},
			getSpaceTxs: (spaceId) => {
				const space = get().spaceTxs.find((tx) => tx.spaceId === spaceId);
				return space ? space.txs : [];
			},
			clearSpaceTxs: (spaceId) => {
				const spaceTxs = get().spaceTxs.filter((tx) => tx.spaceId !== spaceId);
				set({ spaceTxs });
			},
		}),
		{
			name: "spaces-state",
			storage: createJSONStorage(() => zustandMmkvStorage),
			version: 1,

			partialize: (state) => ({
				spaceTxs: state.spaceTxs,
			}),
		},
	),
);
