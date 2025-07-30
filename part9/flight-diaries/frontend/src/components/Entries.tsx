import type { NonSensitiveDiaryEntry } from '../types';
import Entry from './Entry';

interface EntriesProps {
  entries: NonSensitiveDiaryEntry[]
}

const Entries = ({ entries }: EntriesProps) => {
  return (
    <div>
      <h1>Diary Entries</h1>
      {entries.map((e, idx) => <>
        {idx === 0 && <hr/>}
        <Entry entry={e}/>
        {(idx <= entries.length - 1) && <hr/>}
      </>)}
    </div>
  )
};


export default Entries