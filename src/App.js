import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import { Outlet } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

const queryClient = new QueryClient();

function App() {
  return (
    <>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <Outlet/>
      </QueryClientProvider>      
    </CookiesProvider>
    </>
  );
}

export default App;
