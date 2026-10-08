# RevealMe — Architecture

## Current MVP

The current prototype uses localStorage/demo data and is intended to demonstrate the interaction model rather than provide production infrastructure.

## Production blueprint

A production implementation should separate:

**Auth → Database → Private Storage → Server-side image processing → RLS → API → Client**

### Authentication

User identity and session management.

### Database

Profiles, connections, interaction state, reveal state and moderation records.

### Private storage

Visual assets should not be treated as public profile files by default.

### Server-side processing

Sensitive image/reveal transformations should be controlled server-side rather than trusting the client.

### Row-level security

Users should only access records they are authorized to access.

### API

The client should consume explicit interaction/reveal endpoints rather than directly manipulating sensitive state.

## Architecture principle

RevealMe should make the reveal state a first-class domain object rather than a UI-only effect.
