import type { Chain } from "viem";
import {
  erc20ABI,
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import {
  http,
  parseGwei,
  parseUnits,
  getContract,
  zeroAddress,
  createPublicClient,
} from "viem";
import useStore from "@/store";
import config from "@/config";
import { bridgeAbi } from "@/contracts/bridge";
import { Token } from "@/@types/token";
import { toast } from "react-toastify";
import { bnztAbi, bnztAddress } from "@/contracts/bnzt";

const useWeb3Functions = () => {
  const { chain } = useNetwork();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { maxGasLimit } = useStore();

  const fetchTokenBalance = async (
    tokenAddress: `0x${string}`,
    address: `0x${string}`,
    chain: Chain
  ) => {
    const client = createPublicClient({ chain, transport: http() });

    return tokenAddress === zeroAddress
      ? client.getBalance({ address })
      : client.readContract({
          abi: erc20ABI,
          address: tokenAddress,
          functionName: "balanceOf",
          args: [address],
        });
  };

  const calculateGasFee = async (chain: Chain) => {
    const client = createPublicClient({ chain, transport: http() });
    const gasPrice =
      chain.nativeCurrency.symbol === "nexis"
        ? parseGwei("100")
        : await client.getGasPrice();
    const gasFee = Number(gasPrice * BigInt(maxGasLimit)) / 1e18;
    useStore.setState({ transferGasFee: gasFee });
  };

  const getBridgeContract = () => {
    if (!chain || !config.bridge[chain.id]) return null;

    return getContract({
      abi: bridgeAbi,
      address: config.bridge[chain.id],
      publicClient,
      walletClient: walletClient || undefined,
    });
  };

  const getbnztContract = () => {
    if (!chain || !config.bridge[chain.id]) return null;

    return getContract({
      abi: bnztAbi,
      address: bnztAddress,
      publicClient,
      walletClient: walletClient || undefined,
    });
  };

  const checkAllowance = async (
    tokenAddress: `0x${string}`,
    spender: `0x${string}`,
    amount: bigint
  ) => {
    if (!address || !publicClient || !chain) return false;
    const tokenContract = getContract({
      abi: erc20ABI,
      address: tokenAddress,
      publicClient,
      walletClient: walletClient || undefined,
    });

    const allowance = await tokenContract.read.allowance([address, spender]);

    if (allowance < amount) {
      const hash = await tokenContract.write.approve(
        [spender, 2n ** 256n - 1n],
        {
          gasPrice:
            chain.nativeCurrency.symbol === "nexis"
              ? parseGwei("100")
              : undefined,
        }
      );
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success("Spend approved");
    }
  };

  const swap = async (
    amount: string | number,
    token: Token,
    targetChain: Chain
  ) => {
    const bridgeContract = getBridgeContract();
    if (!chain || !bridgeContract || !walletClient || !amount) return;

    const value = parseUnits(`${amount}`, token.decimals);

    try {
      if (token.contract !== zeroAddress) {
        await checkAllowance(token.contract, bridgeContract.address, value);
      }

      const params = [
        BigInt(targetChain.id),
        walletClient.account.address,
        value,
      ] as const;

      console.log(params)
      const { request } = await bridgeContract.simulate.bridge(params, {
        account: walletClient.account,
        gasPrice:
          chain.nativeCurrency.symbol === "nexis" ? parseGwei("100") : undefined,
      });

      const hash = await walletClient.writeContract(request);

      toast.info("Waiting for confirmation");

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      toast.success("Successfully deposited to bridge");

      return receipt;
    } catch (e: any) {
      toast.error(
        e?.walk?.()?.shortMessage ||
          e?.walk?.()?.message ||
          e?.message ||
          "Something went wrong"
      );
    }
  };

  const wrap = async (
    amount: string | number,
    token: Token,
    targetChain: Chain
  ) => {
    const bnztContract = getbnztContract();
    if (!chain || !bnztContract || !walletClient || !amount) return;

    const value = parseUnits(`${amount}`, token.decimals);

    try {
      // if (token.contract !== zeroAddress) {
      //   await checkAllowance(token.contract, bnztContract.address, value);
      // }

      const params = [
      ] as const;

      const { request } = await bnztContract.simulate.wrap(params, {
        value: value,
        account: walletClient.account,
        gasPrice:
          chain.nativeCurrency.symbol === "nexis" ? parseGwei("100") : undefined,
      });

      console.log(request)

      const hash = await walletClient.writeContract(request);

      toast.info("Waiting for confirmation");

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      toast.success("Successfully Wrapped");

      return receipt;
    } catch (e: any) {
      console.log(e)
      toast.error(
        e?.walk?.()?.shortMessage ||
          e?.walk?.()?.message ||
          e?.message ||
          "Something went wrong"
      );
    }
  };
  const unwrap = async (
    amount: string | number,
    token: Token,
    targetChain: Chain
  ) => {
    const bnztContract = getbnztContract();
    if (!chain || !bnztContract || !walletClient || !amount) return;

    const value = parseUnits(`${amount}`, token.decimals);

    try {
      if (token.contract !== zeroAddress) {
        await checkAllowance(token.contract, bnztContract.address, value);
      }

      const params = [
        value
      ] as const;

      const { request } = await bnztContract.simulate.unwrap(params, {
        account: walletClient.account,
        gasPrice:
          chain.nativeCurrency.symbol === "nexis" ? parseGwei("100") : undefined,
      });

      console.log(request)

      const hash = await walletClient.writeContract(request);

      toast.info("Waiting for confirmation");

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      toast.success("Successfully Wrapped");

      return receipt;
    } catch (e: any) {
      console.log(e)
      toast.error(
        e?.walk?.()?.shortMessage ||
          e?.walk?.()?.message ||
          e?.message ||
          "Something went wrong"
      );
    }
  };

  return { fetchTokenBalance, calculateGasFee, swap ,wrap,unwrap};
};

export default useWeb3Functions;
