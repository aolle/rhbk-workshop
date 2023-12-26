import Keycloak from "keycloak-js";
import { useEffect, useState } from "react";
import { Button, Icon, Grid } from 'semantic-ui-react';

const roleToIcon = {
  "padel-users-admin": "user secret",
  "padel-player": "user",
  // Agrega más mapeos según sea necesario
};

const kc = new Keycloak('/keycloak.json');

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);  // Guarda los roles completos

  useEffect(() => {
    kc.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
      .then(authenticated => {
        setAuthenticated(authenticated);
        if (authenticated) {
          setUsername(kc.tokenParsed?.preferred_username);
          const allRoles = kc.tokenParsed.realm_access?.roles || [];
          const padelRoles = allRoles.filter(role => role.startsWith('padel'));
          setRoles(padelRoles);  // Guarda solo los roles relevantes
        }
      });
  }, []);

  const handleLogin = () => kc.login();
  const handleLogout = () => kc.logout();

  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column verticalAlign="middle">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <span style={{ marginRight: 20 }}>Signed in as <b>{username || "Guest"}</b></span>
            {authenticated ? (
              <Button onClick={handleLogout} color="red" size="small">
                <Icon name="sign-out" /> Logout
              </Button>
            ) : (
              <Button onClick={handleLogin} color="green" size="small">
                <Icon name="sign-in" /> Login
              </Button>
            )}
          </div>
          <div>
            {roles.length > 0 && (
              <div>
                <strong>Roles:</strong> {roles.map((role, index) => (
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
