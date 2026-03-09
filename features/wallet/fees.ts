import type { FeeRange, TxType } from "./types";

const feeTable: FeeRange[] = [
	{
		rStart: 0,
		rEnd: 150.6999,
		toMomo: 0,
		toBank: 0,
		toAddress: 0,
		internal: 0,
	},
	{
		rStart: 150.7,
		rEnd: 500.69,
		toMomo: 7,
		toBank: 7,
		toAddress: 2.625,
		internal: 1.75,
	},
	{
		rStart: 500.7,
		rEnd: 1000.69,
		toMomo: 13,
		toBank: 13,
		toAddress: 4.875,
		internal: 3.25,
	},
	{
		rStart: 1000.7,
		rEnd: 1500.69,
		toMomo: 23,
		toBank: 23,
		toAddress: 8.625,
		internal: 5.75,
	},
	{
		rStart: 1500.7,
		rEnd: 2500.69,
		toMomo: 33,
		toBank: 33,
		toAddress: 13.125,
		internal: 8.75,
	},
	{
		rStart: 2500.7,
		rEnd: 3500.69,
		toMomo: 53,
		toBank: 53,
		toAddress: 16.875,
		internal: 11.25,
	},
	{
		rStart: 3500.7,
		rEnd: 5000.69,
		toMomo: 57,
		toBank: 57,
		toAddress: 21.375,
		internal: 14.25,
	},
	{
		rStart: 5000.7,
		rEnd: 7500.69,
		toMomo: 78,
		toBank: 78,
		toAddress: 29.25,
		internal: 19.5,
	},
	{
		rStart: 7500.7,
		rEnd: 10000.69,
		toMomo: 90,
		toBank: 22.5,
		toAddress: 33.75,
		internal: 22.5,
	},
	{
		rStart: 10000.7,
		rEnd: 15000.69,
		toMomo: 100,
		toBank: 100,
		toAddress: 37.5,
		internal: 25.0,
	},
	{
		rStart: 15000.7,
		rEnd: 20000.69,
		toMomo: 105,
		toBank: 105,
		toAddress: 43.125,
		internal: 28.75,
	},
	{
		rStart: 20000.7,
		rEnd: 35000.69,
		toMomo: 108,
		toBank: 108,
		toAddress: 46.875,
		internal: 31.25,
	},
	{
		rStart: 35000.7,
		rEnd: 50000.69,
		toMomo: 108,
		toBank: 108,
		toAddress: 50.625,
		internal: 33.75,
	},
	{
		rStart: 50000.7,
		rEnd: 85000.69,
		toMomo: 108,
		toBank: 108,
		toAddress: 58.125,
		internal: 38.75,
	},
	{
		rStart: 85000.7,
		rEnd: 150000.69,
		toMomo: 108,
		toBank: 108,
		toAddress: 67.5,
		internal: 45,
	},
	{
		rStart: 150000.7,
		rEnd: 250000.69,
		toMomo: 108,
		toBank: 108,
		toAddress: 76.875,
		internal: 51.25,
	},
	{
		rStart: 250000.7,
		rEnd: 350000.69,
		toMomo: 108,
		toBank: 108,
		toAddress: 84.375,
		internal: 56.25,
	},
	{
		rStart: 350000.7,
		rEnd: 500000.69,
		toMomo: 108,
		toBank: 108,
		toAddress: 91.875,
		internal: 61.25,
	},
	{
		rStart: 500000.7,
		rEnd: 999999.69,
		toMomo: 108,
		toBank: 108,
		toAddress: 112.5,
		internal: 75,
	},
];

export function getFee(amount: number, transactionType: TxType): number | null {
	const range = feeTable.find(
		(entry) => amount >= entry.rStart && amount <= entry.rEnd,
	);

	if (!range) {
		return null; // Amount out of range
	}

	return range[transactionType];
}
