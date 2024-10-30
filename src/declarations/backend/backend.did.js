export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'getAIAssistance' : IDL.Func([IDL.Text], [IDL.Text], []),
    'loadWebsite' : IDL.Func([], [Result], ['query']),
    'publishWebsite' : IDL.Func([], [Result], []),
    'saveWebsite' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
