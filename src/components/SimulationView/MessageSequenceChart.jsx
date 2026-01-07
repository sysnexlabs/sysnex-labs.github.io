import React, { useEffect, useState, useRef } from 'react'
import './MessageSequenceChart.css'

/**
 * Message Sequence Chart (MSC) Component
 * 
 * Visualizes the charging protocol as a Message Sequence Chart
 * showing interactions between User, Charge Controller, and Battery
 */
export default function MessageSequenceChart({ isRunning }) {
  const [messages, setMessages] = useState([])
  const timeoutRefs = useRef([])

  useEffect(() => {
    if (!isRunning) {
      // Clear all timeouts and reset messages
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId))
      timeoutRefs.current = []
      setMessages([])
      return
    }

    // Define MSC messages for charging protocol
    const mscMessages = [
      { time: 500, from: 0, to: 1, label: 'Plug In Detected' },
      { time: 1000, from: 1, to: 2, label: 'Initialize Precharge' },
      { time: 1500, from: 2, to: 1, label: 'Ready for Charging' },
      { time: 2000, from: 1, to: 2, label: 'Start CC Phase' },
      { time: 2500, from: 2, to: 1, label: 'Voltage Status' },
      { time: 3000, from: 1, to: 2, label: 'Switch to CV Phase' },
      { time: 3500, from: 2, to: 1, label: 'Current Status' },
      { time: 4000, from: 2, to: 1, label: 'Charging Complete' },
      { time: 4500, from: 1, to: 0, label: 'Notify User' }
    ]

    // Create messages with delays and store timeout IDs
    mscMessages.forEach((msg, index) => {
      const timeoutId = setTimeout(() => {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m.id === index)) return prev
          return [...prev, { ...msg, id: index }]
        })
      }, msg.time)
      timeoutRefs.current.push(timeoutId)
    })

    return () => {
      // Cleanup all timeouts
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId))
      timeoutRefs.current = []
    }
  }, [isRunning])

  const participants = ['User', 'Charge Controller', 'Battery']

  return (
    <div className="msc-section">
      <h3>Message Sequence Chart - Charging Protocol</h3>
      <div className="msc-diagram">
        <div className="msc-participants">
          {participants.map((participant, index) => (
            <div key={index} className="msc-participant">
              <div className="msc-box">{participant}</div>
              <div className="msc-lifeline"></div>
            </div>
          ))}
        </div>
        <div className="msc-messages-container">
          {messages.map((message, index) => {
            const fromIndex = message.from
            const toIndex = message.to
            const isRight = toIndex > fromIndex
            const leftPercent = (fromIndex * 33.33) + 16.67
            const widthPercent = Math.abs(toIndex - fromIndex) * 33.33

            return (
              <div
                key={message.id}
                className="msc-message"
                style={{
                  top: `${(message.time / 50)}px`,
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="msc-label">{message.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

