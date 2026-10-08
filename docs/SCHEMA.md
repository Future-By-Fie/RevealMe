# RevealMe — Schema Direction

A production schema would likely include:

- `users`
- `profiles`
- `connections`
- `interaction_sessions`
- `reveal_states`
- `media_assets`
- `messages`
- `reports`
- `blocks`
- `consents`

## Reveal state

A reveal record should capture who initiated the reveal, whether it was accepted, the current state and timestamps. The client must not be trusted to grant access to private identity/media data.

## Data separation

Identity, private media, interaction state and moderation data should have distinct access policies wherever practical.
