import * as RootModule from "bookemoji";
import * as v4Module from "bookemoji/v4";
import * as v5Module from "bookemoji/components";

import { describe, it, expect } from "vitest";

describe('Can import from "bookemoji"', () => {
  it("has createServerGET", () => {
    expect(RootModule.createServerGET).toBeDefined();
  });

  it("has createStoryEntryGenerator", () => {
    expect(RootModule.createStoryEntryGenerator).toBeDefined();
  });

  it("has createStoryUrl", () => {
    expect(RootModule.createStoryUrl).toBeDefined();
  });

  it("has discoverVariants", () => {
    expect(RootModule.discoverVariants).toBeDefined();
  });

  it("has createVariantUrl", () => {
    expect(RootModule.createVariantUrl).toBeDefined();
  });

  it("has discoverVariants", () => {
    expect(RootModule.discoverVariants).toBeDefined();
  });

  it("has findStoryFiles", () => {
    expect(RootModule.findStoryFiles).toBeDefined();
  });

  it("has generateVariantEntries", () => {
    expect(RootModule.generateVariantEntries).toBeDefined();
  });

  it("has layoutServerLoad", () => {
    expect(RootModule.layoutServerLoad).toBeDefined();
  });

  it("has nameToId", () => {
    expect(RootModule.nameToId).toBeDefined();
  });

  it("has storyLayoutLoad", () => {
    expect(RootModule.storyLayoutLoad).toBeDefined();
  });

  it("has variantLayoutLoad", () => {
    expect(RootModule.variantLayoutLoad).toBeDefined();
  });
});

describe('can import from "bookemoji/v4"', () => {
  it("has Book", () => {
    expect(v4Module.Book).toBeDefined();
  });

  it("has Controls", () => {
    expect(v4Module.Controls).toBeDefined();
  });

  it("has Story", () => {
    expect(v4Module.Story).toBeDefined();
  });

  it("has StoryList", () => {
    expect(v4Module.StoryList).toBeDefined();
  });
});

describe('can import from "bookemoji/v4"', () => {
  it("has Book", () => {
    expect(v5Module.Book).toBeDefined();
  });

  it("has Controls", () => {
    expect(v4Module.Controls).toBeDefined();
  });

  it("has Story", () => {
    expect(v4Module.Story).toBeDefined();
  });

  it("has StoryList", () => {
    expect(v4Module.StoryList).toBeDefined();
  });
});
