import { useEffect, useState } from "react";
import { Form, Grid, Table, Icon, Modal } from 'semantic-ui-react'

const UserCRUD = (config) => {
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState([]);
    const [item, setItem] = useState({});

    const handleInputChange = (fieldName, value) => {
        setItem({
          ...item,
          [fieldName]: value
        });
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
    
    

    const createUser = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        };
    
        fetch(window.appConfig.BACKEND_USERS_URL + config.config.domain, requestOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then(() => {
                updateScreen(); 
            })
            .catch((error) => {
                openErrorModal(error.message);
                console.error("Error:", error);
            });
    };
    

const genders = [
    { key: 'm', text: 'Masculino', value: 'Masculino' },
    { key: 'f', text: 'Femenino', value: 'Femenino' },
]

    const updateScreen = () => {
        fetch(window.appConfig.BACKEND_USERS_URL+config.config.domain)  
            .then(
                (res) => {
                    if(!res.ok) throw new Error(res.status)
                    else return res.json()
                }
            ).then(
                (result) => {
                    setIsLoaded(true);
                    setData(result);
                },
                (error) => {
                    setIsLoaded(true);
                    openErrorModal(error.message);
                }
            )
    }

    const clearForm = () => {
        setItem({
            firstName: '',
            lastName: '',
            dni: '',
            gender: '',
            phone: ''
        });
    };


    useEffect(() => {
        updateScreen()
    }, [])

    const dniRegex = /^\d{8}[a-zA-Z]$/;

    const columnHeaders = [
        "Acciones", 
        "Nombre", 
        "Apellido", 
        "DNI/NIE",
        "Sexo", 
        "Num tfn"];

    const openErrorModal = (message) => {
        setError(message);
        setModalOpen(true);
    
        // Cierra la ventana modal automáticamente después de 5 segundos
        setTimeout(() => {
            setModalOpen(false);
            setError(null);
        }, 2000);
    };

    return (
        <>
        <Modal
            open={modalOpen}
            size="mini"
            onClose={() => {
                setModalOpen(false);
                setError(null);
            }}
        >
            <Modal.Header>Error</Modal.Header>
            <Modal.Content>
                <p>{error}</p>
            </Modal.Content>
        </Modal>
        
        <Grid celled>
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
                            {
                                isLoaded ? 
                                    data.map((data)=> {
                                        return (
                                            <Table.Row key={data.id}>
                                                <Table.Cell>
                                                <Icon
                                                    name="trash"
                                                    color="red"
                                                    link
                                                    onClick={() => deleteUser(data.id)}
                                                />
                                                <Icon
                                                    name="edit"
                                                    color="blue"
                                                    link
                                                    onClick={() => editUser(data)}
                                                />
                                                </Table.Cell>
                                                <Table.Cell>{data.firstName}</Table.Cell>
                                                <Table.Cell>{data.lastName}</Table.Cell>
                                                <Table.Cell>{data.dni}</Table.Cell>
                                                <Table.Cell>{data.gender}</Table.Cell>
                                                <Table.Cell>{data.phone}</Table.Cell>
                                            </Table.Row>
                                        )
                                    }) : 
                                    (
                                        <Table.Row>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell></Table.Cell>
                                        </Table.Row>
                                    )
                            }
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={6}>
                    <Form onSubmit={createUser}>
                        <Form.Input 
                            icon='edit' iconPosition='left'
                            label='Nombre' placeholder='Nombre'
                            value={item.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)} />
                        <Form.Input 
                            icon='edit' iconPosition='left'
                            label='Apellidos' placeholder='Apellidos'
                            value={item.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)} />
                        <Form.Input
                            icon='id card'
                            iconPosition='left'
                            label='DNI/NIE'
                            placeholder='DNI/NIE'
                            value={item.dni}
                            onChange={(e) => handleInputChange("dni", e.target.value)}
                            error={
                                item.dni && !item.dni.match(dniRegex) ? 
                                { content: 'El DNI debe tener 8 números y una letra.', pointing: 'above' } 
                                : null
                            }
                        />
                        <Form.Select 
                            options={genders}
                            label='Sexo' placeholder='sexo'
                            value={item.gender}
                            onChange={(e, { value }) => handleInputChange("gender", value)} />
                        <Form.Input 
                            icon='phone' iconPosition='left'
                            label='Número de teléfono' placeholder='Número de teléfono'
                            value={item.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)} />
                        <Form.Group inline>
                            {/* Botón para Guardar Cambios (visible en modo edición) */}
                            {isEditing && (
                                <Form.Button type="button" onClick={updateUser}>
                                    Guardar Cambios
                                </Form.Button>
                            )}
                            {/* Botón para Crear (visible en modo creación) */}
                            {!isEditing && (
                                <Form.Button type="button" onClick={createUser}>
                                    Crear
                                </Form.Button>
                            )}
                            {/* Botón para Limpiar (visible en modo edición) */}
                            {isEditing && (
                                <Form.Button type="button" onClick={clearForm}>
                                    Limpiar
                                </Form.Button>
                            )}
                        </Form.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        </>
    );
}

export default UserCRUD;