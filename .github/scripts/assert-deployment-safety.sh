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

if grep -Eq 'npx[[:space:]]+--yes[[:space:]]+@forge/cli@[^[:space:]]+[[:space:]]+install([[:space:]]|$)' "$DEV"; then
  fail "the development workflow must never install an app on a Jira site"
fi
if grep -Eq -- '--site|--upgrade|--confirm-scopes' "$DEV"; then
  fail "the development workflow must not target a site, upgrade an installation, or consent to scopes"
fi
grep -Fq 'deploy --non-interactive -e development' "$DEV" || fail "the development workflow must deploy only to Forge development"

grep -Fq 'default: brand7.atlassian.net' "$STAGING" || fail "the staging workflow must default to the connected staging tenant"
grep -Fq 'TARGET_SITE" != "brand7.atlassian.net"' "$STAGING" || fail "the staging workflow must reject every target except brand7.atlassian.net"
grep -Fq 'TARGET_SITE" == "251fa04c84.atlassian.net"' "$STAGING" || fail "the production tenant must be explicitly blocked"
grep -Fq 'CONFIRM_TEST_SITE_INSTALL' "$STAGING" || fail "the staging workflow must require explicit test-site confirmation"
grep -Fq 'CONFIRM_NOT_PRODUCTION_SITE' "$STAGING" || fail "the staging workflow must require explicit non-production confirmation"
grep -Fq 'install --site "$TARGET_SITE" --product jira --non-interactive' "$STAGING" || fail "the staging install must use only the validated target"
grep -Fq -- '-e staging' "$STAGING" || fail "the staging workflow must not install into Forge production"
if grep -Eq 'npx[[:space:]]+--yes[[:space:]]+@forge/cli@[^[:space:]]+.*--confirm-scopes' "$STAGING"; then
  fail "the staging workflow must never auto-consent to scopes"
fi

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
    target="${target%%\\?*}"
    [[ -z "$target" ]] && continue

    if [[ "$target" == /* ]]; then
      resolved=".${target}"
    else
      resolved="$base_dir/$target"
    fi

    [[ -e "$resolved" ]] || fail "broken local Markdown link in $source_file: $target"
  done < <(grep -Eo '\\]\([^)]*\\)' "$source_file" | sed -E 's/^\\]\\(([^)]*)\\)$/\\1/')
}

for document in "$README" "$DEV_GUIDE" "$STAGING_GUIDE" "$STAGING_READINESS"; do
  check_local_markdown_links "$document"
done

echo "Deployment safety checks passed: site-install boundaries are restricted and all local deployment/readiness links resolve."
