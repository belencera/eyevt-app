'use client'

import { useState } from 'react'
import {
  GameShell,
  OptionPicker,
  SessionSummary,
  StimulusGrid,
  StimulusExtraControls,
  useStimulusManager,
} from '../_shared'
import {
  LevelStatus,
  PairsBoard,
  useMemoryPairs,
  CARD_SIZE_FACTOR,
  DEFAULT_MEMORY_STIMULUS,
  DEFAULT_PREVIEW_SECONDS,
  MEMORY_STIMULUS_OPTIONS,
  PAIRS_SHORTCUTS_HINT,
  PREVIEW_OPTIONS,
  formatPreviewBadge,
} from '../_memory'

const MEMORY_PAIRS_HINT =
  'Memorizar la posición de las cartas y levantarlas de dos en dos hasta encontrar todas las parejas.'

export default function MemoryPairsGame() {
  const [previewSeconds, setPreviewSeconds] = useState(DEFAULT_PREVIEW_SECONDS) // Segundos con las cartas boca arriba

  const stimulus = useStimulusManager(DEFAULT_MEMORY_STIMULUS)
  const game = useMemoryPairs({ stimulus, previewSeconds })
  const { session } = game

  return (
    <GameShell
      title="Memoria de parejas"
      hint={MEMORY_PAIRS_HINT}
      session={session}
      stimulus={stimulus}
      speedContent={
        <OptionPicker
          id="memory-pairs-preview"
          label="Vista previa"
          value={previewSeconds}
          options={PREVIEW_OPTIONS}
          disabled={!session.isIdle}
          onChange={setPreviewSeconds}
          formatBadge={formatPreviewBadge}
        />
      }
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
          prefix="memory-pairs"
          showSize={false}
        />
      }
      shortcuts={[]}
      shortcutsHint={PAIRS_SHORTCUTS_HINT}
    >
      {session.started && game.deck.length > 0 && (
        <>
          <LevelStatus level={game.level} filled={game.pairsInRound} total={game.totalPairs} />

          <PairsBoard
            // Tablero nuevo en cada ronda: las cartas emparejadas de la anterior no se ven darse la vuelta
            key={game.roundId}
            type={stimulus.stimulusType}
            deck={game.deck}
            columns={game.columns}
            cardPx={stimulus.sizePx * CARD_SIZE_FACTOR}
            faceUp={game.faceUp}
            matched={game.matched}
            mismatch={game.mismatch}
            disabled={game.isBoardLocked}
            isPaused={session.isPaused}
            onFlip={game.flip}
            onNext={game.isComplete ? game.nextRound : undefined}
          />
        </>
      )}

      <SessionSummary {...game.summary} />
    </GameShell>
  )
}
