import MainLayout from '@/layout/MainLayout'
import Home from '@/pages/Home'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AccountManagement from '@/pages/SystemManagement/AccountManagement'
import ProtectedRoute from './ProtectedRoute'
import NoFoundPage from '@/pages/404'
import Account from '@/pages/Account/Account'
import Login from '@/pages/user/Login/Login'
import Register from '@/pages/user/Register/Register'
import VerifyEmail from '@/pages/user/VerifyEmail/VerifyEmail'
import PermissionManagement from '@/pages/PermissionManagement/PermissionManagement'
import RoleManagement from '@/pages/RoleManagement/RoleManagement';
import GradeLevelsManagement from '@/pages/GradeLevelsManagement/GradeLevelsManagement';
import ExamTypesManagement from '@/pages/ExamTypesManagement/ExamTypesManagement';
import SubjectsManagement from '@/pages/SubjectsManagement/SubjectsManagement';
import ExamManagement from '@/pages/ExamManagement/ExamManagement';
import UserManagement from '@/pages/UserManagement/UserManagement';

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path='user' >
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='verify-email' element={<VerifyEmail />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<MainLayout > </MainLayout>} >
            <Route index element={<Home />} />
          
            <Route path='system' >
              <Route path='account-management' element={<AccountManagement />} />
              <Route path='role-management' element={<RoleManagement />} />
              <Route path='permission-management' element={<PermissionManagement />} />
              <Route path='grade-levels-management' element={<GradeLevelsManagement />} />
              <Route path='exam-types-management' element={<ExamTypesManagement />} />
              <Route path='subjects-management' element={<SubjectsManagement />} />
              <Route path='exams-management' element={<ExamManagement />} />
              <Route path='user-management' element={<UserManagement />} />
            </Route>
            <Route path='/account' element={<Account />} />
            <Route path='/*' element={<NoFoundPage />} />
          </Route>
        </Route>
      </Routes>
  </Router>
  )
}

export default RouterComponent




