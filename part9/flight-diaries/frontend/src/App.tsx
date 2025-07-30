import type { NonSensitiveDiaryEntry } from './types';

import { useState, useEffect } from 'react';

import { getAllDiaryEntries } from './services/diaryService';

// Components
import AddEntry from './components/AddEntry';
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
      <AddEntry setDiaryEntries={setDiaryEntries}/>
      <hr />
      <Entries entries={diaryEntries} />
    </div>
  )
};

export default App
