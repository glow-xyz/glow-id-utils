import { Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";

const getWalletFromHandle = async (handle: string) => {
  const handleBuffer = Buffer.alloc(16);
  handleBuffer.write(handle); // "victor"

  // This publicKey stores the data for the Glow ID
  const [publicKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("handle@"), handleBuffer],
    new PublicKey("GLoW6kDXmQHFjtQQ44ccmXjosqrKkE54bVbUTA4bA3zs")
  );

  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const account = await connection.getAccountInfo(publicKey);

  const walletBytes = account!.data.slice(41, 41 + 32);
  const wallet = new PublicKey(new Uint8Array(walletBytes));
  console.log(wallet.toBase58()); // vicFprL4kcqWTykrdz6icjv2re4CbM5iq3aHtoJmxrh

  console.log("Exiting");
  process.exit(0);
};

getWalletFromHandle("victor");
