import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";
import axios from "axios";
import "./tasklist.css";

const TaskList = () => {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({ name: '', description: '', status: 'Pending' });

  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userId}/tasks/`);
      setTasks(response.data);
    } catch (error) {
      console.error("Ошибка при получении задач:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  const handleShowCreate = () => setShowCreate(true);
  const handleCloseCreate = () => {
    setShowCreate(false);
    setNewTask({ name: '', description: '', status: 'Pending' });
  };

  const handleShowEdit = (task) => {
    setCurrentTask(task);
    setShowEdit(true);
  };

  const handleCloseEdit = () => setShowEdit(false);

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:8080/users/${userId}/tasks/`, newTask);
      fetchTasks();
      handleCloseCreate();
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8080/users/${userId}/tasks/${currentTask.id}`, currentTask);
      fetchTasks();
      handleCloseEdit();
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await axios.delete(`http://localhost:8080/users/${userId}/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error("Ошибка при удалении задачи:", error);
      }
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="task-list__wrapper">
      <h3>Your Tasks</h3>
      <Button className="text-muted px-0" variant="link" onClick={handleLogout}>
        LOGOUT
      </Button>
      <Button variant="primary" onClick={handleShowCreate}>Add Task</Button>
      <ListGroup>
        {tasks.map((task) => (
          <ListGroup.Item key={task.id} className="task-item">
            <h5>{task.name}</h5>
            <p>Status: {task.status}</p>
            <Button variant="secondary" onClick={() => handleShowEdit(task)}>Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showCreate} onHide={handleCloseCreate}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTask}>
            <Form.Group controlId="formNewTaskName">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleNewTaskChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNewTaskDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newTask.description}
                onChange={handleNewTaskChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNewTaskStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newTask.status}
                onChange={handleNewTaskChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">Create Task</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTask && (
            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="formTaskName">
                <Form.Label>Task Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentTask.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTaskDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={currentTask.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTaskStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={currentTask.status}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">Save Changes</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskList;