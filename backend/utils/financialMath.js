const Decimal = require('decimal.js');

// Configure Decimal.js for financial calculations
Decimal.set({
  precision: 20,        // 20 significant digits
  rounding: Decimal.ROUND_HALF_UP,  // Standard rounding
  toExpNeg: -7,         // Use exponential notation for small numbers
  toExpPos: 21,         // Use exponential notation for large numbers
  minE: -9e15,          // Minimum exponent
  maxE: 9e15,           // Maximum exponent
});

/**
 * Utility functions for safe financial calculations
 */
class FinancialMath {
  /**
   * Safely multiply two numbers (quantity * price)
   * @param {number|string} a - First number
   * @param {number|string} b - Second number
   * @returns {number} Result as a regular number
   */
  static multiply(a, b) {
    return new Decimal(a).times(b).toNumber();
  }

  /**
   * Safely add two numbers
   * @param {number|string} a - First number
   * @param {number|string} b - Second number
   * @returns {number} Result as a regular number
   */
  static add(a, b) {
    return new Decimal(a).plus(b).toNumber();
  }

  /**
   * Safely subtract two numbers
   * @param {number|string} a - First number
   * @param {number|string} b - Second number
   * @returns {number} Result as a regular number
   */
  static subtract(a, b) {
    return new Decimal(a).minus(b).toNumber();
  }

  /**
   * Safely divide two numbers
   * @param {number|string} a - Numerator
   * @param {number|string} b - Denominator
   * @returns {number} Result as a regular number
   */
  static divide(a, b) {
    if (new Decimal(b).isZero()) {
      throw new Error('Division by zero');
    }
    return new Decimal(a).dividedBy(b).toNumber();
  }

  /**
   * Round to 2 decimal places (for currency)
   * @param {number|string} value - Value to round
   * @returns {number} Rounded value
   */
  static round(value) {
    return new Decimal(value).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculate weighted average (for portfolio avg price)
   * @param {number} currentQty - Current quantity
   * @param {number} currentAvg - Current average price
   * @param {number} newQty - New quantity
   * @param {number} newPrice - New price
   * @returns {number} New weighted average
   */
  static weightedAverage(currentQty, currentAvg, newQty, newPrice) {
    const totalQty = this.add(currentQty, newQty);
    const currentValue = this.multiply(currentQty, currentAvg);
    const newValue = this.multiply(newQty, newPrice);
    const totalValue = this.add(currentValue, newValue);
    return this.divide(totalValue, totalQty);
  }

  /**
   * Check if value is positive
   * @param {number|string} value - Value to check
   * @returns {boolean} True if positive
   */
  static isPositive(value) {
    return new Decimal(value).greaterThan(0);
  }

  /**
   * Check if value is zero
   * @param {number|string} value - Value to check
   * @returns {boolean} True if zero
   */
  static isZero(value) {
    return new Decimal(value).isZero();
  }

  /**
   * Compare two values
   * @param {number|string} a - First value
   * @param {number|string} b - Second value
   * @returns {number} -1 if a < b, 0 if a === b, 1 if a > b
   */
  static compare(a, b) {
    return new Decimal(a).comparedTo(b);
  }

  /**
   * Check if a >= b
   * @param {number|string} a - First value
   * @param {number|string} b - Second value
   * @returns {boolean} True if a >= b
   */
  static greaterThanOrEqual(a, b) {
    return new Decimal(a).greaterThanOrEqualTo(b);
  }

  /**
   * Format as currency (₹)
   * @param {number|string} value - Value to format
   * @returns {string} Formatted currency string
   */
  static formatCurrency(value) {
    return `₹${this.round(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

module.exports = FinancialMath;
