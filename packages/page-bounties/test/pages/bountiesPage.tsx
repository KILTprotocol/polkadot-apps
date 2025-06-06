// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global jest, expect */

import type { RenderResult } from '@testing-library/react';
import type { ApiPromise } from '@polkadot/api';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { ApiProps } from '@polkadot/react-api/types';
import type { PartialQueueTxExtrinsic, QueueProps, QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import type { BountyIndex } from '@polkadot/types/interfaces';
import type { PalletBountiesBounty, PalletBountiesBountyStatus } from '@polkadot/types/lookup';
import type { BountyApi } from '../../src/hooks/index.js';

import { fireEvent, render, within } from '@testing-library/react';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { lightTheme } from '@polkadot/react-components';
import { KeyringCtxRoot } from '@polkadot/react-hooks';
import { ApiCtx } from '@polkadot/react-hooks/ctx/Api';
import { QueueCtx } from '@polkadot/react-hooks/ctx/Queue';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BountyFactory } from '@polkadot/test-support/creation/bounties';
import { TypeRegistry } from '@polkadot/types/create';

import Bounties from '../../src/Bounties.js';
import { mockBountyHooks } from '../hooks/defaults.js';
import { clickButtonWithName } from '../utils/clickButtonWithName.js';
import { clickElementWithTestId } from '../utils/clickElementWithTestId.js';
import { clickElementWithText } from '../utils/clickElementWithText.js';

function aGenesisHash () {
  return new TypeRegistry().createType('Hash', POLKADOT_GENESIS);
}

type FindOne = (match: string) => Promise<HTMLElement>;
type FindManyWithMatcher = (match: string | ((match: string) => boolean)) => Promise<HTMLElement[]>
type GetMany = (match: string) => HTMLElement[];

class NotYetRendered extends Error {

}

let queueExtrinsic: (value: PartialQueueTxExtrinsic) => void;
const propose = jest.fn(() => 'mockProposeExtrinsic');

interface RenderedBountiesPage {
  findAllByTestId: FindManyWithMatcher;
  findByText: FindOne;
  findByRole: FindOne;
  findByTestId: FindOne;
  getAllByRole: GetMany;
  queryAllByText: GetMany;
}

export class BountiesPage {
  aBounty: ({ status, value }?: Partial<PalletBountiesBounty>) => PalletBountiesBounty;
  aBountyIndex: (index?: number) => BountyIndex;
  aBountyStatus: (status: string) => PalletBountiesBountyStatus;
  bountyStatusWith: ({ curator, status }: { curator?: string, status?: string, }) => PalletBountiesBountyStatus;
  bountyWith: ({ status, value }: { status?: string, value?: number }) => PalletBountiesBounty;

  findByRole?: FindOne;
  findByText?: FindOne;
  findByTestId?: FindOne;
  getAllByRole?: GetMany;
  findAllByTestId?: FindManyWithMatcher;
  queryAllByText?: GetMany;
  renderResult?: RenderResult;

  constructor (api: ApiPromise) {
    ({ aBounty: this.aBounty, aBountyIndex: this.aBountyIndex, aBountyStatus: this.aBountyStatus, bountyStatusWith: this.bountyStatusWith, bountyWith: this.bountyWith } = new BountyFactory(api));
  }

  renderOne (bounty: PalletBountiesBounty, proposals: DeriveCollectiveProposal[] = [], description = '', index = this.aBountyIndex()): RenderedBountiesPage {
    return this.renderMany({ bounties: [{ bounty, description, index, proposals }] });
  }

  renderMany (bountyApi: Partial<BountyApi> = {}, { balance = 1 } = {}): RenderedBountiesPage {
    const renderResult = this.renderBounties(bountyApi, { balance });
    const { findAllByTestId, findByRole, findByTestId, findByText, getAllByRole, queryAllByText } = renderResult;

    this.findByRole = findByRole;
    this.findByText = findByText;
    this.findByTestId = findByTestId;
    this.getAllByRole = getAllByRole;
    this.findAllByTestId = findAllByTestId;
    this.queryAllByText = queryAllByText;
    this.renderResult = renderResult;

    return { findAllByTestId, findByRole, findByTestId, findByText, getAllByRole, queryAllByText };
  }

