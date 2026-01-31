/**
 * Evaluation Controller
 * Thin controller exposing trade and session evaluation APIs
 */

import { evaluateTrade } from '../engine/evaluator.js';
import { evaluateSession } from '../session/sessionEvaluator.js';

/**
 * POST /api/evaluate/trade
 * Evaluate a single trade
 */
export const evaluateTradeEndpoint = async (req, res) => {
  try {
    const { trade } = req.body;

    // Validate request
    if (!trade) {
      return res.status(400).json({
        success: false,
        error: 'Request body must contain a "trade" object',
      });
    }

    if (!trade.tradeId) {
      return res.status(400).json({
        success: false,
        error: 'Trade must have a "tradeId"',
      });
    }

    // Delegate to intelligence layer
    const result = evaluateTrade(trade);

    // Return success response
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to evaluate trade',
    });
  }
};

/**
 * POST /api/evaluate/session
 * Evaluate multiple trades and aggregate into session metrics
 */
export const evaluateSessionEndpoint = async (req, res) => {
  try {
    const { trades } = req.body;

    // Validate request
    if (!trades) {
      return res.status(400).json({
        success: false,
        error: 'Request body must contain a "trades" array',
      });
    }

    if (!Array.isArray(trades)) {
      return res.status(400).json({
        success: false,
        error: '"trades" must be an array',
      });
    }

    // Delegate to intelligence layer
    const result = evaluateSession(trades);

    // Return success response
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to evaluate session',
    });
  }
};
