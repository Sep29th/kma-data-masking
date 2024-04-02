import { Route, Router } from 'electron-router-dom'
import Login from '../pages/Login'
import PublicLayout from '../components/layouts/PublicLayout'

export const ConfigRoute = () => {
  return (
    <Router
      main={
        <Route element={<PublicLayout />} children={<Route path={'/'} element={<Login />} />} />
      }
    />
  )
}
