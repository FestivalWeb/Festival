// ... import 문들 ...
import Login from './components/auth/Login'; // 경로 확인!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... 다른 라우트들 ... */}
        
        {/* 로그인 페이지 연결 */}
        <Route path="/login" element={<Login />} />
        
        {/* ... */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;