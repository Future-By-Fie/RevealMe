# Engineering review and next milestones

## Current boundary
RevealMe is a local proof of concept. It is not a production dating or social service; do not use real users or sensitive personal data.

## Review priorities
1. Trace the reveal-state machine and verify that a reveal cannot happen before the specified mutual interaction/consent conditions.
2. Add tests for consent withdrawal, blocked/reporting states, session reset and image-access failures.
3. Review image handling: original media must never be exposed merely because the browser UI shows a blurred version.
4. Confirm the actual demo installation, test and build commands; document verified outcomes.
5. Map abuse cases: harassment, impersonation, scraping, underage access and unauthorized image disclosure.

## Before a real pilot
Use authenticated server-side access checks, private media storage, moderation operations, age-appropriate safety design, retention/deletion controls and a GDPR assessment.

## Contributor starter task
Write a state-transition test suite for reveal permissions and document which checks are currently visual-only versus enforced in code.
