// AppLayout.jsx
import React from 'react';
import { Outlet } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import UserProfile from "../UserProfile"; // Asegúrate de que la ruta sea correcta

const AppLayout = () => {
    return (
        <Grid padded>
            <Grid.Row>
                <Grid.Column width={16}>
                    <UserProfile/>  
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Outlet />  
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

export default AppLayout;
