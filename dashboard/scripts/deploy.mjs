#!/usr/bin/env node
/**
 * Safe Railway deploy for the Atlas dashboard.
 *
 * - Verifies the linked project + service before upload.
 * - Auto-relinks if either is wrong (defends against `cd`-induced
 *   relink to whatever Railway project lives in the parent directory).
 * - Refuses to deploy if it can't confirm the right destination.
 *
 * Run: `node dashboard/scripts/deploy.mjs` from anywhere, or
 *      `npm run deploy` from the dashboard directory.
 */

import { execSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const EXPECTED_PROJECT = "vn-aio-atlas";
const EXPECTED_SERVICE = "vn-aio-atlas-dashboard";

const here = path.dirname(fileURLToPath(import.meta.url));
const dashboardDir = path.resolve(here, "..");

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: "inherit", ...opts });
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString();
  } catch (err) {
    return err.stdout?.toString() ?? "";
  }
}

function getStatus() {
  const out = runCapture("railway status");
  const project = out.match(/Project:\s*(\S+)/)?.[1];
  const service = out.match(/Service:\s*(\S+)/)?.[1];
  return { project, service };
}

function relink() {
  console.log(`> Relinking to ${EXPECTED_PROJECT} / ${EXPECTED_SERVICE}…`);
  const result = spawnSync(
    "railway",
    ["link", "--project", EXPECTED_PROJECT, "--service", EXPECTED_SERVICE],
    { stdio: "inherit", shell: true },
  );
  if (result.status !== 0) {
    throw new Error("railway link failed");
  }
}

function main() {
  let { project, service } = getStatus();

  if (project !== EXPECTED_PROJECT || service !== EXPECTED_SERVICE) {
    console.log(
      `! Linked to ${project ?? "?"} / ${service ?? "?"}, expected ${EXPECTED_PROJECT} / ${EXPECTED_SERVICE}.`,
    );
    relink();
    ({ project, service } = getStatus());
  }

  if (project !== EXPECTED_PROJECT || service !== EXPECTED_SERVICE) {
    console.error(
      `× Refusing to deploy: still linked to ${project ?? "?"} / ${service ?? "?"} after relink attempt.`,
    );
    process.exit(1);
  }

  console.log(`✓ Linked to ${EXPECTED_PROJECT} / ${EXPECTED_SERVICE}.`);
  console.log(`> Uploading dashboard from ${dashboardDir}…`);
  run(
    `railway up "${dashboardDir.replace(/\\/g, "/")}" --path-as-root --detach`,
    { cwd: dashboardDir },
  );
}

main();
