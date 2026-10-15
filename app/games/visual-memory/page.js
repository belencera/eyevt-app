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
  DEFAULT_EXPOSURE,
  DEFAULT_RECALL_STIMULUS,
  EXPOSURE_STEPS,
  RECALL_SHORTCUTS_HINT,
  RECALL_STIMULUS_OPTIONS,
} from '../_recall'

const VISUAL_MEMORY_HINT =
  'Memorizar los estímulos que aparecen a la vez y seleccionarlos después en la cuadrícula, en cualquier orden.'

export default function VisualMemoryGame() {
  const [exposure, setExposure] = useState(DEFAULT_EXPOSURE) // Segundos que los estímulos permanecen visibles

  const stimulus = useStimulusManager(DEFAULT_RECALL_STIMULUS)

  // Presentación simultánea: todos los objetivos a la vez durante el tiempo de exposición
  const buildSteps = useCallback(
    () => [{ phase: 'presenting', ms: exposure * 1000 }],
    [exposure]
  )

  const game = useRecallGame({ stimulus, buildSteps })
  const { session } = game

  return (
    <GameShell
      title="Memoria visual"
      hint={VISUAL_MEMORY_HINT}
      session={session}
      stimulus={stimulus}
      speedControl={{
        id: 'visual-memory-exposure',
        label: 'Tiempo de exposición',
        value: exposure,
        steps: EXPOSURE_STEPS,
        unit: ' s',
        disabled: !session.isIdle,
        onChange: setExposure,
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
          prefix="visual-memory"
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
              disabled={game.phase !== 'responding'}
              isPaused={session.isPaused}
              onSelect={game.select}
              onNext={game.nextRound}
            />
          )}
        </>
      )}

      <SessionSummary {...game.summary} />
    </GameShell>
  )
}
