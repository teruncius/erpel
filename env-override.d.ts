declare module "*?no-inline" {
    const content: string;
    export default content;
}

declare module "*?asset" {
    const content: string;
    export default content;
}

interface Crypto {
    randomUUID: () => string;
}
