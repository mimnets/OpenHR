import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Showcase consent — Addendum 4 §5b.
 *
 * An organization's name and logo may appear on the public landing page only if an ADMIN of
 * that organization has explicitly opted in. The risk this guards against is not a rendering
 * bug: it is publishing a real company's trademark as an endorsement without permission, which
 * is the same class of problem that N4 removed the fabricated testimonials to avoid.
 *
 * So these tests are about the *shape of the permission*, not the look of the checkbox —
 * default off, ADMIN only, recorded, withdrawable, and never a demo org.
 */

const read = (p: string) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');
const readRoot = (p: string) => fs.readFileSync(path.resolve(__dirname, '../..', p), 'utf8');

const migration = readRoot('supabase/migrations/0024_org_showcase_consent.sql');
const orgSystem = read('components/organization/OrgSystem.tsx');
const superAdmin = read('pages/SuperAdmin.tsx');
const superAdminSvc = read('services/superadmin.service.ts');
const cron = readRoot('supabase/functions/cron-expire-trials/index.ts');

describe('showcase consent defaults to off', () => {
  it('the column is NOT NULL DEFAULT false, so no existing organization is opted in', () => {
    expect(migration).toMatch(/show_on_landing\s+boolean\s+not null\s+default\s+false/i);
  });

  it('the app never initialises the flag to anything but false', () => {
    // OrgSystem seeds its own state; SuperAdmin seeds the create form.
    expect(orgSystem).toContain("showOnLanding: false");
    expect(superAdmin).toContain('showOnLanding: false');
  });

  /**
   * Every point where a stored value becomes the in-app boolean compares against a literal
   * true, so a null, a missing column or a string never reads as consent.
   */
  it('every DB-to-boolean conversion is strict', () => {
    expect(orgSystem, 'OrgSystem load').toMatch(/showOnLanding: \(org as \{ show_on_landing\?: boolean \}\)\.show_on_landing === true/);
    expect(superAdminSvc, 'superadmin mapOrg').toMatch(/showOnLanding: r\.show_on_landing === true/);
    expect(superAdmin, 'SuperAdmin edit form').toMatch(/showOnLanding: org\.showOnLanding === true/);
  });
});

