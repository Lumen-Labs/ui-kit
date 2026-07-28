import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  AppShell,
  AppShellMain,
  AppShellRail,
  AppShellSidebar,
  AppShellSidebarContent,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  BackLink,
  BackToTop,
  GlobalHeader,
  GlobalHeaderActions,
  GlobalHeaderBrand,
  GlobalHeaderInner,
  GlobalHeaderNav,
  GlobalHeaderNavItem,
  GlobalHeaderNavLink,
  GlobalHeaderNavList,
  JumpLink,
  JumpLinks,
  Link,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageSection,
  PageSectionActions,
  PageSectionContent,
  PageSectionDescription,
  PageSectionHeader,
  PageSectionTitle,
  SectionBand,
  SectionBandContent,
  SectionBandDescription,
  SectionBandEyebrow,
  SectionBandHeader,
  SectionBandTitle,
  SectionStack,
  SideNav,
  SideNavItem,
  SideNavLink,
  SideNavList,
  SideNavNestedList,
} from "../index";

test("page navigation exposes landmarks and current location", () => {
  const markup = renderToStaticMarkup(
    <>
      <BackLink href="/reports">Back to reports</BackLink>
      <Link href="/documentation" variant="standalone">Documentation</Link>
      <BackToTop href="#top" />
      <SideNav aria-label="Settings" expression="compact">
        <SideNavList>
          <SideNavItem>
            <SideNavLink href="/profile">Profile</SideNavLink>
            <SideNavNestedList>
              <SideNavItem><SideNavLink href="/profile/security" depth={1} current>Security</SideNavLink></SideNavItem>
            </SideNavNestedList>
          </SideNavItem>
        </SideNavList>
      </SideNav>
      <JumpLinks title="In this guide">
        <JumpLink href="#security" current>Security</JumpLink>
      </JumpLinks>
    </>,
  );

  assert.match(markup, /aria-label="Settings"/);
  assert.match(markup, /data-expression="compact"/);
  assert.match(markup, /aria-current="page"/);
  assert.match(markup, /data-current="true"/);
  assert.match(markup, /data-slot="side-nav-nested-list"/);
  assert.match(markup, /data-depth="1"/);
  assert.match(markup, /data-selection-indicator="nested-rail"/);
  assert.doesNotMatch(markup, /shadow-lumen-control|border-lumen-primary\/30/);
  assert.match(markup, /aria-labelledby="[^"]+"/);
  assert.match(markup, /data-variant="standalone"/);
  assert.match(markup, /data-slot="back-to-top"/);
  assert.match(markup, />In this guide<\/h2>/);
  assert.match(markup, /aria-current="location"/);
});

test("page header and application shell preserve document structure", () => {
  const markup = renderToStaticMarkup(
    <AppShell>
      <AppShellSidebar>Navigation</AppShellSidebar>
      <AppShellMain>
        <PageHeader><PageHeaderTitle>Workspace settings</PageHeaderTitle><PageHeaderDescription>Manage access.</PageHeaderDescription></PageHeader>
      </AppShellMain>
    </AppShell>,
  );

  assert.match(markup, /<aside/);
  assert.match(markup, /<main/);
  assert.match(markup, /<header/);
  assert.match(markup, /<h1[^>]*>Workspace settings<\/h1>/);
});

test("global header exposes product identity, primary navigation, and current location", () => {
  const markup = renderToStaticMarkup(
    <GlobalHeader sticky>
      <GlobalHeaderInner>
        <GlobalHeaderBrand href="/">Lumen Cloud</GlobalHeaderBrand>
        <GlobalHeaderNav>
          <GlobalHeaderNavList>
            <GlobalHeaderNavItem>
              <GlobalHeaderNavLink href="/reports" current>Reports</GlobalHeaderNavLink>
            </GlobalHeaderNavItem>
          </GlobalHeaderNavList>
        </GlobalHeaderNav>
        <GlobalHeaderActions>Account</GlobalHeaderActions>
      </GlobalHeaderInner>
    </GlobalHeader>,
  );

  assert.match(markup, /<header[^>]*data-slot="global-header"/);
  assert.match(markup, /class="[^"]*sticky/);
  assert.match(markup, /<nav[^>]*aria-label="Primary navigation"/);
  assert.match(markup, /aria-current="page"/);
  assert.match(markup, /data-slot="global-header-actions"/);
});

test("application shell composes named sidebar regions and a contextual rail", () => {
  const markup = renderToStaticMarkup(
    <AppShell layout="sidebar-rail">
      <AppShellSidebar>
        <AppShellSidebarHeader>Workspace</AppShellSidebarHeader>
        <AppShellSidebarContent>Navigation</AppShellSidebarContent>
        <AppShellSidebarFooter>Help</AppShellSidebarFooter>
      </AppShellSidebar>
      <AppShellMain>Content</AppShellMain>
      <AppShellRail aria-label="Report context">Context</AppShellRail>
    </AppShell>,
  );

  assert.match(markup, /data-layout="sidebar-rail"/);
  assert.match(markup, /data-slot="app-shell-sidebar-header"/);
  assert.match(markup, /data-slot="app-shell-sidebar-content"/);
  assert.match(markup, /data-slot="app-shell-sidebar-footer"/);
  assert.match(markup, /<aside[^>]*aria-label="Report context"/);
});

test("page content and sections expose readable widths and heading structure", () => {
  const markup = renderToStaticMarkup(
    <PageContent size="readable">
      <PageSection>
        <PageSectionHeader>
          <div>
            <PageSectionTitle>Delivery</PageSectionTitle>
            <PageSectionDescription>Choose when reports are sent.</PageSectionDescription>
          </div>
          <PageSectionActions>Edit</PageSectionActions>
        </PageSectionHeader>
        <PageSectionContent>Schedule details</PageSectionContent>
      </PageSection>
    </PageContent>,
  );

  assert.match(markup, /data-size="readable"/);
  assert.match(markup, /max-w-3xl/);
  assert.match(markup, /<section[^>]*data-slot="page-section"/);
  assert.match(markup, /<h2[^>]*>Delivery<\/h2>/);
  assert.match(markup, /data-slot="page-section-content"/);
});

test("contiguous section bands preserve semantic headings and shared structure", () => {
  const markup = renderToStaticMarkup(
    <SectionStack>
      <SectionBand tone="muted">
        <SectionBandHeader>
          <SectionBandEyebrow>01 / 02 · Operations</SectionBandEyebrow>
          <SectionBandTitle>One connected workspace</SectionBandTitle>
          <SectionBandDescription>
            Related product sections share a boundary while their content keeps a readable inset.
          </SectionBandDescription>
        </SectionBandHeader>
        <SectionBandContent>Operational overview</SectionBandContent>
      </SectionBand>
    </SectionStack>,
  );

  assert.match(markup, /data-slot="section-stack"/);
  assert.match(markup, /<section[^>]*data-slot="section-band"[^>]*data-tone="muted"/);
  assert.match(markup, /data-slot="section-band-eyebrow"/);
  assert.match(markup, /<h2[^>]*>One connected workspace<\/h2>/);
  assert.match(markup, /data-slot="section-band-content"/);
});
