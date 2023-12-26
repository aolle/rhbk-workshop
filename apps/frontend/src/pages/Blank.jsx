import DataView from "../components/dashboard/DataView";
import config from "../config/app.home.config.json"
import { Grid } from 'semantic-ui-react'

const Blank = () => {
    return (
        <div>
            <Grid celled>
                <Grid.Row>
                    <Grid.Column textAlign="center" width={4}>
                        <DataView config={config.cars} />
                    </Grid.Column>
                    <Grid.Column textAlign="center" width={4}>
                        <DataView config={config.money} />
                    </Grid.Column>
                    <Grid.Column textAlign="center" width={4}>
                        <DataView config={config.cars} />
                    </Grid.Column>
                    <Grid.Column textAlign="center" width={4}>
                        <DataView config={config.money} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export default Blank;