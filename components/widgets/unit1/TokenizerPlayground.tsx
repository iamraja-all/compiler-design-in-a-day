'use client';

import { useState, useMemo } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { Database, AlertCircle, Sparkles } from 'lucide-react';

interface TokenItem {
  lexeme: string;
  token: string;
  attribute: string;
  type: 'keyword' | 'id' | 'num' | 'relop' | 'assign' | 'op' | 'punct' | 'error';
}

const PRESETS = [
  'int count = count + 10;',
  'if (x1 >= 42) y = 3.14;',
  'while (i<=n) i = i + 1;',
  'ifx = 5;',
  'a = 9b;',
];

const KEYWORDS = new Set(['int', 'float', 'char', 'if', 'else', 'while', 'for', 'return', 'do', 'void']);

export function TokenizerPlayground() {
  const [input, setInput] = useState('int count = count + 10;');

  const { tokens, symbolTable } = useMemo(() => {
    const list: TokenItem[] = [];
    const symTable: string[] = [];
    let i = 0;
    const str = input;

    while (i < str.length) {
      // 1. Whitespace
      if (/\s/.test(str[i])) {
        i++;
        continue;
      }

      // 5. Relop (test multi-char first for longest match)
      const two = str.slice(i, i + 2);
      if (['<=', '>=', '==', '!='].includes(two)) {
        const attrMap: Record<string, string> = { '<=': 'LE', '>=': 'GE', '==': 'EQ', '!=': 'NE' };
        list.push({ lexeme: two, token: 'relop', attribute: attrMap[two], type: 'relop' });
        i += 2;
        continue;
      }
      if (['<', '>'].includes(str[i])) {
        const attrMap: Record<string, string> = { '<': 'LT', '>': 'GT' };
        list.push({ lexeme: str[i], token: 'relop', attribute: attrMap[str[i]], type: 'relop' });
        i++;
        continue;
      }

      // 6. Assign =
      if (str[i] === '=') {
        list.push({ lexeme: '=', token: 'assign', attribute: '—', type: 'assign' });
        i++;
        continue;
      }

      // 7. Arithmetic op
      if (['+', '-', '*', '/'].includes(str[i])) {
        list.push({ lexeme: str[i], token: 'op', attribute: '—', type: 'op' });
        i++;
        continue;
      }

      // 8. Punctuation
      if ([';', ',', '(', ')', '{', '}'].includes(str[i])) {
        list.push({ lexeme: str[i], token: 'punct', attribute: '—', type: 'punct' });
        i++;
        continue;
      }

      // 4. Number [0-9]+(\.[0-9]+)?
      if (/[0-9]/.test(str[i])) {
        let numStr = '';
        while (i < str.length && /[0-9]/.test(str[i])) {
          numStr += str[i++];
        }
        if (i < str.length && str[i] === '.' && /[0-9]/.test(str[i + 1])) {
          numStr += str[i++];
          while (i < str.length && /[0-9]/.test(str[i])) {
            numStr += str[i++];
          }
        }
        list.push({ lexeme: numStr, token: 'num', attribute: numStr, type: 'num' });
        continue;
      }

      // 2 & 3. Identifiers & Keywords: [A-Za-z_][A-Za-z0-9_]*
      if (/[A-Za-z_]/.test(str[i])) {
        let idStr = '';
        while (i < str.length && /[A-Za-z0-9_]/.test(str[i])) {
          idStr += str[i++];
        }
        if (KEYWORDS.has(idStr)) {
          list.push({ lexeme: idStr, token: 'keyword', attribute: '—', type: 'keyword' });
        } else {
          let idx = symTable.indexOf(idStr);
          if (idx === -1) {
            symTable.push(idStr);
            idx = symTable.length - 1;
          }
          list.push({ lexeme: idStr, token: 'id', attribute: `→${idx + 1}`, type: 'id' });
        }
        continue;
      }

      // 9. Error
      list.push({
        lexeme: str[i],
        token: 'error',
        attribute: `unexpected '${str[i]}'`,
        type: 'error',
      });
      i++;
    }

    return { tokens: list, symbolTable: symTable };
  }, [input]);

  const getTokenChipStyle = (type: TokenItem['type']) => {
    switch (type) {
      case 'keyword':
        return 'bg-[var(--purple)]/15 text-[var(--purple)] border-[var(--purple)]/30';
      case 'id':
        return 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/30';
      case 'num':
        return 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30';
      case 'relop':
        return 'bg-[#F0A36B]/15 text-[#F0A36B] border-[#F0A36B]/30';
      case 'op':
        return 'bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30';
      case 'assign':
        return 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--border)]';
      case 'punct':
        return 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]';
      case 'error':
        return 'bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/40';
    }
  };

  return (
    <WidgetFrame
      title="Lexer & Tokenizer Playground"
      notice="Longest match rule applied; on ties, the first grammar rule wins"
      explanation="The scanner sweeps left-to-right, emitting token-attribute pairs and registering new identifiers in the symbol table."
    >
      <div className="space-y-6">
        {/* Input box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
            Source Code Input:
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-hidden transition-colors"
            placeholder="Type code here..."
          />
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-[var(--text-muted)] mr-1">Presets:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInput(p)}
                className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Live Token Chips */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Token Stream ({tokens.length} tokens):
          </div>
          <div className="flex flex-wrap gap-2 p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] min-h-[50px] items-center">
            {tokens.length === 0 ? (
              <span className="text-xs text-[var(--text-muted)] italic">No tokens</span>
            ) : (
              tokens.map((t, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-[var(--r-sm)] border font-mono text-xs font-bold transition-all ${getTokenChipStyle(
                    t.type
                  )}`}
                >
                  {t.type === 'error' ? (
                    `ERROR: ${t.attribute}`
                  ) : (
                    <>
                      {t.token}
                      {t.attribute !== '—' && (
                        <span className="opacity-75 font-normal ml-1">({t.attribute})</span>
                      )}
                    </>
                  )}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Two-column layout: Token Table & Symbol Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Token Details Table */}
          <div className="md:col-span-2 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)]">
              Lexeme → Token Table
            </div>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[var(--surface-2)]/50 text-[var(--text-muted)] sticky top-0 border-b border-[var(--border)]">
                  <tr>
                    <th className="px-3 py-2">Lexeme</th>
                    <th className="px-3 py-2">Token</th>
                    <th className="px-3 py-2">Attribute</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t, idx) => (
                    <tr key={idx} className="border-b border-[var(--border)]/40 hover:bg-[var(--surface-2)]/40">
                      <td className="px-3 py-1.5 font-bold text-[var(--text)]">{t.lexeme}</td>
                      <td className="px-3 py-1.5 text-[var(--accent)]">{t.token}</td>
                      <td className="px-3 py-1.5 text-[var(--text-muted)]">{t.attribute}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Symbol Table */}
          <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Symbol Table</span>
            </div>
            <div className="max-h-48 overflow-y-auto p-2">
              {symbolTable.length === 0 ? (
                <div className="p-3 text-xs text-[var(--text-muted)] italic text-center">
                  No identifiers
                </div>
              ) : (
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-[var(--text-muted)] border-b border-[var(--border)]">
                      <th className="px-2 py-1">#</th>
                      <th className="px-2 py-1">Identifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {symbolTable.map((id, idx) => (
                      <tr key={idx} className="border-b border-[var(--border)]/30">
                        <td className="px-2 py-1 text-[var(--text-muted)]">{idx + 1}</td>
                        <td className="px-2 py-1 font-bold text-[var(--accent)]">{id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}
