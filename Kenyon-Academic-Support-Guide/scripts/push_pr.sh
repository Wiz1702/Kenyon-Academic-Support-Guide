
#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-git@github.com:Wiz1702/Kenyon-Academic-Support-Guide.git}"
BRANCH="${BRANCH:-feat/career-guidance-starter}"
PR_TITLE="${PR_TITLE:-feat: add career guidance starter scaffold}"
PR_BODY_FILE=".github/PULL_REQUEST_TEMPLATE.md"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Initialize git repo..."
  git init
  git branch -m main || true
  git remote add origin "$REPO_URL" || true
fi

git fetch origin || true
git checkout -B "$BRANCH"
git add -A
git commit -m "$PR_TITLE" || true
git push -u origin "$BRANCH"

# Create PR via GitHub CLI if available
if command -v gh >/dev/null 2>&1; then
  gh pr create --title "$PR_TITLE" --body-file "$PR_BODY_FILE" --base main --head "$BRANCH" || true
else
  echo "PR not created automatically (GitHub CLI not found). Open a PR from branch $BRANCH."
fi
