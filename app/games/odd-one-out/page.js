'use client'

import { useState } from 'react'
import {
  GameShell,
  LevelStatus,
  ModeSelector,
  SessionSummary,
  StimulusGrid,
  StimulusExtraControls,
  useStimulusManager,
  IconRandom,
  IconTarget,
  DEFAULT_POSITION_MODE,
  POSITION_MODES,
} from '../_shared'
import { OddOneBoard } from './components/OddOneBoard'
import { useOddOneGame } from './hooks/useOddOneGame'
import {
  DEFAULT_ODD_ONE_STIMULUS,
  ODD_ONE_SHORTCUTS_HINT,
  ODD_ONE_SIZE_FACTOR,
  ODD_ONE_STIMULUS_OPTIONS,
} from './data/constants'

const ODD_ONE_HINT =
  'Encontrar y pulsar el estímulo que tiene un detalle diferente. Cada acierto añade un estímulo más.'

const MODE_ICONS = {
  center: <IconTarget />,
  scattered: <IconRandom />,
}

const MODE_OPTIONS = POSITION_MODES.map((m) => ({ ...m, icon: MODE_ICONS[m.value] }))

export default function OddOneOutGame() {
  const [mode, setMode] = useState(DEFAULT_POSITION_MODE) // 'center' | 'scattered'

  const stimulus = useStimulusManager(DEFAULT_ODD_ONE_STIMULUS)
  const game = useOddOneGame({ stimulus, scattered: mode === 'scattered' })
  const { session } = game

  return (
    <GameShell
      title="Encuentra el diferente"
      hint={ODD_ONE_HINT}
      session={session}
      stimulus={stimulus}
      gameControls={
        <ModeSelector
          id="odd-one-out-mode"
          label="Modo de juego"
          description={POSITION_MODES.find((m) => m.value === mode)?.description}
          value={mode}
          options={MODE_OPTIONS}
          disabled={!session.isIdle}
          onChange={setMode}
        />
      }
      stimulusGrid={
        <StimulusGrid
          value={stimulus.stimulusType}
          options={ODD_ONE_STIMULUS_OPTIONS}
          disabled={!session.isIdle}
          onChange={stimulus.handleStimulusChange}
        />
      }
      extraControls={
        <StimulusExtraControls
          stimulus={stimulus}
          disabled={!session.isIdle}
          prefix="odd-one-out"
          showSize={false}
        />
      }
      shortcuts={[]}
      shortcutsHint={ODD_ONE_SHORTCUTS_HINT}
    >
      {session.started && game.round && (
        <>
          <LevelStatus level={game.count} />

          <OddOneBoard
            key={game.round.key + game.count}
            type={stimulus.stimulusType}
            items={game.round.items}
            oddIndex={game.round.oddIndex}
            positions={game.round.positions}
            stimulusPx={stimulus.sizePx * ODD_ONE_SIZE_FACTOR}
            selected={game.selected}
            disabled={game.phase !== 'responding'}
            isPaused={session.isPaused}
            onSelect={game.select}
            onNext={game.isAnswered ? game.nextRound : undefined}
          />
        </>
      )}

      <SessionSummary {...game.summary} />
    </GameShell>
  )
}
