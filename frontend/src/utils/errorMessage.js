// Turns an axios error into a translated message.
// - err.response exists -> the server answered (validation error, 401, etc.):
//   use its message.
// - err.response is missing -> the request never got a response at all
//   (server down/unreachable, timeout, or a CORS preflight that was
//   silently dropped). That's a different problem for the user to act on,
//   so it gets its own message instead of the generic fallback.
export function getErrorMessage(err, t) {
  if (err?.response) {
    return err.response.data?.message || t('errors.generic');
  }
  return t('errors.network');
}
