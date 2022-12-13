#!/usr/bin/env node

const { Octokit } = require("@octokit/rest");

(async () => {
  try {
    const { argv } = require("yargs").options({
      pat: { type: "string", description: "GitHub API Token" },
      repo: {
        type: "string",
        description: "The repo to update (format: user/repo)",
        required: true,
      },
      prefix: {
        type: "string",
        description: "Only consider caches that match this prefix",
      },
    });

    const [owner, repo] = argv.repo.split("/", 2);
    const auth = argv.pat || process.env.GITHUB_TOKEN;

    if (!auth) {
      console.log("--pat is a required field");
      process.exit(1);
    }

    const octokit = new Octokit({
      auth,
    });

    let caches = await octokit.paginate(
      octokit.rest.actions.getActionsCacheList,
      {
        owner,
        repo,
        per_page: 100,
      },
      (response) => response.data
    );

    // If they provided a prefix, filter to those items
    if (argv.prefix) {
      caches = caches.filter((c) => {
        return c.key.startsWith(argv.prefix);
      });
    }

    if (caches.length == 0) {
      console.log("No caches found");
      return;
    }

    // Delete all caches
    await Promise.all(
      caches.map(async (c) => {
        return await octokit.rest.actions.deleteActionsCacheById({
          owner,
          repo,
          cache_id: c.id,
        });
      })
    );

    console.log("Caches deleted");
  } catch (e) {
    console.log(e);
  }
})();
