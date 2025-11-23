// Empty module to replace test-only imports
// Export common test exports as no-ops to satisfy re-exports
module.exports = {
  createTestClient: () => ({}),
  testActions: () => ({}),
  test: () => ({}),
};

// Also support ES modules
export const createTestClient = () => ({});
export const testActions = () => ({});
export const test = () => ({});
