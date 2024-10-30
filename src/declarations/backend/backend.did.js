export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getAIAssistance' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getStripePublishableKey' : IDL.Func([], [IDL.Text], ['query']),
    'loadWebsite' : IDL.Func([], [IDL.Text], []),
    'processStripePayment' : IDL.Func(
        [IDL.Text],
        [IDL.Record({ 'success' : IDL.Bool })],
        [],
      ),
    'publishWebsite' : IDL.Func([], [IDL.Text], []),
    'saveWebsite' : IDL.Func([IDL.Text], [], []),
    'setupStripePayment' : IDL.Func(
        [IDL.Text],
        [IDL.Record({ 'success' : IDL.Bool })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
