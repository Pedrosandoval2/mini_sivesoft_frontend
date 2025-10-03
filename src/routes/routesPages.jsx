import Layout from '@/components/Layout';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

export const RoutesPages = ({ routes, typeRoutes }) => {

    return (
        <Router>
            <Layout isActive={typeRoutes === 'private'}>
            <Routes>
                {routes.map(({ path, component: Component }) => (
                    <Route
                        key={path}
                        path={path}
                        element={<Component />}
                    />
                ))}

                {typeRoutes && (
                    <Route
                        path="*"
                        element={
                            <Navigate to={typeRoutes === 'private' ? '/select-company' : '/login'} />
                        }
                    />
                )}
            </Routes>
            </Layout>
        </Router>
    );
};
