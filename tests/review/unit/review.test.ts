import bs58 from "bs58";
import { expect } from "chai";
import { TestContext } from "../base";

describe("add review", () => {
    let testContext: TestContext;

    before(async () => {
        testContext = new TestContext();
        await testContext.init();
    });

    it("should post review", async () => {
        const restaurant = "restaurant_test";
        const review = "review_test";
        const rating = 5;

        const txSignature = await testContext.postReview(
            testContext.reviewer,
            restaurant,
            review,
            rating,
        );
        const txSignatureBytes = bs58.decode(txSignature);
        const tx = await testContext.client.getTransaction(txSignatureBytes);
        const events = await testContext.parseEvents(txSignature);

        expect(events.length).to.equal(1);
        const event = events[0];

        expect(event.name).to.equal("postReviewEvent");
        expect(event.data.restaurant.toString()).to.equal(restaurant);
        expect(event.data.review.toString()).to.equal(review);
        expect(event.data.rating).to.equal(rating);
        expect(event.data.reviewer.toString()).to.equal(testContext.reviewer.publicKey.toString());
    });
});
