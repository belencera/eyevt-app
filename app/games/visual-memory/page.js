'use client'

import { useCallback, useState } from 'react'
import {
  GameShell,
  ModeSelector,
  SessionSummary,
  StimulusGrid,
  StimulusExtraControls,
  useStimulusManager,
  IconRandom,
  IconTarget,
  LevelStatus,
} from '../_shared'
import {
  RecallPresentation,
  ResponseGrid,
  useRecallGame,
  DEFAULT_EXPOSURE,
  DEFAULT_MEMORY_STIMULUS,
  DEFAULT_VISUAL_MEMORY_MODE,
  EXPOSURE_STEPS,
  MEMORY_SHORTCUTS_HINT,
  MEMORY_STIMULUS_OPTIONS,
  RESPONSE_DELAY_MS,
  VISUAL_MEMORY_MODES,
} from '../_memory'

const VISUAL_MEMORY_HINT =
  'Memorizar los estímulos que aparecen a la vez y seleccionarlos después en la cuadrícula, en cualquier orden.'

const MODE_ICONS = {
  center: <IconTarget />,
  scattered: <IconRandom />,
}

const MODE_OPTIONS = VISUAL_MEMORY_MODES.map((m) => ({ ...m, icon: MODE_ICONS[m.value] }))

export default function VisualMemoryGame() {
  const [mode, setMode] = useState(DEFAULT_VISUAL_MEMORY_MODE) // 'center' | 'scattered'
  const [exposure, setExposure] = useState(DEFAULT_EXPOSURE) // Segundos que los estímulos permanecen visibles

  const stimulus = useStimulusManager(DEFAULT_MEMORY_STIMULUS)

  // Presentación simultánea: todos los objetivos a la vez durante el tiempo de exposición y pausa antes de responder
  const buildSteps = useCallback(
    () => [
      { phase: 'presenting', ms: exposure * 1000 },
      { phase: 'gap', ms: RESPONSE_DELAY_MS },
    ],
    [exposure]
  )

  const game = useRecallGame({ stimulus, buildSteps, scattered: mode === 'scattered' })
  const { session } = game

  return (
    <GameShell
      title="Memoria visual"
      hint={VISUAL_MEMORY_HINT}
      session={session}
      stimulus={stimulus}
      gameControls={
        <ModeSelector
          id="visual-memory-mode"
          label="Modo de juego"
          description={VISUAL_MEMORY_MODES.find((m) => m.value === mode)?.description}
          value={mode}
          options={MODE_OPTIONS}
          disabled={!session.isIdle}
          onChange={setMode}
        />
      }
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
          options={MEMORY_STIMULUS_OPTIONS}
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
      shortcutsHint={MEMORY_SHORTCUTS_HINT}
    >
      {session.started && game.round && (
        <>
          <LevelStatus level={game.level} filled={game.streak} total={game.upAfter} />

          <RecallPresentation
            phase={game.stagePhase}
            type={stimulus.stimulusType}
            items={game.presentedItems}
            positions={game.positions}
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
              leaving={game.isLeaving}
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
