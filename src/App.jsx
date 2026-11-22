import { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import GameScreen from './components/GameScreen.jsx'
import EndScreen from './components/EndScreen.jsx'
import { getBest, saveBest } from './lib/storage.js'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [runId, setRunId] = useState(0)
  const [result, setResult] = useState(null)
  const [best, setBest] = useState(getBest)

  const start = () => {
    setRunId((id) => id + 1)
    setScreen('game')
  }

  const finish = (runResult) => {
    saveBest(runResult.decisions)
    setBest(getBest())
    setResult(runResult)
    setScreen('end')
  }

  return (
    <main className="mx-auto max-w-[560px] px-4 pt-6 pb-12">
      {screen === 'start' && <StartScreen best={best} onStart={start} />}
      {screen === 'game' && <GameScreen key={runId} onFinish={finish} />}
      {screen === 'end' && <EndScreen result={result} best={best} onRestart={start} />}
    </main>
  )
}
