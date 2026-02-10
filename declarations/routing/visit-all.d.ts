export declare function visitAllLinks(callback?: (url: string) => void | Promise<void>, knownRedirects?: Record<string, string>): Promise<number>;
