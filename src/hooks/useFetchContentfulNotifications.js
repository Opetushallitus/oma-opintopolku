import { useEffect, useState } from 'react';

export function useFetchContentfulNotifications() {
  console.log("FETCH BACKEND")
  const [hairiotiedotteet, setHairiotiedotteet] = useState([]);

  useEffect(() => {
    async function fetchHairiotiedotteet() {
      const url = '/oma-opintopolku/notifications'
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log({json})
        setHairiotiedotteet(json)
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchHairiotiedotteet()
  }, [])

  return hairiotiedotteet
}
