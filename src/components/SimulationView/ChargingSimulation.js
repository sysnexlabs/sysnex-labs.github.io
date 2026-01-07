/**
 * ChargingSimulation Class
 * 
 * Physics-based battery charging simulation with CC-CV (Constant Current - Constant Voltage) charging
 * Based on the implementation from nexsim-validation.html
 */
export default class ChargingSimulation {
  constructor(options = {}) {
    // Validate and set parameters with defaults
    this.batteryCapacity = Math.max(1, options.batteryCapacity || 75) // kWh, minimum 1
    this.maxVoltage = Math.max(100, options.maxVoltage || 420) // V, minimum 100
    this.minVoltage = Math.max(50, Math.min(options.minVoltage || 320, this.maxVoltage * 0.8)) // V, reasonable bounds
    this.maxCurrent = Math.max(1, options.maxCurrent || 140) // A, minimum 1
    this.chargerPower = Math.max(1, options.chargerPower || 50) // kW, minimum 1
    this.ccToCV = Math.max(50, Math.min(95, options.ccToCV || 80)) // % SOC, between 50-95
    this.maxTemperature = options.maxTemperature || 60 // °C, safety limit
    this.initialSOC = Math.max(0, Math.min(100, options.initialSOC || 20)) // %, 0-100

    this.reset()
  }

  reset() {
    this.soc = this.initialSOC // %
    this.voltage = this.minVoltage + (this.maxVoltage - this.minVoltage) * (this.soc / 100)
    this.current = this.maxCurrent
    this.temperature = 25 // °C
    this.energyDelivered = 0 // kWh
    this.time = 0 // seconds
    this.phase = 'idle'
  }

  // CC-CV charging physics
  step(dt) {
    // Validate delta time
    if (!dt || dt <= 0 || dt > 10) {
      console.warn(`Invalid delta time: ${dt}, using 1 second`)
      dt = 1
    }

    // Check if already complete
    if (this.soc >= 100) {
      this.phase = 'Complete'
      this.current = 0
      this.voltage = this.maxVoltage
      return false // Simulation complete
    }

    this.time += dt

    if (this.soc < this.ccToCV) {
      // Constant Current Phase
      this.phase = 'CC'
      this.current = this.maxCurrent
      this.voltage = this.minVoltage + (this.maxVoltage - this.minVoltage) * (this.soc / 100)
    } else if (this.soc < 100) {
      // Constant Voltage Phase
      this.phase = 'CV'
      this.voltage = this.maxVoltage
      // Current tapers exponentially
      const progress = (this.soc - this.ccToCV) / (100 - this.ccToCV)
      this.current = Math.max(0, this.maxCurrent * Math.exp(-5 * progress))
    } else {
      this.phase = 'Complete'
      this.current = 0
      this.voltage = this.maxVoltage
      return false // Simulation complete
    }

    // Power calculation: P = V * I
    const power = (this.voltage * this.current) / 1000 // kW

    // Energy delivered: E = P * dt
    const energyStep = (power * dt) / 3600 // kWh
    this.energyDelivered += energyStep

    // Update SOC with bounds checking
    const currentCharge = (this.batteryCapacity * this.soc / 100) + energyStep
    this.soc = Math.min(100, Math.max(0, (currentCharge / this.batteryCapacity) * 100))

    // Temperature rise (simplified model) with safety limits
    const heatGeneration = power * 0.05 // 5% loss as heat
    this.temperature = Math.min(
      this.maxTemperature,
      Math.max(25, 25 + (this.soc - this.initialSOC) * 0.3 + heatGeneration)
    )

    // Safety check: stop if temperature exceeds limit
    if (this.temperature >= this.maxTemperature) {
      console.warn('Temperature limit reached, stopping simulation')
      return false
    }

    return true // Simulation continues
  }

  getPower() {
    return (this.voltage * this.current) / 1000 // kW
  }

  getPhase() {
    if (this.time < 5) return 'Idle'
    if (this.time < 10) return 'Precharge'
    if (this.phase === 'CC') return 'Constant Current'
    if (this.phase === 'CV') return 'Constant Voltage'
    return 'Complete'
  }

  getData() {
    return {
      soc: this.soc,
      voltage: this.voltage,
      current: this.current,
      temperature: this.temperature,
      phase: this.getPhase(),
      power: this.getPower(),
      energyDelivered: this.energyDelivered,
      time: this.time
    }
  }
}

