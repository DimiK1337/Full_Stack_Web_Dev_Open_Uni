import type { NonSensitiveDiaryEntry } from "../types";

interface EntryProps {
  entry: NonSensitiveDiaryEntry
}

const Entry = ({ entry }: EntryProps) => {
  return (
    <div>
      <p>Weather: {entry.weather}</p>
      <p>Visibility: {entry.visibility}</p>
      <p>Date: {entry.date}</p>
    </div>
  );
};

export default Entry