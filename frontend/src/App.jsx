import './App.css'
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Layout from "./components/Layout/index.jsx";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <AppRoutes/>
            </Layout>
        </BrowserRouter>
    )
}

export default App
