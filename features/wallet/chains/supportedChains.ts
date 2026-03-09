import {
	avalanche,
	avalancheFuji,
	base,
	baseSepolia,
	celo,
	celoAlfajores,
	mainnet,
	sepolia,
} from "viem/chains";

import { ChainId, type ChainInfo } from "../types";

export const supportedChains: Record<ChainId, ChainInfo> = {
	[ChainId.Mainnet]: {
		...mainnet,
		id: ChainId.Mainnet,
		name: "Ethereum Mainnet",
		rpcUrl: { http: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"] },
		explorer: {
			name: "Etherscan",
			url: "https://etherscan.io/",
			apiUrl: "https://api.etherscan.io/api",
		},
		logo: require("@/ui/assets/images/network-logos/ethereum-logo.png"),
	},
	[ChainId.Avalanche]: {
		...avalanche,
		id: ChainId.Avalanche,
		name: "Avalanche",
		rpcUrl: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
		explorer: {
			name: "SnowTrace",
			url: "https://snowtrace.io/",
			apiUrl: "https://api.snowtrace.io/api",
		},
		logo: require("@/ui/assets/images/network-logos/avalanche-logo.png"),
	},
	[ChainId.Base]: {
		...base,
		id: ChainId.Base,
		name: "Base",
		rpcUrl: { http: ["https://base.org/rpc"] },
		explorer: {
			name: "Base Explorer",
			url: "https://base.org/explorer/",
			apiUrl: "https://base.org/api",
		},
		logo: require("@/ui/assets/images/network-logos/base-logo.png"),
	},
	[ChainId.Celo]: {
		...celo,
		id: ChainId.Celo,
		name: "Celo",
		rpcUrl: { http: ["https://forno.celo.org"] },
		explorer: {
			name: "Celo Explorer",
			url: "https://explorer.celo.org/",
			apiUrl: "https://explorer.celo.org/api",
		},
		logo: require("@/ui/assets/images/network-logos/celo-logo.png"),
		contracts: {
			...celo.contracts,
			overdraft: {
				address: "0x92E4fa9646b22C2AB485d156C8E704a49424Ce24",
				blockCreated: 35762175,
			},
			goalSavings: {
				address: "0xDd2c5A7e7b522e506Ca7b1D96244864849a045b7",
				blockCreated: 35762176,
			},
			roscas: {
				address: "0x08385c3549853f7076774BE93B494791d752Fb85",
				blockCreated: 40895856,
			},
		},
	},
	[ChainId.Alfajores]: {
		...celoAlfajores,
		id: ChainId.Alfajores,
		name: "Celo Alfajores",
		rpcUrl: { http: ["https://alfajores-forno.celo.org"] },
		explorer: {
			name: "Celo Alfajores Explorer",
			url: "https://explorer.alfajores.celo.org/",
			apiUrl: "https://explorer.alfajores.celo.org/api",
		},
		logo: require("@/ui/assets/images/network-logos/celo-logo.png"),
		contracts: {
			...celoAlfajores.contracts,
			overdraft: {
				address: "0xaB6334966F6380F5736c7923De8Ef89b5E84d017",
				blockCreated: 46642535,
			},
			goalSavings: {
				address: "0xA8bd226aD6E2714D816adECB6C3D7C4CF884285d",
				blockCreated: 51359990,
			},
			roscas: {
				address: "0x2A5Be2d605Ca47E77b0Be0916dce86B781DA2371",
				blockCreated: 51581712,
			},
		},
	},
	[ChainId.AvalancheFuji]: {
		...avalancheFuji,
		id: ChainId.AvalancheFuji,
		name: "Avalanche Fuji",
		rpcUrl: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
		explorer: {
			name: "SnowTrace",
			url: "https://snowtrace.io/",
			apiUrl: "https://api.snowtrace.io/api",
		},
		logo: require("@/ui/assets/images/network-logos/avalanche-logo.png"),
	},
	[ChainId.BaseSepolia]: {
		...baseSepolia,
		id: ChainId.BaseSepolia,
		name: "Base Sepolia",
		rpcUrl: { http: ["https://sepolia.base.org/rpc"] },
		explorer: {
			name: "Base Sepolia Explorer",
			url: "https://sepolia.base.org/explorer/",
			apiUrl: "https://sepolia.base.org/api",
		},
		logo: require("@/ui/assets/images/network-logos/base-logo.png"),
	},
	[ChainId.Sepolia]: {
		...sepolia,
		id: ChainId.Sepolia,
		name: "Sepolia",
		rpcUrl: { http: ["https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"] },
		explorer: {
			name: "Sepolia Etherscan",
			url: "https://sepolia.etherscan.io/",
			apiUrl: "https://api-sepolia.etherscan.io/api",
		},
		logo: require("@/ui/assets/images/network-logos/ethereum-logo.png"),
	},
};
