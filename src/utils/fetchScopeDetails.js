import axios from "axios";

/**
 * Fetches details for a mixed list of scope items, including Administrator.
 * Each item includes its original role info so you can identify them later.
 *
 * @param {Array} roleAssignments  Array of {scopeType, scopeItem}
 * @returns {Promise<Array>}       Array of { scopeType, scopeItem, details }
 */
export async function fetchScopeDetails(roleAssignments) {
  const promises = roleAssignments.map(async ({ scopeType, scopeItem }) => {
    try {
      const type = (scopeType || "").toLowerCase();   // ✅ normalise
      let endpoint = "";

      switch (type) {
        case "centerleader":
        case "center":
          endpoint = `http://localhost:8080/api/centers/${scopeItem}`;
          break;

        case "zoneleader":
        case "zone":
          endpoint = `http://localhost:8080/api/zones/${scopeItem}`;
          break;

        case "bacentaleader":
        case "bacenta":
          endpoint = `http://localhost:8080/api/bacentas/${scopeItem}`;
          break;

        case "administrator":
        case "none": // legacy
          return {
            scopeType: "Administrator",
            scopeItem: scopeItem || null,
            details: { message: "Global Administrator – no specific scope" },
          };

        default:
          throw new Error(`Unknown scopeType: ${scopeType}`);
      }

      const { data } = await axios.get(endpoint);
      return { scopeType, scopeItem, details: data };

    } catch (err) {
      console.error(`Failed to fetch ${scopeType} ${scopeItem}:`, err);
      return { scopeType, scopeItem, details: null, error: true };
    }
  });

  return Promise.all(promises);
}
