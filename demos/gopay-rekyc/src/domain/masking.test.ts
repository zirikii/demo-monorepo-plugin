import { describe, expect, it } from "vitest";
import { ON_FILE_IDENTITY } from "@/data/identity";
import {
  MASKED_FIELDS,
  UNMASKED_FIELDS,
  isMaskedField,
  maskAddress,
  maskDateOfBirth,
  maskIdentity,
  maskName,
  maskNik,
} from "./masking";

describe("masking rules", () => {
  it("masks the middle of the NIK but keeps it recognisable", () => {
    const masked = maskNik("3174094509900007");
    expect(masked.startsWith("3174")).toBe(true);
    expect(masked.endsWith("0007")).toBe(true);
    expect(masked).not.toContain("0945");
    expect(masked).toHaveLength("3174094509900007".length);
  });

  it("keeps the first letter of each name part", () => {
    expect(maskName("Rani Puspita Dewi")).toMatch(/^R•+ P•+ D•+$/);
  });

  it("keeps the street name but hides the house number and everything after it", () => {
    const masked = maskAddress("Jl. Kemang Selatan VIII No. 42");
    expect(masked).toBe("Jl. Kemang ••••••••");
    expect(masked).not.toContain("42");
  });

  it("leaves only the year of birth visible", () => {
    expect(maskDateOfBirth("1990-09-05")).toBe("••-••-1990");
  });

  it("masks exactly the fields the PRD lists and no others", () => {
    const masked = maskIdentity(ON_FILE_IDENTITY);
    for (const field of MASKED_FIELDS) {
      expect(isMaskedField(field)).toBe(true);
      expect(masked[field]).not.toBe(ON_FILE_IDENTITY[field]);
    }
    for (const field of UNMASKED_FIELDS) {
      expect(isMaskedField(field)).toBe(false);
      expect(masked[field]).toBe(ON_FILE_IDENTITY[field]);
    }
  });

  it("shows occupation, marital status, religion and gender in full", () => {
    const masked = maskIdentity(ON_FILE_IDENTITY);
    expect(masked.occupation).toBe("Karyawan Swasta");
    expect(masked.maritalStatus).toBe("Belum Kawin");
    expect(masked.religion).toBe("Islam");
    expect(masked.gender).toBe("Perempuan");
  });
});
