import { useState, useEffect, use } from "react";
import EntryList from "./DashboardPageEntryList";
import "../components/DashboardPage.css"

type EntryInputs = {
  dayNumber: number
  latitude: number
  longitude: number
  hour: number
  minute: number
  tiltAngle: number
  panelAzimuth: number
}

type EntryResults = {
  solarAltitudeAngle: number
  zenithAngle: number
  azimuthAngle: number
  totalIrradiance: number
}

export type DashboardEntry = {
  _id: string
  userId: string
  inputs: EntryInputs
  results: EntryResults
  createdAt: string
  __v: number
}

function DashboardPage() {
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  useEffect( () => {
    async function fetchEntries(): Promise<void> {
      try {
        const response = await fetch(
          `http://localhost:4000/api/v1/userEntry/dashboard/?page=${page}&limit=${limit}`, 
          {
            credentials:"include",
          });

          const data = await response.json();
          setEntries(data.entries)
          setTotalPages(data.totalPages)
      } catch (error){
        console.error("Failed to fetch user entries:", error)
      }
    }
    fetchEntries();
  }, [page]);

  function handleNextPage(){
    if(page<totalPages){
        setPage(prevPage => prevPage + 1);
    }
  }

  function handlePrevPage(){
    if(page>1) {
      setPage(prevPage => prevPage -1);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="pagination-controls">
        <button className="pagination-btn" onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <span className="pagination-info"> Page {page} of {totalPages}</span>
        <button className="pagination-btn" onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
      <EntryList entries={entries}/>
    </div>
  )
}

export default DashboardPage;
