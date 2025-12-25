import "../components/DashboardPageEntryList.css"
import { DashboardEntry } from "./DashboardPage";

type EntryListProps = {
  entries: DashboardEntry[]
}

function EntryList(props: EntryListProps) {
  return (
    <div className="entry-card-container">
      {props.entries.map(entry => (
        <div key={entry._id} className="entry-card">

          <div className="entry-header">
            <h3>Entry on {new Date(entry.createdAt).toLocaleString()}</h3>
          </div>
          <div className="entry-body">
            <div className="entry-input-container">
              <h4>Input</h4>
              <ul>
                <li>Day Number: {entry.inputs.dayNumber}</li>
                <li>Latitude: {entry.inputs.latitude}</li>
                <li>Longitude: {entry.inputs.longitude}</li>
                <li>Hour: {entry.inputs.hour}</li>
                <li>Minute: {entry.inputs.minute}</li>
                <li>Tilt Angle: {entry.inputs.tiltAngle}</li>
                <li>Panel Azimuth: {entry.inputs.panelAzimuth}</li>
              </ul>
            </div>

            <div className="entry-result-container">
              <h4>Results</h4>
              <ul>
                <li>Azimuth Angle: {entry.results.azimuthAngle.toFixed(2)}</li>
                <li>Solar Altitude Angle: {entry.results.solarAltitudeAngle.toFixed(2)}</li>
                <li>Zenith Angle: {entry.results.zenithAngle.toFixed(2)}</li>
                <li>Total Irradiance: {entry.results.totalIrradiance.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EntryList;
