import { ethers } from 'ethers';

// TODO add EIP191 signature hook for off-chain login support
// TODO add Wallet-like modal for off-chain login support
export default function useSignature() {
  //  // connect to blockchain API

  const provider = new ethers.providers.AlchemyProvider('goerli', import.meta.env.VITE_ALCHEMY_GOERLI_API_KEY);

  // sign and send transaction as EOA
  const signer = new ethers.Wallet(import.meta.env.VITE_GOERLI_PRIVATE_KEY);

  // async function handleSign() {
  //   const message = 'test signature';
  //   const signature = await signer.signMessage(message);
  //   const isVerified = ethers.utils.verifyMessage(message, signature);
  //   setSignature({
  //     sig: signature,
  //     verified: isVerified,
  //   });
  // }
  // React.useEffect(() => {
  //   (async () => {
  //     const addr = await signer.getAddress();
  //     const network = (await provider.getNetwork()).name;
  //     setTest({
  //       address: addr,
  //       network,
  //     });
  //   })();
  // }, []);

  // <Button onClick={async () => await handleSign()}>signature check</Button>
  // sig: {signature.sig}
  // verified: {signature.verified}
  // <br />
  // fetched wallet: {JSON.stringify(test)}
}
