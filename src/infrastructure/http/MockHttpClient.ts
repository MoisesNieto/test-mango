export interface HttpClient {
  get(path: string): Promise<unknown>;
}

export function createMockHttpClient(): HttpClient {
  return {
    async get(path: string): Promise<unknown> {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 20);
      });

      switch (path) {
        case "/api/range/dynamic":
          return { min: 1, max: 100 };
        case "/api/range/fixed":
          return [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
        default:
          throw new Error(`Mock HTTP endpoint not found: ${path}`);
      }
    }
  };
}
