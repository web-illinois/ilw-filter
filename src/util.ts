/**
 * Parses an attribute for allValues "fromAttribute" conversion.
 *
 * This function handles different formats:
 * - JSON array of strings (e.g., `["value1", "value2"]`)
 * - JSON object with key-value pairs (e.g., `{"value1": "label1", "value2": "label2"}`)
 * - Plain text with "[-]" as a separator (e.g., `value1[-]value2`)
 * @param component Name of the component, used in logging.
 */
export function allValuesParse(component: string) {
    return function (text: string): (string | [string, string])[] {
        if (!text) {
            return [];
        }
        try {
            // Parse as JSON if it starts with [
            if (text.startsWith("[") && !text.startsWith("[-]")) {
                const parsed = JSON.parse(text);
                if (
                    Array.isArray(parsed) &&
                    parsed.every((item) => typeof item === "string")
                ) {
                    return parsed;
                } else {
                    console.warn(
                        `${component}: JSON for allValues was not a list of strings. Using empty list.`,
                    );
                    return [];
                }
            }
            // If it's an object, return key and value pairs
            if (text.startsWith("{")) {
                const parsed = JSON.parse(text);
                if (typeof parsed === "object" && parsed !== null) {
                    return Object.entries(parsed)
                        .map(([key, val]) => {
                            if (typeof val === "string") {
                                return [key, val] as [string, string];
                            } else {
                                console.warn(
                                    `${component}: Value for key ${key} is not a string, skipping.`,
                                );
                                return null;
                            }
                        })
                        .filter((item) => !!item);
                } else {
                    console.warn(
                        `${component}: JSON for allValues was not an object. Using empty list.`,
                    );
                    return [];
                }
            }
            return text.split("[-]");
        } catch (e) {
            console.warn(
                `${component}: Failed to parse value ${text}, using empty list.`,
                e,
            );
            return [];
        }
    };
}
