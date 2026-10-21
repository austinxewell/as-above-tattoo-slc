type GraphQLResponse<TData> = {
  data?: TData;
  errors?: { message: string; extensions?: { code?: string; field?: string } }[];
};

export class GraphQLRequestError extends Error {
  code: string | undefined;
  field: string | undefined;

  constructor(message: string, code?: string, field?: string) {
    super(message);
    this.name = "GraphQLRequestError";
    this.code = code;
    this.field = field;
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
      result.errors[0].extensions?.field,
    );
  }

  if (!result.data) {
    throw new Error("API response did not include any data");
  }

  return result.data;
}
