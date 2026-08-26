-- ============================================================
-- OpenHR — Correct the default OpenRouter model slug
-- 0030_fix_default_llm_model.sql
--
-- 0029 shipped with 'deepseek/deepseek-chat-v3-0324:free', which does not exist
-- on OpenRouter. Checked against the live model list: every generation would
-- have failed and silently fallen back to the plain template, which is the
-- worst kind of bug — it looks like it works.
--
-- Replaced with google/gemma-4-31b-it:free, chosen over the other free models
-- because it is instruction-tuned and the templates demand strict JSON output.
-- The larger free options are reasoning models that tend to emit a thinking
-- preamble, which breaks JSON parsing far more often than it improves the copy.
--
-- Model slugs come and go on the free tier. This column is deliberately plain
-- text and editable from the dashboard so a dead slug is a one-field fix rather
-- than a migration.
-- ============================================================

alter table public.email_templates
  alter column model set default 'google/gemma-4-31b-it:free';

update public.email_templates
set    model = 'google/gemma-4-31b-it:free',
       updated = now()
where  provider = 'openrouter'
  and  model = 'deepseek/deepseek-chat-v3-0324:free';
