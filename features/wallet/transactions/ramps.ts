import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paydRampsApi = createApi({
	reducerPath: "paydRampsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://api.mypayd.app/api/v3",
		prepareHeaders: (headers) => {
			const encodedCredentials = btoa(
				"gmUKrPAQACw79eztHsmq:Wv5QVa5EQkh0sagOViqJjo9xzrBSjdjGY3VFQtPH",
			);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
			headers.set("Content-Type", "application/json");
			return headers;
		},
	}),
	endpoints: (builder) => ({
		onrampP: builder.mutation({
			query: (params) => ({
				url: "/chain/onramp",
				method: "post",
				body: JSON.stringify({
					amount: params.amount,
					network_code: "63902",
					username: "clixpesa",
					phone_number: params.phone,
					narration: "Buy Stable Token",
					currency: params.tokenId,
					to_address: params.address,
					payment_method: "MPESA",
					callback_url:
						"https://webhook.site/629eca97-a44c-48e6-b22b-7d527243dd02",
					provider: "web3",
				}),
			}),
		}),
	}),
});

export const xwiftRampsApi = createApi({
	reducerPath: "xwiftRampsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://xwift.africa/v1",
		prepareHeaders: (headers) => {
			headers.set("x-api-key", "zdEiJbfk985AOVre");
			headers.set("Content-Type", "application/json");
			return headers;
		},
	}),
	endpoints: (builder) => ({
		onrampX: builder.mutation({
			query: (params) => ({
				url: "/onramp/KES",
				method: "post",
				body: JSON.stringify({
					shortcode: params.phone.replace("+254", "0"),
					amount: params.amount,
					fee: 0.001,
					mobile_network: "Safaricom",
					chain: params.tokenId.split("_")[1],
					asset: params.tokenId.split("_")[0],
					address: params.address,
					callback_url:
						"https://webhook.site/629eca97-a44c-48e6-b22b-7d527243dd02",
				}),
			}),
		}),
	}),
});

export const { useOnrampPMutation } = paydRampsApi;

export const { useOnrampXMutation } = xwiftRampsApi;
