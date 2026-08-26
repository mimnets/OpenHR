import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Link2, List, ListOrdered, Heading2, Pilcrow,
  Undo2, Redo2, Code2, Eraser, MousePointerClick,
} from 'lucide-react';
import DOMPurify from 'dompurify';

// A small composer for email bodies.
//
// Deliberately not a full rich-text editor. Email clients only reliably render
// a narrow set of tags, and the send path re-styles exactly that set, so an
// editor that could produce more would only produce things that break in
// Outlook. The toolbar offers what the layout can style and nothing else.
//
// Sanitising on every change rather than only on save means a paste from Word —
// which carries a mountain of markup — is cleaned the moment it lands, instead
// of silently changing shape later when it is saved.

const ALLOWED_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'a', 'ul', 'ol', 'li', 'h2', 'blockquote'];
// data-btn is how a button survives sanitising. It stays an ordinary anchor
// here — a working link that reads correctly to a screen reader — and only
// becomes the table-based email button at send time.
const ALLOWED_ATTR = ['href', 'title', 'data-btn'];

/** Must match BUTTON_COLORS in supabase/functions/_shared/emailLayout.ts. */
export const BUTTON_COLORS: Record<string, string> = {
  teal:  '#0e6f66',
  blue:  '#1d4ed8',
  green: '#15803d',
  amber: '#b45309',
  rose:  '#be123c',
  slate: '#334155',
};

export const sanitizeEmailHtml = (dirty: string): string =>
  DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Placeholders like {{org_name}} must survive untouched.
    KEEP_CONTENT: true,
  });

interface Props {
  value: string;
  onChange: (html: string) => void;
  /** Inserted by the toolbar's placeholder menu. */
  placeholders?: string[];
}

const btn =
  'p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors disabled:opacity-30';

