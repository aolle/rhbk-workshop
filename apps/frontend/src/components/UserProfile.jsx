import React from 'react';
import { Button, Icon, Grid } from 'semantic-ui-react';
import { useAuth } from './AuthContext';

// Mapeo de roles a nombres de íconos de Semantic UI
const roleToIcon = {
  "padel-users-admin": "user secret",
  "padel-player": "user",
};

const UserProfile = () => {
  const { authenticated, username, roles, login, logout } = useAuth();

  // Filtra los roles que comienzan con "padel"
  const padelRoles = roles.filter(role => role.startsWith('padel'));

  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column verticalAlign="middle">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <span style={{ marginRight: 20 }}>Signed in as <b>{username || "Guest"}</b></span>
            {authenticated ? (
              <Button onClick={logout} color="red" size="small">
                <Icon name="sign-out" /> Logout
              </Button>
            ) : (
              <Button onClick={login} color="green" size="small">
                <Icon name="sign-in" /> Login
              </Button>
            )}
          </div>
          <div>
            {padelRoles.length > 0 && (
              <div>
                <strong>Roles:</strong> {padelRoles.map((role, index) => (
                  <Icon key={index} name={roleToIcon[role] || "question circle"} title={role} />
                ))}
              </div>
            )}
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default UserProfile;
