'use client'

import { useState } from 'react'
import {
  GameShell,
  LevelStatus,
  ModeSelector,
  OptionPicker,
  SessionSummary,
  StimulusGrid,
  StimulusExtraControls,
  useStimulusManager,
  IconEye,
  IconRotate,
  IconTarget,
} from '../_shared'
import { RepeatsBoard } from './components/RepeatsBoard'
import { useWhichRepeatsGame } from './hooks/useWhichRepeatsGame'
import {
  CARD_SIZE_FACTOR,
  DEFAULT_ROTATION_SECONDS,
  DEFAULT_VISIBLE_SECONDS,
  DEFAULT_WHICH_REPEATS_MODE,
  DEFAULT_WHICH_REPEATS_STIMULUS,
  ROTATION_SPEED_OPTIONS,
  VISIBLE_SECONDS_OPTIONS,
  WHICH_REPEATS_MODES,
  WHICH_REPEATS_SHORTCUTS_HINT,
  WHICH_REPEATS_STIMULUS_OPTIONS,
} from './data/constants'

const WHICH_REPEATS_HINT =
  'Encontrar y pulsar el único estímulo que aparece en las dos tarjetas. Cada acierto añade un estímulo más a cada tarjeta.'

const MODE_ICONS = {
  normal: <IconTarget />,
  memory: <IconEye />,
  rotating: <IconRotate />,
}

const MODE_OPTIONS = WHICH_REPEATS_MODES.map((m) => ({ ...m, icon: MODE_ICONS[m.value] }))

export default function WhichRepeatsGame() {
  const [mode, setMode] = useState(DEFAULT_WHICH_REPEATS_MODE) // 'normal' | 'memory' | 'rotating'
  const [visibleSeconds, setVisibleSeconds] = useState(DEFAULT_VISIBLE_SECONDS)
  const [rotationSeconds, setRotationSeconds] = useState(DEFAULT_ROTATION_SECONDS)

  const stimulus = useStimulusManager(DEFAULT_WHICH_REPEATS_STIMULUS)
  const game = useWhichRepeatsGame({ stimulus, mode, visibleSeconds })
  const { session } = game

  // Opción propia de cada modo: tiempo visible (con memoria) o velocidad de giro (girando)
  const modeOption =
    mode === 'memory' ? (
      <OptionPicker
        id="which-repeats-visible"
        label="Tiempo visible"
        value={visibleSeconds}
        options={VISIBLE_SECONDS_OPTIONS}
        disabled={!session.isIdle}
        onChange={setVisibleSeconds}
      />
    ) : mode === 'rotating' ? (
      <OptionPicker
        id="which-repeats-rotation"
        label="Velocidad de giro"
        value={rotationSeconds}
        options={ROTATION_SPEED_OPTIONS}
        disabled={!session.isIdle}
        onChange={setRotationSeconds}
      />
    ) : null

  return (
    <GameShell
      title="¿Cuál se repite?"
      hint={WHICH_REPEATS_HINT}
      session={session}
      stimulus={stimulus}
      gameControls={
        <ModeSelector
          id="which-repeats-mode"
          label="Modo de juego"
          description={WHICH_REPEATS_MODES.find((m) => m.value === mode)?.description}
          value={mode}
          options={MODE_OPTIONS}
          disabled={!session.isIdle}
          onChange={setMode}
        />
      }
      speedContent={modeOption}
      stimulusGrid={
        <StimulusGrid
          value={stimulus.stimulusType}
          options={WHICH_REPEATS_STIMULUS_OPTIONS}
          disabled={!session.isIdle}
          onChange={stimulus.handleStimulusChange}
        />
      }
      extraControls={
        <StimulusExtraControls
          stimulus={stimulus}
          disabled={!session.isIdle}
          prefix="which-repeats"
          showSize={false}
        />
      }
      shortcuts={[]}
      shortcutsHint={WHICH_REPEATS_SHORTCUTS_HINT}
    >
      {session.started && game.round && (
        <>
          <LevelStatus level={game.count} />

          <RepeatsBoard
            key={game.round.commonKey + game.count}
            type={stimulus.stimulusType}
            round={game.round}
            cardPx={stimulus.sizePx * CARD_SIZE_FACTOR}
            selected={game.selected}
            isAnswered={game.isAnswered}
            isVisible={game.isVisible}
            rotationSeconds={mode === 'rotating' ? rotationSeconds : null}
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
