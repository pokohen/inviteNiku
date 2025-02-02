import { useEffect, useState } from 'react'
import './App.css'
import InvitedMain from './conpoments/InvitedMain'
import Cookies from 'js-cookie'
import InvitedDetail from './conpoments/InvitedDetail'

function App() {
  const [invited, setInvited] = useState(false)
  const [invitedName, setInvitedName] = useState('');

  useEffect(()=>{
    const invitedName = Cookies.get('invited');
    if (invitedName) {
      setInvited(true)
      setInvitedName(invitedName)
    }
  }, [])

  return (
    <>
      {invited ? <InvitedDetail invitedName={invitedName}></InvitedDetail> : <InvitedMain></InvitedMain>}
    </>
  )
}

export default App
