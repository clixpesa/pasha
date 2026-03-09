import { storage } from "@/store/storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Currency, type CurrencyInfo } from "./types";

const setCachedRates = async (currency: Currency, data: CurrencyInfo) => {
	try {
		console.log("Storing rates");
		storage.set(
			`rates_${currency}`,
			JSON.stringify({
				data,
				timestamp: Date.now(),
			}),
		);
	} catch (error) {
		console.warn("Failed to cache rates:", error);
	}
};

export const getCachedRates = async (currency: Currency) => {
	try {
		const cached = storage.getString(`rates_${currency}`);
		if (cached) {
			const { data, timestamp } = JSON.parse(cached);
			// Return cached data if less than 5 minutes old
			if (Date.now() - timestamp < 5 * 60 * 1000) {
				return data;
			}
		}
	} catch (error) {
		console.warn("Failed to get cached rates:", error);
	}
	return null;
};

export const info: Record<Currency, CurrencyInfo & { xid: string }> = {
	[Currency.USD]: {
		symbol: "$",
		xid: "0",
		conversionRate: 1,
		buyingRate: 1,
		sellingRate: 1,
	},
	[Currency.KES]: {
		symbol: "Ksh",
		xid: "1",
		conversionRate: 128.38,
		buyingRate: 128.0,
		sellingRate: 128.75,
	},
	[Currency.UGX]: {
		symbol: "Ush",
		xid: "2",
		conversionRate: 3608.39,
		buyingRate: 3600.0,
		sellingRate: 3620.0,
	},
	[Currency.TZS]: {
		symbol: "Tsh",
		xid: "7",
		conversionRate: 2479.97,
		buyingRate: 2470.0,
		sellingRate: 2490.0,
	},
};

export const ratesApi = createApi({
	reducerPath: "ratesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://xwift.africa/v2/rates",
		prepareHeaders: (headers) => {
			headers.set("x-api-key", "zdEiJbfk985AOVre");
			headers.set("Content-Type", "application/json");
			return headers;
		},
	}),

	tagTypes: ["Rates"],
	endpoints: (builder) => ({
		getRate: builder.query({
			queryFn: async (currency: Currency, _api, _options, baseQuery) => {
				const cached = await getCachedRates(currency);
				if (cached) {
					console.log("Using stored rate");
					return { data: cached };
				}

				const { xid } = info[currency];
				const result = await baseQuery({
					url: `/${xid}`,
					params: { currency },
				});

				if (result.error) {
					return { error: result.error };
				}

				const response = result.data as { data: CurrencyInfo };
				setCachedRates(currency, response.data);
				return { data: response.data };
			},
		}),
	}),
});

export const getRate = (
	currency: Currency,
): Pick<CurrencyInfo, "symbol" | "conversionRate"> => {
	const { symbol, conversionRate } = info[currency];
	return { symbol, conversionRate };
};

export const { useGetRateQuery } = ratesApi;
