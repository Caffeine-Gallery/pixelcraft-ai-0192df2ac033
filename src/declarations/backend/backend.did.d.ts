import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getAIAssistance' : ActorMethod<[string], string>,
  'getStripePublishableKey' : ActorMethod<[], string>,
  'loadWebsite' : ActorMethod<[], string>,
  'processStripePayment' : ActorMethod<[string], { 'success' : boolean }>,
  'publishWebsite' : ActorMethod<[], string>,
  'saveWebsite' : ActorMethod<[string], undefined>,
  'setupStripePayment' : ActorMethod<[string], { 'success' : boolean }>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
