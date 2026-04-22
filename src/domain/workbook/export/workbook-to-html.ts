import {
	type Exercise,
	FILL_BLANK_PLACEHOLDER,
	type TrueFalseAnswer,
	type Workbook,
} from "../models/Workbook";

export function workbookToHtml(workbook: Workbook): string {
	const title = esc(workbook.title);
	const body = renderBody(workbook);
	const script = `(${workbookInit.toString()})(document);`;
	const lang = languageCode(workbook.targetLanguage);
	const htmlOpen = lang ? `<html lang="${lang}">` : "<html>";
	return `<!DOCTYPE html>
${htmlOpen}
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>${STYLES}</style>
</head>
<body>
<noscript><p style="max-width:720px;margin:24px auto;padding:16px;border:1px solid #f43f5e;border-radius:8px;color:#9f1239;background:#fff1f2;font-family:system-ui,sans-serif">Please enable JavaScript to check your answers.</p></noscript>
<main class="wb">
${body}
</main>
<script>${script}</script>
</body>
</html>`;
}

export function workbookMarkup(workbook: Workbook): string {
	return `<main class="wb">${renderBody(workbook)}</main>`;
}

export const workbookStyles = (): string => STYLES;

// Serialized via `.toString()` and embedded in the standalone HTML, then also
// called directly on a ShadowRoot from the in-app preview. Must stay
// self-contained: no references to outer-module bindings, no closures over
// module state — everything it needs comes through the `root` argument or is
// declared inside the function body.
export function workbookInit(root: Document | ShadowRoot | Element): void {
	// Locale-insensitive: `toLocaleLowerCase()` varies by locale (Turkish i,
	// for one), which would make grading non-deterministic across devices.
	function norm(s: string): string {
		return (s || "").trim().toLowerCase();
	}

	function gradeMc(fs: Element): { correct: number; total: number } {
		const correctIndex = parseInt(
			fs.getAttribute("data-correct-index") || "-1",
			10,
		);
		const opts = fs.querySelectorAll<HTMLElement>(".opt");
		const checked = fs.querySelector<HTMLInputElement>(
			'input[type="radio"]:checked',
		);
		const chosen = checked ? parseInt(checked.value, 10) : -1;
		opts.forEach((opt, i) => {
			const input = opt.querySelector<HTMLInputElement>("input");
			if (i === correctIndex) {
				opt.setAttribute("data-state", "correct");
				if (input) input.checked = true;
			} else if (i === chosen) {
				opt.setAttribute("data-state", "incorrect");
			}
			if (input) input.disabled = true;
		});
		fs.querySelectorAll<HTMLElement>(".opt-exp").forEach((exp) => {
			exp.hidden = false;
		});
		return { correct: chosen === correctIndex ? 1 : 0, total: 1 };
	}

	function gradeTf(fs: Element): { correct: number; total: number } {
		const correct = fs.getAttribute("data-correct");
		const opts = fs.querySelectorAll<HTMLElement>(".opt");
		const checked = fs.querySelector<HTMLInputElement>(
			'input[type="radio"]:checked',
		);
		const chosen = checked ? checked.value : null;
		opts.forEach((opt) => {
			const input = opt.querySelector<HTMLInputElement>("input");
			const val = input ? input.value : "";
			if (val === correct) {
				opt.setAttribute("data-state", "correct");
				if (input) input.checked = true;
			} else if (val === chosen) {
				opt.setAttribute("data-state", "incorrect");
			}
			if (input) input.disabled = true;
		});
		fs.querySelectorAll<HTMLElement>(".opt-exp").forEach((exp) => {
			exp.hidden = false;
		});
		return { correct: chosen === correct ? 1 : 0, total: 1 };
	}

	function gradeFb(el: Element): { correct: number; total: number } {
		const raw = el.getAttribute("data-accepted") || "[]";
		let accepted: string[] = [];
		try {
			accepted = JSON.parse(raw);
		} catch (err) {
			if (typeof console !== "undefined")
				console.warn("workbookInit: malformed data-accepted", err);
		}
		const input = el.querySelector<HTMLInputElement>("input");
		const value = norm(input ? input.value : "");
		const isCorrect =
			value.length > 0 && accepted.map(norm).indexOf(value) !== -1;
		el.setAttribute("data-state", isCorrect ? "correct" : "incorrect");
		if (input) {
			if (!isCorrect && accepted[0]) input.value = accepted[0];
			input.disabled = true;
		}
		return { correct: isCorrect ? 1 : 0, total: 1 };
	}

	function gradeMatch(row: Element): { correct: number; total: number } {
		const correct = row.getAttribute("data-correct");
		const select = row.querySelector<HTMLSelectElement>("select");
		const value = select ? select.value : "";
		const isCorrect = value === correct;
		row.setAttribute("data-state", isCorrect ? "correct" : "incorrect");
		if (select) {
			if (!isCorrect && correct) select.value = correct;
			select.disabled = true;
		}
		return { correct: isCorrect ? 1 : 0, total: 1 };
	}

	function updateBadge(correct: number, total: number): void {
		const badge = root.querySelector<HTMLElement>("[data-badge]");
		if (!badge) return;
		const ratio = total === 0 ? 0 : correct / total;
		badge.setAttribute(
			"data-tone",
			ratio >= 0.7 ? "good" : ratio >= 0.4 ? "mid" : "low",
		);
		const icon = badge.querySelector<HTMLElement>(".wb-badge-icon");
		const score = badge.querySelector<HTMLElement>(".wb-badge-score");
		if (icon) icon.hidden = true;
		if (score) {
			score.hidden = false;
			const c = score.querySelector("[data-score-correct]");
			const t = score.querySelector("[data-score-total]");
			if (c) c.textContent = String(correct);
			if (t) t.textContent = String(total);
		}
	}

	function check(): void {
		let totalCorrect = 0;
		let totalQuestions = 0;
		root.querySelectorAll<HTMLElement>("[data-q-kind]").forEach((el) => {
			const kind = el.getAttribute("data-q-kind");
			let s: { correct: number; total: number } | null = null;
			if (kind === "mc") s = gradeMc(el);
			else if (kind === "tf") s = gradeTf(el);
			else if (kind === "fb") s = gradeFb(el);
			else if (kind === "match") s = gradeMatch(el);
			if (s) {
				totalCorrect += s.correct;
				totalQuestions += s.total;
			}
		});
		root.querySelectorAll<HTMLElement>("[data-exp-for]").forEach((el) => {
			el.hidden = false;
			if (el instanceof HTMLDetailsElement) el.open = true;
		});
		updateBadge(totalCorrect, totalQuestions);
		const btn = root.querySelector<HTMLButtonElement>("#wb-check");
		if (btn) {
			btn.disabled = true;
			btn.textContent = "Checked";
		}
		const wb = root.querySelector<HTMLElement>(".wb");
		if (wb) {
			wb.setAttribute("data-revealed", "");
			// Only scroll to the top in the standalone HTML. When `workbookInit`
			// runs against a ShadowRoot inside the preview dialog, scrolling
			// yanks the dialog's scroll container — bad UX.
			if (root.nodeType === 9 && wb.scrollIntoView)
				wb.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}

	const btn = root.querySelector<HTMLButtonElement>("#wb-check");
	if (btn) btn.addEventListener("click", check);
}

export function workbookFilename(workbook: Workbook): string {
	const parts = [
		slugify(workbook.targetLanguage),
		slugify(workbook.topic),
		slugify(workbook.level),
		slugify(workbook.title),
	].filter((p) => p.length > 0);
	const name = parts.join("-") || "workbook";
	return `${name}.html`;
}

function renderBody(workbook: Workbook): string {
	const metadata = `${esc(workbook.topic)} · ${esc(workbook.level)} ${esc(workbook.targetLanguage)}`;
	const tags = workbook.tags.map((tag) => `<li>${esc(tag)}</li>`).join("");
	const objectives = workbook.objectives
		.map((objective) => `<li>${esc(objective)}</li>`)
		.join("");
	const exercises = workbook.exercises
		.map((exercise, index) => renderExercise(exercise, index))
		.join("\n");

	return `<header class="wb-header">
  <div class="wb-badge" data-badge>
    <span class="wb-badge-icon" aria-hidden="true">&#x1F4DA;</span>
    <span class="wb-badge-score" hidden>
      <span data-score-correct>0</span> / <span data-score-total>0</span>
    </span>
  </div>
  <p class="wb-meta">${metadata}</p>
  <h1 class="wb-title">${esc(workbook.title)}</h1>
  ${tags ? `<ul class="wb-tags">${tags}</ul>` : ""}
</header>
<section class="wb-card">
  <p class="wb-focal">${esc(workbook.intro)}</p>
  ${
		objectives
			? `<div class="wb-objectives">
    <p class="wb-label">Learning objectives</p>
    <ul>${objectives}</ul>
  </div>`
			: ""
	}
</section>
${exercises}
<div class="wb-actions">
  <button type="button" id="wb-check">Check answers</button>
</div>`;
}

function renderExercise(exercise: Exercise, index: number): string {
	const number = index + 1;
	const kindLabel = EXERCISE_KIND_LABEL[exercise.kind];
	const header = `<header class="ex-header">
    <span class="ex-kind">Exercise ${number} · ${esc(kindLabel)}</span>
    ${exercise.title ? `<h2 class="ex-title">${esc(exercise.title)}</h2>` : ""}
    ${exercise.instructions ? `<p class="ex-instructions">${esc(exercise.instructions)}</p>` : ""}
  </header>`;

	const body = renderExerciseBody(exercise);

	return `<section class="wb-card ex" data-exercise-id="${exercise.id}">
  ${header}
  ${body}
</section>`;
}

function renderExerciseBody(exercise: Exercise): string {
	switch (exercise.kind) {
		case "reading":
			return renderReading(exercise);
		case "multipleChoice":
			return renderMultipleChoice(exercise);
		case "trueFalse":
			return renderTrueFalse(exercise);
		case "fillBlank":
			return renderFillBlank(exercise);
		case "matching":
			return renderMatching(exercise);
		default: {
			const _exhaustive: never = exercise;
			return _exhaustive;
		}
	}
}

function renderReading(
	exercise: Extract<Exercise, { kind: "reading" }>,
): string {
	const paragraphs = exercise.text
		.split(/\n\s*\n/)
		.filter((p) => p.trim().length > 0)
		.map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
		.join("");

	const questions = exercise.questions
		.map((question, i) => {
			const qId = `${exercise.id}-${i}`;
			if (question.kind === "multipleChoice") {
				return renderMcQuestion(qId, question.prompt, question.options);
			}
			return renderTfQuestion(qId, question.statement, question);
		})
		.join("");

	return `<div class="ex-reading">
    <div class="ex-text">${paragraphs}</div>
    <div class="ex-reading-questions">${questions}</div>
  </div>`;
}

function renderMultipleChoice(
	exercise: Extract<Exercise, { kind: "multipleChoice" }>,
): string {
	return renderMcQuestion(
		String(exercise.id),
		exercise.prompt,
		exercise.options,
	);
}

function renderTrueFalse(
	exercise: Extract<Exercise, { kind: "trueFalse" }>,
): string {
	return renderTfQuestion(String(exercise.id), exercise.statement, exercise);
}

function renderMcQuestion(
	qId: string,
	prompt: string,
	options: Extract<Exercise, { kind: "multipleChoice" }>["options"],
): string {
	const name = `q-${qId}`;
	const correctIndex = options.findIndex((o) => o.isCorrect);
	const optionItems = options
		.map((option, i) => {
			const id = `${name}-${i}`;
			return `<label class="opt" for="${id}">
      <input type="radio" id="${id}" name="${name}" value="${i}"${option.isCorrect ? ' data-correct="1"' : ""}>
      <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
      <span class="opt-body">
        <span class="opt-text">${esc(option.text)}</span>
      </span>
    </label>`;
		})
		.join("");

	const explanations = options
		.map(
			(option, i) =>
				`<p class="opt-exp" data-option="${i}" hidden>${esc(option.explanationIfChosen)}</p>`,
		)
		.join("");

	return `<fieldset class="ex-mc" data-q="${name}" data-q-kind="mc" data-correct-index="${correctIndex}">
    <legend class="ex-focal">${esc(prompt)}</legend>
    <div class="opt-list">${optionItems}</div>
    <details class="exp" data-exp-for="${name}" hidden>
      <summary class="exp-toggle">Show explanation</summary>
      <div class="exp-body">${explanations}</div>
    </details>
  </fieldset>`;
}

function renderTfQuestion(
	qId: string,
	statement: string,
	answer: TrueFalseAnswer,
): string {
	const name = `q-${qId}`;
	const correct = answer.correctAnswer ? "true" : "false";
	const trueExp = esc(answer.explanationIfTrueChosen);
	const falseExp = esc(answer.explanationIfFalseChosen);

	return `<fieldset class="ex-tf" data-q="${name}" data-q-kind="tf" data-correct="${correct}">
    <legend class="ex-focal">${esc(statement)}</legend>
    <div class="tf-options">
      <label class="opt opt-tf" for="${name}-t">
        <input type="radio" id="${name}-t" name="${name}" value="true" class="sr-only">
        <span class="opt-tf-label">&#x2713; True</span>
      </label>
      <label class="opt opt-tf" for="${name}-f">
        <input type="radio" id="${name}-f" name="${name}" value="false" class="sr-only">
        <span class="opt-tf-label">&#x2715; False</span>
      </label>
    </div>
    <details class="exp" data-exp-for="${name}" hidden>
      <summary class="exp-toggle">Show explanation</summary>
      <div class="exp-body">
        <p class="opt-exp" data-option="true" hidden>${trueExp}</p>
        <p class="opt-exp" data-option="false" hidden>${falseExp}</p>
      </div>
    </details>
  </fieldset>`;
}

function renderFillBlank(
	exercise: Extract<Exercise, { kind: "fillBlank" }>,
): string {
	const segments = exercise.sentence.split(FILL_BLANK_PLACEHOLDER);
	let html = '<p class="ex-focal ex-fb-sentence">';
	segments.forEach((segment, i) => {
		html += esc(segment);
		const blank = exercise.blanks[i];
		if (blank) {
			const accepted = esc(JSON.stringify(blank.acceptedAnswers));
			html += `<span class="fb" data-q="q-${exercise.id}-${i}" data-q-kind="fb" data-accepted="${accepted}">
        <input type="text" autocomplete="off">
        <span class="fb-hint">(${esc(blank.hint)})</span>
      </span>`;
		}
	});
	html += "</p>";

	const explanations = exercise.blanks
		.map(
			(blank, i) => `<li>
      <p class="fb-exp-head"><span class="fb-exp-label">Blank ${i + 1} (${esc(blank.hint)})</span></p>
      <p class="fb-exp-body">${esc(blank.explanation)}</p>
    </li>`,
		)
		.join("");

	return `<div class="ex-fb">
    ${html}
    <details class="exp" data-exp-for="ex-${exercise.id}" hidden>
      <summary class="exp-toggle">Show explanation</summary>
      <div class="exp-body">
        <ol class="fb-exp-list">${explanations}</ol>
      </div>
    </details>
  </div>`;
}

function renderMatching(
	exercise: Extract<Exercise, { kind: "matching" }>,
): string {
	const rightOptions = shuffleDeterministic(
		exercise.pairs.map((p) => p.right),
		String(exercise.id),
	);
	const optionsHtml = rightOptions
		.map((opt) => `<option value="${esc(opt)}">${esc(opt)}</option>`)
		.join("");

	const rows = exercise.pairs
		.map((pair, i) => {
			const qName = `q-${exercise.id}-${i}`;
			return `<div class="match-row" data-q="${qName}" data-q-kind="match" data-correct="${esc(pair.right)}">
      <div class="match-left">
        <span class="match-num">${pad2(i + 1)}</span>
        <span>${esc(pair.left)}</span>
      </div>
      <div class="match-select-wrap">
        <select class="match-select">
          <option value="" disabled selected>Select…</option>
          ${optionsHtml}
        </select>
      </div>
    </div>`;
		})
		.join("");

	const explanations = exercise.pairs
		.map(
			(pair) => `<li>
      <p class="match-exp-head">${esc(pair.left)} &rarr; <span class="match-exp-right">${esc(pair.right)}</span></p>
      <p class="match-exp-body">${esc(pair.explanation)}</p>
    </li>`,
		)
		.join("");

	return `<div class="ex-match">
    <div class="match-head">
      <span>${esc(exercise.leftLabel)}</span>
      <span>${esc(exercise.rightLabel)}</span>
    </div>
    ${rows}
    <details class="exp" data-exp-for="ex-${exercise.id}" hidden>
      <summary class="exp-toggle">Show explanation</summary>
      <div class="exp-body">
        <ol class="match-exp-list">${explanations}</ol>
      </div>
    </details>
  </div>`;
}

const EXERCISE_KIND_LABEL: Record<Exercise["kind"], string> = {
	reading: "Reading",
	multipleChoice: "Multiple choice",
	trueFalse: "True or false",
	fillBlank: "Fill in the blank",
	matching: "Matching",
};

function esc(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function pad2(n: number): string {
	return n.toString().padStart(2, "0");
}

function shuffleDeterministic<T>(items: T[], seed: string): T[] {
	return items
		.map((item, i) => ({ item, key: fnv1a(`${seed}:${i}`) }))
		.sort((a, b) => a.key - b.key)
		.map(({ item }) => item);
}

function fnv1a(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

const LANGUAGE_CODES: Record<string, string> = {
	english: "en",
	spanish: "es",
	french: "fr",
	german: "de",
	italian: "it",
	portuguese: "pt",
	russian: "ru",
	ukrainian: "uk",
	polish: "pl",
	dutch: "nl",
	chinese: "zh",
	japanese: "ja",
	korean: "ko",
	arabic: "ar",
	hebrew: "he",
	hindi: "hi",
	turkish: "tr",
	swedish: "sv",
	norwegian: "no",
	danish: "da",
	finnish: "fi",
	greek: "el",
	czech: "cs",
	hungarian: "hu",
	romanian: "ro",
	bulgarian: "bg",
	serbian: "sr",
	croatian: "hr",
	vietnamese: "vi",
	thai: "th",
	indonesian: "id",
};

function languageCode(name: string): string | null {
	const key = name.toLowerCase().trim().split(/\s+/)[0] ?? "";
	return LANGUAGE_CODES[key] ?? null;
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
}

// Standalone stylesheet for the downloadable HTML. This is a second source
// of truth alongside the Tailwind v4 tokens in `src/styles.css` — the
// downloaded file has no Tailwind runtime, so colors must be inlined here.
// Keep brand colors in rough parity with `@theme` / `.dark` in styles.css.
const STYLES = `
*,*::before,*::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; }
:host, body {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.55;
  color: #18181b;
  background: #fafafa;
  padding: 24px 16px;
  display: block;
}
.wb { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
.wb-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 24px;
}
.wb-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 24px; }
.wb-badge {
  display: inline-flex; align-items: center; justify-content: center;
  height: 40px; min-width: 40px; padding: 0 12px; border-radius: 8px;
  background: rgba(0,0,0,0.04);
  color: #52525b; font-size: 18px;
}
.wb-badge[data-tone="good"] { background: rgba(16,185,129,0.1); color: #047857; }
.wb-badge[data-tone="mid"] { background: rgba(245,158,11,0.1); color: #b45309; }
.wb-badge[data-tone="low"] { background: rgba(244,63,94,0.1); color: #be123c; }
.wb-badge-score { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 16px; }
.wb-meta { margin: 0; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a; font-weight: 600; }
.wb-title { margin: 4px 0 0; font-size: 26px; line-height: 1.2; font-weight: 700; color: #09090b; }
.wb-tags { margin: 4px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.wb-tags li { font-size: 12px; color: #52525b; background: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 6px; padding: 4px 10px; }
.wb-focal { margin: 0; font-size: 15px; line-height: 1.6; color: #27272a; }
.wb-objectives { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.08); }
.wb-label { margin: 0 0 8px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a; font-weight: 600; }
.wb-objectives ul { margin: 0; padding-left: 20px; }
.wb-objectives li { font-size: 14px; color: #3f3f46; margin: 2px 0; }

.ex-header { margin-bottom: 16px; }
.ex-kind { display: inline-block; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a; font-weight: 600; }
.ex-title { margin: 6px 0 0; font-size: 18px; font-weight: 700; color: #09090b; }
.ex-instructions { margin: 4px 0 0; font-size: 14px; color: #52525b; }
.ex-focal { font-size: 16px; font-weight: 500; color: #18181b; line-height: 1.55; margin: 0 0 12px; }

/* Multiple choice / True-false */
.ex-mc, .ex-tf { border: none; padding: 0; margin: 0; }
.opt-list { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.tf-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

.opt {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 20px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  cursor: pointer;
  background: #fff;
  color: #3f3f46;
  transition: border-color 0.15s, background 0.15s;
}
.opt:hover { background: rgba(0,0,0,0.02); }
.opt:focus-within { box-shadow: 0 0 0 2px rgba(139,92,246,0.4); }
.opt input[type="radio"] { margin-top: 4px; width: 16px; height: 16px; accent-color: #8b5cf6; flex: 0 0 auto; }
.opt-letter { flex: 0 0 16px; font-size: 12px; font-weight: 500; color: #a1a1aa; margin-top: 3px; }
.opt-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.opt-text { font-size: 15px; line-height: 1.55; }
.opt-exp { margin: 0; font-size: 13px; line-height: 1.6; color: #3f3f46; }

.opt:has(input:checked):not([data-state]) { border-color: #8b5cf6; background: rgba(139,92,246,0.06); color: #09090b; }

/* True / False buttons */
.opt-tf {
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.opt[data-state="correct"] { border-color: #10b981; background: rgba(16,185,129,0.08); color: #065f46; }
.opt[data-state="incorrect"] { border-color: #f43f5e; background: rgba(244,63,94,0.08); color: #9f1239; }

/* Fill blank */
.ex-fb-sentence { line-height: 2.2; }
.fb { display: inline-flex; align-items: baseline; gap: 4px; margin: 0 2px; }
.fb input[type="text"] {
  width: 140px;
  border: none;
  border-bottom: 1px solid #a1a1aa;
  background: transparent;
  text-align: center;
  font: inherit;
  color: #09090b;
  padding: 2px 4px;
  outline: none;
  transition: border-color 0.15s;
}
.fb input[type="text"]:focus { border-bottom-color: #8b5cf6; }
.fb-hint { font-size: 12px; color: #a1a1aa; font-weight: 500; }
.fb[data-state="correct"] input { border-bottom-color: #10b981; color: #047857; }
.fb[data-state="incorrect"] input { border-bottom-color: #f43f5e; color: #be123c; }

/* Matching */
.ex-match { display: flex; flex-direction: column; }
.match-head { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.08); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a; font-weight: 600; }
.match-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.04); }
.match-row:last-of-type { border-bottom: none; }
.match-left { display: flex; align-items: center; gap: 12px; font-size: 15px; color: #27272a; }
.match-num { font-size: 12px; font-weight: 500; color: #a1a1aa; font-variant-numeric: tabular-nums; min-width: 20px; }
.match-select-wrap { position: relative; display: flex; align-items: center; gap: 8px; }
.match-select {
  width: 100%;
  appearance: none;
  border: 1px solid rgba(0,0,0,0.1);
  background: #fff;
  color: #09090b;
  padding: 8px 32px 8px 12px;
  border-radius: 8px;
  font: inherit;
  transition: border-color 0.15s;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
}
.match-select:focus { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.25); }
.match-row[data-state="correct"] .match-select { border-color: #10b981; }
.match-row[data-state="incorrect"] .match-select { border-color: #f43f5e; }
/* Explanations — ExpansionTile */
.exp {
  margin-top: 20px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  background: #fff;
}
.exp-toggle {
  display: flex;
  cursor: pointer;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #18181b;
  transition: background 0.15s;
  user-select: none;
}
.exp-toggle:hover { background: rgba(0,0,0,0.03); }
.exp-toggle::-webkit-details-marker { display: none; }
.exp-toggle::after {
  content: "";
  width: 8px;
  height: 8px;
  border-right: 1.5px solid #71717a;
  border-bottom: 1.5px solid #71717a;
  transform: rotate(45deg);
  transition: transform 0.15s;
  margin-top: -3px;
}
.exp[open] > .exp-toggle::after { transform: rotate(-135deg); margin-top: 3px; }
.exp-body {
  border-top: 1px solid rgba(0,0,0,0.1);
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #3f3f46;
}
.fb-exp-list, .match-exp-list { margin: 0; padding-left: 20px; }
.fb-exp-list li, .match-exp-list li { margin: 6px 0; }
.fb-exp-head, .match-exp-head { margin: 0; font-size: 13px; }
.fb-exp-label { color: #71717a; font-weight: 500; }
.fb-exp-body, .match-exp-body { margin: 2px 0 0; font-size: 12px; color: #71717a; line-height: 1.6; }
.match-exp-right { color: #047857; font-weight: 600; }

.opt[data-state="correct"] input[type="radio"] { accent-color: #10b981; }
.opt[data-state="incorrect"] input[type="radio"] { accent-color: #f43f5e; }

/* Reading */
.ex-reading { display: flex; flex-direction: column; gap: 16px; }
.ex-text { background: rgba(0,0,0,0.03); padding: 16px 20px; border-radius: 8px; font-size: 15px; line-height: 1.7; color: #27272a; }
.ex-text p { margin: 0 0 10px; }
.ex-text p:last-child { margin: 0; }
.ex-reading-questions { display: flex; flex-direction: column; gap: 20px; }
.ex-reading-questions .ex-focal { font-size: 15px; font-weight: 500; }

/* Actions */
.wb-actions { display: flex; justify-content: center; }
#wb-check {
  appearance: none;
  border: none;
  background: #18181b;
  color: #fafafa;
  padding: 10px 20px;
  font: inherit;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, transform 0.05s;
}
#wb-check:hover { background: #27272a; }
#wb-check:active { transform: translateY(1px); }
#wb-check[disabled] { opacity: 0.5; cursor: default; transform: none; }

/* Revealed state: disable interaction */
.wb[data-revealed] input, .wb[data-revealed] select { pointer-events: none; }
.wb[data-revealed] .opt { cursor: default; }
.wb[data-revealed] .opt:hover { border-color: rgba(0,0,0,0.1); background: #fff; }

@media (prefers-color-scheme: dark) {
  :host, body { background: #09090b; color: #fafafa; }
  .wb-card, .wb-header { background: #18181b; border-color: rgba(255,255,255,0.1); }
  .wb-title, .ex-title, .match-left, .fb input[type="text"], .ex-text { color: #fafafa; }
  .wb-meta, .ex-kind, .wb-label, .match-head, .match-num, .fb-hint, .opt-letter { color: #a1a1aa; }
  .wb-focal, .ex-focal, .ex-instructions, .wb-objectives li, .fb-exp-body, .match-exp-body, .opt-exp { color: #d4d4d8; }
  .match-exp-right { color: #6ee7b7; }
  .wb-tags li { background: #27272a; border-color: rgba(255,255,255,0.1); color: #a1a1aa; }
  .wb-badge { background: rgba(255,255,255,0.06); color: #a1a1aa; }
  .opt { background: #18181b; border-color: rgba(255,255,255,0.1); color: #d4d4d8; }
  .opt:hover { background: rgba(255,255,255,0.04); }
  .opt:has(input:checked):not([data-state]) { border-color: #a78bfa; background: rgba(167,139,250,0.12); color: #fafafa; }
  .opt[data-state="correct"] { background: rgba(16,185,129,0.15); color: #6ee7b7; }
  .opt[data-state="incorrect"] { background: rgba(244,63,94,0.15); color: #fda4af; }
  .wb[data-revealed] .opt:hover { background: #18181b; border-color: rgba(255,255,255,0.1); }
  .match-select { background-color: #18181b; color: #fafafa; border-color: rgba(255,255,255,0.12); }
  .ex-text { background: rgba(255,255,255,0.03); }
  #wb-check { background: #fafafa; color: #09090b; }
  #wb-check:hover { background: #e4e4e7; }
  .exp { background: #18181b; border-color: rgba(255,255,255,0.1); }
  .exp-toggle { color: #fafafa; }
  .exp-toggle:hover { background: rgba(255,255,255,0.04); }
  .exp-toggle::after { border-color: #a1a1aa; }
  .exp-body { border-color: rgba(255,255,255,0.1); color: #d4d4d8; }
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
`;
