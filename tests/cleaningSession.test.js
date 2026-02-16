/**
 * Unit Tests for Cleaning Session Service
 * 
 * Tests session management functionality for route and dosage cleaning.
 * 
 * Run with: node tests/cleaningSession.test.js
 */

const sessionService = require('../src/services/cleaningSessionService');

// Simple test framework
let testsPassed = 0;
let testsFailed = 0;

function assertEquals(actual, expected, testName) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  
  if (actualStr === expectedStr) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    console.log(`  Expected: ${expectedStr}`);
    console.log(`  Actual:   ${actualStr}`);
    testsFailed++;
  }
}

function assertTrue(condition, testName) {
  if (condition) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    testsFailed++;
  }
}

function assertFalse(condition, testName) {
  if (!condition) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    testsFailed++;
  }
}

function assertNotNull(value, testName) {
  if (value !== null && value !== undefined) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    testsFailed++;
  }
}

console.log('===========================================');
console.log('Cleaning Session Service Unit Tests');
console.log('===========================================\n');

// ========================================
// Test Suite 1: Session Creation
// ========================================
console.log('Test Suite 1: Session Creation');
console.log('-------------------------------------------');

const routeSession = sessionService.createSession('route', 1, { description: 'Test session' });

assertTrue(
  routeSession !== null,
  'Create route session returns session object'
);

assertTrue(
  routeSession.sessionId.startsWith('route_cleaning_'),
  'Route session ID has correct prefix'
);

assertEquals(
  routeSession.type,
  'route',
  'Route session has correct type'
);

assertEquals(
  routeSession.status,
  'initialized',
  'New session has initialized status'
);

assertEquals(
  routeSession.userId,
  1,
  'Session has correct user ID'
);

assertEquals(
  routeSession.affectedCount,
  0,
  'New session has affectedCount of 0'
);

const dosageSession = sessionService.createSession('dosage', 2, {});

assertTrue(
  dosageSession.sessionId.startsWith('dosage_cleaning_'),
  'Dosage session ID has correct prefix'
);

assertEquals(
  dosageSession.type,
  'dosage',
  'Dosage session has correct type'
);

// Test invalid session type
let errorThrown = false;
try {
  sessionService.createSession('invalid', 1, {});
} catch (error) {
  errorThrown = true;
}

assertTrue(
  errorThrown,
  'Creating session with invalid type throws error'
);

console.log();

// ========================================
// Test Suite 2: Session Retrieval
// ========================================
console.log('Test Suite 2: Session Retrieval');
console.log('-------------------------------------------');

const retrievedSession = sessionService.getSession(routeSession.sessionId);

assertNotNull(
  retrievedSession,
  'Get session returns session object'
);

assertEquals(
  retrievedSession.sessionId,
  routeSession.sessionId,
  'Retrieved session has correct ID'
);

assertEquals(
  retrievedSession.type,
  'route',
  'Retrieved session has correct type'
);

const nonExistentSession = sessionService.getSession('non_existent_id');

assertEquals(
  nonExistentSession,
  null,
  'Get non-existent session returns null'
);

console.log();

// ========================================
// Test Suite 3: Session Updates
// ========================================
console.log('Test Suite 3: Session Updates');
console.log('-------------------------------------------');

const updatedSession = sessionService.updateSession(routeSession.sessionId, {
  status: 'mapped',
  mappings: [{ routeRaw: 'O', newRoute: 'Oral' }],
  affectedCount: 100
});

assertEquals(
  updatedSession.status,
  'mapped',
  'Session status updated correctly'
);

assertEquals(
  updatedSession.affectedCount,
  100,
  'Session affectedCount updated correctly'
);

assertTrue(
  Array.isArray(updatedSession.mappings) && updatedSession.mappings.length === 1,
  'Session mappings updated correctly'
);

// Test metadata merge
sessionService.updateSession(routeSession.sessionId, {
  metadata: { newField: 'value' }
});

const sessionWithMetadata = sessionService.getSession(routeSession.sessionId);

assertTrue(
  sessionWithMetadata.metadata.newField === 'value' && sessionWithMetadata.metadata.description === 'Test session',
  'Metadata is merged, not replaced'
);

// Test updating non-existent session
let updateErrorThrown = false;
try {
  sessionService.updateSession('non_existent_id', { status: 'mapped' });
} catch (error) {
  updateErrorThrown = true;
}

assertTrue(
  updateErrorThrown,
  'Updating non-existent session throws error'
);

console.log();

// ========================================
// Test Suite 4: Session Clearing
// ========================================
console.log('Test Suite 4: Session Clearing');
console.log('-------------------------------------------');

const testSession = sessionService.createSession('route', 1, {});
const testSessionId = testSession.sessionId;

