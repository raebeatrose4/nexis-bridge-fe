import { Token } from "./@types/token";
import { nexisTestnet, localhost, fantomTestnet } from "./chains";
import { zeroAddress } from "viem";
const config = {
  chains: [nexisTestnet,fantomTestnet],

  chainImage: {
    [nexisTestnet.id]: "/images/chains/NZT.svg",
    [fantomTestnet.id]:"/images/chains/ETH.svg"
  },

  bridge: {
    [nexisTestnet.id]: "0x478b2E52eab5be2d6511412Fb5E79bE26e901f14",
    [fantomTestnet.id]: "0x8C9Cc380a7bD4cb4b6De6bA85D20299730164d49",
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
  } as Record<number, Record<string, Token>>,
};

export default config;
