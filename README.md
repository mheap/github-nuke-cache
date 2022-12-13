# github-nuke-cache

This is a CLI tool for bulk deleting GitHub Actions caches.

## Usage

You can set the `GITHUB_TOKEN` environment variable or pass a `--pat TOKEN_HERE` argument to the CLI to authenticate your API calls.

```bash
# Delete all caches
github-nuke-cache --repo org/repo-name

# Delete caches with a specific prefix
github-nuke-cache --repo org/repo-name --prefix Linux-npm-
```

## Why did you make this?

The GitHub runners were upgraded and a compiled dependency in our cache no longer worked. I needed to clear out all caches with a specific prefix across all branches.
