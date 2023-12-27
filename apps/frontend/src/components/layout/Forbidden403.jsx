// Forbidden403.jsx
import React from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';

const Forbidden403 = () => {
  return (
    <Grid textAlign='center' verticalAlign='middle'>
      <Grid.Column>
        <Header as='h2' color='red' textAlign='center'>
          <Icon name='ban' />
          Access Forbidden
        </Header>
        <p style={{ fontSize: '1.2em' }}>
          You do not have permission to access this page. Please contact the administrator if you believe this is an error.
        </p>
      </Grid.Column>
    </Grid>
  );
};

export default Forbidden403;
