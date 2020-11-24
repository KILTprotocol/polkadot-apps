// Copyright 2017-2020 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Snippet } from '@polkadot/app-js/types';

// We must fix this :(
/* eslint-disable sort-keys */

export const polimecDemo: Snippet = {
  value: 'polimecDemo',
  text: '(Polimec) Make transfer and listen to events',
  label: { color: 'red', children: 'Extrinsics', size: 'tiny' },
  code: `// Helper for waiting until transaction is in block
const sendAndAwaitInBlock = async (tx) => {
  return new Promise((resolve) => {
    tx.send(({ events = [], status }) => {
      if (status.isInBlock) {
        console.log(
          "Successful transfer of " +
            randomAmount +
            " with hash " +
            status.asInBlock.toHex()
        );
        resolve();
      } else {
        console.log("Status of transfer: " + status.type);
      }

      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(
          phase.toString() +
            " : " +
            section +
            "." +
            method +
            " " +
            data.toString()
        );
      });
    });
  });
};

// #############################################################################
// Start of DEMO:

// addresses of BOB and Alice, ID of currency that should be transferred
const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";
const TEST_CURRENCY = "0x0000000000000000";

// Print balances
console.log("BALANCES:");
console.log(
  "Alice:",
  (await api.query.poliBalances.accounts(ALICE, TEST_CURRENCY)).free
);
console.log(
  "Bob:",
  (await api.query.poliBalances.accounts(BOB, TEST_CURRENCY)).free
);

// Get a random number between 1 and 100000
const randomAmount = Math.floor(Math.random() * 100000 + 1);

// Create a extrinsic, transferring randomAmount units to Alice.
const transfer = api.tx.preCurrencyMint.transfer(
  TEST_CURRENCY,
  ALICE,
  randomAmount
);

// Sign transaction and send it
await sendAndAwaitInBlock(await transfer.signAsync(BOB));

// print balances again
console.log("BALANCES:");
console.log(
  "Alice:",
  (await api.query.poliBalances.accounts(ALICE, TEST_CURRENCY)).free
);
console.log(
  "Bob:",
  (await api.query.poliBalances.accounts(BOB, TEST_CURRENCY)).free
);
`
};
