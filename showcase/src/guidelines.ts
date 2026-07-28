export interface GuideDocument {
  id: string;
  title: string;
  summary: string;
  path: string;
}

export const guideDocuments = [
  {
    id: "agent-workflow",
    title: "Agent workflow",
    summary: "How agents inspect, integrate, implement, and verify Lumen interfaces.",
    path: "SKILL.md",
  },
  {
    id: "foundations",
    title: "Foundations",
    summary: "Visual direction, typography, spacing, tokens, iconography, and usage rules.",
    path: "references/foundations.md",
  },
  {
    id: "components",
    title: "Component specifications",
    summary: "Button, input, card, and dialog anatomy, states, and behavior.",
    path: "references/components.md",
  },
  {
    id: "accessibility",
    title: "Accessibility requirements",
    summary: "WCAG checks for perception, keyboard use, semantics, focus, and testing.",
    path: "references/accessibility.md",
  },
  {
    id: "product-patterns",
    title: "Product patterns",
    summary: "Navigation, shells, data display, forms, states, and destructive actions.",
    path: "references/product-patterns.md",
  },
  {
    id: "react-nextjs",
    title: "React and Next.js",
    summary: "Server Components, client boundaries, Tailwind integration, and responsive verification.",
    path: "references/react-nextjs.md",
  },
  {
    id: "package-api",
    title: "Package API",
    summary: "Public entrypoints, components, adapters, extension rules, and package boundaries.",
    path: "references/package-api.md",
  },
  {
    id: "graph",
    title: "Relationship graph",
    summary: "Client boundaries, graph records, controlled filters, layout, accessibility, and performance.",
    path: "references/graph.md",
  },
  {
    id: "automation",
    title: "Automation and MCP",
    summary: "Token pipelines, component metadata, audits, release workflows, and governance.",
    path: "references/automation.md",
  },
  {
    id: "attribution",
    title: "Attribution and provenance",
    summary: "Source systems, licensing boundaries, adaptation history, and redistribution notes.",
    path: "references/attribution.md",
  },
] as const satisfies readonly GuideDocument[];

export function matchesGuide(guide: GuideDocument, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) return true;

  return [guide.title, guide.summary, guide.path].some((value) =>
    value.toLocaleLowerCase().includes(normalizedQuery),
  );
}