const EmailComposer: React.FC<Props> = ({ value, onChange, placeholders = [] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [htmlDraft, setHtmlDraft] = useState(value);

  // Only write into the editable node when the incoming value genuinely differs
  // from what is rendered. Assigning innerHTML on every keystroke would move the
  // caret to the start of the field on every character typed.
  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) ref.current.innerHTML = value;
  }, [value]);

  useEffect(() => { setHtmlDraft(value); }, [value]);

  const emit = useCallback(() => {
    if (!ref.current) return;
    onChange(sanitizeEmailHtml(ref.current.innerHTML));
  }, [onChange]);

  // execCommand is deprecated but is still the only thing every browser
  // implements consistently for contentEditable formatting. The replacement
  // (manual Range surgery) would be a great deal of code for a four-button
  // toolbar over a constrained tag set.
  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const insertButton = (color: string) => {
    setShowColors(false);
    const label = window.prompt('Button text', 'Open your dashboard');
    if (!label) return;
    const url = window.prompt('Where should it go?', 'https://openhrapp.com');
    if (!url) return;
    if (!/^https?:\/\/|^\{\{/.test(url)) {
      window.alert('The link must start with http:// or https://, or be a placeholder like {{app_url}}.');
      return;
    }
    ref.current?.focus();
    // A paragraph after the button so the caret has somewhere to land — without
    // it, typing after inserting continues inside the anchor.
    document.execCommand(
      'insertHTML',
      false,
      `<p><a href="${url}" data-btn="${color}">${label.replace(/</g, '&lt;')}</a></p><p><br></p>`,
    );
    emit();
  };

  const addLink = () => {
    const url = window.prompt('Link address', 'https://openhrapp.com');
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      window.alert('Links must start with http:// or https://');
      return;
    }
    exec('createLink', url);
  };

  const insertPlaceholder = (token: string) => {
    ref.current?.focus();
    document.execCommand('insertText', false, token);
    emit();
  };

  const applyHtmlDraft = () => {
    const clean = sanitizeEmailHtml(htmlDraft);
    onChange(clean);
    if (ref.current) ref.current.innerHTML = clean;
    setShowHtml(false);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-2 bg-slate-50 border-b border-slate-200">
        <button type="button" className={btn} onClick={() => exec('bold')} title="Bold" aria-label="Bold"><Bold size={15} /></button>
        <button type="button" className={btn} onClick={() => exec('italic')} title="Italic" aria-label="Italic"><Italic size={15} /></button>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <button type="button" className={btn} onClick={() => exec('formatBlock', '<p>')} title="Paragraph" aria-label="Paragraph"><Pilcrow size={15} /></button>
        <button type="button" className={btn} onClick={() => exec('formatBlock', '<h2>')} title="Heading" aria-label="Heading"><Heading2 size={15} /></button>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <button type="button" className={btn} onClick={() => exec('insertUnorderedList')} title="Bulleted list" aria-label="Bulleted list"><List size={15} /></button>
        <button type="button" className={btn} onClick={() => exec('insertOrderedList')} title="Numbered list" aria-label="Numbered list"><ListOrdered size={15} /></button>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <button type="button" className={btn} onClick={addLink} title="Add link" aria-label="Add link"><Link2 size={15} /></button>
        <div className="relative">
          <button
            type="button"
            className={`${btn} ${showColors ? 'bg-slate-200 text-slate-800' : ''}`}
            onClick={() => setShowColors(v => !v)}
            title="Insert a button"
            aria-label="Insert a button"
            aria-expanded={showColors}
          >
            <MousePointerClick size={15} />
          </button>
          {showColors && (
            <div className="absolute z-20 top-full left-0 mt-1 p-2 bg-white border border-slate-200 rounded-xl shadow-lg flex gap-1.5">
              {Object.entries(BUTTON_COLORS).map(([name, hex]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => insertButton(name)}
                  title={name}
                  aria-label={`${name} button`}
                  className="w-6 h-6 rounded-md border border-black/10 hover:scale-110 transition-transform"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          )}
        </div>
        <button type="button" className={btn} onClick={() => exec('removeFormat')} title="Clear formatting" aria-label="Clear formatting"><Eraser size={15} /></button>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <button type="button" className={btn} onClick={() => exec('undo')} title="Undo" aria-label="Undo"><Undo2 size={15} /></button>
        <button type="button" className={btn} onClick={() => exec('redo')} title="Redo" aria-label="Redo"><Redo2 size={15} /></button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowHtml(v => !v)}
            title="Edit the HTML directly"
            aria-label="Edit HTML"
            className={`${btn} ${showHtml ? 'bg-slate-200 text-slate-800' : ''}`}
          >
            <Code2 size={15} />
          </button>
        </div>
      </div>

      {/* Placeholder chips */}
      {placeholders.length > 0 && !showHtml && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-white">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1">Insert</span>
          {placeholders.map(ph => (
            <button
              key={ph}
              type="button"
              onClick={() => insertPlaceholder(ph)}
              className="px-2 py-1 rounded-md bg-primary-light text-primary text-[10px] font-bold hover:bg-primary hover:text-white transition-colors"
            >
              {ph}
            </button>
          ))}
        </div>
      )}

      {showHtml ? (
        <div className="p-3 space-y-2">
          <textarea
            rows={10}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] leading-relaxed outline-none focus:ring-4 focus:ring-primary-light resize-y"
            value={htmlDraft}
            onChange={e => setHtmlDraft(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyHtmlDraft}
              className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-primary-hover transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => { setHtmlDraft(value); setShowHtml(false); }}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="text-[10px] font-bold text-slate-400">
            Anything outside {ALLOWED_TAGS.map(t => `<${t}>`).join(' ')} is stripped when applied — those are the
            tags email clients render reliably.
          </p>
        </div>
      ) : (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Email body"
          onInput={emit}
          onBlur={emit}
          onPaste={e => {
            // Paste as plain text. A copy from Word or a web page brings styles
            // and tags that survive sanitising as nested junk.
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
            emit();
          }}
          className="composer-body min-h-[11rem] px-4 py-3 text-sm text-slate-800 outline-none focus:ring-4 focus:ring-primary-light [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-slate-200 [&_blockquote]:pl-3 [&_blockquote]:text-slate-500"
        />
      )}

      {/* Buttons are anchors in the markup, so they need painting to look like
          buttons while editing. Scoped to this component's body. */}
      {!showHtml && (
        <style>{`
          .composer-body a[data-btn] {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 8px;
            color: #fff !important;
            font-weight: 600;
            font-size: 13px;
            text-decoration: none !important;
          }
          ${Object.entries(BUTTON_COLORS)
            .map(([n, hex]) => `.composer-body a[data-btn="${n}"] { background: ${hex}; }`)
            .join('\n')}
        `}</style>
      )}
    </div>
  );
};

export default EmailComposer;
