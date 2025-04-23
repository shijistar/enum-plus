/**
 * Serialize JavaScript object to string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param {object} obj - The object to serialize.
 *
 * @returns {string} - The serialized string.
 */
type SerializeJavascript = (obj: object) => string;

/**
 * Deserialize JavaScript object from string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param {string} str - The string to deserialize.
 * @param {Record<string, unknown>} [closure] - The closure object to use for deserialization.
 *
 * @returns {object} - The deserialized object.
 */
type DeserializeJavascript = (str: string, closure?: Record<string, unknown>) => Record<string, unknown>;

declare const serializeJavascript: SerializeJavascript;
declare const deserializeJavascript: DeserializeJavascript;

export { serializeJavascript, deserializeJavascript };
