export const containsMalicious = (text: string): boolean => {
    const patterns = [
        /<script.*?>.*?<\/script>/gi,  // script tags
        /javascript:/gi,               // js protocol
        /on\w+\s*=/gi,                 // event handlers (onclick=, onerror=, …)
        /SELECT.*FROM|DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM/gi, // SQL injection
    ];
    return patterns.some((p) => p.test(text));
};