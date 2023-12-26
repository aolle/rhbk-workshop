import { Outlet } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import UserProfile from "../UserProfile";

const AppLayout = () => {
    return (
        <Grid celled>
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