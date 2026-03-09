import type { Chain } from "viem";

export enum Currency {
	USD = "USD",
	//EUR = "EUR",
	//GBP = "GBP",
	KES = "KES",
	UGX = "UGX",
	TZS = "TZS",
	//NGN = "NGN",
	//GHS = "GHS",
	//ZAR = "ZAR",
}

export type CurrencyInfo = {
	symbol: string;
	conversionRate: number; // Conversion rate to USD
	buyingRate: number; // Buying rate against USD
	sellingRate: number; // Selling rate against USD
};

export type FeeRange = {
	rStart: number;
	rEnd: number;
	toMomo: number;
	toBank: number;
	internal: number;
	toAddress: number;
};

export enum TxType {
	toMomo = "toMomo",
	toBank = "toBank",
	internal = "internal",
	toAddress = "toAddress",
}

export enum CountryCode {
	Kenya = "KEN",
	Uganda = "UGA",
	Tanzania = "TZA",
	Nigeria = "NGA",
	Ghana = "GHA",
	SouthAfrica = "ZAF",
}

export enum ChainId {
	Mainnet = 1,
	Avalanche = 43114,
	Base = 8453,
	Celo = 42220,
	Alfajores = 44787,
	AvalancheFuji = 43113,
	BaseSepolia = 84532,
	Sepolia = 11155111,
}

export enum MethodId {
	//1 = Mobile Money, 2 = Bank Transfer, 3 = Credit Card
	MobileMoney = 101,
	BankTransfer = 201,
	CreditCard = 301,
}

export type ProviderId = `${MethodId}_${string}`; // e.g., "101_MPESA"
export type ProviderInfo = {
	id: ProviderId;
	name: string;
	logo: string;
	desc: string;
	country: string;
};

export type MethodInfo = {
	name: string;
	logo: string;
	providers: ProviderInfo[];
	tokens: TokenId[];
	baseURL: string;
};

export type ProviderDetails = Record<ProviderId, RampsAccountDetails>;

export type RampsAccountDetails = {
	accountName: string;
	accountNumber: string;
	bankName?: string | null;
};

export interface ChainInfo extends Chain {
	readonly id: ChainId;
	readonly name: string;
	readonly rpcUrl: { http: string[] };
	readonly explorer: { name: string; url: `${string}/`; apiUrl?: string };
	readonly logo: string;
}

export interface EnabledChainsInfo {
	chains: ChainId[]; //ChainInfo[];
	isTestnet: boolean;
	defaultChainId: ChainId;
}

export type Address = `0x${string}`; // Ethereum-style address format

export type MnemonicData = {
	address: string;
	mnemonic?: { phrase: string; path: string; locale: string } | string | null;
	enMnemonic?: string;
	enSkey?: string;
};

export type Balance = {
	balance: number;
	balanceUSD: number;
};

export type TokenType = "Dollar" | "Local" | "Native" | "Other";
export type TokenId = `${string}_${ChainId}`; // e.g., "USDC_1" for USDC on Ethereum Mainnet

export type Token = {
	chainId: ChainId;
	address: Address;
	name: string;
	symbol: string;
	decimals: number;
	logo: string; // Optional logo URL
	isNative?: boolean; // Indicates if it's a native token (e.g., ETH, AVAX)
};

export type TokenWithBalance = Token &
	Balance & {
		type?: TokenType; // Optional type for categorization
	};

export type RawTransaction = typeof sampleTx;

const sampleTx = {
	blockHash:
		"0x59814709a2951e2d7f01833cfee203c2a12af14b01641a564a830874dc32713f",
	blockNumber: "27472265",
	confirmations: "68451",
	contractAddress: "0x236d5ad19a5e5c5ae80910de96141272aef27e38",
	cumulativeGasUsed: "2514519",
	from: "0x0000000000000000000000000000000000000000",
	gas: "8000000",
	gasPrice: "1000094",
	gasUsed: "177540",
	hash: "0x787bb32354ece737234c1410209e73a2aafcf3236b4e58d46c302c6409ac1b21",
	methodId: "0xb1dc65a4",
	nonce: "33262",
	timeStamp: "1750712818",
	to: "0x590392f06ac76c82f49c01219cf121a553aa2e58",
	tokenDecimal: "18",
	tokenId: "KxSH_84532",
	tokenName: "Stable KES Shilling",
	tokenSymbol: "KxSH",
	transactionIndex: "8",
	value: "10000000000000000000",
};

export type Transaction = {
	id: string;
	hash: string;
	title: string;
	date: string;
	tokenId: TokenId;
	to: Address;
	from: Address;
	fee: number;
	amount: number;
	amountUSD: number;
	timestamp: number;
};
