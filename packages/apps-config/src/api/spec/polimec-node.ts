// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

// eslint-disable-next-line header/header
export default {
  Address: 'AccountId',
  Index: 'u32',
  LookupSource: 'Address',
  BlockNumber: 'u64',
  Signature: 'MultiSignature',
  AccountIndex: 'u32',
  Hash: 'H256',

  Keys: 'SessionKeys2',
  Amount: 'i128',
  AmountOf: 'Amount',
  Balance: 'u128',
  BalanceOf: 'Balance',

  CurrencyId: '[u8; 8]',
  CurrencyIdOf: 'CurrencyId',

  ValidatorId: 'AccountId',
  IssuerPoints: 'u32',
  LeftCouncilReason: {
    _enum: {
      SlashedOut: null,
      VotedOut: null,
      Voluntarily: null
    }
  },
  SlashReason: {
    _enum: {
      Offline: null,
      FaultyBlock: null,
      InitProposal: null,
      MissingVote: null
    }
  },
  SessionStatus: {
    _enum: {
      Outdated: null,
      UpToDate: null
    }
  },

  UserVote: {
    amount: 'BalanceOf',
    approve: 'Option<bool>'
  },

  CouncilMember: {
    points: 'u32',
    currency_id: 'CurrencyId',
    account_id: 'AccountId',
    validator_id: 'AccountId'
  },

  CouncilMemberApplicant: {
    council_member: 'CouncilMember',
    total_issuance: 'BalanceOf',
    closing_at_block: 'BlockNumber'
  },

  Ballot: {
    yes_votes: 'BalanceOf',
    no_votes: 'BalanceOf'
  },

  CouncilVote: {
    vote: 'bool',
    applicant: 'AccountId',
    votes: 'BTreeMap<CurrencyIdOf, Ballot>'
  },

  // required in 2.0.0
  RefCount: 'u32',

  StakingLedger2: {
    stash: 'AccountId',
    currency_id: 'CurrencyIdOf',
    total: 'BalanceOf',
    active: 'BalanceOf',
    unlocking: 'Vec<UnlockChunk2>'
  },

  UnlockChunk2: {
    value: 'BalanceOf',
    block: 'BlockNumber'
  }
};
