import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DefiGoFundMe } from "../target/types/defi_go_fund_me";

describe("Defi-Go-Fund-Me", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DefiGoFundMe as Program<DefiGoFundMe>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
