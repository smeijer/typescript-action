/**
 * Unit tests for src/wait.ts
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { wait } from "./wait";

describe("wait.ts", () => {
	it("throws an invalid number", async () => {
		const input = Number.parseInt("foo", 10);
		assert(Number.isNaN(input));
		await assert.rejects(
			() => wait(input),
			new Error("milliseconds not a number"),
		);
	});

	it("waits with a valid number", async () => {
		const start = new Date();
		await wait(500);
		const end = new Date();

		const delta = Math.abs(end.getTime() - start.getTime());
		assert(delta > 450);
	});
});
