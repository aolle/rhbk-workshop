// AppMenu.jsx
import React from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AppMenu = () => {
  const { roles } = useAuth();

  const isAdmin = roles.includes('padel-users-admin');
  const isUser = roles.includes('padel-player'); 

  if (isAdmin || isUser) {
    return (
      <Menu borderless>
        {isAdmin && (
          <Menu.Item as={Link} to="/users">
            <Button color="blue" size="small">
              <Icon name="users" /> Usuarios
            </Button>
          </Menu.Item>
        )}
        {isUser && (
          <Menu.Item as={Link} to="/matches">
            <Button color="blue" size="small">
              <Icon name="soccer" /> Partidos
            </Button>
          </Menu.Item>
        )}
      </Menu>
    );
  } else {
    return null; // No renderiza nada si no es admin ni user
  }
};

export default AppMenu;
