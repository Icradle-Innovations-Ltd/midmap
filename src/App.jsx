import { useEffect, useMemo, useState } from "react";

import MindMapCanvas from "./components/MindMapCanvas.jsx";

const STORAGE_KEY = "mind-bloom-session";

function formatSeconds(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getShortLabel(label) {
  return label.split(" ").slice(0, 2).join(" ");
}

function useTimer(isRunning, duration, stepKey) {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    setSecondsLeft(duration);
  }, [duration, stepKey]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, secondsLeft]);

  return secondsLeft;
}

export default function App() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMoodId, setSelectedMoodId] = useState("");
  const [selections, setSelections] = useState([]);
  const [journalEntry, setJournalEntry] = useState("");
  const [showRestoreHint, setShowRestoreHint] = useState(false);

  useEffect(() => {
    const storedState = window.localStorage.getItem(STORAGE_KEY);
    if (!storedState) {
      return;
    }

    try {
      const parsed = JSON.parse(storedState);
      setSelectedMoodId(parsed.selectedMoodId || "");
      setSelections(parsed.selections || []);
      setJournalEntry(parsed.journalEntry || "");
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      try {
        setLoading(true);
        const response = await fetch("/api/game-content", {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Could not load the game content.");
        }

        const data = await response.json();
        setContent(data);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedMoodId, selections, journalEntry })
    );
  }, [selectedMoodId, selections, journalEntry]);

  const selectedMood = useMemo(
    () => content?.moods.find((mood) => mood.id === selectedMoodId) ?? null,
    [content, selectedMoodId]
  );

  const currentStage = content?.stages[selections.length] ?? null;
  const isComplete = Boolean(content && selections.length === content.stages.length);
  const activeChoice = selections.at(-1) ?? null;
  const secondsLeft = useTimer(
    Boolean(activeChoice && !isComplete),
    activeChoice?.duration ?? 0,
    `${activeChoice?.id ?? "idle"}-${selections.length}`
  );

  useEffect(() => {
    if (activeChoice && secondsLeft === 0) {
      setShowRestoreHint(true);
      return;
    }

    setShowRestoreHint(false);
  }, [activeChoice, secondsLeft]);

  function handleMoodSelect(moodId) {
    setSelectedMoodId(moodId);
    setSelections([]);
    setJournalEntry("");
  }

  function handleChoice(choice) {
    if (!currentStage) {
      return;
    }

    setSelections((current) => [
      ...current,
      {
        ...choice,
        stage: currentStage.title,
        shortLabel: getShortLabel(choice.label)
      }
    ]);
  }

  function handleReset() {
    setSelectedMoodId("");
    setSelections([]);
    setJournalEntry("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const themes = useMemo(() => {
    const toneCounts = selections.reduce((counts, selection) => {
      counts[selection.tone] = (counts[selection.tone] || 0) + 1;
      return counts;
    }, {});

    return Object.entries(toneCounts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 3)
      .map(([tone]) => tone);
  }, [selections]);

  if (loading) {
    return <div className="screen-state">Loading your calming space...</div>;
  }

  if (error || !content) {
    return (
      <div className="screen-state">
        <p>{error || "Something went wrong while loading the app."}</p>
        <button className="secondary-button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  const progressCount = selections.length;
  const progressLabel = `${progressCount}/${content.stages.length} branches grown`;

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Mind-map recovery game</p>
          <h1>{content.app.title}</h1>
          <p className="hero-subtitle">{content.app.subtitle}</p>
          <p className="hero-note">{content.app.supportNote}</p>
        </div>
        <div className="hero-alert">
          <p>Safety note</p>
          <span>{content.app.crisisNote}</span>
        </div>
      </section>

      <section className="main-grid">
        <article className="panel visual-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Your map</p>
              <h2>{selectedMood ? `${selectedMood.label} path` : "Choose a starting feeling"}</h2>
            </div>
            <div className="progress-pill">
              <strong>{progressLabel}</strong>
            </div>
          </div>
          <MindMapCanvas mood={selectedMood} selections={selections} />
          <div className="map-footnote">
            {selectedMood ? (
              <p>{selectedMood.prompt}</p>
            ) : (
              <p>
                Pick the starting feeling that sounds closest to your present moment. The game will grow a calmer path from there.
              </p>
            )}
          </div>
        </article>

        <article className="panel play-panel">
          {!selectedMood && (
            <>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Step 1</p>
                  <h2>Choose your starting mood</h2>
                </div>
              </div>
              <div className="mood-grid">
                {content.moods.map((mood) => (
                  <button
                    key={mood.id}
                    className="mood-card"
                    onClick={() => handleMoodSelect(mood.id)}
                  >
                    <span className="mood-card__aura">{mood.aura}</span>
                    <strong>{mood.label}</strong>
                    <p>{mood.description}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedMood && currentStage && (
            <>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Current challenge</p>
                  <h2>{currentStage.title}</h2>
                </div>
                <div className="stage-count">Branch {selections.length + 1}</div>
              </div>
              <p className="prompt-copy">{currentStage.prompt}</p>
              <div className="choice-list">
                {currentStage.choices.map((choice) => (
                  <button
                    key={choice.id}
                    className="choice-card"
                    onClick={() => handleChoice(choice)}
                  >
                    <span>{choice.tone}</span>
                    <strong>{choice.label}</strong>
                    <p>{choice.detail}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedMood && activeChoice && !isComplete && (
            <div className="practice-card">
              <div className="practice-card__header">
                <div>
                  <p className="eyebrow">Micro practice</p>
                  <h3>{activeChoice.label}</h3>
                </div>
                <div className="timer-badge">{formatSeconds(secondsLeft)}</div>
              </div>
              <p>{activeChoice.practice}</p>
              {showRestoreHint && (
                <p className="practice-card__hint">
                  Nice work. Let the effect settle for one breath before you choose the next branch.
                </p>
              )}
            </div>
          )}

          {selectedMood && isComplete && (
            <div className="summary-stack">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Recovery path</p>
                  <h2>Your map is complete</h2>
                </div>
              </div>
              <p className="summary-copy">{selectedMood.summary}</p>
              <div className="theme-list">
                {themes.map((theme) => (
                  <span key={theme} className="theme-chip">
                    {theme}
                  </span>
                ))}
              </div>
              <label className="journal-box">
                <span>One note to keep with you after this round</span>
                <textarea
                  value={journalEntry}
                  onChange={(event) => setJournalEntry(event.target.value)}
                  placeholder="Example: I only need one kind next step tonight."
                />
              </label>
              <div className="summary-actions">
                <button className="primary-button" onClick={handleReset}>
                  Start a new map
                </button>
                <button
                  className="secondary-button"
                  onClick={() => window.print()}
                >
                  Print this reflection
                </button>
              </div>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
