type GraphQLResponse<TData> = {
  data?: TData;
  errors?: { message: string; extensions?: { code?: string } }[];
};

export class GraphQLRequestError extends Error {
  code: string | undefined;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "GraphQLRequestError";
    this.code = code;
  }
}

export async function graphqlRequest<TData>(
  query: string,
  variables?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<TData> {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-graphql-yoga-csrf": "1" },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = (await response.json()) as GraphQLResponse<TData>;

  if (result.errors?.length) {
    throw new GraphQLRequestError(
      result.errors.map((error) => error.message).join("; "),
      result.errors[0].extensions?.code,
    );
  }

  if (!result.data) {
    throw new Error("API response did not include any data");
  }

  return result.data;
}
