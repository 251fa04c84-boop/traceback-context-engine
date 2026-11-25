#!/usr/bin/env bash
set -euo pipefail

DEV=".github/workflows/forge-dev-deploy.yml"
STAGING=".github/workflows/forge-test-site-deploy.yml"
README="README.md"
DEV_GUIDE="docs/DEPLOY_FROM_GITHUB_ANDROID.md"
STAGING_GUIDE="docs/DEPLOY_TO_TEST_SITE_ANDROID.md"
STAGING_READINESS="docs/STAGING_READINESS_2026-11-23.md"

fail() {
  echo "Deployment safety check failed: $1" >&2
  exit 1
}

# Neither workflow may install, upgrade, target, or consent scopes for a Jira site.
for workflow in "$DEV" "$STAGING"; do
  if grep -Eq 'npx[[:space:]]+--yes[[:space:]]+@forge/cli@[^[:space:]]+[[:space:]]+install([[:space:]]|$)' "$workflow"; then
    fail "$workflow must never install an app on a Jira site"
  fi
  if grep -Eq -- '--site|--upgrade|--confirm-scopes' "$workflow"; then
    fail "$workflow must not target a site, upgrade an installation, or consent to scopes"
  fi
done

grep -Fq 'deploy --non-interactive -e development' "$DEV" || fail "the development workflow must deploy only to Forge development"

if grep -Eq 'TARGET_SITE|INSTALL_MODE|CONFIRM_TEST_SITE_INSTALL|CONFIRM_NOT_PRODUCTION_SITE' "$STAGING"; then
  fail "the staging workflow must not accept a Jira site or installation-mode input"
fi
grep -Fq 'CONFIRM_STAGING_DEPLOY' "$STAGING" || fail "the staging workflow must require an explicit staging deployment confirmation"
grep -Fq 'CONFIRM_STAGING_DEPLOY" != "true"' "$STAGING" || fail "the staging workflow must reject an unconfirmed deployment"
grep -Fq 'deploy --non-interactive -e staging' "$STAGING" || fail "the staging workflow must deploy only to Forge staging"

# Keep every local Markdown link in the public deployment/readiness guides resolvable.
for path in "$README" "$DEV_GUIDE" "$STAGING_GUIDE" "$STAGING_READINESS"; do
  [[ -f "$path" ]] || fail "required deployment/readiness document is missing: $path"
done

check_local_markdown_links() {
  local source_file="$1"
  local base_dir
  base_dir="$(dirname "$source_file")"

  while IFS= read -r target; do
    case "$target" in
      ""|http://*|https://*|mailto:*|//*|\#*) continue ;;
    esac

    target="${target%%#*}"
    target="${target%%\?*}"
    [[ -z "$target" ]] && continue

    if [[ "$target" == /* ]]; then
      resolved=".${target}"
    else
      resolved="$base_dir/$target"
    fi

    [[ -e "$resolved" ]] || fail "broken local Markdown link in $source_file: $target"
  done < <(grep -Eo '\]\([^)]*\)' "$source_file" | sed -E 's/^\]\(([^)]*)\)$/\1/')
}

for document in "$README" "$DEV_GUIDE" "$STAGING_GUIDE" "$STAGING_READINESS"; do
  check_local_markdown_links "$document"
done

echo "Deployment safety checks passed: neither workflow installs or upgrades a Jira site; development and staging deployment targets are isolated; local readiness links resolve."
