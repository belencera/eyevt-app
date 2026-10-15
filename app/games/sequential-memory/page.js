'use client'

import { useCallback, useState } from 'react'
import {
  GameShell,
  SessionSummary,
  StimulusGrid,
  StimulusExtraControls,
  useStimulusManager,
} from '../_shared'
import {
  LevelStatus,
  RecallPresentation,
  ResponseGrid,
  useRecallGame,
  DEFAULT_RECALL_STIMULUS,
  DEFAULT_SEQUENCE_SPEED,
  RECALL_SHORTCUTS_HINT,
  RECALL_STIMULUS_OPTIONS,
  SEQUENCE_GAP_MS,
  SEQUENCE_SPEED_STEPS,
} from '../_recall'

const SEQUENTIAL_MEMORY_HINT =
  'Memorizar los estímulos que aparecen uno tras otro y pulsarlos después en el mismo orden.'

export default function SequentialMemoryGame() {
  const [speed, setSpeed] = useState(DEFAULT_SEQUENCE_SPEED) // Segundos que se muestra cada estímulo

  const stimulus = useStimulusManager(DEFAULT_RECALL_STIMULUS)

  // Presentación serial en fila: cada objetivo aparece a la derecha del anterior, separados por un breve hueco en blanco
  const buildSteps = useCallback(
    (round) =>
      round.targets.flatMap((_, index) => [
        { phase: 'presenting', ms: speed * 1000, index },
        ...(index < round.targets.length - 1 ? [{ phase: 'gap', ms: SEQUENCE_GAP_MS }] : []),
      ]),
    [speed]
  )

  const game = useRecallGame({ stimulus, buildSteps, ordered: true })
  const { session } = game

  return (
    <GameShell
      title="Memoria secuencial"
      hint={SEQUENTIAL_MEMORY_HINT}
      session={session}
      stimulus={stimulus}
      speedControl={{
        id: 'sequential-memory-speed',
        label: 'Tiempo por estímulo',
        value: speed,
        steps: SEQUENCE_SPEED_STEPS,
        unit: ' s',
        disabled: !session.isIdle,
        onChange: setSpeed,
      }}
      stimulusGrid={
        <StimulusGrid
          value={stimulus.stimulusType}
          options={RECALL_STIMULUS_OPTIONS}
          disabled={!session.isIdle}
          onChange={stimulus.handleStimulusChange}
        />
      }
      extraControls={
        <StimulusExtraControls
          stimulus={stimulus}
          disabled={!session.isIdle}
          prefix="sequential-memory"
          showSize={false}
        />
      }
      shortcuts={[]}
      shortcutsHint={RECALL_SHORTCUTS_HINT}
    >
      {session.started && game.round && (
        <>
          <LevelStatus level={game.level} streak={game.streak} upAfter={game.upAfter} />

          <RecallPresentation
            phase={game.stagePhase}
            type={stimulus.stimulusType}
            items={game.presentedItems}
            activeIndex={game.activeIndex}
            sizePx={stimulus.sizePx}
            sizeLevel={stimulus.sizeLevel}
          />

          {game.isAnswering && (
            <ResponseGrid
              type={stimulus.stimulusType}
              options={game.round.options}
              columns={game.round.columns}
              selection={game.selection}
              results={game.results}
              ordered
              disabled={game.phase !== 'responding'}
              isPaused={session.isPaused}
              onSelect={game.select}
              onUndo={game.undo}
              onNext={game.nextRound}
            />
          )}
        </>
      )}

      <SessionSummary {...game.summary} />
    </GameShell>
  )
}
