import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'createPaymentIntent' : ActorMethod<[bigint, string], string>,
  'getAIAssistance' : ActorMethod<[string], string>,
  'getPaymentIntentStatus' : ActorMethod<[string], [] | [string]>,
  'getStripeConfig' : ActorMethod<[], { 'publishableKey' : string }>,
  'getStripePublishableKey' : ActorMethod<[], string>,
  'handleStripeWebhook' : ActorMethod<[Uint8Array | number[], string], string>,
  'loadWebsite' : ActorMethod<[], string>,
  'publishWebsite' : ActorMethod<[], string>,
  'saveWebsite' : ActorMethod<[string], undefined>,
  'setupStripe' : ActorMethod<[string, string, string], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
