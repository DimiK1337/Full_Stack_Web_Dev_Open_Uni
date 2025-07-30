import type { NonSensitiveDiaryEntry } from './types';

import { useState, useEffect } from 'react';

import { getAllDiaryEntries } from './services/diaryService';

// Components
import Entries from './components/Entries';

const App = () => {

  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([])

  useEffect(() => {
    const fetchDiaries = async () => {
      const res = await getAllDiaryEntries();
      setDiaryEntries(res)
    }
    fetchDiaries()
  }, [])

  return (
    <div>
      <h1>Diary Entries</h1>
      <div>
        <Entries entries={diaryEntries}/>
      </div>
    </div>
  )
};

export default App
