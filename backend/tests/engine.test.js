/**
 * Trade Intelligence Engine - Sanity Tests
 * Minimal deterministic tests using Node.js built-in assert
 * Run with: node backend/tests/engine.test.js
 */

import assert from 'assert';
import { evaluateTrade } from '../engine/evaluator.js';
import { evaluateSession } from '../session/sessionEvaluator.js';

// Test counter
let testsRun = 0;
let testsPassed = 0;

/**
 * Run a test and handle assertions
 */
function runTest(testName, testFn) {
  testsRun++;
  try {
    testFn();
    testsPassed++;
    console.log(`✓ ${testName}`);
  } catch (error) {
    console.log(`✗ ${testName}`);
    console.error(`  Error: ${error.message}`);
  }
}

/**
 * TEST 1: GOOD Trade
 * Well-executed trade following all rules
 */
function testGoodTrade() {
  const trade = {
    tradeId: 'T001',
    market: 'EQUITY',
    entryPrice: 100,
    exitPrice: 105,
    stopLoss: 98,
    quantity: 10,
    riskPercent: 0.8,
    rrRatio: 2.5,
    pnl: 50,
    ruleFollowed: true,
  };

  const result = evaluateTrade(trade);

  assert.strictEqual(result.tradeId, 'T001', 'Trade ID should match');
  assert.strictEqual(result.verdict, 'GOOD', 'Verdict should be GOOD');
  assert.strictEqual(result.score, 100, 'Score should be 100');
  assert.strictEqual(result.reasons.length, 0, 'Should have no penalty reasons');
}

/**
 * TEST 2: BAD Trade
 * Multiple rule violations
 */
function testBadTrade() {
  const trade = {
    tradeId: 'T002',
    market: 'EQUITY',
    entryPrice: 100,
    exitPrice: 95,
    stopLoss: null, // No stop loss
    quantity: 10,
    riskPercent: 2.5, // High risk (>1%)
    rrRatio: 0.8, // Poor RR (<1.5)
    pnl: -50,
    ruleFollowed: false, // Rules violated
  };

  const result = evaluateTrade(trade);

  assert.strictEqual(result.tradeId, 'T002', 'Trade ID should match');
  assert.strictEqual(result.verdict, 'BAD', 'Verdict should be BAD');
  assert.ok(result.score < 60, 'Score should be less than 60');
  assert.ok(result.reasons.length > 0, 'Should have penalty reasons');
}

/**
 * TEST 3: Mixed Session
 * One GOOD trade + One BAD trade = AVERAGE session
 */
function testMixedSession() {
  const trades = [
    {
      tradeId: 'T101',
      entryPrice: 100,
      exitPrice: 105,
      stopLoss: 98,
      quantity: 10,
      riskPercent: 0.8,
      rrRatio: 2.5,
      pnl: 50,
      ruleFollowed: true,
    },
    {
      tradeId: 'T102',
      entryPrice: 100,
      exitPrice: 95,
      stopLoss: null,
      quantity: 10,
      riskPercent: 2.5,
      rrRatio: 0.8,
      pnl: -50,
      ruleFollowed: false,
    },
  ];

  const result = evaluateSession(trades);

  assert.strictEqual(result.totalTrades, 2, 'Should have 2 trades');
  assert.strictEqual(result.verdictCounts.GOOD, 1, 'Should have 1 GOOD trade');
  assert.strictEqual(result.verdictCounts.BAD, 1, 'Should have 1 BAD trade');
  assert.strictEqual(result.sessionVerdict, 'AVERAGE', 'Session verdict should be AVERAGE');
  assert.ok(result.consistencyScore >= 60 && result.consistencyScore < 80, 'Consistency score should be AVERAGE range');
}

/**
 * TEST 4: Empty Session
 * Should handle empty array gracefully
 */
function testEmptySession() {
  const trades = [];

  const result = evaluateSession(trades);

  assert.strictEqual(result.totalTrades, 0, 'Should have 0 trades');
  assert.strictEqual(result.consistencyScore, 0, 'Consistency score should be 0');
  assert.ok(['GOOD', 'AVERAGE', 'BAD'].includes(result.sessionVerdict), 'Session verdict should be valid');
  assert.strictEqual(result.tradeEvaluations.length, 0, 'Should have no evaluations');
  assert.strictEqual(result.dominantFailureReasons.length, 0, 'Should have no failure reasons');
}

/**
 * TEST 5: Invalid Trade Handling
 * Missing tradeId should throw but not crash system
 */
function testInvalidTrade() {
  const invalidTrade = {
    entryPrice: 100,
    exitPrice: 105,
    stopLoss: 98,
    // Missing tradeId
  };

  let errorThrown = false;
  try {
    evaluateTrade(invalidTrade);
  } catch (error) {
    errorThrown = true;
    assert.ok(error.message.includes('tradeId'), 'Error should mention tradeId');
  }

  assert.strictEqual(errorThrown, true, 'Should throw error for invalid trade');
}

/**
 * TEST 6: Edge Case - Zero Risk
 * Should handle zero risk gracefully
 */
function testZeroRisk() {
  const trade = {
    tradeId: 'T003',
    entryPrice: 100,
    exitPrice: 105,
    stopLoss: 98,
    quantity: 10,
    riskPercent: 0,
    rrRatio: 2.0,
    pnl: 50,
    ruleFollowed: true,
  };

  const result = evaluateTrade(trade);

  assert.strictEqual(result.tradeId, 'T003', 'Trade ID should match');
  assert.ok(['GOOD', 'AVERAGE', 'BAD'].includes(result.verdict), 'Should return valid verdict');
  assert.ok(result.score >= 0 && result.score <= 100, 'Score should be in valid range');
}

/**
 * TEST 7: Edge Case - Breakeven Trade
 * pnl = 0 should be handled correctly
 */
function testBreakevenTrade() {
  const trade = {
    tradeId: 'T004',
    entryPrice: 100,
    exitPrice: 100,
    stopLoss: 98,
    quantity: 10,
    riskPercent: 0.5,
    rrRatio: 2.0,
    pnl: 0,
    ruleFollowed: true,
  };

  const result = evaluateTrade(trade);

  assert.strictEqual(result.tradeId, 'T004', 'Trade ID should match');
  assert.strictEqual(result.metrics.isProfitable, false, 'Breakeven should not be profitable');
  assert.ok(['GOOD', 'AVERAGE', 'BAD'].includes(result.verdict), 'Should return valid verdict');
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('\n========================================');
  console.log('Trade Intelligence Engine - Sanity Tests');
  console.log('========================================\n');

  runTest('TEST 1: GOOD Trade', testGoodTrade);
  runTest('TEST 2: BAD Trade', testBadTrade);
  runTest('TEST 3: Mixed Session', testMixedSession);
  runTest('TEST 4: Empty Session', testEmptySession);
  runTest('TEST 5: Invalid Trade Handling', testInvalidTrade);
  runTest('TEST 6: Edge Case - Zero Risk', testZeroRisk);
  runTest('TEST 7: Edge Case - Breakeven Trade', testBreakevenTrade);

  console.log('\n========================================');
  console.log(`Results: ${testsPassed}/${testsRun} tests passed`);
  console.log('========================================\n');

  // Exit with appropriate code
  if (testsPassed === testsRun) {
    console.log('✓ All tests passed!\n');
    process.exit(0);
  } else {
    console.log('✗ Some tests failed!\n');
    process.exit(1);
  }
}

// Run tests
runAllTests();
