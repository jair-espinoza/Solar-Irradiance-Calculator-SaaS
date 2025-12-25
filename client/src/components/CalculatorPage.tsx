import { useState} from 'react';
import './CalculatorPage.css'
import type { FormEvent } from 'react'

type CalculationResults = {
  azimuthAngle: number;
  solarAltitudeAngle: number;
  zenithAngle: number;
  totalIrradiance: number;
}


export function CalculatorPage() {
  const [results, setResults] = useState<CalculationResults | null>(null);

  async function calculateIrradiance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formEl = new FormData(event.currentTarget);
    const data = Object.fromEntries(formEl.entries())

    const intData = {
        dayNumber: Number(data.dayNumber),
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        localStandardTimeMeridian: Number(data.localStandardTimeMeridian),
        hour: Number(data.hour),
        minute: Number(data.minute),
        tiltAngle: Number(data.tiltAngle),
        panelAzimuth: Number(data.panelAzimuth)
    }
    
    try {

      const response = await fetch('http://localhost:4000/api/v1/userEntry/calculate', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify(intData)
          }
        )

      const apiData = await response.json();

      const {azimuthAngle, solarAltitudeAngle, zenithAngle, totalIrradiance} = apiData.results;
      
      setResults({azimuthAngle, solarAltitudeAngle, zenithAngle, totalIrradiance});
      
      // clear form inputs
      event.currentTarget.reset();

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  // id match the backend
  return (
    <div className='calculator-page-container'>
      <div className='calculator-form-container'>
        <form onSubmit={calculateIrradiance} className='solar-calculator-form'>
          <div className='form-input-layout'>
            <div className='one-col-layout'>
              <div className='calculator-form-group'>
                <label htmlFor='dayNumber'>Day Number:</label>
                <input 
                  type='number'
                  placeholder='120 (April 30th)'
                  id='dayNumber'
                  name='dayNumber'
                  required
                  min={1}
                  max={365}
                />
              </div>
            </div>

            <div className='two-col-layout'>
              <div className='calculator-form-group'>
                <label htmlFor='latitude'>Latitude:</label>
                <input 
                  type='number'
                  placeholder='40.75'
                  name='latitude'
                  id='latitude'
                  required
                  min={-90}
                  max={90}
                />
              </div>

              <div className='calculator-form-group'>
                <label htmlFor='longitude'>Longitude:</label>
                <input 
                type='number'
                placeholder='-73.99'
                name='longitude'
                id='longitude'
                required
                min={-180}
                max={180}
              />
              </div>
            </div>

            <div className='calculator-form-group'>
              <label htmlFor='localStandardTimeMeridian'>Local Standard Time Meridian:</label>
              <input 
                type='number'
                placeholder='-75 (UTC-5, EST)'
                name='localStandardTimeMeridian'
                id='localStandardTimeMeridian'
                required
                min={-180}
                max={180}
              />
            </div>
            
            <div className='two-col-layout'>
            <div className='calculator-form-group'>
              <label htmlFor='hour'>Hour</label>
              <input 
              type='number'
              placeholder='14'
              name='hour'
              id='hour'
              required
              min={0}
              max={23}
            />
            </div>

            <div className='calculator-form-group'>

              <label htmlFor='minute'>Minute</label>
              <input 
                type='number'
                placeholder='30'
                name='minute'
                id='minute'
                required
                min={0}
                max={59}
              />
            </div>
            </div>

            <div className='two-col-layout'>
            <div className='calculator-form-group'>
              <label htmlFor='tiltAngle'>Tilt Angle</label>
              <input 
                type='number'
                placeholder='30'
                name='tiltAngle'
                id='tiltAngle'
                required
                min={0}
                max={90}
              />
            </div>

            <div className='calculator-form-group'>
              <label htmlFor='panelAzimuth'>Panel Azimuth</label>
              <input 
                type='number'
                placeholder='180'
                name='panelAzimuth'
                id='panelAzimuth'
                required
                min={0}
                max={360}
            />
            </div>
            </div>

          <button>Calculate</button>

          </div>
        </form>
      </div>
      {/* Renders after API call */}
      {results ? (
        <div className="render-results">
          <div className='result-group'>
            <p>Azimuth Angle: {results.azimuthAngle.toFixed(2)}</p>
            <p>Solar Altitude Angle: {results.solarAltitudeAngle.toFixed(2)}</p>
            <p>Zenith Angle: {results.zenithAngle.toFixed(2)}</p>
            <p>Total Solar Irradiance: {results.totalIrradiance.toFixed(2)}</p>
        </div>
      </div>
      ) : null}
    
    </div>
  )
}

export default CalculatorPage;