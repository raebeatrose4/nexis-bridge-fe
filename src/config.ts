import { Token } from "./@types/token";
import { nexisTestnet, fantomTestnet,bscTestnet,sepolia,polygonMumbai} from "./chains";
import { zeroAddress } from "viem";
const config = {
  chains: [nexisTestnet,fantomTestnet,bscTestnet,sepolia,polygonMumbai],

  chainImage: {
    [nexisTestnet.id]: "/images/chains/NZT.svg",
    [fantomTestnet.id]:"/images/chains/FTM.png",
    [bscTestnet.id]:"/images/chains/BNB.svg",
    [sepolia.id]:"/images/chains/ETH.svg",
    [polygonMumbai.id]:"/images/chains/MATIC.svg"
  
  },

  bridge: {
    [nexisTestnet.id]: "0x478b2E52eab5be2d6511412Fb5E79bE26e901f14",
    [fantomTestnet.id]: "0x8C9Cc380a7bD4cb4b6De6bA85D20299730164d49",
    [bscTestnet.id]: "0x6Ee348a5d180B102860d037AB75B82BA5194FEBC",
    [sepolia.id]:"0x6Ee348a5d180B102860d037AB75B82BA5194FEBC",
    [polygonMumbai.id]:"0x6Ee348a5d180B102860d037AB75B82BA5194FEBC"
  } as Record<number, `0x${string}`>,

  tokens: {
    [nexisTestnet.id]: {
      nexis: {
        name: "Bridged Nexis",
        symbol: "bNZT",
        contract: "0x478b2E52eab5be2d6511412Fb5E79bE26e901f14",
        decimals: 18,
        image: "/images/tokens/NZT.svg",
      },
      nexisNative: {
        name: "Nexis",
        symbol: "NZT",
        contract: zeroAddress,
        decimals: 18,
        image: "/images/tokens/NZT.svg",
      },
    },
    [fantomTestnet.id]: {
      nexis: {
        name: "Nexis",
        symbol: "NZT",
        contract: "0x8C9Cc380a7bD4cb4b6De6bA85D20299730164d49",
        decimals: 18,
        image: "/images/tokens/NZT.svg",
      },
    },
    [bscTestnet.id]: {
      nexis: {
        name: "Nexis",
        symbol: "NZT",
        contract: "0x6Ee348a5d180B102860d037AB75B82BA5194FEBC",
        decimals: 18,
        image: "/images/tokens/NZT.svg",
      },
    },
    [sepolia.id]: {
      nexis: {
        name: "Nexis",
        symbol: "NZT",
        contract: "0x6Ee348a5d180B102860d037AB75B82BA5194FEBC",
        decimals: 18,
        image: "/images/tokens/NZT.svg",
      },
    },
    [polygonMumbai.id]: {
      nexis: {
        name: "Nexis",
        symbol: "NZT",
        contract: "0x6Ee348a5d180B102860d037AB75B82BA5194FEBC",
        decimals: 18,
        image: "/images/tokens/NZT.svg",
      },
    },
  } as Record<number, Record<string, Token>>,
};

export default config;
