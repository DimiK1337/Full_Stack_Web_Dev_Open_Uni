
import FavoriteIcon from '@mui/icons-material/Favorite';

import type { HealthCheckEntry } from '../../../types';
import { HealthCheckRating } from '../../../types';

// Components
import BaseEntry from './BaseEntry';
import BorderBox from '../../ui/BorderBox';

interface Props {
  entry: HealthCheckEntry;
}

const HealthCheckEntryDetails = ({ entry }: Props) => {
  const getHealthIcon = () => {
    switch (entry.healthCheckRating) {
      case HealthCheckRating.Healthy:
        return <FavoriteIcon style={{ color: 'green' }}/>;
      case HealthCheckRating.LowRisk:
        return <FavoriteIcon style={{ color: 'yellow' }}/>;
      case HealthCheckRating.HighRisk:
        return <FavoriteIcon style={{ color: 'orange' }}/>;
      case HealthCheckRating.CriticalRisk:
        return <FavoriteIcon style={{ color: 'red' }}/>;
    }
  };

  return (
    <BorderBox>
      <BaseEntry entry={entry}/>
      {getHealthIcon()}
    </BorderBox>
  );
};


export default HealthCheckEntryDetails;