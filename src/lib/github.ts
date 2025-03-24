export async function fetchTopLanguages(): Promise<Record<string, number>> {
	const GITHUB_API = 'https://api.github.com/graphql';
	const TOKEN = import.meta.env.GITHUB_TOKEN;

	const langs: Record<string, number> = {};

	let hasNextPage = true;
	let endCursor: string | null = null;

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
			method: 'POST',
			headers: {
				Authorization: `Bearer ${TOKEN}`,
				'Content-Type': 'application/json',
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
	}

	const sortedLangs = Object.fromEntries(
		Object.entries(langs).sort((a, b) => b[1] - a[1])
	);

	return sortedLangs;
}
