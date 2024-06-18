/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import assert from "node:assert";
import { type Mock, beforeEach, describe, it, mock } from "node:test";
import * as core from "@actions/core";
import * as main from "./main";

// Mock the action's main function
let runMock: Mock<typeof main.run>;

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/;

// Mock the GitHub Actions core library
let debugMock: Mock<typeof core.debug>;
let errorMock: Mock<typeof core.error>;
let getInputMock: Mock<typeof core.getInput>;
let setFailedMock: Mock<typeof core.setFailed>;
let setOutputMock: Mock<typeof core.setOutput>;

describe("action", () => {
	beforeEach(() => {
		mock.restoreAll();

		runMock = mock.method(main, "run");
		debugMock = mock.method(core, "debug", () => void 0);
		errorMock = mock.method(core, "error", () => void 0);
		getInputMock = mock.method(core, "getInput", () => "");
		setFailedMock = mock.method(core, "setFailed", () => void 0);
		setOutputMock = mock.method(core, "setOutput", () => void 0);
	});

	it("sets the time output", async () => {
		// Set the action's inputs as return values from core.getInput()
		getInputMock = mock.method(core, "getInput", (name) => {
			switch (name) {
				case "milliseconds":
					return "500";
				default:
					return "";
			}
		});

		await main.run();
		assert.equal(runMock.mock.callCount(), 1);

		// Verify that all the core library functions were called correctly
		assert.equal(debugMock.mock.calls.length, 3);
		assert.equal(
			debugMock.mock.calls[0].arguments[0],
			"Waiting 500 milliseconds ...",
		);
		assert.match(debugMock.mock.calls[1].arguments[0], timeRegex);
		assert.match(debugMock.mock.calls[2].arguments[0], timeRegex);
		assert.equal(setOutputMock.mock.calls[0].arguments[0], "time");
		assert.match(setOutputMock.mock.calls[0].arguments[1], timeRegex);
		assert.equal(errorMock.mock.callCount(), 0);
	});

	it("sets a failed status", async () => {
		// Set the action's inputs as return values from core.getInput()
		getInputMock = mock.method(core, "getInput", (name) => {
			switch (name) {
				case "milliseconds":
					return "this is not a number";
				default:
					return "";
			}
		});

		await main.run();
		assert.equal(runMock.mock.callCount(), 1);

		// Verify that all the core library functions were called correctly
		assert.equal(setFailedMock.mock.callCount(), 1);
		assert.equal(
			setFailedMock.mock.calls[0].arguments[0],
			"milliseconds not a number",
		);
		assert.equal(errorMock.mock.callCount(), 0);
	});
});
