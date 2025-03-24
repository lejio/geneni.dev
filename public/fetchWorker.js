// public/fetchWorker.js

self.onmessage = async function (event) {
    const token = event.data.token;
    if (!token) {
      postMessage({ error: "Missing GitHub token." });
      return;
    }
  
    const GITHUB_API = "https://api.github.com/graphql";
    const langs = {};
  
    let hasNextPage = true;
    let endCursor = null;
  
    while (hasNextPage) {
      const query = `
        query ($after: String) {
          viewer {
            repositories(first: 100, after: $after, ownerAffiliations: OWNER, isFork: false) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                  edges {
                    size
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `;
  
      const res = await fetch(GITHUB_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { after: endCursor },
        }),
      });
  
      const json = await res.json();
      const repos = json.data.viewer.repositories;
      endCursor = repos.pageInfo.endCursor;
      hasNextPage = repos.pageInfo.hasNextPage;
  
      for (const repo of repos.nodes) {
        for (const lang of repo.languages.edges) {
          const name = lang.node.name;
          const size = lang.size;
          langs[name] = (langs[name] || 0) + size;
        }
      }
  
      // Send partial update after each page
      postMessage({ partial: true, langs });
    }
  
    // Final sorted result
    const sortedLangs = Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  
    postMessage({ done: true, langs: sortedLangs });
  };
  