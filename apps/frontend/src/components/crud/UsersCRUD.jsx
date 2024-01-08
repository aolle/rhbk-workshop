import { useEffect, useState } from "react";
import { Form, Grid, Table, Icon, Modal, Pagination } from 'semantic-ui-react'
import { useAuth } from '../AuthContext';
import { getAll, createUser } from './UserService'; 

const UserCRUD = (config) => {
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10); 
    const [data, setData] = useState([]);
    const [item, setItem] = useState({});

    const { token } = useAuth();

    const handleInputChange = (fieldName, value) => {
        setItem({
          ...item,
          [fieldName]: value
        });
      };
    
    const fetchUsers = async () => {
        try {
            const users = await getAll(config.config.domain, token, currentPage, pageSize);
            setData(users);
            setIsLoaded(true);
        } catch (error) {
            setIsLoaded(true);
            setError(error.message);
            openErrorModal(error.message);
        }
    };
      
    const deleteUser = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };
    
        fetch(window.appConfig.BACKEND_USERS_URL+ config.config.domain + "/" + id, requestOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                // Actualiza la pantalla después de eliminar el elemento
                updateScreen();
            })
            .catch((error) => {
                openErrorModal(error.message);
                console.error("Error:", error);
            });
    };

    const editUser = (selectedData) => {
        setItem(selectedData);
        setIsEditing(true);
    };
    
    
    const updateUser = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        };
    
        fetch(window.appConfig.BACKEND_USERS_URL + config.config.domain + "/" + item.id, requestOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                updateScreen();
            })
            .catch((error) => {
                openErrorModal(error.message);
                console.error("Error:", error);
            });
    };
    
    

    const handleCreateUser = async () => {
        try {
            await createUser(config.config.domain, token, item);
            fetchUsers();
        } catch (error) {
            // Manejo de errores
            setError(error.message);
            openErrorModal(error.message);
        }
    };
    
    
    const updateScreen = () => {
        fetchUsers();
    }

    const clearForm = () => {
        setItem({
            username: '',
            name: '',
            year: '',
            level: ''
        });
    };


    useEffect(() => {
        updateScreen()
    }, [currentPage, pageSize]);

    const columnHeaders = [
        "Acciones", 
        "Nombre de Usuario", 
        "Nombre Completo", 
        "Año de Nacimiento",
        "Nivel"];
        
    const openErrorModal = (message) => {
        setError(message);
        setModalOpen(true);
    
        setTimeout(() => {
            setModalOpen(false);
            setError(null);
        }, 2000);
    };

    return (
            <>
                <Modal open={modalOpen} size="mini" onClose={() => setModalOpen(false)}>
                    <Modal.Header>Error</Modal.Header>
                    <Modal.Content>
                        <p>{error}</p>
                    </Modal.Content>
                </Modal>
                
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <Table celled padded>
                                <Table.Header>
                                    <Table.Row>
                                        {columnHeaders.map((header, index) => (
                                            <Table.HeaderCell key={index}>{header}</Table.HeaderCell>
                                        ))}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {isLoaded ? data.map((user) => (
                                        <Table.Row key={user.id}>
                                            <Table.Cell>
                                                {/* Acciones para cada usuario */}
                                                <Icon name="trash" color="red" link onClick={() => deleteUser(user.id)} />
                                                <Icon name="edit" color="blue" link onClick={() => editUser(user)} />
                                            </Table.Cell>
                                            <Table.Cell>{user.username}</Table.Cell>
                                            <Table.Cell>{user.name}</Table.Cell>
                                            <Table.Cell>{user.year}</Table.Cell>
                                            <Table.Cell>{user.level}</Table.Cell>
                                        </Table.Row>
                                    )) : (
                                        <Table.Row>
                                            {/* Celdas vacías si no hay datos */}
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                            <Pagination
                                defaultActivePage={1}
                                totalPages={Math.ceil(100 / pageSize)} 
                                onPageChange={(e, { activePage }) => setCurrentPage(activePage - 1)}
                            />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Form onSubmit={isEditing ? updateUser : createUser}>
                                {/* Campos del formulario */}
                                <Form.Input label='Nombre de Usuario' placeholder='Nombre de Usuario' value={item.username || ''} onChange={(e) => handleInputChange("username", e.target.value)} />
                                <Form.Input label='Nombre Completo' placeholder='Nombre Completo' value={item.name || ''} onChange={(e) => handleInputChange("name", e.target.value)} />
                                <Form.Input label='Año de Nacimiento' placeholder='Año de Nacimiento' type="number" value={item.year || ''} onChange={(e) => handleInputChange("year", e.target.value)} />
                                <Form.Input label='Nivel' placeholder='Nivel' type="number" value={item.level || ''} onChange={(e) => handleInputChange("level", e.target.value)} />
                                
                                <Form.Group inline>
                                    {isEditing && <Form.Button type="button" onClick={updateUser}>Guardar Cambios</Form.Button>}
                                    {!isEditing && <Form.Button type="button" onClick={handleCreateUser}>Crear</Form.Button>}
                                    {isEditing && <Form.Button type="button" onClick={clearForm}>Limpiar</Form.Button>}
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        );
    }

export default UserCRUD;