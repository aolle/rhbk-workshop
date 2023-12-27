// AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import UserProfile from '../UserProfile';
import AppMenu from '../menu/AppMenu';

const AppLayout = () => {
    return (
        <Grid style={{ borderBottom: '1px solid #ddd', padding: '1rem 0' }}> {/* Estilos para la fila superior */}
            <Grid.Row>
                <Grid.Column width={10}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <UserProfile />  
                    </div>
                </Grid.Column>
                <Grid.Column width={6}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
                        <AppMenu /> 
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Outlet />  
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default AppLayout;
