/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import assert from "node:assert";
import { describe, it, mock } from "node:test";
import * as core from "@actions/core";
import * as main from "./main";

// Mock the action's entrypoint
const runMock = mock.method(main, "run");
mock.method(core, "debug", () => void 0);
mock.method(core, "setFailed", () => void 0);

describe("index", () => {
	it("calls run when imported", async () => {
		require("./index");
		assert.equal(runMock.mock.callCount(), 1);
	});
});
