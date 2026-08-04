# Security Specification for DataSingularity Firestore Rules

## 1. Data Invariants
- `assets`: Anyone authenticated can read assets; users can write custom assets if `urn` and `name` are valid strings <= 256 chars.
- `simulations`: Users can create simulation messages with `text` <= 2000 chars and `sender` in `['user', 'oracle', 'system']`. Reads are allowed for authenticated users.
- `users`: Users can only read and write their own profile document (`/users/$(request.auth.uid)`).

## 2. Dirty Dozen Payloads
1. Unauthorized asset update (unauthenticated user).
2. Asset payload with URN size > 256 characters.
3. Asset with unknown extra root keys (Shadow Update).
4. Simulation message with text > 2000 characters.
5. Simulation message setting spoofed `userId` different from `request.auth.uid`.
6. Simulation message with invalid `sender` type.
7. User updating another user's profile (/users/otherUid).
8. User creating profile with invalid language value.
9. User setting `createdAt` timestamp in future or client spoofed time.
10. Attempting to list all user profiles without filtering by ownership.
11. Attempting to delete a core system asset document without owner/admin permission.
12. Injecting malicious non-alphanumeric document ID into `/assets/{assetId}`.

## 3. Security Test Runner (`firestore.rules.test.ts`)
```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// Verification suite ensuring all dirty dozen payloads return PERMISSION_DENIED.
```
