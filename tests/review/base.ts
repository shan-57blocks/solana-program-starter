import { BorshCoder, EventParser, Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { fromWorkspace, LiteSVMProvider } from "anchor-litesvm";
import bs58 from "bs58";
import { LiteSVM } from "litesvm";
import ReviewIDL from "../../target/idl/review.json";
import { Review } from "../../target/types/review";

export class TestContext {
    public client: LiteSVM;
    public provider: LiteSVMProvider;
    public program: Program<Review>;
    public reviewer: Keypair;

    constructor() {
        this.client = fromWorkspace(".");
        this.provider = new LiteSVMProvider(this.client);
        this.program = new Program<Review>(ReviewIDL, this.provider);
        this.reviewer = Keypair.generate();
    }

    async init(): Promise<void> {
        await this.client.airdrop(this.reviewer.publicKey, BigInt(LAMPORTS_PER_SOL));
    }

    getReviewPDA(restaurant: string): PublicKey {
        return PublicKey.findProgramAddressSync(
            [Buffer.from(restaurant), this.reviewer.publicKey.toBuffer()],
            this.program.programId,
        )[0];
    }

    async postReview(
        reviewer: Keypair,
        restaurant: string,
        review: string,
        rating: number,
    ): Promise<string> {
        const reviewPDA = this.getReviewPDA(restaurant);
        const transactionSignature = await this.program.methods
            .postReview(restaurant, review, rating)
            .accountsPartial({
                review: reviewPDA,
                signer: reviewer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([reviewer])
            .rpc();

        return transactionSignature;
    }

    async parseEvents(txSignature: string) {
        const txSignatureBytes = bs58.decode(txSignature);
        const tx = await this.client.getTransaction(txSignatureBytes);
        if (!tx || !("logs" in tx)) {
            return [];
        }
        const logs = tx.logs();
        const eventParser = new EventParser(
            this.program.programId,
            new BorshCoder(this.program.idl),
        );
        const eventGenerator = eventParser.parseLogs(logs);
        const events = [];
        for (const event of eventGenerator) {
            events.push(event);
        }
        return events;
    }
}
