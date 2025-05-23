// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  rpc: {
    techcommitteemanager: {
      candiadtes: {
        description: 'Get the list of technical committee candidates',
        params: [],
        type: 'Vec<AccountId>'
      },
      selectedCandidates: {
        description: 'Get the list of selected technical committee candidates',
        params: [],
        type: 'Vec<AccountId>'
      }
    },
    validatormanager: {
      activeValidators: {
        description: 'Get the list of active validators',
        params: [],
        type: 'Vec<AccountId>'
      },
      currentMaintenanceIndex: {
        description: 'Get current maintenance index',
        params: [],
        type: 'MaintenanceIndex'
      },
      nextMaintenanceIndex: {
        description: 'Get next maintenance index',
        params: [],
        type: 'MaintenanceIndex'
      },
      offenceValidators: {
        description: 'Get the list of active validators who made the offence',
        params: [],
        type: 'Vec<(AccountId, AuthIndex)>'
      },
      offlineValidators: {
        description: 'Get the list of active validators who went offline',
        params: [],
        type: 'Vec<(AccountId, AuthIndex)>'
      },
      validatorsPool: {
        description: 'Get the list of validator candidates',
        params: [],
        type: 'Vec<AccountId>'
      },
      validators: {
        description: 'Get the list of validator candidates',
        params: [],
        type: 'Vec<AccountId>'
      },
      selectedValidators: {
        description: 'Get the list of active validators',
        params: [],
        type: 'Vec<AccountId>'
      },
      nextValidators: {
        description: 'Get the list of next session active validators',
        params: [],
        type: 'Vec<AccountId>'
      }
    },
    potential: {
      getPotential: {
        description: 'Get the potential of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Balance'
      },
      getMaxSupply: {
        description: 'Get the maximum supply',
        params: [],
        type: 'BalanceOf'
      },
      getTotalSupply: {
        description: 'Get the total supply',
        params: [],
        type: 'BalanceOf'
      },
      getCurrentMonthSupply: {
        description: 'Get the current month supply',
        params: [],
        type: 'BalanceOf'
      },
      getCurrentMonthNumber: {
        description: 'Get the current month number',
        params: [],
        type: 'MonthNumber'
      },
      getCurrentCycleSupply: {
        description: 'Get the current cycle supply',
        params: [],
        type: 'BalanceOf'
      },
      getCurrentCycleNumber: {
        description: 'Get the current cycle number',
        params: [],
        type: 'CycleNumber'
      },
      defaultActiveReferralShare: {
        description: 'Get the default active referral share',
        params: [],
        type: 'ActiveReferralShareType'
      },
      activeReferralShare: {
        description: 'Get the active referral share of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'ActiveReferralShareType'
      }
    },
    fractionalNft: {
      collections: {
        description: 'Get the total number of collections',
        params: [],
        type: 'CollectionId'
      },
      items: {
        description: 'Get the total number of items in a collection',
        params: [
          {
            name: 'collection_id',
            type: 'CollectionId'
          }
        ],
        type: 'ItemId'
      },
      nftInfo: {
        description: 'Get NFT information for a collection',
        params: [
          {
            name: 'collection_id',
            type: 'CollectionId'
          }
        ],
        type: 'NftInfo'
      },
      owner: {
        description: 'Get the owner of an item in a collection',
        params: [
          {
            name: 'collection_id',
            type: 'CollectionId'
          },
          {
            name: 'item_id',
            type: 'ItemId'
          }
        ],
        type: 'Option<AccountId>'
      }
    },
    rewardPool: {
      accountId: {
        description: 'Get the account ID of the reward pool',
        params: [],
        type: 'AccountId'
      },
      balance: {
        description: 'Get the balance of the reward pool',
        params: [],
        type: 'Balance'
      },
      collectionIds: {
        description: 'Get the set of collection IDs associated with the reward pool',
        params: [],
        type: 'BTreeSet<CollectionId>'
      },
      itemIds: {
        description: 'Get the set of item IDs for a given collection in the reward pool',
        params: [
          {
            name: 'collection_id',
            type: 'CollectionId'
          }
        ],
        type: 'BTreeSet<ItemId>'
      }
    },
    referral: {
      activeReferralsCount: {
        description: 'Get count of active referrals for an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      },
      referrer: {
        description: 'Get referrer of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Option<AccountId>'
      },
      activeReferrals: {
        description: 'Get active referrals of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Option<TreeNode<AccountId>>'
      },
      blockProducers: {
        description: 'Get block producers',
        params: [],
        type: 'Vec<AccountId>'
      },
      pendingReferrals: {
        description: 'Get pending referrals of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Vec<AccountId>'
      }
    }
  },
  types: [
    {
      minmax: [0, undefined],
      types: {
        AccountId: 'EthereumAccountId',
        AccountId20: 'EthereumAccountId',
        AccountId32: 'EthereumAccountId',
        Address: 'AccountId',
        AuthIndex: 'u32',
        EthereumSignature: {
          r: 'H256',
          s: 'H256',
          v: 'U8'
        },
        ExtrinsicSignature: 'EthereumSignature',
        Lookup0: 'AccountId',
        LookupSource: 'AccountId',
        MaintenanceIndex: 'u32',
        Balance: 'u128',
        BalanceOf: 'Balance',
        MonthNumber: 'u32',
        CycleNumber: 'u32',
        ActiveReferralShareType: 'u32',
        CollectionId: 'u32',
        ItemId: 'u32',
        NftInfo: {
          address: 'H160',
          token_id: 'U256'
        },
        BTreeSet: 'Vec',
        TreeNode: {
          parent: 'Option<AccountId>',
          children: 'Vec<AccountId>'
        }
      }
    }
  ]
};

export default definitions;