assertTrue(
  sessionService.getSession(testSessionId) !== null,
  'Session exists before clearing'
);

const cleared = sessionService.clearSession(testSessionId);

assertTrue(
  cleared,
  'Clear session returns true'
);

assertEquals(
  sessionService.getSession(testSessionId),
  null,
  'Session is null after clearing'
);

const clearedAgain = sessionService.clearSession(testSessionId);

assertFalse(
  clearedAgain,
  'Clearing non-existent session returns false'
);

console.log();

// ========================================
// Test Suite 5: User Sessions
// ========================================
console.log('Test Suite 5: User Sessions');
console.log('-------------------------------------------');

// Create multiple sessions for user 10
const userSession1 = sessionService.createSession('route', 10, {});
const userSession2 = sessionService.createSession('dosage', 10, {});
const userSession3 = sessionService.createSession('route', 11, {});

const user10Sessions = sessionService.getUserSessions(10);

assertEquals(
  user10Sessions.length,
  2,
  'Get user sessions returns correct count'
);

assertTrue(
  user10Sessions.every(s => s.userId === 10),
  'All returned sessions belong to user 10'
);

const user10RouteSessions = sessionService.getUserSessions(10, 'route');

assertEquals(
  user10RouteSessions.length,
  1,
  'Get user route sessions filters by type'
);

assertTrue(
  user10RouteSessions[0].type === 'route',
  'Filtered sessions have correct type'
);

// Clean up
sessionService.clearSession(userSession1.sessionId);
sessionService.clearSession(userSession2.sessionId);
sessionService.clearSession(userSession3.sessionId);

console.log();

// ========================================
// Test Suite 6: Session Statistics
// ========================================
console.log('Test Suite 6: Session Statistics');
console.log('-------------------------------------------');

// Clean all sessions first
sessionService.cleanupExpiredSessions();

// Create some sessions
const statSession1 = sessionService.createSession('route', 1, {});
const statSession2 = sessionService.createSession('dosage', 1, {});
sessionService.updateSession(statSession1.sessionId, { status: 'applied' });
sessionService.updateSession(statSession2.sessionId, { status: 'initialized' });

const stats = sessionService.getSessionStats();

assertTrue(
  stats.total >= 2,
  'Stats show correct total count'
);

assertTrue(
  stats.byType.route >= 1 && stats.byType.dosage >= 1,
  'Stats break down by type'
);

assertTrue(
  stats.byStatus.applied >= 1 && stats.byStatus.initialized >= 1,
  'Stats break down by status'
);

// Clean up
sessionService.clearSession(statSession1.sessionId);
sessionService.clearSession(statSession2.sessionId);

console.log();

// ========================================
// Test Suite 7: Session Expiration
// ========================================
console.log('Test Suite 7: Session Expiration');
console.log('-------------------------------------------');

const expirySession = sessionService.createSession('route', 1, {});

assertTrue(
  expirySession.expiresAt instanceof Date,
  'Session has expiration date'
);

const now = new Date();
const expiresAt = new Date(expirySession.expiresAt);
const hoursDiff = (expiresAt - now) / (1000 * 60 * 60);

assertTrue(
  hoursDiff >= 23 && hoursDiff <= 24,
  'Session expires in approximately 24 hours'
);

// Clean up
sessionService.clearSession(expirySession.sessionId);

console.log();

// ========================================
// Test Suite 8: Status Transitions
// ========================================
console.log('Test Suite 8: Status Transitions');
console.log('-------------------------------------------');

const workflowSession = sessionService.createSession('route', 1, {});

assertEquals(
  workflowSession.status,
  'initialized',
  'Session starts in initialized status'
);

sessionService.updateSession(workflowSession.sessionId, { status: 'mapped' });
assertEquals(
  sessionService.getSession(workflowSession.sessionId).status,
  'mapped',
  'Session transitions to mapped status'
);

sessionService.updateSession(workflowSession.sessionId, { status: 'previewed' });
assertEquals(
  sessionService.getSession(workflowSession.sessionId).status,
  'previewed',
  'Session transitions to previewed status'
);

sessionService.updateSession(workflowSession.sessionId, { status: 'applied' });
assertEquals(
  sessionService.getSession(workflowSession.sessionId).status,
  'applied',
  'Session transitions to applied status'
);

sessionService.updateSession(workflowSession.sessionId, { status: 'rolled_back' });
assertEquals(
  sessionService.getSession(workflowSession.sessionId).status,
  'rolled_back',
  'Session can be rolled back'
);

// Clean up
sessionService.clearSession(workflowSession.sessionId);

console.log();

// ========================================
// Test Summary
// ========================================
console.log('===========================================');
console.log('Test Summary');
console.log('===========================================');
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);
console.log('===========================================\n');

if (testsFailed === 0) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please review the output above.');
  process.exit(1);
}
