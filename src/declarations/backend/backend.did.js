export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'createPaymentIntent' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Text], []),
    'getAIAssistance' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getPaymentIntentStatus' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'getStripePublishableKey' : IDL.Func([], [IDL.Text], ['query']),
    'handleStripeWebhook' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Text],
        [IDL.Text],
        [],
      ),
    'loadWebsite' : IDL.Func([], [IDL.Text], []),
    'publishWebsite' : IDL.Func([], [IDL.Text], []),
    'saveWebsite' : IDL.Func([IDL.Text], [], []),
    'setupStripe' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
