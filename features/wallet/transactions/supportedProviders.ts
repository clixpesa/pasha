import { MethodId, type MethodInfo } from "../types";

export const supportedProviders: Record<MethodId, MethodInfo> = {
	[MethodId.MobileMoney]: {
		name: "Mobile Money",
		logo: require("@/ui/assets/images/provider-logos/mobile-money.png"),
		providers: [
			{
				id: `${MethodId.MobileMoney}_MPESA`,
				name: "MPESA",
				logo: require("@/ui/assets/images/provider-logos/mpesa.png"),
				desc: "Use MPESA to buy crypto quickly and securely.",
				country: "KEN",
			},
			{
				id: `${MethodId.MobileMoney}_AIRTEL`,
				name: "Airtel Money",
				logo: require("@/ui/assets/images/provider-logos/airtelmoney.png"),
				desc: "Use Airtel Money to buy crypto quickly and securely.",
				country: "KEN",
			},
		],
		tokens: ["USDC_1", "USDT_1", "DAI_1", "cUSD_42220", "cEUR_42220"],
		baseURL: "https://api.clixpesa.com/v1/momo",
	},
	[MethodId.BankTransfer]: {
		name: "Bank Transfer",
		logo: require("@/ui/assets/images/provider-logos/bank-transfer.png"),
		providers: [
			{
				id: `${MethodId.BankTransfer}_PESALINK`,
				name: "Pesalink",
				logo: require("@/ui/assets/images/provider-logos/bank-transfer.png"),
				desc: "Use Pesalink to transfer from your bank.",
				country: "KEN",
			},
			{
				id: `${MethodId.BankTransfer}_CASHRAMP`,
				name: "Cashramp",
				logo: require("@/ui/assets/images/provider-logos/bank-transfer.png"),
				desc: "Use Cashramp to transfer from your bank.",
				country: "KEN",
			},
		],
		tokens: ["USDC_1", "USDT_1", "DAI_1", "cUSD_42220", "cEUR_42220"],
		baseURL: "https://api.clixpesa.com/v1/bank",
	},
	[MethodId.CreditCard]: {
		name: "Debit/Credit Card",
		logo: require("@/ui/assets/images/provider-logos/credit-card.png"),
		providers: [
			{
				id: `${MethodId.CreditCard}_PRIMARY`,
				name: "Primary",
				logo: require("@/ui/assets/images/provider-logos/credit-card.png"),
				desc: "Use/Link your debit/credit card.",
				country: "KEN",
			},
			{
				id: `${MethodId.CreditCard}_BACKUP`,
				name: "Backup",
				logo: require("@/ui/assets/images/provider-logos/credit-card.png"),
				desc: "Use/Link your debit/credit card as a backup option.",
				country: "KEN",
			},
		],
		tokens: ["USDC_1", "USDT_1", "DAI_1", "cUSD_42220", "cEUR_42220"],
		baseURL: "https://api.clixpesa.com/v1/card",
	},
};

export function getMethodInfo(methodId: MethodId): MethodInfo {
	return supportedProviders[methodId];
}
export function getProviderInfo(
	methodId: MethodId,
	providerId: string,
): MethodInfo["providers"][0] | undefined {
	const methodInfo = getMethodInfo(methodId);
	return methodInfo.providers.find((p) => p.id === providerId);
}
