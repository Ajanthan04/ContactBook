import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import './index.css';

const AppToaster = Toaster.create({
    position: "top"
})

function App() {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newWebsite, setNewWebsite] = useState("")


    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => response.json() )
        .then((json) => setUsers(json))
    },[])

    function addUser() {
        const name = newName.trim();
        const email = newEmail.trim();
        const website = newWebsite.trim();

        if (name && email && website) {
            fetch("https://jsonplaceholder.typicode.com/users",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name,
                        email,
                        website
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8 "
                    }
                }
            ).then((response) => response.json() )
            .then(data => {
                setUsers([...users, data]);
                AppToaster.show({
                    message: "user added successfully",
                    intent: 'success',
                    timeout: 3000
                })
                setNewName("");
                setNewEmail("");
                setNewWebsite("");

            })
        }

    }

    function onChangeHandler(id, key, value) {
        setUsers((users) => {
            return users.map(user => {
                return user.id === id ? {...user, [key]: value } : user;
            })
        })
    }

    function updateUser(id) {
        const user = users.find((user) => user.id === id );
        fetch(`https://jsonplaceholder.typicode.com/users/10`,
                {
                    method: "PUT",
                    body: JSON.stringify(user),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8 "
                    }
                }
            )
        .then( response => response.json())    
        .then(data => {
                AppToaster.show({
                    message: "user updated successfully",
                    intent: 'success',
                    timeout: 3000
                })

        })

    }

    function deleteUser(id) {
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
        {
            method: "DELETE",
        })
        .then( response => response.json())    
        .then(data => {
                setUsers((users) => {
                    return users.filter(user => user.id !== id)
                })

                AppToaster.show({
                    message: "user deleted successfully",
                    intent: 'success',
                    timeout: 3000
                })

        })
    }

  return (
    <div className="App">
        <table className='bp4-html-table modifier' border={5} color='solid black'>
            <thead>
                <th><b>ID</b></th>
                <th><b>Name</b></th>
                <th><b>Email</b></th>
                <th><b>Website</b></th>
                <th><b>Action</b></th>
            </thead>
            <tbody>
                {users.map(user => 
                    <tr key={user.id}>
                        <td><b>{user.id}</b></td>
                        <td><EditableText onChange={value => onChangeHandler(user.id, 'name',  value)} value={user.name} /></td>
                        <td><EditableText onChange={value => onChangeHandler(user.id, 'email',  value)} value={user.email} /></td>
                        <td><EditableText onChange={value => onChangeHandler(user.id, 'website',  value)} value={user.website}/></td>
                        <td>
                            <Button intent='primary' onClick={() => updateUser(user.id)}>Update</Button>
                            &nbsp;
                            <Button intent='danger' onClick={() => deleteUser(user.id)} >Delete</Button>
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td>
                        <InputGroup
                            value={newName}
                            onChange={(e) => setNewName(e.target.value) }
                            placeholder='Enter Name...'
                        />
                    </td>
                    <td>
                        <InputGroup
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value) }
                            placeholder='Enter Email...'
                        />
                    </td>
                    <td>
                        <InputGroup
                            value={newWebsite}
                            onChange={(e) => setNewWebsite(e.target.value) }
                            placeholder='Enter Website...'
                        />
                    </td>
                    <td>
                        <Button intent='success' onClick={addUser}>Add User</Button>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
  );
}

export default App;