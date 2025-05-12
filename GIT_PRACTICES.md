
# Git Practices Agreement

This document outlines the Git practices adopted by our team to ensure consistency, clarity, and smooth collaboration in version control.

---

## 📁 Branching Strategy

We follow the **feature-branch model**, based on the main production and development flow:

### Main Branches
- `main`: Stable production-ready code. All releases are tagged from here.
- `develop`: Integration branch for completed features before release.

### Supporting Branches
- `feature/feature-name`: For developing new features.
- `bugfix/bug-description`: For fixing non-critical bugs.
- `hotfix/hotfix-description`: For urgent patches to production.
- `release/release-x.x.x`: For preparing a release (version bump, documentation).

> **Naming conventions**: Use lowercase with hyphens (`feature/add-login-page`).

---

## 💬 Commit Message Conventions

All commit messages should follow this structure:

```
<type>: <short summary>

[optional body]
```

### Common `<type>` keywords:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring (no new features or fixes)
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks (e.g., updating build tools)

### Examples:
```
feat: add user authentication module
fix: resolve crash on profile page when data is null
docs: update README with new setup instructions
```

> Use imperative tone: *"add"*, not *"added"* or *"adds"*

---

## 🔁 Merge / Pull Request Process

To maintain code quality and collaboration, follow this process:

1. **Create a feature branch** from `develop` or `main` depending on scope.
2. **Push commits regularly** to remote.
3. **Open a pull request** (PR) with:
   - A clear title and description
   - References to related issues (e.g., `Closes #42`)
4. **Request a review** from at least one team member.
5. **Ensure CI passes** (tests, linters, etc.)
6. **Squash or rebase** commits if needed for clarity.
7. **Do not merge your own PR** unless authorized.
8. **Merge method**: Use **"Squash and merge"** to maintain a clean history.

---

## ✅ Summary

| Practice              | Rule |
|-----------------------|------|
| Branch naming         | `type/meaningful-name` |
| Commit style          | `<type>: short summary` |
| PR requirements       | Clear title, review, CI pass |
| Merge type            | Squash & merge |
| Code reviews          | Mandatory (1+ reviewer) |

---

By following these guidelines, we promote a maintainable, professional, and efficient workflow.
