import './App.css';
import {useState, useEffect} from 'react'
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from "react-icons/bs"

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");/* aqui na iniciou como string */
  const [todos, setTodos] = useState([]);/* nesse caso como é um array iniciamos a var com array */
  const [loading, setLoading] = useState(false);

  /* carregando os todos */

  // Load todos on page load
  useEffect (() => {
    const loadData = async() => {
      setLoading(true);
      /* await funciona porque a função é assincrona */
      const res = await fetch(API + "/todos")
      .then((res) => res.json()) /* como a requisição é GET usando os then como padrão */
      .then((data) => data) /* pegando a resposta chamando ela de data e retornando ela */
      .catch((err) => console.log(err)); /* opicional caso ocorra algum erro vemos ele no console */

      setLoading(false); /* retirando o load */
      setTodos(res);
    }

    loadData(); /* executando a função criada quando carrega a página */
  }, []); //quando este array está vazio a função é executada quando a página carrega

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setTitle(""); /* limpando o input */
    setTime(""); /* limpando o input */
    
    /* adicionamos a nova tarefa no obj do js pra não ser preciso consultar de novo no backend */
    setTodos((prevState) => [...prevState, todo]);

  };

  /* função para deletar a tarefa */
  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      /* nesse caso como o metodo é delete então podemos deixar sem os outros parametros */
      method: "DELETE"
    });
    
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  /* função para editar a tarefa */
  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "/todos/" + todo.id, {
      /* nesse caso como o metodo é delete então podemos deixar sem os outros parametros */
      method: "PUT", /* método de atualizar */
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    setTodos((prevState) => 
      /* então verificamos se o id que veio da API, se não for retorna ele mesmo */
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };

  /* tratando a exibição do 'não ha tarefas' enquanto a página estiver carregando */
  if(loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React Todo</h1>
      </div>
      <div className='form-todo'>
        <h2>Insira a sua própria tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>O que você vai fazer?</label>
            <input type="text" name="title" placeholder='Título de tarefa' onChange={(e) => setTitle(e.target.value)} value={title || ""} required/>
          </div>
          <div className='form-control'>
            <label htmlFor='time'>Duração</label>
            <input type="text" name="time" placeholder='Tempo estimado (em horas)' onChange={(e) => setTime(e.target.value)} value={time || ""} required/>
          </div>
          <input type="submit" value="Criar tarefa" />
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas:</h2> 
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              {/* sem o aerouwfunction ISSO: () =>   a função abaixo é executada pelo JS apenas quando a tela carrega 
              quando vc coloca ele, ele é executado apenas quando clica*/}
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
