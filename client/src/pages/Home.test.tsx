import { describe, expect, it } from "vitest";

/**
 * ROI Calculator Tests
 * These tests validate the ROI calculation logic for different business types and call volumes.
 */

const businessTypeValues: Record<string, number> = {
  HVAC: 5000,
  Plumbing: 4500,
  Roofing: 10000,
  Electrical: 3500,
  General: 4000,
};

const calculateROILoss = (businessType: string, callVolume: number) => {
  const missedCallRate = 0.62; // 62% of calls go unanswered
  const avgJobValue = businessTypeValues[businessType] || 5000;
  const monthlyMissedCalls = Math.floor(callVolume * missedCallRate);
  const annualLoss = monthlyMissedCalls * 12 * avgJobValue;
  return annualLoss;
};

describe("ROI Calculator", () => {
  it("should calculate HVAC ROI loss correctly", () => {
    const loss = calculateROILoss("HVAC", 50);
    // 50 calls * 62% = 31 missed calls per month
    // 31 * 12 * $5000 = $1,860,000
    expect(loss).toBe(1860000);
  });

  it("should calculate Plumbing ROI loss correctly", () => {
    const loss = calculateROILoss("Plumbing", 40);
    // 40 calls * 62% = 24.8 -> 24 missed calls per month
    // 24 * 12 * $4500 = $1,296,000
    expect(loss).toBe(1296000);
  });

  it("should calculate Roofing ROI loss correctly", () => {
    const loss = calculateROILoss("Roofing", 30);
    // 30 calls * 62% = 18.6 -> 18 missed calls per month
    // 18 * 12 * $10000 = $2,160,000
    expect(loss).toBe(2160000);
  });

  it("should calculate Electrical ROI loss correctly", () => {
    const loss = calculateROILoss("Electrical", 60);
    // 60 calls * 62% = 37.2 -> 37 missed calls per month
    // 37 * 12 * $3500 = $1,554,000
    expect(loss).toBe(1554000);
  });

  it("should handle edge case with zero call volume", () => {
    const loss = calculateROILoss("HVAC", 0);
    expect(loss).toBe(0);
  });

  it("should handle edge case with very high call volume", () => {
    const loss = calculateROILoss("HVAC", 500);
    // 500 calls * 62% = 310 missed calls per month
    // 310 * 12 * $5000 = $18,600,000
    expect(loss).toBe(18600000);
  });

  it("should use default job value for unknown business type", () => {
    const loss = calculateROILoss("UnknownType", 50);
    // Should use default $5000 value
    // 50 calls * 62% = 31 missed calls per month
    // 31 * 12 * $5000 = $1,860,000
    expect(loss).toBe(1860000);
  });

  it("should calculate ROI loss with 100 call volume", () => {
    const loss = calculateROILoss("HVAC", 100);
    // 100 calls * 62% = 62 missed calls per month
    // 62 * 12 * $5000 = $3,720,000
    expect(loss).toBe(3720000);
  });

  it("should calculate ROI loss with 10 call volume", () => {
    const loss = calculateROILoss("HVAC", 10);
    // 10 calls * 62% = 6.2 -> 6 missed calls per month
    // 6 * 12 * $5000 = $360,000
    expect(loss).toBe(360000);
  });
});
