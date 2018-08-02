#if defined(NODE_WANT_INTERNALS) && NODE_WANT_INTERNALS
// Can't include node_internals.h because of NAPI_EXPERIMENTAL
#include "base_object-inl.h"
#include "env-inl.h"
#include "memory_tracker-inl.h"
#include "string_decoder-inl.h"
#include "util-inl.h"
#endif  // defined(NODE_WANT_INTERNALS) && NODE_WANT_INTERNALS