describe('only an ADMIN of the organization may consent', () => {
  it('the database rejects the change unless the caller is that org\'s ADMIN or a super admin', () => {
    expect(migration).toMatch(/only an admin of this organization may change showcase consent/i);
    expect(migration).toMatch(/p\.role\s*=\s*'ADMIN'\s+and\s+p\.organization_id\s*=\s*new\.id/i);
    expect(migration).toMatch(/p\.role\s*=\s*'SUPER_ADMIN'/);
  });

  it('the trigger is wired to organizations', () => {
    expect(migration).toMatch(/create trigger trg_enforce_showcase_consent/i);
    expect(migration).toMatch(/before update on organizations/i);
  });

  /**
   * Sidebar.tsx grants the Organization page to ADMIN *and* HR. The consent block has to be
   * gated more narrowly than the tab it sits in, or an HR clerk could license the company's
   * trademark.
   */
  it('the UI gate is ADMIN, not merely whoever can open the page', () => {
    expect(orgSystem).toMatch(/const isOrgAdmin\s*=\s*user\?\.role === 'ADMIN'/);
    expect(orgSystem).toMatch(/\{isOrgAdmin && consentSupported && \(/);
  });

  it('a non-ADMIN cannot smuggle the field into the update either', () => {
    expect(orgSystem).toMatch(/\.\.\.\(isOrgAdmin && consentSupported \? \{ show_on_landing: orgData\.showOnLanding \} : \{\}\)/);
  });

  /**
   * The column arrives in 0024. A deployment that has not run it — a self-hoster on an older
   * schema — must still get a working Organization form rather than an empty one.
   */
  it('an un-migrated schema degrades instead of blanking the form', () => {
    expect(orgSystem).toMatch(/error\?\.code === '42703'/);
    expect(orgSystem).toMatch(/setConsentSupported\(false\)/);
    expect(orgSystem).toMatch(/\{isOrgAdmin && consentSupported && \(/);
  });
});

describe('consent is recorded and withdrawable', () => {
  it('granting stamps a timestamp', () => {
    expect(migration).toMatch(/if new\.show_on_landing then\s+new\.landing_consent_at := now\(\)/);
  });

  it('withdrawing does not erase that the consent once existed', () => {
    // The stamp is only written on the true branch — nothing nulls it.
    expect(migration).not.toMatch(/landing_consent_at\s*:=\s*null/i);
  });

  it('the same control both grants and withdraws — a checkbox, not a one-way button', () => {
    expect(orgSystem).toMatch(/type="checkbox"[\s\S]{0,200}checked=\{orgData\.showOnLanding\}/);
    expect(orgSystem).toMatch(/onChange=\{e => setOrgData\(\{ \.\.\.orgData, showOnLanding: e\.target\.checked \}\)\}/);
  });

  it('the copy names what is being agreed to and says it is reversible', () => {
    expect(orgSystem).toMatch(/name and logo/i);
    expect(orgSystem).toMatch(/turn this off at any time/i);
    expect(orgSystem).toMatch(/Off by default/i);
  });
});

describe('a demo organization can never be showcased', () => {
  it('the trigger refuses it regardless of who asks', () => {
    expect(migration).toMatch(/if coalesce\(new\.is_demo, false\) then/i);
    expect(migration).toMatch(/demo organization cannot be shown/i);
  });
});

describe('the public read path has not been opened yet', () => {
  /**
   * The view and the RLS grant land with the showcase component, not with consent capture.
   * Shipping them early would expose customer names before anything renders them.
   */
  it('no view is granted to anon in this migration', () => {
    expect(migration).not.toMatch(/grant select .* to anon/i);
    expect(migration).not.toMatch(/create view public_landing_orgs/i);
  });
});

/**
 * The trial cron. TRIAL is an ad-free window, not a paid trial — when it ends the organization
 * continues on AD_SUPPORTED with every feature intact. It used to set EXPIRED, which sets
 * isReadOnly and disables attendance punching, leave, announcements, org settings and reviews,
 * contradicting the FAQ, the landing page and the signup screen.
 */
describe('the end of the ad-free period does not take anything away', () => {
  it('the cron moves organizations to AD_SUPPORTED, never EXPIRED', () => {
    expect(cron).toMatch(/subscription_status: 'AD_SUPPORTED'/);
    expect(cron).not.toMatch(/subscription_status: 'EXPIRED'/);
  });

  it('it no longer tells anyone their account is read-only or that they must upgrade', () => {
    const body = cron.slice(cron.indexOf('serve') >= 0 ? cron.indexOf('serve') : 0);
    expect(body).not.toMatch(/read-only mode/i);
    expect(body).not.toMatch(/Trial Has Expired/i);
    expect(body).not.toMatch(/Contact our team to upgrade/i);
  });

  it('it says the product stays free and every feature keeps working', () => {
    expect(cron).toMatch(/free forever/i);
    expect(cron).toMatch(/every feature|feature keeps working|features? stays? available/i);
  });

  it('a donation is offered as the way to remove ads', () => {
    expect(cron).toMatch(/donation removes them|donation removes ads/i);
  });
});

describe('the super admin surface matches the subscription model', () => {
  it('AD_SUPPORTED is selectable — it is the state the cron now assigns', () => {
    expect(superAdmin).toMatch(/<option value="AD_SUPPORTED">/);
  });

  it('the trial-end helper no longer claims the organization expires', () => {
    expect(superAdmin).not.toMatch(/auto-expire after this date/i);
    expect(superAdmin).toMatch(/moves to Ad Supported/i);
  });

  it('a super admin can record consent obtained out of band, on edit only', () => {
    expect(superAdmin).toMatch(/sa-show-on-landing/);
    expect(superAdmin).toMatch(/viewMode === 'edit' && \(/);
    expect(superAdminSvc).toMatch(/if \(data\.showOnLanding !== undefined\) update\.show_on_landing = data\.showOnLanding/);
  });

  it('the copy warns that ticking it publishes a real company', () => {
    expect(superAdmin).toMatch(/only tick this if the organization has actually agreed/i);
  });
});