  private renderBounties (bountyApi: Partial<BountyApi> = {}, { balance = 1 } = {}) {
    mockBountyHooks.bountyApi = { ...mockBountyHooks.bountyApi, ...bountyApi };
    mockBountyHooks.balance = balanceOf(balance);
    const mockApi: ApiProps = {
      api: {
        derive: {
          accounts: {
            info: () => Promise.resolve(() => { /**/
            })
          }
        },
        genesisHash: aGenesisHash(),
        query: {},
        registry: { chainDecimals: [12], chainTokens: ['Unit'] },
        tx: {
          council: {
            propose
          }
        }
      },
      isApiConnected: true,
      isApiInitialized: true,
      isApiReady: true,
      isEthereum: false,
      systemName: 'substrate'
    } as unknown as ApiProps;

    queueExtrinsic = jest.fn() as QueueTxExtrinsicAdd;
    const queue = {
      queueExtrinsic
    } as QueueProps;

    return render(
      <>
        <div id='tooltips' />
        <Suspense fallback='...'>
          <QueueCtx.Provider value={queue}>
            <MemoryRouter>
              <ThemeProvider theme={lightTheme}>
                <ApiCtx.Provider value={mockApi}>
                  <KeyringCtxRoot>
                    <Bounties />
                  </KeyringCtxRoot>
                </ApiCtx.Provider>
              </ThemeProvider>
            </MemoryRouter>
          </QueueCtx.Provider>
        </Suspense>
      </>
    );
  }

  private assertRendered (): asserts this is RenderedBountiesPage {
    if (this.findByText === undefined) {
      throw new NotYetRendered();
    }
  }

  async openProposeCurator (): Promise<void> {
    this.assertRendered();
    const proposeCuratorButton = await this.findByText('Propose curator');

    fireEvent.click(proposeCuratorButton);
    // await this.expectText('This action will create a Council motion to propose a Curator for the Bounty.');
  }

  async enterCuratorsFee (fee: string): Promise<void> {
    this.assertRendered();
    const feeInput = await this.findByTestId("curator's fee");

    fireEvent.change(feeInput, { target: { value: fee } });
  }

  async expectText (expected: string): Promise<void> {
    this.assertRendered();
    expect(await this.findByText(expected)).toBeTruthy();
  }

  async assignCuratorButton (): Promise<HTMLElement> {
    this.assertRendered();
    const proposeCuratorModal = await this.findByTestId('propose-curator-modal');

    return await within(proposeCuratorModal).findByText('Propose curator');
  }

  enterProposingAccount (account: string): void {
    this.assertRendered();
    const comboboxes = this.getAllByRole('combobox');

    const proposingAccountInput = comboboxes[0].children[0];

    fireEvent.change(proposingAccountInput, { target: { value: account } });
    fireEvent.keyDown(proposingAccountInput, { code: 'Enter', key: 'Enter' });
  }

  enterProposedCurator (curator: string): void {
    this.assertRendered();
    const comboboxes = this.getAllByRole('combobox');

    const proposedCuratorInput = comboboxes[1].children[0];

    fireEvent.change(proposedCuratorInput, { target: { value: curator } });
    fireEvent.keyDown(proposedCuratorInput, { code: 'Enter', key: 'Enter' });
  }

