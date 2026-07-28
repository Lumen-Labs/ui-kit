# Attribution and Provenance

Lumen UI Kit is adapted from a source package titled **Synth UI Kit**, generated on 2026-07-17. The source package synthesized implementation-agnostic guidance from:

- [Atlassian Design System](https://atlassian.design/)
- [Carbon Design System](https://www.carbondesignsystem.com/)
- [Elastic UI](https://elastic.github.io/eui/)
- [GitLab Pajamas](https://gitlab.com/gitlab-org/pajamas)
- [PatternFly](https://www.patternfly.org/)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [U.S. Web Design System](https://designsystem.digital.gov/)
- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)

The Lumen adaptation changes the kit name, reorganizes the material for progressive disclosure, adds React/Next.js operating guidance, and updates the token envelope to the stable DTCG 2025.10 format. It preserves the supplied design-token values and the source package's attribution intent.

The 2026-07-25 enterprise navigation and table-chrome refresh adds original
Lumen APIs and styling informed by the official shell, navigation, table,
filtering, and toolbar guidance linked in the provenance map. It does not copy
upstream component code, illustrations, logos, or design assets. Lumen's 56px
header, 240px sidebar, 272px rail, responsive breakpoints, link variants, and
table-toolbar primitives are Lumen implementation decisions.

The 2026-07-25 contiguous-section, motion, and icon-catalog additions use
Firecrawl's public website only as visual research for shared section seams,
compact numbered framing, dense specimen grids, and functional status/data
motion. `SectionStack`, the `SectionBand` family, the icon showcase, motion
tokens, CSS, examples, and documentation are original Lumen work. No Firecrawl
source code, logos, illustrations, or branded assets are included.

The 2026-07-25 prompt-composer refresh uses the separate Pipeer product
composer as internal visual research for its compact glass-like surface,
attachment band, inset control cluster, and inspectable context-usage
breakdown. Lumen's component code remains original and project agnostic; no
Pipeer application state, backend behavior, or dependencies are included.

The 2026-07-26 relationship-graph adapter is original Lumen code informed by Neo4j Browser and Bloom exploration patterns, Neo4j NVL's published architecture and license boundary, and Graphology's community and layout algorithms. NVL is restricted to Neo4j Aura and proprietary Neo4j products and is not a dependency. Lumen includes no NVL code, Neo4j driver, Cypher integration, database connection, logo, trademark asset, or copied product code and is not affiliated with Neo4j.

The 2026-07-27 Canvas2D physics refresh replaces the initial Sigma renderer with vis-network and vis-data. Its ForceAtlas2-based settings, visible initial settling behavior, continuous relationships, and filled-node interaction treatment were informed by the separate BrainAPI console as internal reference material. Lumen's topology-aware spring lengths, semantic-level position inheritance, public APIs, workbench composition, accessibility, filters, Louvain communities, and semantic zoom are original integration behavior; no BrainAPI application state, queries, backend behavior, assets, or source code are distributed. vis-network and vis-data are optional peers under their upstream Apache-2.0-or-MIT license terms. Graphology, ForceAtlas2, Noverlap, and Louvain remain optional peers for community detection and public pure layout helpers.

The 2026-07-27 enterprise graph workbench refresh is original Lumen composition informed by Neo4j Explore's search/tools/minimap/legend model, PatternFly's responsive toolbar hierarchy, and Elastic's field-value search-and-filter pattern. It copies no upstream source code, layout, assets, or product branding. Carbon's separately installed icon peer supplies the curated viewport symbols through `lumen-ui-kit/icons`.

The optional `lumen-ui-kit/icons` adapter links to `@carbon/icons-react`; it does not copy Carbon SVG files into Lumen. [Carbon's upstream repository](https://github.com/carbon-design-system/carbon) is Apache-2.0 licensed. Consumers that install or redistribute the peer package must preserve its applicable license and notices. Vendor brand marks and illustrations remain outside Lumen.

## Licensing note

The source package recommended the MIT License but did not include a complete license grant. Do not represent that recommendation as a definitive license for third-party source material. When redistributing this skill or copying substantial guidance into a public artifact:

- Preserve this attribution file and [source-to-claim-map.csv](source-to-claim-map.csv).
- Link to the original design systems.
- Paraphrase guidance rather than copying substantial source text.
- Verify the applicable upstream licenses for any code or assets copied from those systems.
- Add an explicit project license only when the rights holder or project owner authorizes it.

## Source package history

Version 1.0.0 of the source package was dated 2026-07-17 and contained the initial tokens, component guidance, product patterns, accessibility guidance, automation notes, and provenance map. Process-oriented README and changelog files are intentionally not bundled separately in this skill.
