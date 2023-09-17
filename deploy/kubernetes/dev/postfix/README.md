# deploy/dev/postfix/

This directory contains an override for postfix in the dev environment to divert all outgoing email to Mailhog.

All email sent in the dev environment ends up in mailhog instead of actually getting sent.
Mailhog allows you to debug what the email looks like after it's sent.
