import { useContext } from 'react';
import RepairsContext from '../context/RepairsContext';

export default function useRepairs() {
  return useContext(RepairsContext);
}
