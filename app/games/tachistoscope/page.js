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
  DEFAULT_FLASH_MS,
  DEFAULT_MEMORY_STIMULUS,
  FLASH_DELAY_MS,
  FLASH_MS_STEPS,
  MEMORY_SHORTCUTS_HINT,
  MEMORY_STIMULUS_OPTIONS,
  RESPONSE_DELAY_MS,
} from '../_memory'

const TACHISTOSCOPE_HINT =
  'Mirar al centro de la pantalla, identificar los estímulos que aparecen durante un instante y seleccionarlos en la cuadrícula.'

export default function TachistoscopeGame() {
  const [flashMs, setFlashMs] = useState(DEFAULT_FLASH_MS) // Milisegundos que dura el flash

  const stimulus = useStimulusManager(DEFAULT_MEMORY_STIMULUS)

  // Pantalla vacía breve y flash ultracorto de todos los estímulos en fila
  const buildSteps = useCallback(
    () => [
      { phase: 'gap', ms: FLASH_DELAY_MS },
      { phase: 'presenting', ms: flashMs },
      { phase: 'gap', ms: RESPONSE_DELAY_MS },
    ],
    [flashMs]
  )

  const game = useRecallGame({ stimulus, buildSteps })
  const { session } = game

  return (
    <GameShell
      title="Taquitoscopio"
      hint={TACHISTOSCOPE_HINT}
      session={session}
      stimulus={stimulus}
      speedControl={{
        id: 'tachistoscope-flash',
        label: 'Duración del flash',
        value: flashMs,
        steps: FLASH_MS_STEPS,
        unit: ' ms',
        disabled: !session.isIdle,
        onChange: setFlashMs,
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
          prefix="tachistoscope"
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
            sizePx={stimulus.sizePx}
            sizeLevel={stimulus.sizeLevel}
            instant
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
