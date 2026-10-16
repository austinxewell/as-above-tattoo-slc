type GraphQLResponse<TData> = {
  data?: TData;
  errors?: { message: string }[];
};

export async function graphqlRequest<TData>(
  query: string,
  variables?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<TData> {
  const response = await fetch(import.meta.env.VITE_API_URL, {
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
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }

  if (!result.data) {
    throw new Error("API response did not include any data");
  }

  return result.data;
}
