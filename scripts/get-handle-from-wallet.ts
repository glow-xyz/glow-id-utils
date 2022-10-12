import { Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import { GLOW_ID_PUBKEY } from "./glow-id-base";

/**
 * There are two ways of doing this:
 * 1. getProgramAccounts
 * 2. look up the wallet account and get the handle there
 */
const getHandleFromWallet = async (address: string) => {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const pubkey = new PublicKey(address);

  // Option 1 - getProgramAccounts
  const [matchingAccount, x] = await connection.getProgramAccounts(
    GLOW_ID_PUBKEY,
    {
      filters: [{ memcmp: { offset: 41, bytes: pubkey.toBase58() } }],
    }
  );

  const handleBytesViaGpa = matchingAccount.account.data
    .slice(9, 9 + 16)
    // Filter out null bytes since they are just for filler
    .filter((byte) => byte !== 0);

  const handleViaGpa = Buffer.from(handleBytesViaGpa).toString("utf-8");
  console.log(handleViaGpa); // "thomas"

  // Option 2 - look up wallet account
  const [walletInfoPkey] = PublicKey.findProgramAddressSync(
    [Buffer.from("wallet@"), pubkey.toBuffer()],
    new PublicKey("GLoW6kDXmQHFjtQQ44ccmXjosqrKkE54bVbUTA4bA3zs")
  );
  const walletInfoAccount = await connection.getAccountInfo(walletInfoPkey);
  const handleBytes = walletInfoAccount!.data
    .slice(41, 41 + 16)
    .filter((byte) => byte !== 0);
  const handleViaWalletInfo = Buffer.from(handleBytes).toString("utf-8");
  console.log(handleViaWalletInfo); // "thomas"

  console.log("Exiting");
  process.exit(0);
};

getHandleFromWallet("64WMAwJ2zPw9uuPQSeQCKwKqeTne6z2kzCjnNczp7My8");
