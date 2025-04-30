import { useEffect, useState } from 'react';
import { getLang } from '../utils';

export function useFetchContentfulNotifications() {
  const [hairiotiedotteet, setHairiotiedotteet] = useState([]);
  const userLang = getLang();

  useEffect(() => {
    async function fetchHairiotiedotteet() {
      const url = `/oma-opintopolku/notifications/${userLang}`
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setHairiotiedotteet(json)
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchHairiotiedotteet()
  }, [])

  return hairiotiedotteet
}