  expectExtrinsicQueued (extrinsicPart: { accountId: string; extrinsic?: string }): void {
    expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining(extrinsicPart));
  }

  expectTextAbsent (text: string): void {
    this.assertRendered();
    expect(this.queryAllByText(text)).toHaveLength(0);
  }

  async findAllDescriptions (): Promise<string[]> {
    this.assertRendered();
    const descriptions = await this.findAllByTestId('description');

    return descriptions.map((d) => d.textContent || '');
  }

  async rendered (): Promise<void> {
    this.assertRendered();
    await this.findByTestId('bountyStatus');
  }

  async openAddBounty (): Promise<void> {
    this.assertRendered();
    await clickButtonWithName('Add Bounty', this.findByRole);
    await this.expectText('This account will propose the bounty. Bond amount will be reserved on its balance.');
  }

  async enterBountyTitle (title: string): Promise<void> {
    this.assertRendered();
    const titleInput = await this.findByTestId('bounty title');

    fireEvent.change(titleInput, { target: { value: title } });
  }

  async openCloseBounty (): Promise<void> {
    this.assertRendered();
    await this.openExtraActions();

    await clickElementWithText('Close', this.findByText);

    // await this.expectText('This action will create a Council proposal to close the Bounty.');
  }

  async clickButton (buttonName: string): Promise<void> {
    this.assertRendered();
    await clickButtonWithName(buttonName, this.findByRole);
  }

  async clickButtonByTestId (buttonName: string): Promise<void> {
    this.assertRendered();
    await clickElementWithTestId(buttonName, this.findByTestId);
  }

  async clickButtonByText (buttonName: string): Promise<void> {
    this.assertRendered();
    await clickElementWithText(buttonName, this.findByText);
  }

  async openRejectCuratorRole (): Promise<void> {
    await this.openExtraActions();
    await this.clickButtonByText('Reject curator');
    // await this.expectText('This action will reject your candidacy for the curator of the bounty.');
  }

  async openExtraActions (): Promise<void> {
    await this.clickButtonByTestId('popup-open');
  }

  async openAcceptCuratorRole (): Promise<void> {
    await this.clickButton('Accept');
    // await this.expectText('This action will accept your candidacy for the curator of the bounty.');
  }

  async findCuratorsFee (): Promise<string> {
    this.assertRendered();

    return (await this.findByTestId("curator's fee")).getAttribute('value') || '';
  }

  async findCuratorsDeposit (): Promise<string> {
    this.assertRendered();

    return (await this.findByTestId("curator's deposit")).getAttribute('value') || '';
  }

  async openExtendExpiry (): Promise<void> {
    await this.openExtraActions();
    await this.clickButtonByText('Extend expiry');
    // await this.expectText('This action will extend expiry time of the selected bounty.');
  }

  async enterExpiryRemark (remark: string): Promise<void> {
    this.assertRendered();
    const remarkInput = await this.findByTestId('bounty remark');

    fireEvent.change(remarkInput, { target: { value: remark } });
  }

  async openGiveUpCuratorsRole (): Promise<void> {
    await this.openExtraActions();
    await this.clickButtonByText('Give up');
    // await this.expectText('This action will unassign you from the curator role.');
  }

  async openSlashCuratorByCouncil (): Promise<void> {
    await this.openExtraActions();
    await this.clickButtonByText('Slash curator (Council)');
    // await this.expectText('This action will create a Council motion to slash the Curator.');
  }

  async openAwardBeneficiary (): Promise<void> {
    await this.clickButton('Reward implementer');
    // await this.expectText('This action will reward the Beneficiary and close the bounty after a delay period.');
  }

  enterBeneficiary (beneficiary: string): void {
    this.assertRendered();
    const comboboxes = this.getAllByRole('combobox');

    const beneficiaryAccountInput = comboboxes[1].children[0];

    fireEvent.change(beneficiaryAccountInput, { target: { value: beneficiary } });
    fireEvent.keyDown(beneficiaryAccountInput, { code: 'Enter', key: 'Enter' });
  }

  async expectVotingDescription (description: string): Promise<void> {
    this.assertRendered();
    const votingInfo = await this.findByTestId('voting-description');
    const icon = await within(votingInfo).findByTestId('question-circle');

    fireEvent.mouseEnter(icon);
    expect(await this.findByText(description)).toBeVisible();
  }
}
