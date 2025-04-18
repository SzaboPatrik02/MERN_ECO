import { useEffect, useState } from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

import ChallengeDetails from '../components/ChallengeDetails'
import WorkoutDetails from '../components/WorkoutDetails'
import EventDetails from '../components/EventDetails'

const Home = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setData(data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="page">
      <div>
        {data && data.map((d) => {
          if (d.type === 'challenge') {
            return<ChallengeDetails key={d._id} challenge={d} isMainPage={true}/>
          } else if (d.type === 'workout') {
            return <WorkoutDetails key={d._id} workout={d} isMainPage={true}/>
          } else if (d.type === 'sportevent') {
            return <EventDetails key={d._id} event={d} isMainPage={true}/>
          }
          //return null
        })
        }
      </div>
    </div>
  )
}

export default Home