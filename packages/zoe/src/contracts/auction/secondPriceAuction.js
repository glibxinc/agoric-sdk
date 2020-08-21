// @ts-check

import { E } from '@agoric/eventual-send';

// Eventually will be importable from '@agoric/zoe-contract-support'
import {
  defaultAcceptanceMsg,
  assertIssuerKeywords,
  assertProposalShape,
} from '../../contractSupport';
import { calcWinnerAndClose } from './secondPriceLogic';
import { assertBidSeat } from './assertBidSeat';

import '../../../exported';

/**
 * NOT TO BE USED IN PRODUCTION CODE. BIDS ARE PUBLIC. An auction
 * contract in which the seller offers an Asset for sale, and states a
 * minimum price. The auction closes at the deadline specified by the
 * timerAuthority and closesAfter parameters in the terms provided by
 * the creator of the contract instance. The second price rule is
 * followed, so the highest bidder pays the amount bid by the second
 * highest bidder.
 *
 * startInstance() specifies the issuers and the terms. An invitation
 * for the seller is returned as the creatorInvitation. The seller's
 * offer should look like { give: { Asset: asset }, want: { Ask:
 * minimumBidAmount}} The asset can be non-fungible, but the Ask
 * amount should be of a fungible brand. The bidder invitations can be
 * made by calling makeBidInvitation on the object returned from the
 * seller's offer. Each bidder can submit an offer: { give: { Bid:
 * null } want: { Asset: null } }.
 *
 * @type {ContractStartFn}
 */
const start = zcf => {
  const { timerAuthority, closesAfter } = zcf.getTerms();

  let sellSeat;
  const bidSeats = [];

  // seller will use 'Asset' and 'Ask'. buyer will use 'Asset' and 'Bid'
  assertIssuerKeywords(zcf, harden(['Asset', 'Ask']));

  /** @type {Timer} */
  E(timerAuthority)
    .setWakeup(
      closesAfter,
      harden({ wake: () => calcWinnerAndClose(zcf, sellSeat, bidSeats) }),
    )
    .catch(err => {
      console.error(
        `Could not schedule the close of the auction at the 'closesAfter' deadline ${closesAfter} using this timer ${timerAuthority}`,
      );
      console.error(err);
      throw err;
    });

  const makeBidInvitation = () => {
    /** @type {OfferHandler} */
    const performBid = seat => {
      assertBidSeat(zcf, sellSeat, seat);
      bidSeats.push(seat);
      return defaultAcceptanceMsg;
    };

    const bidExpected = harden({
      give: { Bid: null },
      want: { Asset: null },
    });

    const customProperties = harden({
      auctionedAssets: sellSeat.getProposal().give.Asset,
      minimumBid: sellSeat.getProposal().want.Ask,
      closesAfter,
      timerAuthority,
    });

    return zcf.makeInvitation(
      assertProposalShape(performBid, bidExpected),
      'bid',
      customProperties,
    );
  };

  const sellExpected = harden({
    give: { Asset: null },
    want: { Ask: null },
    // The auction is not over until the deadline according to the
    // provided timer. The seller cannot exit beforehand.
    exit: { waived: null },
  });

  const sell = seat => {
    // Save the seat for when the auction closes.
    sellSeat = seat;

    // The bid invitations can only be sent out after the assets to be
    // auctioned are escrowed.
    return harden({ makeBidInvitation });
  };

  const creatorInvitation = zcf.makeInvitation(
    assertProposalShape(sell, sellExpected),
    'sellAssets',
  );

  return harden({ creatorInvitation });
};

export { start };