import { useState, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "../../src";
import { DownloadIcon, Icon } from "../../src/icons";
import { type GuideDocument, guideDocuments } from "./guidelines";
import { SKILL_ARCHIVE_NAME, downloadSkillArchive } from "./skill-bundle";

const guideMarkdown = import.meta.glob([
  "../../guidelines/SKILL.md",
  "../../guidelines/references/*.md",
], {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const guideUrls = import.meta.glob([
  "../../guidelines/SKILL.md",
  "../../guidelines/references/*.md",
], {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const supportUrls = import.meta.glob(
  [
    "../../guidelines/assets/*.json",
    "../../guidelines/references/*.csv",
  ],
  {
    eager: true,
    import: "default",
    query: "?url",
  },
) as Record<string, string>;

function findModuleValue(modules: Record<string, string>, path: string) {
  const entry = Object.entries(modules).find(([modulePath]) =>
    modulePath.endsWith(`/guidelines/${path}`),
  );

  if (!entry) throw new Error(`The copied Lumen guide is missing: ${path}`);

  return entry[1];
}

function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function textContent(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(textContent).join("");
  if (value && typeof value === "object" && "props" in value) {
    return textContent((value as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}

function localGuideFor(href: string) {
  const fileName = href.split("/").pop();
  return guideDocuments.find((guide) => guide.path.endsWith(`/${fileName}`) || guide.path === fileName);
}

function localSupportUrl(href: string) {
  const fileName = href.split("/").pop();
  return Object.entries(supportUrls).find(([path]) => path.endsWith(`/${fileName}`))?.[1];
}

function markdownComponents(guide: GuideDocument): Components {
  const heading = (Tag: "h3" | "h4" | "h5" | "h6") =>
    function GuideHeading({ children }: { children?: ReactNode }) {
      const id = `guide-${guide.id}-${slugify(textContent(children))}`;
      return <Tag id={id}>{children}</Tag>;
    };

  return {
    h1: heading("h3"),
    h2: heading("h4"),
    h3: heading("h5"),
    h4: heading("h6"),
    h5: heading("h6"),
    h6: heading("h6"),
    a({ children, href = "", ...props }) {
      if (href.startsWith("#")) {
        return <a href={`#guide-${guide.id}-${href.slice(1)}`} {...props}>{children}</a>;
      }

      const targetGuide = href.endsWith(".md") ? localGuideFor(href) : undefined;
      if (targetGuide) {
        const targetId = `guide-${targetGuide.id}`;
        return (
          <a
            href={`#${targetId}`}
            onClick={() => {
              const target = document.getElementById(targetId);
              if (target instanceof HTMLDetailsElement) target.open = true;
            }}
            {...props}
          >
            {children}
          </a>
        );
      }

      const supportUrl = localSupportUrl(href);
      return <a href={supportUrl ?? href} {...props}>{children}</a>;
    },
    table({ children, ...props }) {
      return (
        <div className="markdown-table" role="region" aria-label={`${guide.title} table`} tabIndex={0}>
          <table {...props}>{children}</table>
        </div>
      );
    },
  };
}

function GuidelineDocument({ defaultOpen, guide }: { defaultOpen: boolean; guide: GuideDocument }) {
  const markdown = stripFrontmatter(findModuleValue(guideMarkdown, guide.path));
  const rawUrl = findModuleValue(guideUrls, guide.path);

  return (
    <details className="guide-card" id={`guide-${guide.id}`} open={defaultOpen}>
      <summary>
        <span><strong>{guide.title}</strong><small>{guide.summary}</small></span>
        <code>{guide.path}</code>
      </summary>
      <div className="guide-card__content">
        <a className="guide-source-link" href={rawUrl}>Open raw Markdown</a>
        <article className="markdown-body" aria-label={`${guide.title} guideline`}>
          <Markdown components={markdownComponents(guide)} remarkPlugins={[remarkGfm]} skipHtml>
            {markdown}
          </Markdown>
        </article>
      </div>
    </details>
  );
}

type DownloadState = { status: "idle" | "working" } | { status: "done" | "failed"; message: string };

function SkillDownload() {
  const [state, setState] = useState<DownloadState>({ status: "idle" });

  function download() {
    setState({ status: "working" });

    try {
      const count = downloadSkillArchive();

      setState({
        status: "done",
        message: `Downloaded ${SKILL_ARCHIVE_NAME} with ${count} files. Unzip it into your agent's skills directory.`,
      });
    } catch (error) {
      setState({
        status: "failed",
        message: `The skill bundle could not be built: ${(error as Error).message}`,
      });
    }
  }

  return (
    <div className="skill-download">
      <div className="skill-download__copy">
        <strong>Take the skill with you</strong>
        <span>
          The skill, its references, the token bundle, and the source map, packaged as{" "}
          <code>{SKILL_ARCHIVE_NAME}</code> for an agent&rsquo;s skills directory.
        </span>
      </div>
      <Button
        aria-busy={state.status === "working"}
        onClick={download}
        variant="secondary"
      >
        <Icon source={DownloadIcon} />
        Download skill
      </Button>
      <p aria-live="polite" className="skill-download__status">
        {state.status === "done" || state.status === "failed" ? state.message : ""}
      </p>
    </div>
  );
}

export function GuidelineViewer({ guides }: { guides: readonly GuideDocument[] }) {
  return (
    <div className="guide-library">
      <SkillDownload />
      {guides.map((guide, index) => (
        <GuidelineDocument
          defaultOpen={guides.length === 1 || index === 0}
          guide={guide}
          key={guide.id}
        />
      ))}
    </div>
  );
}
